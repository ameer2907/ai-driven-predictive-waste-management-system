import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trash2, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface BinData {
  id: string;
  fillLevel: number;
  predictedFull: number;
  location: string;
  status: "normal" | "warning" | "critical";
  lastUpdated: string;
}

const Dashboard = () => {
  const [bins, setBins] = useState<BinData[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    warning: 0,
    normal: 0,
    avgFill: 0,
  });

  // Simulate real-time data
  useEffect(() => {
    const generateBins = (): BinData[] => {
      const locations = ["Downtown", "Park Area", "Industrial Zone", "Residential", "Market Street", "Tech Hub"];
      return Array.from({ length: 12 }, (_, i) => {
        const fillLevel = Math.floor(Math.random() * 100);
        const predictedHours = Math.floor((100 - fillLevel) / (Math.random() * 3 + 1));
        
        let status: "normal" | "warning" | "critical" = "normal";
        if (fillLevel > 85 || predictedHours < 4) status = "critical";
        else if (fillLevel > 70 || predictedHours < 12) status = "warning";

        return {
          id: `BIN-${String(i + 1).padStart(3, "0")}`,
          fillLevel,
          predictedFull: predictedHours,
          location: locations[Math.floor(Math.random() * locations.length)],
          status,
          lastUpdated: new Date().toLocaleTimeString(),
        };
      });
    };

    const updateData = () => {
      const newBins = generateBins();
      setBins(newBins);
      
      setStats({
        total: newBins.length,
        critical: newBins.filter(b => b.status === "critical").length,
        warning: newBins.filter(b => b.status === "warning").length,
        normal: newBins.filter(b => b.status === "normal").length,
        avgFill: Math.floor(newBins.reduce((acc, b) => acc + b.fillLevel, 0) / newBins.length),
      });
    };

    updateData();
    const interval = setInterval(updateData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fillDistribution = [
    { range: "0-25%", count: bins.filter(b => b.fillLevel <= 25).length },
    { range: "26-50%", count: bins.filter(b => b.fillLevel > 25 && b.fillLevel <= 50).length },
    { range: "51-75%", count: bins.filter(b => b.fillLevel > 50 && b.fillLevel <= 75).length },
    { range: "76-100%", count: bins.filter(b => b.fillLevel > 75).length },
  ];

  const timeSeriesData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    avgFill: Math.floor(30 + Math.random() * 40 + (i > 12 ? 20 : 0)),
  }));

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border-border/50 hover:border-primary/50 transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Trash2 className="w-8 h-8 text-primary" />
              <span className="text-3xl font-bold text-gradient-primary">{stats.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50 hover:border-destructive/50 transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-8 h-8 text-destructive" />
              <span className="text-3xl font-bold text-destructive">{stats.critical}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50 hover:border-warning/50 transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Warning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="w-8 h-8 text-warning" />
              <span className="text-3xl font-bold text-warning">{stats.warning}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50 hover:border-success/50 transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Normal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-8 h-8 text-success" />
              <span className="text-3xl font-bold text-success">{stats.normal}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="text-gradient-primary">24-Hour Fill Trend</CardTitle>
            <CardDescription>Average fill levels throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" />
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
                  dataKey="avgFill" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="text-gradient-secondary">Fill Distribution</CardTitle>
            <CardDescription>Current bin capacity distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={fillDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }} 
                />
                <Bar dataKey="count" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bins Grid */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-gradient-hero">Live Bin Status</CardTitle>
          <CardDescription>Real-time monitoring of all waste collection points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bins.map((bin) => (
              <Card 
                key={bin.id} 
                className={`glass-card transition-all hover:scale-105 ${
                  bin.status === "critical" ? "border-destructive/50" :
                  bin.status === "warning" ? "border-warning/50" :
                  "border-success/50"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{bin.id}</CardTitle>
                    <Badge 
                      variant={
                        bin.status === "critical" ? "destructive" :
                        bin.status === "warning" ? "default" :
                        "secondary"
                      }
                      className={
                        bin.status === "normal" ? "bg-success text-primary-foreground" : ""
                      }
                    >
                      {bin.status}
                    </Badge>
                  </div>
                  <CardDescription>{bin.location}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Fill Level</span>
                      <span className="font-semibold">{bin.fillLevel}%</span>
                    </div>
                    <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all rounded-full ${
                          bin.fillLevel > 85 ? "bg-destructive" :
                          bin.fillLevel > 70 ? "bg-warning" :
                          "bg-success"
                        }`}
                        style={{ width: `${bin.fillLevel}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Predicted Full</span>
                    <span className="font-semibold text-primary">
                      {bin.predictedFull}h
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last updated: {bin.lastUpdated}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
