export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex h-[50vh] items-center justify-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#005da4] border-t-transparent"></div>
            <p className="text-lg font-bold text-gray-500">Yükleniyor...</p>
          </div>
        </div>
      </main>
    </div>
  );
}