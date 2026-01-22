import { Sparkles, Recycle, Brain, Cpu, Wifi, BarChart3 } from "lucide-react";

const Hero = () => {
  return (
    <header className="relative overflow-hidden py-16 px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-mesh" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto relative z-10">
        {/* IoT Device Icons */}
        <div className="flex items-center justify-center gap-4 mb-8 animate-slide-up">
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 animate-pulse-glow">
            <Brain className="w-7 h-7 text-primary" />
          </div>
          <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/30 animate-pulse-glow" style={{ animationDelay: "0.3s" }}>
            <Cpu className="w-7 h-7 text-secondary" />
          </div>
          <div className="p-3 rounded-xl bg-accent/10 border border-accent/30 animate-pulse-glow" style={{ animationDelay: "0.6s" }}>
            <Wifi className="w-7 h-7 text-accent" />
          </div>
          <div className="p-3 rounded-xl bg-success/10 border border-success/30 animate-pulse-glow" style={{ animationDelay: "0.9s" }}>
            <Recycle className="w-7 h-7 text-success" />
          </div>
          <div className="p-3 rounded-xl bg-warning/10 border border-warning/30 animate-pulse-glow" style={{ animationDelay: "1.2s" }}>
            <BarChart3 className="w-7 h-7 text-warning" />
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <span className="text-gradient-hero">AI-Driven Predictive</span>
          <br />
          <span className="text-foreground">Waste Management</span>
          <br />
          <span className="text-gradient-primary">for Urban Sustainability</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground text-center max-w-4xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <span className="text-primary font-semibold">USING IoT</span> — Leveraging smart sensors, machine learning, and real-time analytics 
          to predict waste levels, optimize collection routes, and build sustainable smart cities
        </p>

        <div className="flex flex-wrap gap-3 justify-center animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <div className="glass-card px-5 py-2.5 rounded-full border-primary/40 hover:border-primary transition-all">
            <span className="text-primary font-semibold text-sm">🔌 IoT Sensors</span>
          </div>
          <div className="glass-card px-5 py-2.5 rounded-full border-secondary/40 hover:border-secondary transition-all">
            <span className="text-secondary font-semibold text-sm">🧠 Deep Learning</span>
          </div>
          <div className="glass-card px-5 py-2.5 rounded-full border-accent/40 hover:border-accent transition-all">
            <span className="text-accent font-semibold text-sm">📊 Predictive Analytics</span>
          </div>
          <div className="glass-card px-5 py-2.5 rounded-full border-success/40 hover:border-success transition-all">
            <span className="text-success font-semibold text-sm">♻️ 93.2% Accuracy</span>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: "0.8s" }}>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold text-primary">2,527</div>
            <div className="text-xs text-muted-foreground">Training Images</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold text-secondary">6</div>
            <div className="text-xs text-muted-foreground">Waste Categories</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold text-success">93.2%</div>
            <div className="text-xs text-muted-foreground">Model Accuracy</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold text-warning">$25</div>
            <div className="text-xs text-muted-foreground">Per Unit Cost</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
