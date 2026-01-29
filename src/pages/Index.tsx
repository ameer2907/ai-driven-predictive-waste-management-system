import { useState } from "react";
import Hero from "@/components/Hero";
import Dashboard from "@/components/Dashboard";
import ImageClassificationTraining from "@/components/ImageClassificationTraining";
import BinVisualization from "@/components/BinVisualization";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Brain, Cpu } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-mesh">
      <Hero />
      
      <main className="container mx-auto px-4 py-8 pb-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-3 glass-card mb-8 p-1.5 h-auto">
            <TabsTrigger 
              value="dashboard"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3 gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="training"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3 gap-2"
            >
              <Brain className="w-4 h-4" />
              AI Classification
            </TabsTrigger>
            <TabsTrigger 
              value="visualization"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3 gap-2"
            >
              <Cpu className="w-4 h-4" />
              3D IoT Hardware
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="animate-slide-up">
            <Dashboard />
          </TabsContent>

          <TabsContent value="training" className="animate-slide-up">
            <ImageClassificationTraining />
          </TabsContent>

          <TabsContent value="visualization" className="animate-slide-up">
            <BinVisualization />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border/50 py-6 mt-8 bg-card/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-foreground font-medium">
            AI-Driven Predictive Waste Management for Urban Sustainability <span className="text-primary font-semibold">using IoT</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1.5">
            Powered by Machine Learning • ESP32 • LoRa/WiFi • Real-time Analytics
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
