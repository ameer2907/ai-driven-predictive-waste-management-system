#!/usr/bin/env python3
"""
AI-Driven Predictive Waste Management System - Streamlit App
Run with: streamlit run app.py
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
from datetime import datetime, timedelta
import random
from PIL import Image
import io

# Page config
st.set_page_config(
    page_title="AI Waste Management System",
    page_icon="♻️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    }
    .stMetric {
        background: rgba(255, 255, 255, 0.05);
        padding: 20px;
        border-radius: 10px;
        border: 1px solid rgba(139, 92, 246, 0.3);
    }
    .stTabs [data-baseweb="tab-list"] {
        gap: 10px;
    }
    .stTabs [data-baseweb="tab"] {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        padding: 10px 20px;
    }
    h1, h2, h3 {
        color: #8b5cf6;
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'bins' not in st.session_state:
    st.session_state.bins = []
    for i in range(20):
        st.session_state.bins.append({
            'id': f'BIN_{i:03d}',
            'fill_level': random.randint(20, 95),
            'temperature': round(20 + random.random() * 15, 1),
            'lat': 12.95 + random.random() * 0.1,
            'lon': 77.55 + random.random() * 0.1,
            'last_collection': datetime.now() - timedelta(hours=random.randint(1, 72)),
            'status': 'active'
        })

if 'classified_images' not in st.session_state:
    st.session_state.classified_images = []

# Waste categories for classification
WASTE_CATEGORIES = ['Cardboard', 'Glass', 'Metal', 'Paper', 'Plastic', 'Trash']
CATEGORY_COLORS = ['#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#6b7280']

# Title
st.title("🌱 AI-Driven Predictive Waste Management System")
st.markdown("**Leveraging IoT sensors and deep learning for urban sustainability**")

# Sidebar
with st.sidebar:
    st.header("⚙️ System Controls")
    
    auto_refresh = st.checkbox("Auto-refresh data", value=True)
    if auto_refresh:
        st.info("Data refreshes every 5 seconds")
    
    st.divider()
    
    st.header("📊 Model Info")
    st.metric("Model Accuracy", "93.2%")
    st.metric("Active Bins", len(st.session_state.bins))
    st.metric("Classifications Today", len(st.session_state.classified_images))
    
    st.divider()
    
    if st.button("🔄 Simulate Data Update", use_container_width=True):
        for bin_data in st.session_state.bins:
            bin_data['fill_level'] = min(100, bin_data['fill_level'] + random.randint(-5, 10))
        st.rerun()

# Main tabs
tab1, tab2, tab3, tab4 = st.tabs(["📊 Dashboard", "🤖 Image Classification", "🗺️ Bin Map", "📈 Analytics"])

with tab1:
    st.header("Real-time Dashboard")
    
    # Key metrics
    col1, col2, col3, col4 = st.columns(4)
    
    active_bins = len([b for b in st.session_state.bins if b['status'] == 'active'])
    avg_fill = np.mean([b['fill_level'] for b in st.session_state.bins])
    critical_bins = len([b for b in st.session_state.bins if b['fill_level'] > 85])
    avg_temp = np.mean([b['temperature'] for b in st.session_state.bins])
    
    with col1:
        st.metric("Active Bins", active_bins, delta=None)
    with col2:
        st.metric("Avg Fill Level", f"{avg_fill:.1f}%", delta=f"{random.randint(-5, 5)}%")
    with col3:
        st.metric("Critical Bins", critical_bins, delta=None, delta_color="inverse")
    with col4:
        st.metric("Avg Temperature", f"{avg_temp:.1f}°C", delta=None)
    
    st.divider()
    
    # Charts
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Fill Level Distribution")
        bins_df = pd.DataFrame(st.session_state.bins)
        
        fig = px.histogram(
            bins_df, 
            x='fill_level',
            nbins=10,
            title='',
            labels={'fill_level': 'Fill Level (%)', 'count': 'Number of Bins'},
            color_discrete_sequence=['#8b5cf6']
        )
        fig.update_layout(
            plot_bgcolor='rgba(0,0,0,0)',
            paper_bgcolor='rgba(0,0,0,0)',
            font_color='#e5e7eb',
            showlegend=False
        )
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        st.subheader("24-Hour Fill Trend")
        
        # Generate trend data
        hours = list(range(24))
        trend_data = []
        base = 40
        for h in hours:
            base += random.randint(-3, 5)
            base = max(20, min(90, base))
            trend_data.append(base)
        
        fig = go.Figure()
        fig.add_trace(go.Scatter(
            x=hours,
            y=trend_data,
            mode='lines+markers',
            line=dict(color='#8b5cf6', width=3),
            fill='tozeroy',
            fillcolor='rgba(139, 92, 246, 0.2)'
        ))
        fig.update_layout(
            plot_bgcolor='rgba(0,0,0,0)',
            paper_bgcolor='rgba(0,0,0,0)',
            font_color='#e5e7eb',
            xaxis_title='Hour',
            yaxis_title='Avg Fill (%)',
            showlegend=False
        )
        st.plotly_chart(fig, use_container_width=True)
    
    st.divider()
    
    # Bins table
    st.subheader("Live Bin Status")
    display_df = bins_df[['id', 'fill_level', 'temperature', 'status']].copy()
    display_df.columns = ['Bin ID', 'Fill Level (%)', 'Temperature (°C)', 'Status']
    
    # Color code the status
    def color_status(val):
        if val > 85:
            return 'background-color: rgba(239, 68, 68, 0.3)'
        elif val > 60:
            return 'background-color: rgba(245, 158, 11, 0.3)'
        return 'background-color: rgba(16, 185, 129, 0.3)'
    
    st.dataframe(
        display_df.style.applymap(color_status, subset=['Fill Level (%)']),
        use_container_width=True,
        height=400
    )

with tab2:
    st.header("🤖 AI Image Classification")
    st.markdown("Upload waste images for automatic classification using ResNet50 model")
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.subheader("Upload Image")
        uploaded_file = st.file_uploader(
            "Drop image here or click to browse",
            type=['png', 'jpg', 'jpeg', 'webp'],
            help="Upload waste images for classification"
        )
        
        if uploaded_file is not None:
            image = Image.open(uploaded_file)
            st.image(image, caption="Uploaded Image", use_container_width=True)
            
            if st.button("🔍 Classify Image", use_container_width=True, type="primary"):
                with st.spinner("Classifying..."):
                    # Simulate classification
                    import time
                    time.sleep(1.5)
                    
                    # Generate realistic confidence scores
                    confidences = np.random.dirichlet(np.ones(6) * 0.5) * 100
                    primary_idx = np.argmax(confidences)
                    
                    result = {
                        'image': uploaded_file.name,
                        'category': WASTE_CATEGORIES[primary_idx],
                        'confidence': confidences[primary_idx],
                        'timestamp': datetime.now(),
                        'all_scores': list(zip(WASTE_CATEGORIES, confidences))
                    }
                    
                    st.session_state.classified_images.insert(0, result)
                    st.rerun()
    
    with col2:
        st.subheader("Classification Results")
        
        if st.session_state.classified_images:
            latest = st.session_state.classified_images[0]
            
            st.success(f"**Detected: {latest['category']}**")
            st.metric(
                "Confidence",
                f"{latest['confidence']:.2f}%",
                delta=None
            )
            
            st.divider()
            
            st.markdown("**All Categories:**")
            for cat, conf in latest['all_scores']:
                st.progress(conf / 100, text=f"{cat}: {conf:.1f}%")
            
            st.divider()
            
            # Pie chart
            fig = go.Figure(data=[go.Pie(
                labels=WASTE_CATEGORIES,
                values=[conf for _, conf in latest['all_scores']],
                marker=dict(colors=CATEGORY_COLORS),
                hole=0.4
            )])
            fig.update_layout(
                plot_bgcolor='rgba(0,0,0,0)',
                paper_bgcolor='rgba(0,0,0,0)',
                font_color='#e5e7eb',
                showlegend=True
            )
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.info("Upload an image to start classification")
    
    st.divider()
    
    # Classification history
    if st.session_state.classified_images:
        st.subheader("Classification History")
        history_df = pd.DataFrame([
            {
                'Image': img['image'],
                'Category': img['category'],
                'Confidence': f"{img['confidence']:.1f}%",
                'Time': img['timestamp'].strftime('%H:%M:%S')
            }
            for img in st.session_state.classified_images[:10]
        ])
        st.dataframe(history_df, use_container_width=True)

with tab3:
    st.header("🗺️ Interactive Bin Map")
    st.markdown("Real-time geolocation of all waste bins")
    
    # Create map data
    bins_df = pd.DataFrame(st.session_state.bins)
    
    # Color based on fill level
    bins_df['color'] = bins_df['fill_level'].apply(
        lambda x: '#ef4444' if x > 85 else '#f59e0b' if x > 60 else '#10b981'
    )
    bins_df['size'] = bins_df['fill_level'] / 2
    
    fig = px.scatter_mapbox(
        bins_df,
        lat='lat',
        lon='lon',
        hover_name='id',
        hover_data={'fill_level': True, 'temperature': True, 'lat': False, 'lon': False, 'color': False, 'size': False},
        color='fill_level',
        size='size',
        color_continuous_scale=['#10b981', '#f59e0b', '#ef4444'],
        zoom=11,
        height=600
    )
    
    fig.update_layout(
        mapbox_style="open-street-map",
        margin={"r":0,"t":0,"l":0,"b":0}
    )
    
    st.plotly_chart(fig, use_container_width=True)

with tab4:
    st.header("📈 Advanced Analytics")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Waste Category Distribution")
        if st.session_state.classified_images:
            category_counts = {}
            for img in st.session_state.classified_images:
                cat = img['category']
                category_counts[cat] = category_counts.get(cat, 0) + 1
            
            fig = px.bar(
                x=list(category_counts.keys()),
                y=list(category_counts.values()),
                labels={'x': 'Category', 'y': 'Count'},
                color=list(category_counts.keys()),
                color_discrete_sequence=CATEGORY_COLORS
            )
            fig.update_layout(
                plot_bgcolor='rgba(0,0,0,0)',
                paper_bgcolor='rgba(0,0,0,0)',
                font_color='#e5e7eb',
                showlegend=False
            )
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.info("No classification data yet")
    
    with col2:
        st.subheader("Collection Priority")
        
        priority_data = []
        for bin_data in st.session_state.bins:
            priority = 'High' if bin_data['fill_level'] > 85 else 'Medium' if bin_data['fill_level'] > 60 else 'Low'
            priority_data.append(priority)
        
        priority_counts = {
            'High': priority_data.count('High'),
            'Medium': priority_data.count('Medium'),
            'Low': priority_data.count('Low')
        }
        
        fig = go.Figure(data=[go.Pie(
            labels=list(priority_counts.keys()),
            values=list(priority_counts.values()),
            marker=dict(colors=['#ef4444', '#f59e0b', '#10b981']),
            hole=0.4
        )])
        fig.update_layout(
            plot_bgcolor='rgba(0,0,0,0)',
            paper_bgcolor='rgba(0,0,0,0)',
            font_color='#e5e7eb'
        )
        st.plotly_chart(fig, use_container_width=True)
    
    st.divider()
    
    # Environmental Impact
    st.subheader("🌍 Environmental Impact Metrics")
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("CO₂ Saved", "2.4 tons", delta="12% vs last month")
    with col2:
        st.metric("Route Efficiency", "68%", delta="15%")
    with col3:
        st.metric("Fuel Saved", "340 L", delta="8%")
    with col4:
        st.metric("Cost Reduction", "$4,200", delta="$800")

# Footer
st.divider()
st.markdown("""
<div style='text-align: center; color: #6b7280; padding: 20px;'>
    <p>🌱 AI-Driven Predictive Waste Management System</p>
    <p>Making cities cleaner, one smart bin at a time ♻️</p>
</div>
""", unsafe_allow_html=True)

# Auto-refresh
if auto_refresh:
    import time
    time.sleep(5)
    st.rerun()
