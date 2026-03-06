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
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-gray-900">Sistem & Mail Ayarları</h1>
        <Link href="/admin" className="text-blue-600 font-bold hover:underline">← Panele Dön</Link>
      </div>
      
      <form onSubmit={handleSave} className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 space-y-6">
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Mail Gönderim Servisi</label>
          <select 
            value={settings.mailService}
            onChange={(e) => setSettings({...settings, mailService: e.target.value})}
            className="w-full p-4 bg-gray-50 border border-gray-300 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-semibold"
          >
            <option value="SMTP">SMTP (Kendi Mail Sunucum)</option>
            <option value="RESEND">Resend API (Modern Servis)</option>
          </select>
        </div>

        {settings.mailService === "SMTP" ? (
          <div className="space-y-4 p-6 bg-blue-50 rounded-2xl border border-blue-100">
            <h3 className="font-bold text-blue-800">SMTP Sunucu Bilgileri</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                placeholder="SMTP Host (mail.site.com)" 
                value={settings.smtpHost || ""} 
                onChange={e => setSettings({...settings, smtpHost: e.target.value})}
                className="p-4 border rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <input 
                type="number" 
                placeholder="Port (587)" 
                value={settings.smtpPort || 587} 
                onChange={e => setSettings({...settings, smtpPort: parseInt(e.target.value)})}
                className="p-4 border rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <input 
                placeholder="Mail Kullanıcı Adı" 
                value={settings.smtpUser || ""} 
                onChange={e => setSettings({...settings, smtpUser: e.target.value})}
                className="p-4 border rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <input 
                type="password" 
                placeholder="Mail Şifresi" 
                value={settings.smtpPass || ""} 
                onChange={e => setSettings({...settings, smtpPass: e.target.value})}
                className="p-4 border rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>
        ) : (
          <div className="p-6 bg-green-50 rounded-2xl border border-green-100 space-y-4">
            <h3 className="font-bold text-green-800">Resend API Bilgileri</h3>
            <input 
              placeholder="re_xxxxxxxxxxxx" 
              value={settings.resendApiKey || ""} 
              onChange={e => setSettings({...settings, resendApiKey: e.target.value})}
              className="w-full p-4 border rounded-xl text-gray-900 font-mono focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Gönderici E-posta (From Email)</label>
          <input 
            placeholder="noreply@gozplatformu.com" 
            value={settings.fromEmail || ""} 
            onChange={e => setSettings({...settings, fromEmail: e.target.value})}
            className="w-full p-4 bg-gray-50 border border-gray-300 rounded-2xl text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition-all active:scale-[0.98] disabled:bg-gray-400 shadow-lg shadow-blue-200"
        >
          {loading ? "Kaydediliyor..." : "Ayarları Kaydet"}
        </button>

        {message && (
          <div className={`p-4 rounded-xl text-center font-bold ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}