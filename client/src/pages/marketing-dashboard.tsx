import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/consolidated-language-context";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, Users, Share2, BarChart3, Zap, Trophy } from "lucide-react";

export default function MarketingDashboard() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const isTr = language === "tr";

  const { data: stats } = useQuery({
    queryKey: ["/api/marketing/stats"],
  });

  const { data: referrals } = useQuery({
    queryKey: ["/api/referral/my-referrals"],
  });

  const { data: analytics } = useQuery({
    queryKey: ["/api/marketing/analytics"],
  });

  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar />
      <div className="ml-0 md:ml-64 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white">
              {isTr ? "Pazarlama Panosu" : "Marketing Dashboard"}
            </h1>
            <p className="text-slate-400">
              {isTr
                ? "Tüm pazarlama metriklerinizi ve başarılarınızı takip edin"
                : "Track all your marketing metrics and performance"}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {isTr ? "Davetler" : "Referrals"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats?.referrals || 0}</div>
                <p className="text-xs text-green-400">
                  {isTr ? "+12% bu ay" : "+12% this month"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  {isTr ? "Dönüşüm" : "Conversions"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats?.conversions || 0}</div>
                <p className="text-xs text-green-400">
                  {isTr ? "12.5% oran" : "12.5% rate"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  {isTr ? "Paylaşımlar" : "Shares"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats?.shares || 0}</div>
                <p className="text-xs text-slate-500">
                  {isTr ? "Sosyal ortamda" : "On social"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  {isTr ? "Kazanç" : "Earnings"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">${stats?.earnings || "0.00"}</div>
                <p className="text-xs text-slate-500">
                  {isTr ? "Toplam" : "Total"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="referral" className="w-full">
            <TabsList className="bg-slate-800 border-slate-700">
              <TabsTrigger value="referral">
                {isTr ? "Referral" : "Referral"}
              </TabsTrigger>
              <TabsTrigger value="affiliate">
                {isTr ? "Afiliasyon" : "Affiliate"}
              </TabsTrigger>
              <TabsTrigger value="analytics">
                {isTr ? "Analitiği" : "Analytics"}
              </TabsTrigger>
              <TabsTrigger value="waitlist">
                {isTr ? "Bekleme Listesi" : "Waitlist"}
              </TabsTrigger>
            </TabsList>

            {/* Referral Tab */}
            <TabsContent value="referral" className="space-y-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>{isTr ? "Referral Kodunuz" : "Your Referral Code"}</CardTitle>
                  <CardDescription>
                    {isTr
                      ? "Bu kodu arkadaşlarınızla paylaşın ve bonuslar kazanın"
                      : "Share this code with friends and earn rewards"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={referrals?.code || "EDUREF2025"}
                      readOnly
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <Button className="bg-blue-500 hover:bg-blue-600">
                      {isTr ? "Kopyala" : "Copy"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Affiliate Tab */}
            <TabsContent value="affiliate" className="space-y-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>{isTr ? "Afiliasyon Programı" : "Affiliate Program"}</CardTitle>
                  <CardDescription>
                    {isTr
                      ? "Öğretmen ve etkileyiciler için özel kazanç fırsatı"
                      : "Earn commissions as an affiliate"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400">
                    {isTr
                      ? "Her başarılı öğrenci kaydı için %15 komisyon kazanın"
                      : "Earn 15% commission per successful student signup"}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>{isTr ? "Pazarlama Analitikleri" : "Marketing Analytics"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-40 bg-slate-700/50 rounded flex items-center justify-center text-slate-400">
                      {isTr ? "Grafik Yükleniyor..." : "Chart Loading..."}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Waitlist Tab */}
            <TabsContent value="waitlist" className="space-y-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>{isTr ? "Bekleme Listesi" : "Waitlist"}</CardTitle>
                  <CardDescription>
                    {isTr
                      ? "Erken erişim için başvurabilecek kişileri davet edin"
                      : "Invite people to early access"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder={isTr ? "E-posta adresi" : "Email address"}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <Button className="bg-blue-500 hover:bg-blue-600">
                      {isTr ? "Davet Et" : "Invite"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
