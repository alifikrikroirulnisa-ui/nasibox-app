import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex flex-col">
        <h1 className="text-4xl font-bold mb-4 text-blue-900">NASI BOX ANDALAN</h1>
        <p className="mb-8 text-lg text-gray-600">Sistem Kontrol Order & Vendor Terpusat</p>
        
        <div className="flex gap-4">
          <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Login Sistem
          </Link>
        </div>

        <div className="mt-12 p-4 border rounded bg-white text-xs text-gray-400">
          <p>System v1.0 MVP</p>
          <p>Created for: Nanang Budiyanto</p>
        </div>
      </div>
    </main>
  );
}