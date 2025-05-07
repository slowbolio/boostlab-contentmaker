import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MetricsSummary from "@/components/analytics/metrics-summary";
import ContentPerformance from "@/components/analytics/content-performance";
import PlatformPerformance from "@/components/analytics/platform-performance";
import ContentRanking from "@/components/analytics/content-ranking";

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Track and analyze your content performance
        </p>
      </div>
      
      {/* Metrics Summary */}
      <MetricsSummary />
      
      {/* Content Performance Chart */}
      <div className="grid grid-cols-1 gap-6">
        <ContentPerformance />
      </div>
      
      {/* Platform Performance and Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlatformPerformance />
        
        <Card>
          <CardHeader>
            <CardTitle>Målgruppsanalys</CardTitle>
            <CardDescription>Insikter om din publik och läsare</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-[300px] text-center space-y-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-16 h-16 text-muted-foreground"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
              <h3 className="text-lg font-medium">Målgruppsanalys kommer snart</h3>
              <p className="text-muted-foreground max-w-md">
                Vi arbetar på att implementera avancerad målgruppsanalys för att 
                hjälpa dig förstå din publik och optimera ditt innehåll bättre.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Content Ranking */}
      <div className="grid grid-cols-1 gap-6">
        <ContentRanking />
      </div>
      
      {/* SEO Performance (Coming Soon) */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>SEO Prestanda</CardTitle>
            <CardDescription>Analyser av sökmotorsynlighet och optimeringsmöjligheter</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-[200px] text-center space-y-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-16 h-16 text-muted-foreground"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <h3 className="text-lg font-medium">SEO-analys kommer snart</h3>
              <p className="text-muted-foreground max-w-md">
                Vi implementerar snart detaljerad SEO-analys som visar dina rangordningar, 
                nyckelord och förbättringsmöjligheter.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}