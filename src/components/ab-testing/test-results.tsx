import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, BarChart2, TrendingUp, Award, EyeIcon, MousePointerClick, ShoppingCart } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell
} from 'recharts';

// Mockdata
const COLORS = ['#FF6B00', '#4A90E2', '#10B981', '#8B5CF6'];

const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

interface ABTestResult {
  id: string;
  title: string;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  conversionRate: number;
  isWinner: boolean;
}

interface ABTestResultsProps {
  testId: string;
  testTitle: string;
  testDescription?: string;
  status: 'active' | 'draft' | 'completed';
  dateCreated: string;
  dateCompleted?: string;
  results?: ABTestResult[];
}

export function ABTestResults({ 
  testId, 
  testTitle, 
  testDescription, 
  status, 
  dateCreated, 
  dateCompleted,
  results: propResults 
}: ABTestResultsProps) {
  // Generate mock data if not provided
  const results: ABTestResult[] = propResults || [
    {
      id: 'variant-a',
      title: 'Variant A (Original)',
      impressions: randomIntFromInterval(5000, 8000),
      clicks: randomIntFromInterval(300, 600),
      conversions: randomIntFromInterval(30, 80),
      ctr: 0,
      conversionRate: 0,
      isWinner: false,
    },
    {
      id: 'variant-b',
      title: 'Variant B',
      impressions: randomIntFromInterval(5000, 8000),
      clicks: randomIntFromInterval(300, 700),
      conversions: randomIntFromInterval(30, 90),
      ctr: 0,
      conversionRate: 0,
      isWinner: false,
    }
  ];

  // Calculate rates and determine winner
  let winnerIndex = -1;
  let highestConvRate = 0;

  results.forEach((result, index) => {
    result.ctr = (result.clicks / result.impressions) * 100;
    result.conversionRate = (result.conversions / result.clicks) * 100;
    
    if (result.conversionRate > highestConvRate) {
      highestConvRate = result.conversionRate;
      winnerIndex = index;
    }
  });

  if (status === 'completed' && winnerIndex >= 0) {
    results[winnerIndex].isWinner = true;
  }

  // Prepare chart data
  const impressionsData = results.map(r => ({ name: r.title, value: r.impressions }));
  const clicksData = results.map(r => ({ name: r.title, value: r.clicks }));
  const conversionsData = results.map(r => ({ name: r.title, value: r.conversions }));
  
  const metricsComparisonData = results.map(r => ({
    name: r.title,
    'CTR (%)': parseFloat(r.ctr.toFixed(2)),
    'Konverteringsgrad (%)': parseFloat(r.conversionRate.toFixed(2)),
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{testTitle}</h2>
          {testDescription && <p className="text-muted-foreground mt-1">{testDescription}</p>}
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant={status === 'active' ? 'default' : status === 'completed' ? 'outline' : 'secondary'}>
              {status === 'active' ? 'Aktiv' : status === 'completed' ? 'Avslutad' : 'Utkast'}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Skapad: {new Date(dateCreated).toLocaleDateString()}
            </span>
            {dateCompleted && (
              <span className="text-sm text-muted-foreground">
                Avslutad: {new Date(dateCompleted).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        
        {status === 'active' && (
          <Button variant="outline" className="gap-2">
            <BarChart2 className="h-4 w-4" />
            Avsluta test
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <span>Översikt</span>
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>Detaljerade mätvärden</span>
          </TabsTrigger>
          <TabsTrigger value="variants" className="flex items-center gap-2">
            <EyeIcon className="h-4 w-4" />
            <span>Innehållsvarianter</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Totala visningar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {results.reduce((sum, r) => sum + r.impressions, 0).toLocaleString()}
                </div>
                <div className="mt-4 h-[160px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={impressionsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {impressionsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Totala klick</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {results.reduce((sum, r) => sum + r.clicks, 0).toLocaleString()}
                </div>
                <div className="mt-4 h-[160px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={clicksData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {clicksData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Totala konverteringar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {results.reduce((sum, r) => sum + r.conversions, 0).toLocaleString()}
                </div>
                <div className="mt-4 h-[160px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={conversionsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {conversionsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Jämförelse av nyckeltal</CardTitle>
              <CardDescription>CTR och konverteringsgrad för varje variant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={metricsComparisonData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '0.375rem',
                        color: 'white'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="CTR (%)" fill="#FF6B00" />
                    <Bar dataKey="Konverteringsgrad (%)" fill="#4A90E2" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {status === 'completed' && winnerIndex >= 0 && (
            <Card className="border-green-500/20 bg-green-500/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-500" />
                  <CardTitle>Testvinnare: {results[winnerIndex].title}</CardTitle>
                </div>
                <CardDescription>
                  {results[winnerIndex].title} presterade bäst med en konverteringsgrad på {results[winnerIndex].conversionRate.toFixed(2)}%
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                    <EyeIcon className="h-5 w-5 mb-1 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Visningar</span>
                    <span className="text-xl font-bold">{results[winnerIndex].impressions.toLocaleString()}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                    <MousePointerClick className="h-5 w-5 mb-1 text-blue-500" />
                    <span className="text-sm text-muted-foreground">Klick</span>
                    <span className="text-xl font-bold">{results[winnerIndex].clicks.toLocaleString()}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col items-center p-4 bg-green-500/20 rounded-lg">
                    <ShoppingCart className="h-5 w-5 mb-1 text-green-500" />
                    <span className="text-sm text-muted-foreground">Konverteringar</span>
                    <span className="text-xl font-bold">{results[winnerIndex].conversions.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detaljerade mätvärden</CardTitle>
              <CardDescription>Jämförelse av alla mätvärden per variant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-muted">
                      <th className="py-3 px-4 text-left">Variant</th>
                      <th className="py-3 px-4 text-right">Visningar</th>
                      <th className="py-3 px-4 text-right">Klick</th>
                      <th className="py-3 px-4 text-right">CTR</th>
                      <th className="py-3 px-4 text-right">Konverteringar</th>
                      <th className="py-3 px-4 text-right">Konverteringsgrad</th>
                      {status === 'completed' && <th className="py-3 px-4 text-center">Status</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => (
                      <tr key={result.id} className="border-b border-muted">
                        <td className="py-3 px-4">{result.title}</td>
                        <td className="py-3 px-4 text-right">{result.impressions.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">{result.clicks.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">{result.ctr.toFixed(2)}%</td>
                        <td className="py-3 px-4 text-right">{result.conversions.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">{result.conversionRate.toFixed(2)}%</td>
                        {status === 'completed' && (
                          <td className="py-3 px-4 text-center">
                            {result.isWinner ? (
                              <Badge className="bg-green-500/20 text-green-500 border-green-500/20 flex items-center gap-1">
                                <Award className="h-3 w-3" />
                                <span>Vinnare</span>
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Förlorare</Badge>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-8 space-y-1 text-sm text-muted-foreground">
                <p>- CTR (Click-Through Rate): Procent av visningar som resulterade i klick</p>
                <p>- Konverteringsgrad: Procent av klick som resulterade i en konvertering</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="variants" className="space-y-4">
          {results.map((result, i) => (
            <Card key={result.id} className={result.isWinner ? 'border-green-500/20' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle>
                      {result.title}
                    </CardTitle>
                    {result.isWinner && (
                      <Badge className="bg-green-500/20 text-green-500 border-green-500/20 flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        <span>Vinnare</span>
                      </Badge>
                    )}
                  </div>
                  <Badge variant="outline">
                    Variant {String.fromCharCode(65 + i)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-md bg-muted/50">
                  <p className="text-sm">
                    {i === 0 ? 
                      "Den här sommarkollektion är otrolig! Titta på dessa nya modeller från vårt senaste sortiment. ☀️ Passar perfekt för varma dagar vid stranden eller i staden. Snygg, bekväm och stilfull - allt du behöver för att stråla i sommar! Kolla in hela kollektionen i vår webbutik, länk i bion." :
                      "☀️ SOMMARKOLLEKTION 2025! ☀️\n\nNya modeller har landat! Stilrena, bekväma och perfekta för både strand och stadsliv.\n\n🔥 Begränsat antal - Shoppa nu innan dina favoriter tar slut!\n\nLänk i bion 👇 #sommarmode #nykollektion"}
                  </p>
                </div>
                
                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                  <div className="p-3 border rounded-md flex flex-col items-center">
                    <div className="text-muted-foreground mb-1">Visningar</div>
                    <div className="font-bold">{result.impressions.toLocaleString()}</div>
                  </div>
                  <div className="p-3 border rounded-md flex flex-col items-center">
                    <div className="text-muted-foreground mb-1">Klick</div>
                    <div className="font-bold">{result.clicks.toLocaleString()}</div>
                  </div>
                  <div className="p-3 border rounded-md flex flex-col items-center">
                    <div className="text-muted-foreground mb-1">Konverteringar</div>
                    <div className="font-bold">{result.conversions.toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 border rounded-md flex flex-col items-center">
                    <div className="text-muted-foreground mb-1">CTR</div>
                    <div className="font-bold">{result.ctr.toFixed(2)}%</div>
                  </div>
                  <div className="p-3 border rounded-md flex flex-col items-center">
                    <div className="text-muted-foreground mb-1">Konverteringsgrad</div>
                    <div className="font-bold">{result.conversionRate.toFixed(2)}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}