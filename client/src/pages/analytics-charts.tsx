import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/consolidated-language-context";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AnalyticsCharts() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isTr = language === "tr";

  const { data: analytics } = useQuery({
    queryKey: ["/api/marketing/analytics"],
  });

  // Sample data for charts
  const signupData = [
    { date: "Nov 1", signups: 12, conversions: 3 },
    { date: "Nov 2", signups: 19, conversions: 5 },
    { date: "Nov 3", signups: 15, conversions: 4 },
    { date: "Nov 4", signups: 25, conversions: 8 },
    { date: "Nov 5", signups: 22, conversions: 7 },
    { date: "Nov 6", signups: 30, conversions: 10 },
  ];

  const sourceData = [
    { source: isTr ? "Organik" : "Organic", users: 400 },
    { source: isTr ? "Referral" : "Referral", users: 300 },
    { source: isTr ? "Reklam" : "Ads", users: 200 },
    { source: isTr ? "Sosyal" : "Social", users: 278 },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar />
      <div className="ml-0 md:ml-64 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white">
              {isTr ? "Pazarlama Analitikleri" : "Marketing Analytics"}
            </h1>
            <p className="text-slate-400">
              {isTr
                ? "Detaylı metrikler ve performans raporları"
                : "Detailed metrics and performance reports"}
            </p>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Signups vs Conversions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>{isTr ? "Kayıtlar vs Dönüşümler" : "Signups vs Conversions"}</CardTitle>
                <CardDescription>
                  {isTr ? "Son 6 günün performansı" : "Last 6 days performance"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={signupData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: "#1F2937" }} />
                    <Line
                      type="monotone"
                      dataKey="signups"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      name={isTr ? "Kayıtlar" : "Signups"}
                    />
                    <Line
                      type="monotone"
                      dataKey="conversions"
                      stroke="#10B981"
                      strokeWidth={2}
                      name={isTr ? "Dönüşümler" : "Conversions"}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Source Distribution */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>{isTr ? "Kullanıcı Kaynakları" : "User Sources"}</CardTitle>
                <CardDescription>
                  {isTr ? "Trafiğin nereden geldiği" : "Where traffic comes from"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sourceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: "#1F2937" }} />
                    <Bar dataKey="users" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-slate-400">
                  {isTr ? "Toplam Ziyaretçi" : "Total Visitors"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-400">2,450</div>
                <p className="text-xs text-green-400">+12% bu ay</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-slate-400">
                  {isTr ? "Kayıt Oranı" : "Signup Rate"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-cyan-400">24.5%</div>
                <p className="text-xs text-green-400">+3% bu ay</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-slate-400">
                  {isTr ? "Dönüşüm Oranı" : "Conversion Rate"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">12.8%</div>
                <p className="text-xs text-green-400">+5% bu ay</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-slate-400">
                  {isTr ? "Ortalama Oturum" : "Avg Session"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-400">4m 32s</div>
                <p className="text-xs text-green-400">+1m bu ay</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
