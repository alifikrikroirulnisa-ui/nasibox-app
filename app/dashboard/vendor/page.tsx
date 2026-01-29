'use client';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function VendorDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-orange-50 p-8 text-black">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-orange-700">Vendor Panel</h1>
          <button onClick={() => { supabase.auth.signOut(); router.push('/login'); }} className="text-gray-500 underline">Logout</button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-orange-500">
          <h2 className="text-xl font-bold mb-4">Tugas Masak Hari Ini</h2>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-10 text-center text-gray-400">
            Belum ada pesanan yang di-assign ke Anda.
          </div>
        </div>
      </div>
    </div>
  );
}