'use client';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function PrincipalDashboard() {
  const router = useRouter();

  // Data dummy untuk contoh tampilan tabel
  const orders = [
    { id: 1, customer: 'Bank BCA Klaten', qty: 50, total: 'Rp 1.250.000', status: 'Diproses', vendor: 'Dapur Bu Sri' },
    { id: 2, customer: 'PT Telkom', qty: 100, total: 'Rp 2.500.000', status: 'Selesai', vendor: 'Catering Berkah' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-800">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Nasibox Andalan 🍱</h1>
            <p className="text-sm text-slate-500">Selamat datang kembali, Admin.</p>
          </div>
          <button onClick={handleLogout} className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold px-5 py-2 rounded-xl transition">
            Keluar
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-blue-500">
            <span className="text-3xl mb-2 block">📦</span>
            <p className="text-slate-500 font-medium">Total Order</p>
            <p className="text-3xl font-bold text-slate-900">128</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-amber-500">
            <span className="text-3xl mb-2 block">👨‍🍳</span>
            <p className="text-slate-500 font-medium">Vendor Aktif</p>
            <p className="text-3xl font-bold text-slate-900">5</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-emerald-500">
            <span className="text-3xl mb-2 block">💰</span>
            <p className="text-slate-500 font-medium">Estimasi Komisi</p>
            <p className="text-3xl font-bold text-slate-900">Rp 4.250.000</p>
          </div>
        </div>

        {/* TABEL DATA */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800">Monitoring Pesanan</h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition shadow-lg shadow-blue-200">
              + Order Baru
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Qty</th>
                  <th className="p-4 font-semibold">Vendor</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-bold text-slate-700">{order.customer}</td>
                    <td className="p-4 text-slate-600">{order.qty} Box</td>
                    <td className="p-4 text-slate-600">{order.vendor}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === 'Selesai' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-blue-600">{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}