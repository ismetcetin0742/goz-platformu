"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminSettings() {
  const [settings, setSettings] = useState<any>({
    mailService: "SMTP",
    smtpHost: "",
    smtpPort: 587,
    smtpUser: "",
    smtpPass: "",
    resendApiKey: "",
    fromEmail: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Mevcut ayarları çek
  useEffect(() => {
    fetch("/api/admin/settings")
      .then(res => res.json())
      .then(data => {
        if (data && data.id) setSettings(data);
      })
      .catch(err => console.error("Yükleme hatası:", err));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage("✅ Ayarlar başarıyla kaydedildi.");
      } else {
        setMessage("❌ Kaydedilirken bir hata oluştu. Yetkinizi kontrol edin.");
      }
    } catch (error) {
      setMessage("❌ Sunucuya bağlanılamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <Link href="/admin" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#005da4] font-bold transition-colors text-sm">
              <span>←</span> Panele Dön
            </Link>
            <Link href="/" className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl font-bold text-sm text-[#005da4] shadow-sm border border-gray-100 hover:bg-blue-50 hover:shadow-md transition-all active:scale-95">
              🌍 Siteye Dön
            </Link>
          </div>
          <h1 className="text-4xl font-black text-[#002f56] tracking-tight">Sistem & Mail Ayarları</h1>
          <p className="text-gray-500 font-medium mt-2">Platformun temel e-posta ve iletişim yapılandırmasını yönetin.</p>
        </div>
        
        <form onSubmit={handleSave} className="space-y-8 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-gray-100">
          
          <div>
            <label className="block text-sm font-black text-[#002f56] mb-3 ml-1 uppercase tracking-wider">Mail Gönderim Servisi</label>
            <select 
              value={settings.mailService}
              onChange={(e) => setSettings({...settings, mailService: e.target.value})}
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-neutral-900 font-bold outline-none focus:bg-white focus:border-[#005da4] focus:ring-4 focus:ring-blue-100 transition-all cursor-pointer"
            >
              <option value="SMTP">SMTP (Kendi Mail Sunucum)</option>
              <option value="RESEND">Resend API (Modern Servis)</option>
            </select>
          </div>

          {settings.mailService === "SMTP" ? (
            <div className="space-y-6 p-8 bg-blue-50/50 rounded-3xl border border-blue-100">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">⚙️</span>
                <h3 className="font-black text-[#005da4] text-lg">SMTP Sunucu Bilgileri</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#005da4] mb-2 ml-1 uppercase tracking-wider">SMTP Host</label>
                  <input 
                    placeholder="mail.site.com" 
                    value={settings.smtpHost || ""} 
                    onChange={e => setSettings({...settings, smtpHost: e.target.value})}
                    className="w-full p-4 bg-white border-2 border-blue-100 rounded-2xl text-neutral-900 font-bold outline-none focus:border-[#005da4] focus:ring-4 focus:ring-blue-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#005da4] mb-2 ml-1 uppercase tracking-wider">Port</label>
                  <input 
                    type="number" 
                    placeholder="587" 
                    value={settings.smtpPort || 587} 
                    onChange={e => setSettings({...settings, smtpPort: parseInt(e.target.value)})}
                    className="w-full p-4 bg-white border-2 border-blue-100 rounded-2xl text-neutral-900 font-bold outline-none focus:border-[#005da4] focus:ring-4 focus:ring-blue-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#005da4] mb-2 ml-1 uppercase tracking-wider">Kullanıcı Adı</label>
                  <input 
                    placeholder="Mail Kullanıcı Adı" 
                    value={settings.smtpUser || ""} 
                    onChange={e => setSettings({...settings, smtpUser: e.target.value})}
                    className="w-full p-4 bg-white border-2 border-blue-100 rounded-2xl text-neutral-900 font-bold outline-none focus:border-[#005da4] focus:ring-4 focus:ring-blue-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#005da4] mb-2 ml-1 uppercase tracking-wider">Şifre</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={settings.smtpPass || ""} 
                    onChange={e => setSettings({...settings, smtpPass: e.target.value})}
                    className="w-full p-4 bg-white border-2 border-blue-100 rounded-2xl text-neutral-900 font-bold outline-none focus:border-[#005da4] focus:ring-4 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-green-50/50 rounded-3xl border border-green-100 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🚀</span>
                <h3 className="font-black text-green-700 text-lg">Resend API Bilgileri</h3>
              </div>
              <div>
                <label className="block text-xs font-bold text-green-700 mb-2 ml-1 uppercase tracking-wider">API Key</label>
                <input 
                  placeholder="re_xxxxxxxxxxxx" 
                  value={settings.resendApiKey || ""} 
                  onChange={e => setSettings({...settings, resendApiKey: e.target.value})}
                  className="w-full p-4 bg-white border-2 border-green-200 rounded-2xl text-neutral-900 font-mono focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-black text-[#002f56] mb-3 ml-1 uppercase tracking-wider">Gönderici E-posta (From Email)</label>
            <input 
              placeholder="noreply@gozplatformu.com" 
              value={settings.fromEmail || ""} 
              onChange={e => setSettings({...settings, fromEmail: e.target.value})}
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-neutral-900 font-bold outline-none focus:bg-white focus:border-[#005da4] focus:ring-4 focus:ring-blue-100 transition-all"
            />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
            <div className="w-full md:w-auto">
              {message && (
                <div className={`px-6 py-4 rounded-xl font-bold text-sm ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {message}
                </div>
              )}
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full md:w-auto bg-[#00a3e0] text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-[#005da4] transition-all shadow-2xl shadow-blue-200 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
            >
              {loading ? "Kaydediliyor..." : "Ayarları Kaydet"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}