import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, Play, Download, CheckCircle2, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from "recharts";

const ModelTraining = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [modelMetrics, setModelMetrics] = useState<any>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: "Dataset Uploaded",
        description: `${file.name} loaded successfully`,
      });
    }
  };

  const startTraining = () => {
    setIsTraining(true);
    setTrainingProgress(0);

    // Simulate training process
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          
          // Generate mock metrics
          setModelMetrics({
            accuracy: 0.94,
            mae: 2.3,
            rmse: 3.1,
            r2Score: 0.89,
            trainingTime: "2m 34s",
            epochs: 50,
          });

          toast({
            title: "Training Complete! ✨",
            description: "Model achieved 94% accuracy",
          });
          
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const trainingHistory = Array.from({ length: 50 }, (_, i) => ({
    epoch: i + 1,
    trainLoss: 0.8 - (i * 0.015) + Math.random() * 0.05,
    valLoss: 0.85 - (i * 0.012) + Math.random() * 0.06,
  }));

  const predictionData = Array.from({ length: 100 }, (_, i) => ({
    actual: 40 + Math.random() * 50,
    predicted: 40 + Math.random() * 50 + (Math.random() - 0.5) * 10,
  }));

  return (
    <div className="space-y-6">
      {/* Upload and Training Controls */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-gradient-primary">ML Model Training</CardTitle>
          <CardDescription>
            Upload your dataset and train the predictive model
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dataset" className="text-base">Dataset Upload</Label>
              <div className="flex gap-3">
                <Input
                  id="dataset"
                  type="file"
                  accept=".csv,.json"
                  onChange={handleFileUpload}
                  className="glass-card"
                />
                <Button variant="outline" className="flex gap-2">
                  <Upload className="w-4 h-4" />
                  Browse
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Supported formats: CSV, JSON (with columns: bin_id, timestamp, fill_level, temperature, location)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Algorithm</Label>
                <select className="w-full px-3 py-2 rounded-lg glass-card border border-border">
                  <option>Random Forest</option>
                  <option>XGBoost</option>
                  <option>LSTM</option>
                  <option>Gradient Boosting</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Train/Test Split</Label>
                <select className="w-full px-3 py-2 rounded-lg glass-card border border-border">
                  <option>80/20</option>
                  <option>70/30</option>
                  <option>90/10</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Max Epochs</Label>
                <Input type="number" defaultValue="50" className="glass-card" />
              </div>
            </div>
          </div>

          {isTraining && (
            <div className="space-y-3 p-6 rounded-xl glass-card border-primary/30 animate-pulse-glow">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Training Progress</span>
                <span className="text-sm text-primary font-bold">{trainingProgress}%</span>
              </div>
              <Progress value={trainingProgress} className="h-3" />
              <p className="text-xs text-muted-foreground">
                Epoch {Math.floor(trainingProgress / 2)}/50 • Processing batch data...
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              onClick={startTraining} 
              disabled={isTraining}
              className="flex gap-2 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
            >
              <Play className="w-4 h-4" />
              {isTraining ? "Training..." : "Start Training"}
            </Button>
            {modelMetrics && (
              <Button variant="outline" className="flex gap-2">
                <Download className="w-4 h-4" />
                Export Model
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Model Metrics */}
      {modelMetrics && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Accuracy", value: `${(modelMetrics.accuracy * 100).toFixed(1)}%`, icon: CheckCircle2, color: "text-success" },
              { label: "MAE", value: modelMetrics.mae.toFixed(2), icon: TrendingUp, color: "text-primary" },
              { label: "RMSE", value: modelMetrics.rmse.toFixed(2), icon: TrendingUp, color: "text-secondary" },
              { label: "R² Score", value: modelMetrics.r2Score.toFixed(3), icon: TrendingUp, color: "text-accent" },
              { label: "Epochs", value: modelMetrics.epochs, icon: TrendingUp, color: "text-info" },
              { label: "Time", value: modelMetrics.trainingTime, icon: TrendingUp, color: "text-warning" },
            ].map((metric, i) => (
              <Card key={i} className="glass-card border-border/50 hover:scale-105 transition-all">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center gap-2">
                    <metric.icon className={`w-8 h-8 ${metric.color}`} />
                    <span className="text-2xl font-bold">{metric.value}</span>
                    <span className="text-xs text-muted-foreground">{metric.label}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="text-gradient-primary">Training History</CardTitle>
                <CardDescription>Loss curves over epochs</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trainingHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="epoch" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="trainLoss" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="Training Loss"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="valLoss" 
                      stroke="hsl(var(--secondary))" 
                      strokeWidth={2}
                      name="Validation Loss"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="text-gradient-secondary">Prediction Accuracy</CardTitle>
                <CardDescription>Actual vs Predicted values</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="actual" 
                      name="Actual" 
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis 
                      dataKey="predicted" 
                      name="Predicted" 
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                      cursor={{ strokeDasharray: "3 3" }}
                    />
                    <Scatter 
                      data={predictionData} 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.6}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card border-border/50 border-primary/30">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-success mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Model Training Complete ✨</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your predictive model has been successfully trained and is ready for deployment. 
                    The model shows excellent performance with 94% accuracy in predicting waste bin fill times.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-primary/20 text-primary">Random Forest</Badge>
                    <Badge className="bg-success/20 text-success">High Accuracy</Badge>
                    <Badge className="bg-secondary/20 text-secondary">Production Ready</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ModelTraining;
