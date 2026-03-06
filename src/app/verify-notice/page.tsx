import Link from "next/link";

export default function VerifyNotice() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 text-center">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        {/* Hareketli Emoji */}
        <div className="text-6xl mb-6 animate-bounce">📧</div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Mailinizi Kontrol Edin!</h1>
        
        <p className="text-gray-600 mb-8 text-lg">
          Kayıt işleminiz başarıyla tamamlandı. Hesabınızı aktifleştirmek için e-posta adresinize gönderdiğimiz doğrulama bağlantısına tıklamanız yeterli.
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/login" 
            className="block w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            Giriş Sayfasına Dön
          </Link>
          
          <div className="pt-4">
            <p className="text-sm text-gray-400">
              E-posta gelmedi mi? Gereksiz (Spam) klasörünü kontrol etmeyi unutmayın.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}