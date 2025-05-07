import { useState, useEffect } from 'react';
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
import { fetchDashboardAnalytics, PerformanceDataPoint } from '@/lib/dashboard-backend-integration';

// Sample data as fallback if API fails
const generateData = (days: number) => {
  const data = [];
  const now = new Date();
  
  // Förbered datapunkter för de tre olika metrikerna
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const viewsBase = Math.floor(Math.random() * 50) + 100;
    const engagementBase = Math.floor(Math.random() * 30) + 40;
    const conversionBase = Math.floor(Math.random() * 10) + 5;
    
    // Lägg till lite variation men behåll en uppåtgående trend
    const trend = 1 + ((days - i) * 0.01);
    
    data.push({
      date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      views: Math.floor(viewsBase * trend),
      engagement: Math.floor(engagementBase * trend),
      conversions: Math.floor(conversionBase * trend)
    });
  }
  
  return data;
};

// Mock-data för de tre olika tidsperioderna (används som fallback)
const mockData = {
  '7': generateData(7),
  '14': generateData(14),
  '30': generateData(30)
};

export type TimeRange = '7' | '14' | '30';

interface PerformanceChartProps {
  initialData?: PerformanceDataPoint[];
  onTimeRangeChange?: (range: TimeRange) => void;
}

export default function PerformanceChart({ initialData, onTimeRangeChange }: PerformanceChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('30');
  const [chartData, setChartData] = useState<PerformanceDataPoint[]>(initialData || mockData['30']);
  const [loading, setLoading] = useState<boolean>(false);
  
  useEffect(() => {
    // Only fetch if no initial data is provided
    if (!initialData) {
      fetchData(timeRange);
    }
  }, [initialData]);
  
  const fetchData = async (range: TimeRange) => {
    setLoading(true);
    try {
      const analytics = await fetchDashboardAnalytics(range);
      if (analytics && analytics.performanceData) {
        setChartData(analytics.performanceData);
      } else {
        // Fallback to mock data if no performance data
        setChartData(mockData[range]);
      }
    } catch (error) {
      console.error('Failed to fetch performance data:', error);
      setChartData(mockData[range]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    fetchData(range);
    if (onTimeRangeChange) {
      onTimeRangeChange(range);
    }
  };
  
  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button 
            onClick={() => handleTimeRangeChange('7')}
            className={`text-xs px-3 py-1 rounded-md ${
              timeRange === '7' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground'
            }`}
            disabled={loading}
          >
            7 dagar
          </button>
          <button 
            onClick={() => handleTimeRangeChange('14')}
            className={`text-xs px-3 py-1 rounded-md ${
              timeRange === '14' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground'
            }`}
            disabled={loading}
          >
            14 dagar
          </button>
          <button 
            onClick={() => handleTimeRangeChange('30')}
            className={`text-xs px-3 py-1 rounded-md ${
              timeRange === '30' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground'
            }`}
            disabled={loading}
          >
            30 dagar
          </button>
        </div>
        {loading && (
          <div className="text-xs text-muted-foreground">Laddar data...</div>
        )}
      </div>
      
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FF6B00" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4A90E2" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
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
            <Area 
              type="monotone" 
              dataKey="views" 
              name="Visningar"
              stroke="#FF6B00" 
              fillOpacity={1}
              fill="url(#colorViews)" 
            />
            <Area 
              type="monotone" 
              dataKey="engagement" 
              name="Engagemang"
              stroke="#4A90E2" 
              fillOpacity={1}
              fill="url(#colorEngagement)" 
            />
            <Area 
              type="monotone" 
              dataKey="conversions" 
              name="Konverteringar"
              stroke="#10B981" 
              fillOpacity={1}
              fill="url(#colorConversions)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}