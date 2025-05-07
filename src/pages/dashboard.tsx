import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import bannerImage from '@/assets/images/Banner 8k (With Rocket).png';
import logoImage from '@/assets/images/Color logo - no background.png';
import PerformanceChart, { TimeRange } from "@/components/dashboard/performance-chart";
import { 
  initializeDashboardBackend, 
  fetchDashboardAnalytics, 
  fetchRecentActivity,
  DashboardAnalytics,
  RecentActivity,
  PerformanceDataPoint
} from "@/lib/dashboard-backend-integration";

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('30');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize backend connection
    initializeDashboardBackend();
    
    // Fetch dashboard data
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch analytics data
      const analyticsData = await fetchDashboardAnalytics(timeRange);
      setAnalytics(analyticsData);
      
      // Fetch recent activity
      const activityData = await fetchRecentActivity();
      setRecentActivity(activityData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Ett fel uppstod när data skulle hämtas. Försök igen senare.');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    fetchDashboardAnalytics(range)
      .then(data => setAnalytics(data))
      .catch(err => {
        console.error('Error fetching analytics:', err);
      });
  };

  // Calculate how long ago an activity occurred
  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffMs = now.getTime() - activityDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) return `${diffMins} minuter sedan`;
    if (diffHours < 24) return `${diffHours} timmar sedan`;
    return `${diffDays} dagar sedan`;
  };

  return (
    <>
      <div className="space-y-6 relative z-0">
        {/* Custom welcome card */}
        <div className="rounded-lg overflow-hidden border border-orange-500/20 bg-gradient-to-br from-slate-800/90 to-slate-900/95 shadow-xl p-6">
          <div className="flex flex-col md:flex-row items-start justify-between relative">
            <div>
              <h2 className="text-2xl font-bold mb-2">Välkommen till din dashboard!</h2>
              <p className="text-gray-300 mt-2 max-w-2xl">
                Skapa professionellt innehåll för dina sociala medier på minuter, inte timmar. Här ser du en överblick av dina aktiviteter och tillgängliga verktyg.
              </p>
              
              <div className="flex flex-wrap gap-4 mt-6">
                <a href="/content-creator" className="gradient-button-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14"></path>
                  </svg>
                  Skapa nytt innehåll
                </a>
                <a href="/templates" className="gradient-button-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  Utforska mallar
                </a>
              </div>
            </div>

            <div className="hidden md:block opacity-10">
              <img src={logoImage} alt="BoostLab Logo" className="w-32 h-32" />
            </div>
          </div>
        </div>
      
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="group gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Content</CardTitle>
              <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                <DollarSign className="h-4 w-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-6 w-16 bg-slate-700 rounded mb-2"></div>
                  <div className="h-4 w-24 bg-slate-700/50 rounded"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{analytics?.totalContent || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    +10% from last month
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card className="group gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active A/B Tests</CardTitle>
              <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <Users className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-6 w-16 bg-slate-700 rounded mb-2"></div>
                  <div className="h-4 w-24 bg-slate-700/50 rounded"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{analytics?.abTests || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    3 completed this week
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card className="group gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Credits</CardTitle>
              <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                <CreditCard className="h-4 w-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-6 w-16 bg-slate-700 rounded mb-2"></div>
                  <div className="h-2 w-full bg-slate-700 rounded-full mt-2"></div>
                  <div className="h-4 w-24 bg-slate-700/50 rounded mt-1"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{analytics?.aiCredits || 0}</div>
                  <div className="mt-2">
                    <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full" 
                        style={{ width: `${analytics?.aiCreditsUsed || 0}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {analytics?.aiCreditsUsed || 0}% remaining for this month
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card className="group gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <Activity className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-6 w-16 bg-slate-700 rounded mb-2"></div>
                  <div className="h-4 w-24 bg-slate-700/50 rounded"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{analytics?.activeProjects || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    +2 in draft status
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 gradient-card">
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>
                Content performance metrics for the last {timeRange} days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading && !analytics?.performanceData ? (
                <div className="h-[200px] flex items-center justify-center">
                  <div className="text-muted-foreground">Laddar data...</div>
                </div>
              ) : error ? (
                <div className="h-[200px] flex items-center justify-center">
                  <div className="text-orange-400">{error}</div>
                </div>
              ) : (
                <PerformanceChart 
                  initialData={analytics?.performanceData} 
                  onTimeRangeChange={handleTimeRangeChange}
                />
              )}
            </CardContent>
          </Card>
          
          <Card className="col-span-3 gradient-card">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your recent content creation and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  // Loading skeleton
                  Array(5).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                      <div className="flex-1 space-y-1">
                        <div className="h-4 w-32 bg-slate-700 rounded"></div>
                        <div className="h-3 w-24 bg-slate-700/50 rounded"></div>
                      </div>
                    </div>
                  ))
                ) : recentActivity.length > 0 ? (
                  // Actual data
                  recentActivity.map((activity, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-400" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {activity.type === 'content' && `Content ${activity.action || 'created'}`}
                          {activity.type === 'project' && `Project ${activity.title || ''} ${activity.status || ''}`}
                          {activity.type === 'template' && `Template ${activity.action || 'used'}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getTimeAgo(activity.date)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  // Fallback if no activity
                  <div className="text-center text-muted-foreground py-4">
                    Ingen aktivitet att visa
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Upcoming Features Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Kommande funktioner</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-lg p-6 gradient-card group">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.7 7.91c-.5-.2-1.03-.3-1.58-.27-1.47.06-2.8.97-3.34 2.3M9.82 14.31a3.93 3.93 0 0 0 1.53.3 3.94 3.94 0 0 0 3.93-3.93M9 17.5c0 2.49 2.01 4.5 4.5 4.5s4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5-4.5 2.01-4.5 4.5"></path>
                  <path d="M18.5 9.5 19 8l1.5.5c.94.31 1.93.31 2.88 0l1.12-.38V3l-1.12.38a7.3 7.3 0 0 1-2.88 0l-1.5-.5-.5 1.5c-.31.94-.31 1.93 0 2.88l.5 1.74Zm-13 0L5 8l-1.5.5a7.3 7.3 0 0 1-2.88 0L0 8V3l.62.38a7.3 7.3 0 0 0 2.88 0l1.5-.5.5 1.5c.31.94.31 1.93 0 2.88L5 9.26Z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-orange-400 transition-colors">AI-bildskapare</h3>
              <p className="text-muted-foreground">
                Skapa unika bilder för dina sociala medieinlägg direkt från vårt verktyg.
              </p>
            </div>
            
            <div className="rounded-lg p-6 gradient-card group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7V5c0-1.1.9-2 2-2h2M17 3h2c1.1 0 2 .9 2 2v2M21 17v2c0 1.1-.9 2-2 2h-2M7 21H5c-1.1 0-2-.9-2-2v-2"></path>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  <path d="M9 9h.01"></path>
                  <path d="M15 9h.01"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors">Intelligent tonanalys</h3>
              <p className="text-muted-foreground">
                Analysera hur ditt innehåll uppfattas och föreslår förbättringar för att matcha din målgrupp.
              </p>
            </div>
            
            <div className="rounded-lg p-6 gradient-card group">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-orange-400 transition-colors">Innehållsplanering</h3>
              <p className="text-muted-foreground">
                Planera och schemalägg ditt innehåll med en visuell kalender direkt från dashboarden.
              </p>
            </div>
          </div>
        </div>

        {/* Team Activity Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Teamaktivitet</h2>
          <Card className="gradient-card">
            <CardContent className="pt-6">
              <div className="space-y-8">
                {[
                  { user: 'JD', name: 'John Doe', action: 'skapade nytt innehåll', time: '2 timmar sedan', type: 'Instagram' },
                  { user: 'AS', name: 'Anna Svensson', action: 'startade A/B test', time: '4 timmar sedan', type: 'LinkedIn' },
                  { user: 'ML', name: 'Marcus Larsson', action: 'publicerade innehåll', time: '1 dag sedan', type: 'Facebook' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${i % 2 === 0 ? 'bg-gradient-to-r from-orange-500 to-orange-400' : 'bg-gradient-to-r from-blue-500 to-blue-400'}`}>
                      {activity.user}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold">{activity.name}</span> {activity.action}
                      </p>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          activity.type === 'Instagram' ? 'bg-pink-500/10 text-pink-400' :
                          activity.type === 'LinkedIn' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-blue-700/10 text-blue-500'
                        }`}>
                          {activity.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}