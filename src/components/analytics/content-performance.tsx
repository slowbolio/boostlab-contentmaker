import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Generate mock data for content performance over time
const generateTimeData = (days: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Base values with some randomness
    const views = Math.floor(Math.random() * 100) + 100;
    const shares = Math.floor(Math.random() * 20) + 10;
    const comments = Math.floor(Math.random() * 15) + 5;
    const likes = Math.floor(Math.random() * 50) + 30;
    
    // Add a slight trend
    const trend = 1 + ((days - i) * 0.01);
    
    data.push({
      date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      views: Math.floor(views * trend),
      shares: Math.floor(shares * trend),
      comments: Math.floor(comments * trend),
      likes: Math.floor(likes * trend)
    });
  }
  
  return data;
};

// Mock data for different time periods
const mockTimeData = {
  '7': generateTimeData(7),
  '30': generateTimeData(30),
  '90': generateTimeData(90)
};

type TimeRange = '7' | '30' | '90';
type ContentMetric = 'views' | 'shares' | 'comments' | 'likes';

export default function ContentPerformance() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30');
  const [selectedMetrics, setSelectedMetrics] = useState<ContentMetric[]>(['views', 'shares']);
  
  const metricColors = {
    views: '#FF6B00',
    shares: '#4A90E2',
    comments: '#10B981',
    likes: '#8B5CF6'
  };
  
  const metricNames = {
    views: 'Visningar',
    shares: 'Delningar',
    comments: 'Kommentarer',
    likes: 'Gillanden'
  };
  
  const toggleMetric = (metric: ContentMetric) => {
    if (selectedMetrics.includes(metric)) {
      setSelectedMetrics(selectedMetrics.filter(m => m !== metric));
    } else {
      setSelectedMetrics([...selectedMetrics, metric]);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Innehållsprestanda</CardTitle>
        <CardDescription>Analysera hur ditt innehåll presterar över tid</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="performance">Prestanda</TabsTrigger>
            <TabsTrigger value="trends">Trender</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setTimeRange('7')}
                    className={`text-xs px-3 py-1 rounded-md ${
                      timeRange === '7' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    7 dagar
                  </button>
                  <button 
                    onClick={() => setTimeRange('30')}
                    className={`text-xs px-3 py-1 rounded-md ${
                      timeRange === '30' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    30 dagar
                  </button>
                  <button 
                    onClick={() => setTimeRange('90')}
                    className={`text-xs px-3 py-1 rounded-md ${
                      timeRange === '90' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    90 dagar
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap space-x-2">
                {(Object.keys(metricNames) as ContentMetric[]).map(metric => (
                  <button 
                    key={metric}
                    onClick={() => toggleMetric(metric)}
                    className={`text-xs px-3 py-1 mb-2 rounded-md ${
                      selectedMetrics.includes(metric)
                        ? `bg-opacity-80 text-white`
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                    style={{ 
                      backgroundColor: selectedMetrics.includes(metric) 
                        ? metricColors[metric] 
                        : '' 
                    }}
                  >
                    {metricNames[metric]}
                  </button>
                ))}
              </div>
              
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={mockTimeData[timeRange]}
                    margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                  >
                    <defs>
                      {(Object.keys(metricColors) as ContentMetric[]).map(metric => (
                        <linearGradient key={metric} id={`color${metric}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={metricColors[metric]} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={metricColors[metric]} stopOpacity={0} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="rgba(255,255,255,0.4)"
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getDate()}/${date.getMonth() + 1}`;
                      }}
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
                    
                    {selectedMetrics.map(metric => (
                      <Area 
                        key={metric}
                        type="monotone" 
                        dataKey={metric} 
                        name={metricNames[metric]}
                        stroke={metricColors[metric]} 
                        fillOpacity={1}
                        fill={`url(#color${metric})`} 
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="trends">
            <div className="h-[300px] flex items-center justify-center">
              <div className="text-center space-y-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className="mx-auto w-16 h-16 text-muted-foreground"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
                <h3 className="text-lg font-medium">Trend-analys kommer snart</h3>
                <p className="text-muted-foreground max-w-md">
                  Vi arbetar på att implementera avancerad trend-analys för att 
                  hjälpa dig identifiera mönster och optimera ditt innehåll.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}