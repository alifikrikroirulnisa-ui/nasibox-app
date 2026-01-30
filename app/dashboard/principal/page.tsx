'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function CreateOrder() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    delivery_date: '',
    delivery_time: '',
    product_name: '',
    quantity: 0,
    unit_price: 0,
    notes: ''
  });

  // Logika Auto-Calculate Komisi (Contoh 10%)
  const totalPrice = formData.quantity * formData.unit_price;
  const commission = totalPrice * 0.10; 
  const netToVendor = totalPrice - commission;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Nomor HP akan di-mask saat di-assign ke vendor nanti
    const { error } = await supabase.from('orders').insert([{
      ...formData,
      total_price: totalPrice,
      principal_commission: commission,
      vendor_net_amount: netToVendor,
      status: 'new' // Status awal adalah 'Baru'
    }]);

    if (error) {
      alert('Gagal membuat order: ' + error.message);
    } else {
      alert('Order berhasil dibuat!');
      router.push('/dashboard/principal');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-800">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span>➕</span> Buat Order Baru
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Data Customer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nama Customer *</label>
              <input type="text" required className="w-full p-2 border rounded-lg" 
                onChange={(e) => setFormData({...formData, customer_name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">No. Telepon *</label>
              <input type="tel" required placeholder="0812..." className="w-full p-2 border rounded-lg"
                onChange={(e) => setFormData({...formData, customer_phone: e.target.value})} />
              <p className="text-xs text-slate-400 mt-1 italic">Nomor ini akan disembunyikan dari vendor</p>
            </div>
          </div>

          {/* Detail Pesanan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tanggal Kirim</label>
              <input type="date" required className="w-full p-2 border rounded-lg"
                onChange={(e) => setFormData({...formData, delivery_date: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Jam Kirim</label>
              <input type="time" required className="w-full p-2 border rounded-lg"
                onChange={(e) => setFormData({...formData, delivery_time: e.target.value})} />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <label className="block text-sm font-medium mb-1 font-bold text-blue-600">💰 Detail Harga & Komisi</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-blue-50 p-4 rounded-xl">
              <div>
                <label className="block text-xs font-bold uppercase">Jumlah Box</label>
                <input type="number" required className="w-full p-2 border rounded-lg mt-1"
                  onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase">Harga Satuan (Rp)</label>
                <input type="number" required className="w-full p-2 border rounded-lg mt-1"
                  onChange={(e) => setFormData({...formData, unit_price: Number(e.target.value)})} />
              </div>
              <div className="flex flex-col justify-end">
                <p className="text-xs text-slate-500">Total Harga:</p>
                <p className="text-lg font-bold text-blue-700">Rp {totalPrice.toLocaleString()}</p>
              </div>
            </div>

            {/* Ringkasan Komisi */}
            <div className="grid grid-cols-2 gap-4 text-sm bg-slate-100 p-4 rounded-xl">
              <div className="text-emerald-600 font-bold">
                Jatah Principal (10%): <br/> Rp {commission.toLocaleString()}
              </div>
              <div className="text-orange-600 font-bold">
                Jatah Vendor: <br/> Rp {netToVendor.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <button type="button" onClick={() => router.back()} className="text-slate-500 underline">Batal</button>
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-slate-300 transition">
              {loading ? 'Menyimpan...' : 'Buat Order Sekarang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}