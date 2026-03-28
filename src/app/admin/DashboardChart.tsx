"use client";

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

type Props = {
  stats: { totalPosts: number, pendingPosts: number, totalUsers: number, totalOpticians: number };
  userTrends: { name: string, users: number }[];
};

export default function DashboardChart({ stats, userTrends }: Props) {
  // Onaylı içerik sayısını bulmak için Toplam'dan Bekleyen'i çıkarıyoruz
  const approvedPosts = stats.totalPosts - stats.pendingPosts;

  // Grafikte gösterilecek veriler ve temanıza uygun renkler
  const data = [
    { name: "Onaylı İçerik", value: approvedPosts, color: "#005da4" }, // Koyu Mavi
    { name: "Bekleyen", value: stats.pendingPosts, color: "#f97316" }, // Turuncu
    { name: "Kullanıcılar", value: stats.totalUsers, color: "#00a3e0" }, // Açık Mavi
    { name: "Gözlükçüler", value: stats.totalOpticians, color: "#22c55e" }, // Yeşil
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      {/* Sol Grafik: Genel Durum Dağılımı */}
      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-[#002f56]">Genel İstatistikler</h2>
          <p className="text-gray-500 font-medium mt-1">Platformdaki verilerin güncel dağılımı</p>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#6b7280", fontSize: 13, fontWeight: 700 }} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#6b7280", fontSize: 13, fontWeight: 700 }} 
                allowDecimals={false}
              />
              <Tooltip 
                cursor={{ fill: "#f8f9fa" }}
                contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", fontWeight: "bold", color: "#002f56" }}
              />
              <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={50}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sağ Grafik: 7 Günlük Kayıt Trendi */}
      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-[#002f56]">Yeni Kullanıcılar</h2>
          <p className="text-gray-500 font-medium mt-1">Son 7 günlük kayıt trendi</p>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 13, fontWeight: 700 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 13, fontWeight: 700 }} allowDecimals={false} />
              <Tooltip cursor={{ stroke: "#f3f4f6", strokeWidth: 2 }} contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", fontWeight: "bold", color: "#00a3e0" }} />
              <Line type="monotone" dataKey="users" name="Kayıt Sayısı" stroke="#00a3e0" strokeWidth={4} dot={{ r: 6, fill: "#00a3e0", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}