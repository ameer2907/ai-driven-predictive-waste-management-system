import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cpu, Wifi, Battery, Thermometer, Ruler, RotateCcw } from "lucide-react";

const BinVisualization = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = "hsl(220 25% 8%)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Center point
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw 3D bin using isometric projection
      ctx.save();
      ctx.translate(centerX, centerY);

      // Apply rotation
      const rotX = rotation.x;
      const rotY = rotation.y;

      // Function to apply 3D rotation
      const rotate3D = (x: number, y: number, z: number) => {
        // Rotate around Y axis
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;

        // Rotate around X axis
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const y1 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        // Isometric projection
        const isoX = (x1 - z2) * 0.866;
        const isoY = (x1 + z2) * 0.5 - y1;

        return { x: isoX, y: isoY, z: z2 };
      };

      // Bin dimensions
      const width = 80;
      const height = 120;
      const depth = 80;

      // Define vertices
      const vertices = [
        rotate3D(-width / 2, -height / 2, -depth / 2), // 0: back bottom left
        rotate3D(width / 2, -height / 2, -depth / 2),  // 1: back bottom right
        rotate3D(width / 2, height / 2, -depth / 2),   // 2: back top right
        rotate3D(-width / 2, height / 2, -depth / 2),  // 3: back top left
        rotate3D(-width / 2, -height / 2, depth / 2),  // 4: front bottom left
        rotate3D(width / 2, -height / 2, depth / 2),   // 5: front bottom right
        rotate3D(width / 2, height / 2, depth / 2),    // 6: front top right
        rotate3D(-width / 2, height / 2, depth / 2),   // 7: front top left
      ];

      // Draw faces (back to front based on Z)
      const faces = [
        { points: [0, 1, 2, 3], color: "hsl(150 40% 30%)" }, // back
        { points: [4, 5, 6, 7], color: "hsl(150 50% 40%)" }, // front
        { points: [0, 4, 7, 3], color: "hsl(150 45% 35%)" }, // left
        { points: [1, 5, 6, 2], color: "hsl(150 45% 35%)" }, // right
        { points: [3, 2, 6, 7], color: "hsl(150 55% 45%)" }, // top
        { points: [0, 1, 5, 4], color: "hsl(150 35% 25%)" }, // bottom
      ];

      // Sort faces by average Z (painter's algorithm)
      faces.sort((a, b) => {
        const avgZa = a.points.reduce((sum, i) => sum + vertices[i].z, 0) / 4;
        const avgZb = b.points.reduce((sum, i) => sum + vertices[i].z, 0) / 4;
        return avgZa - avgZb;
      });

      // Draw each face
      faces.forEach((face) => {
        ctx.beginPath();
        face.points.forEach((idx, i) => {
          const v = vertices[idx];
          if (i === 0) ctx.moveTo(v.x, v.y);
          else ctx.lineTo(v.x, v.y);
        });
        ctx.closePath();
        ctx.fillStyle = face.color;
        ctx.fill();
        ctx.strokeStyle = "hsl(150 60% 50%)";
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw fill level
      const fillLevel = 0.65; // 65% full
      const fillHeight = height * fillLevel;
      const fillY = height / 2 - fillHeight;

      // Fill indicator (simplified)
      ctx.fillStyle = "hsl(40 90% 50% / 0.6)";
      ctx.fillRect(-width / 3, fillY, width * 0.66, fillHeight);

      // Draw sensor components
      // Ultrasonic sensor at top
      ctx.fillStyle = "hsl(200 70% 50%)";
      ctx.fillRect(-15, -height / 2 - 10, 30, 8);
      ctx.fillRect(-12, -height / 2 - 15, 8, 5);
      ctx.fillRect(4, -height / 2 - 15, 8, 5);

      // MCU box on side
      ctx.fillStyle = "hsl(280 60% 55%)";
      ctx.fillRect(width / 2 + 5, -20, 25, 35);
      
      // Antenna
      ctx.strokeStyle = "hsl(280 60% 55%)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width / 2 + 30, -20);
      ctx.lineTo(width / 2 + 30, -40);
      ctx.stroke();
      ctx.fillStyle = "hsl(280 60% 55%)";
      ctx.beginPath();
      ctx.arc(width / 2 + 30, -45, 5, 0, Math.PI * 2);
      ctx.fill();

      // Glow effect
      ctx.shadowBlur = 20;
      ctx.shadowColor = "hsl(150 80% 55%)";
      ctx.strokeStyle = "hsl(150 80% 55%)";
      ctx.lineWidth = 1;
      ctx.strokeRect(-width / 2 - 2, -height / 2 - 2, width + 4, height + 4);
      ctx.shadowBlur = 0;

      ctx.restore();

      // Auto-rotate if not dragging
      if (!isDragging) {
        setRotation((prev) => ({
          x: prev.x,
          y: prev.y + 0.005,
        }));
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [rotation, isDragging]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastPos.x;
    const deltaY = e.clientY - lastPos.y;

    setRotation((prev) => ({
      x: prev.x + deltaY * 0.01,
      y: prev.y + deltaX * 0.01,
    }));

    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetRotation = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gradient-hero">3D IoT Hardware Model</CardTitle>
              <CardDescription>Interactive visualization of smart waste bin with sensors</CardDescription>
            </div>
            <Button onClick={resetRotation} variant="outline" size="icon">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="relative bg-background/50 rounded-xl p-8 border-2 border-primary/20">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={500}
                  className="w-full cursor-move"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
                <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">
                  Click and drag to rotate • Auto-rotating when idle
                </div>
              </div>
            </div>

            <div className="lg:w-80 space-y-4">
              <Card className="glass-card border-primary/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-primary" />
                    Hardware Components
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">MCU</span>
                      <Badge variant="outline" className="text-xs">ESP32</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Ultrasonic</span>
                      <Badge variant="outline" className="text-xs">HC-SR04</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Temperature</span>
                      <Badge variant="outline" className="text-xs">DHT22</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">GPS</span>
                      <Badge variant="outline" className="text-xs">NEO-6M</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Connectivity</span>
                      <Badge variant="outline" className="text-xs">LoRa/WiFi</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-secondary/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-secondary" />
                    Sensor Readings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Ruler className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">Fill Level</div>
                      <div className="text-lg font-bold text-primary">65%</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-warning/10">
                      <Thermometer className="w-4 h-4 text-warning" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">Temperature</div>
                      <div className="text-lg font-bold text-warning">27°C</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-success/10">
                      <Battery className="w-4 h-4 text-success" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">Battery</div>
                      <div className="text-lg font-bold text-success">87%</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-info/10">
                      <Wifi className="w-4 h-4 text-info" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">Signal</div>
                      <div className="text-lg font-bold text-info">Strong</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-accent/30">
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">
                      Cost-Effective Solution
                    </div>
                    <div className="text-3xl font-bold text-accent">$25</div>
                    <div className="text-xs text-muted-foreground">
                      Per unit hardware cost
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card border-border/50 hover:border-primary/50 transition-all">
          <CardContent className="pt-6 text-center">
            <div className="text-4xl font-bold text-gradient-primary mb-2">10cm</div>
            <div className="text-sm text-muted-foreground">Ultrasonic Range Accuracy</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50 hover:border-secondary/50 transition-all">
          <CardContent className="pt-6 text-center">
            <div className="text-4xl font-bold text-gradient-secondary mb-2">5 min</div>
            <div className="text-sm text-muted-foreground">Data Transmission Interval</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50 hover:border-accent/50 transition-all">
          <CardContent className="pt-6 text-center">
            <div className="text-4xl font-bold text-accent mb-2">2 years</div>
            <div className="text-sm text-muted-foreground">Battery Life (LoRa Mode)</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BinVisualization;
