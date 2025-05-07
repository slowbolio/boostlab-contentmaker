import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for platform performance
const generatePlatformData = () => {
  const platforms = ['Facebook', 'Instagram', 'LinkedIn', 'Twitter', 'Blog', 'Website'];
  return platforms.map(platform => {
    const views = Math.floor(Math.random() * 1000) + 200;
    const engagementRate = Math.random() * 10 + 2;
    const clickRate = Math.random() * 8 + 1;
    
    return {
      platform,
      views,
      engagementRate: parseFloat(engagementRate.toFixed(1)),
      clickRate: parseFloat(clickRate.toFixed(1)),
    };
  });
};

const mockPlatformData = generatePlatformData();

export type MetricType = 'views' | 'engagementRate' | 'clickRate';

export default function PlatformPerformance() {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('views');
  
  const getMetricColor = (metric: MetricType) => {
    const colors = {
      views: '#FF6B00',
      engagementRate: '#4A90E2',
      clickRate: '#10B981'
    };
    return colors[metric];
  };
  
  const getMetricName = (metric: MetricType) => {
    const names = {
      views: 'Visningar',
      engagementRate: 'Engagemang (%)',
      clickRate: 'Klickfrekvens (%)'
    };
    return names[metric];
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Plattformsanalys</CardTitle>
        <CardDescription>Jämför prestanda över olika plattformar</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <button 
            onClick={() => setSelectedMetric('views')}
            className={`text-xs px-3 py-1 rounded-md ${
              selectedMetric === 'views' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground'
            }`}
          >
            Visningar
          </button>
          <button 
            onClick={() => setSelectedMetric('engagementRate')}
            className={`text-xs px-3 py-1 rounded-md ${
              selectedMetric === 'engagementRate' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground'
            }`}
          >
            Engagemang (%)
          </button>
          <button 
            onClick={() => setSelectedMetric('clickRate')}
            className={`text-xs px-3 py-1 rounded-md ${
              selectedMetric === 'clickRate' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground'
            }`}
          >
            Klickfrekvens (%)
          </button>
        </div>
        
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mockPlatformData}
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="platform" 
                stroke="rgba(255,255,255,0.4)"
              />
              <YAxis stroke="rgba(255,255,255,0.4)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '0.375rem',
                  color: 'white'
                }} 
              />
              <Legend />
              <Bar 
                dataKey={selectedMetric} 
                name={getMetricName(selectedMetric)}
                fill={getMetricColor(selectedMetric)} 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}