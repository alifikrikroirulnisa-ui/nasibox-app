'use client';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function PrincipalDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-black">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Admin Nasi Box Andalan</h1>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Keluar</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-600">
            <p className="text-gray-500">Total Order</p>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
            <p className="text-gray-500">Vendor Aktif</p>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
            <p className="text-gray-500">Komisi Masuk</p>
            <p className="text-2xl font-bold">Rp 0</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">Order Terbaru</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">+ Tambah Order Manual</button>
          </div>
          <p className="text-center text-gray-400 py-10">Belum ada data order.</p>
        </div>
      </div>
    </div>
  );
}