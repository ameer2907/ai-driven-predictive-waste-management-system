import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cpu, Wifi, Battery, Thermometer, Ruler, RotateCcw, Zap, Signal, MapPin, Clock } from "lucide-react";

const BinVisualization = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef({ x: 0.3, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [fillLevel, setFillLevel] = useState(65);
  const [sensorData, setSensorData] = useState({
    temperature: 27,
    battery: 87,
    signal: -45,
  });
  const animationRef = useRef<number>();
  const timeRef = useRef(0);
  const isDraggingRef = useRef(false);

  // Simulate live sensor updates
  useEffect(() => {
    const interval = setInterval(() => {
      setFillLevel(prev => Math.min(100, Math.max(0, prev + (Math.random() - 0.4) * 2)));
      setSensorData(prev => ({
        temperature: Math.round(25 + Math.random() * 10),
        battery: Math.max(10, prev.battery - Math.random() * 0.1),
        signal: Math.round(-30 - Math.random() * 30),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      timeRef.current += 0.02;
      const time = timeRef.current;

      // Clear with gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, "hsl(220 40% 8%)");
      bgGradient.addColorStop(1, "hsl(220 45% 4%)");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw animated grid
      ctx.strokeStyle = "hsl(200 85% 50% / 0.1)";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2 + 20;

      ctx.save();
      ctx.translate(centerX, centerY);

      const rotX = rotationRef.current.x;
      const rotY = rotationRef.current.y;

      // 3D rotation function
      const rotate3D = (x: number, y: number, z: number) => {
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;

        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const y1 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        const scale = 1.2;
        const isoX = (x1 - z2) * 0.866 * scale;
        const isoY = (x1 + z2) * 0.5 - y1 * scale;

        return { x: isoX, y: isoY, z: z2 };
      };

      // Bin dimensions
      const width = 90;
      const height = 140;
      const depth = 90;

      // Define vertices
      const vertices = [
        rotate3D(-width / 2, -height / 2, -depth / 2),
        rotate3D(width / 2, -height / 2, -depth / 2),
        rotate3D(width / 2, height / 2, -depth / 2),
        rotate3D(-width / 2, height / 2, -depth / 2),
        rotate3D(-width / 2, -height / 2, depth / 2),
        rotate3D(width / 2, -height / 2, depth / 2),
        rotate3D(width / 2, height / 2, depth / 2),
        rotate3D(-width / 2, height / 2, depth / 2),
      ];

      // Define faces with gradients
      const faces = [
        { points: [0, 1, 2, 3], colorStart: "hsl(200 70% 25%)", colorEnd: "hsl(200 60% 20%)" },
        { points: [4, 5, 6, 7], colorStart: "hsl(200 80% 35%)", colorEnd: "hsl(200 70% 28%)" },
        { points: [0, 4, 7, 3], colorStart: "hsl(200 75% 30%)", colorEnd: "hsl(200 65% 25%)" },
        { points: [1, 5, 6, 2], colorStart: "hsl(200 75% 30%)", colorEnd: "hsl(200 65% 25%)" },
        { points: [3, 2, 6, 7], colorStart: "hsl(200 85% 40%)", colorEnd: "hsl(200 75% 32%)" },
        { points: [0, 1, 5, 4], colorStart: "hsl(200 50% 18%)", colorEnd: "hsl(200 40% 15%)" },
      ];

      // Sort faces
      faces.sort((a, b) => {
        const avgZa = a.points.reduce((sum, i) => sum + vertices[i].z, 0) / 4;
        const avgZb = b.points.reduce((sum, i) => sum + vertices[i].z, 0) / 4;
        return avgZa - avgZb;
      });

      // Draw faces with gradient
      faces.forEach((face) => {
        ctx.beginPath();
        face.points.forEach((idx, i) => {
          const v = vertices[idx];
          if (i === 0) ctx.moveTo(v.x, v.y);
          else ctx.lineTo(v.x, v.y);
        });
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, -height/2, 0, height/2);
        gradient.addColorStop(0, face.colorStart);
        gradient.addColorStop(1, face.colorEnd);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Neon edge glow
        ctx.strokeStyle = `hsl(200 100% 60% / ${0.3 + Math.sin(time * 2) * 0.2})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw animated fill level
      const fillHeight = height * (fillLevel / 100);
      const fillY = height / 2 - fillHeight;

      // Fill gradient based on level
      const fillHue = fillLevel > 80 ? 0 : fillLevel > 60 ? 45 : 150;
      const fillGradient = ctx.createLinearGradient(0, fillY, 0, height / 2);
      fillGradient.addColorStop(0, `hsl(${fillHue} 80% 50% / 0.8)`);
      fillGradient.addColorStop(1, `hsl(${fillHue} 70% 40% / 0.6)`);
      ctx.fillStyle = fillGradient;
      ctx.fillRect(-width / 3, fillY, width * 0.66, fillHeight);

      // Animated waves on fill surface
      ctx.strokeStyle = `hsl(${fillHue} 90% 60% / 0.5)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = -width / 3; x <= width / 3; x += 5) {
        const waveY = fillY + Math.sin(x * 0.1 + time * 3) * 3;
        if (x === -width / 3) ctx.moveTo(x, waveY);
        else ctx.lineTo(x, waveY);
      }
      ctx.stroke();

      // Ultrasonic sensor with animated waves
      ctx.fillStyle = "hsl(170 80% 45%)";
      ctx.shadowBlur = 15;
      ctx.shadowColor = "hsl(170 100% 50%)";
      
      // Sensor housing
      ctx.beginPath();
      ctx.roundRect(-20, -height / 2 - 15, 40, 12, 4);
      ctx.fill();
      
      // Sensor eyes
      ctx.fillStyle = "hsl(170 100% 60%)";
      ctx.beginPath();
      ctx.arc(-8, -height / 2 - 9, 5, 0, Math.PI * 2);
      ctx.arc(8, -height / 2 - 9, 5, 0, Math.PI * 2);
      ctx.fill();

      // Animated ultrasonic waves
      ctx.shadowBlur = 0;
      for (let i = 0; i < 3; i++) {
        const waveOffset = (time * 50 + i * 30) % 100;
        const alpha = 1 - waveOffset / 100;
        ctx.strokeStyle = `hsl(170 100% 60% / ${alpha * 0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -height / 2 - 9, 15 + waveOffset * 0.5, Math.PI * 0.3, Math.PI * 0.7);
        ctx.stroke();
      }

      // MCU box with LED indicators
      ctx.shadowBlur = 10;
      ctx.shadowColor = "hsl(260 80% 60%)";
      const mcuGradient = ctx.createLinearGradient(width / 2 + 5, -30, width / 2 + 35, 20);
      mcuGradient.addColorStop(0, "hsl(260 60% 45%)");
      mcuGradient.addColorStop(1, "hsl(260 50% 35%)");
      ctx.fillStyle = mcuGradient;
      ctx.beginPath();
      ctx.roundRect(width / 2 + 5, -30, 35, 50, 5);
      ctx.fill();
      ctx.shadowBlur = 0;

      // ESP32 label
      ctx.fillStyle = "hsl(260 100% 80%)";
      ctx.font = "bold 8px monospace";
      ctx.textAlign = "center";
      ctx.fillText("ESP32", width / 2 + 22, -5);

      // Blinking LEDs
      const ledColors = [
        { y: -20, color: `hsl(150 90% ${50 + Math.sin(time * 5) * 30}%)` },
        { y: -10, color: `hsl(200 90% ${50 + Math.sin(time * 3 + 1) * 30}%)` },
        { y: 0, color: `hsl(45 90% ${50 + Math.sin(time * 4 + 2) * 30}%)` },
      ];
      ledColors.forEach(led => {
        ctx.fillStyle = led.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = led.color;
        ctx.beginPath();
        ctx.arc(width / 2 + 35, led.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // Antenna with signal waves
      ctx.strokeStyle = "hsl(260 70% 55%)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(width / 2 + 38, -25);
      ctx.lineTo(width / 2 + 38, -55);
      ctx.stroke();

      // Antenna tip
      ctx.fillStyle = "hsl(260 80% 60%)";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "hsl(260 100% 70%)";
      ctx.beginPath();
      ctx.arc(width / 2 + 38, -60, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // WiFi signal waves
      for (let i = 0; i < 3; i++) {
        const waveR = 12 + i * 8;
        const alpha = 0.8 - i * 0.25 + Math.sin(time * 3 + i) * 0.2;
        ctx.strokeStyle = `hsl(260 100% 70% / ${alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(width / 2 + 38, -60, waveR, -Math.PI * 0.7, -Math.PI * 0.3);
        ctx.stroke();
      }

      // Solar panel on top
      ctx.fillStyle = "hsl(220 60% 25%)";
      ctx.shadowBlur = 5;
      ctx.shadowColor = "hsl(200 100% 50%)";
      ctx.beginPath();
      ctx.roundRect(-width / 2 + 10, -height / 2 - 25, width - 20, 8, 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Solar panel grid
      ctx.strokeStyle = "hsl(200 80% 40%)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        const x = -width / 2 + 15 + i * 12;
        ctx.beginPath();
        ctx.moveTo(x, -height / 2 - 25);
        ctx.lineTo(x, -height / 2 - 17);
        ctx.stroke();
      }

      // Outer glow effect
      ctx.shadowBlur = 30;
      ctx.shadowColor = `hsl(200 100% 60% / ${0.3 + Math.sin(time) * 0.15})`;
      ctx.strokeStyle = `hsl(200 100% 60% / ${0.5 + Math.sin(time * 2) * 0.2})`;
      ctx.lineWidth = 2;
      ctx.strokeRect(-width / 2 - 5, -height / 2 - 30, width + 50, height + 35);
      ctx.shadowBlur = 0;

      // Ground shadow
      ctx.fillStyle = "hsl(200 50% 5% / 0.5)";
      ctx.beginPath();
      ctx.ellipse(0, height / 2 + 20, width * 0.8, 15, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Draw HUD elements
      ctx.fillStyle = "hsl(200 85% 50%)";
      ctx.font = "12px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`FILL: ${fillLevel.toFixed(1)}%`, 20, 30);
      ctx.fillText(`TEMP: ${sensorData.temperature}°C`, 20, 50);
      ctx.fillText(`RSSI: ${sensorData.signal}dBm`, 20, 70);

      // Auto-rotate
      if (!isDraggingRef.current) {
        rotationRef.current.y += 0.008;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [fillLevel, sensorData]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastPos.x;
    const deltaY = e.clientY - lastPos.y;
    rotationRef.current = {
      x: Math.max(-0.5, Math.min(0.8, rotationRef.current.x + deltaY * 0.01)),
      y: rotationRef.current.y + deltaX * 0.01,
    };
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    setLastPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.touches[0].clientX - lastPos.x;
    const deltaY = e.touches[0].clientY - lastPos.y;
    rotationRef.current = {
      x: Math.max(-0.5, Math.min(0.8, rotationRef.current.x + deltaY * 0.01)),
      y: rotationRef.current.y + deltaX * 0.01,
    };
    setLastPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const resetRotation = () => {
    rotationRef.current = { x: 0.3, y: 0 };
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card border-primary/30 neon-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gradient-hero text-2xl flex items-center gap-3">
                <Cpu className="w-7 h-7 text-primary" />
                Interactive 3D IoT Smart Bin
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Real-time visualization with animated sensors and live data
              </CardDescription>
            </div>
            <Button onClick={resetRotation} variant="outline" size="icon" className="border-primary/50 hover:bg-primary/20">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="relative rounded-2xl overflow-hidden border-2 border-primary/30 bg-background">
                <canvas
                  ref={canvasRef}
                  width={650}
                  height={520}
                  className="w-full cursor-grab active:cursor-grabbing"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleMouseUp}
                />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <Badge variant="outline" className="bg-background/80 backdrop-blur text-xs">
                    🖱️ Drag to rotate • Auto-rotating
                  </Badge>
                  <Badge className="bg-primary/80 animate-pulse">
                    <Zap className="w-3 h-3 mr-1" />
                    LIVE
                  </Badge>
                </div>
              </div>
            </div>

            <div className="lg:w-80 space-y-4">
              {/* Hardware Components */}
              <Card className="glass-card border-primary/40">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-primary" />
                    Hardware Components
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { label: "MCU", value: "ESP32-WROOM-32", icon: Cpu },
                    { label: "Ultrasonic", value: "HC-SR04", icon: Ruler },
                    { label: "Temperature", value: "DHT22", icon: Thermometer },
                    { label: "GPS Module", value: "NEO-6M", icon: MapPin },
                    { label: "Connectivity", value: "LoRa + WiFi", icon: Wifi },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/30">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <item.icon className="w-4 h-4 text-primary" />
                        {item.label}
                      </span>
                      <Badge variant="outline" className="text-xs font-mono">{item.value}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Live Sensor Readings */}
              <Card className="glass-card border-secondary/40">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Signal className="w-4 h-4 text-secondary animate-pulse" />
                    Live Sensor Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-primary/10">
                    <Ruler className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">Fill Level</div>
                      <div className="flex items-center gap-2">
                        <div className="text-xl font-bold text-primary">{fillLevel.toFixed(1)}%</div>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full transition-all duration-500"
                            style={{ 
                              width: `${fillLevel}%`,
                              backgroundColor: fillLevel > 80 ? 'hsl(0 75% 55%)' : fillLevel > 60 ? 'hsl(45 95% 55%)' : 'hsl(150 70% 45%)'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-warning/10">
                    <Thermometer className="w-5 h-5 text-warning" />
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">Temperature</div>
                      <div className="text-xl font-bold text-warning">{sensorData.temperature}°C</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-success/10">
                    <Battery className="w-5 h-5 text-success" />
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">Battery</div>
                      <div className="text-xl font-bold text-success">{sensorData.battery.toFixed(1)}%</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-info/10">
                    <Wifi className="w-5 h-5 text-info" />
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">Signal Strength</div>
                      <div className="text-xl font-bold text-info">{sensorData.signal} dBm</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card className="glass-card border-primary/30">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      System Status
                    </div>
                    <div className="text-xl font-bold text-primary flex items-center justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      Online
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      All sensors operational
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Specifications Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Ruler, label: "Ultrasonic Accuracy", value: "±2cm", color: "primary" },
          { icon: Clock, label: "Update Interval", value: "5 min", color: "secondary" },
          { icon: Battery, label: "Battery Life", value: "2 years", color: "success" },
          { icon: Wifi, label: "Range (LoRa)", value: "10 km", color: "info" },
        ].map((spec, i) => (
          <Card key={i} className="glass-card hover:scale-105 transition-transform">
            <CardContent className="pt-6 text-center">
              <spec.icon className={`w-8 h-8 mx-auto mb-2 text-${spec.color}`} />
              <div className={`text-2xl font-bold text-${spec.color}`}>{spec.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{spec.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BinVisualization;
