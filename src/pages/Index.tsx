import { useState } from "react";
import Hero from "@/components/Hero";
import Dashboard from "@/components/Dashboard";
import ModelTraining from "@/components/ModelTraining";
import BinVisualization from "@/components/BinVisualization";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-mesh">
      <Hero />
      
      <main className="container mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-3 glass-card mb-8">
            <TabsTrigger 
              value="dashboard"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="training"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              ML Training
            </TabsTrigger>
            <TabsTrigger 
              value="visualization"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              3D Hardware
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="animate-slide-up">
            <Dashboard />
          </TabsContent>

          <TabsContent value="training" className="animate-slide-up">
            <ModelTraining />
          </TabsContent>

          <TabsContent value="visualization" className="animate-slide-up">
            <BinVisualization />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
