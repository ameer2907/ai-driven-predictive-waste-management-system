import { Sparkles, Recycle, Brain } from "lucide-react";

const Hero = () => {
  return (
    <header className="relative overflow-hidden py-20 px-4">
      <div className="absolute inset-0 bg-mesh opacity-50" />
      
      <div className="container mx-auto relative z-10">
        <div className="flex items-center justify-center gap-3 mb-6 animate-slide-up">
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 animate-pulse-glow">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20 animate-pulse-glow" style={{ animationDelay: "0.2s" }}>
            <Recycle className="w-8 h-8 text-secondary" />
          </div>
          <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 animate-pulse-glow" style={{ animationDelay: "0.4s" }}>
            <Sparkles className="w-8 h-8 text-accent" />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-center mb-6 animate-slide-up">
          <span className="text-gradient-hero">AI-Driven Predictive</span>
          <br />
          <span className="text-foreground">Waste Management System</span>
        </h1>

        <p className="text-xl text-muted-foreground text-center max-w-3xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          Leveraging IoT sensors and machine learning to predict waste levels, optimize collection routes, 
          and promote urban sustainability through intelligent analytics
        </p>

        <div className="flex flex-wrap gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <div className="glass-card px-6 py-3 rounded-full border-primary/30">
            <span className="text-primary font-semibold">Real-time IoT</span>
          </div>
          <div className="glass-card px-6 py-3 rounded-full border-secondary/30">
            <span className="text-secondary font-semibold">ML Predictions</span>
          </div>
          <div className="glass-card px-6 py-3 rounded-full border-accent/30">
            <span className="text-accent font-semibold">Smart Analytics</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
