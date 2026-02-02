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
    customer_email: '',
    delivery_date: '',
    delivery_time: '',
    delivery_address: '',
    delivery_notes: '',
    product_name: '',
    quantity: 0,
    unit_price: 0,
    notes: ''
  });

  // Logika Auto-Calculate Komisi
  const totalAmount = formData.quantity * formData.unit_price;
  const commissionPct = 10;
  const commissionAmount = totalAmount * (commissionPct / 100);
  const netVendorAmount = totalAmount - commissionAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Ambil user ID yang sedang login
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('Anda harus login terlebih dahulu!');
        setLoading(false);
        return;
      }

      // 2. Siapkan data items dalam format JSONB
      const itemsData = [{
        name: formData.product_name,
        quantity: formData.quantity,
        unit_price: formData.unit_price,
        subtotal: totalAmount
      }];

      // 3. Gabungkan delivery_time ke dalam delivery_notes
      // Format: [Jam: 16:00] Catatan user...
      let finalDeliveryNotes = '';
      if (formData.delivery_time) {
        finalDeliveryNotes = `[Jam Kirim: ${formData.delivery_time}]`;
        if (formData.delivery_notes) {
          finalDeliveryNotes += ` ${formData.delivery_notes}`;
        }
      } else {
        finalDeliveryNotes = formData.delivery_notes || null;
      }

      // 4. Data yang akan dikirim - TANPA delivery_time
      const orderData = {
        // Customer Info (required)
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        customer_email: formData.customer_email || null,
        
        // Delivery Information (required)
        delivery_date: formData.delivery_date,
        delivery_address: formData.delivery_address,
        delivery_notes: finalDeliveryNotes, // Jam kirim sudah digabung di sini
        delivery_lat: null,
        delivery_lng: null,
        
        // Order Details (required)
        items: itemsData,
        total_amount: totalAmount,
        notes: formData.notes || null,
        
        // Status (required)
        status: 'new',
        
        // Commission
        commission_pct: commissionPct,
        
        // Created by
        created_by: user.id
      };

      console.log('🔍 Data yang akan dikirim:', orderData);

      // 5. Insert ke database
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select();

      if (error) {
        console.error('❌ Error detail:', error);
        throw error;
      }

      console.log('✅ Berhasil membuat order:', data);
      alert('✅ Order berhasil dibuat!');
      router.push('/dashboard/principal');
      
    } catch (error: any) {
      console.error('❌ Full error:', error);
      alert(`❌ Gagal membuat order: ${error.message}\n\nCek console browser (F12) untuk detail.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header Halaman */}
      <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between mb-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <span className="text-orange-500">🛒</span> Buat Order Baru
        </h1>
        <button 
          onClick={() => router.back()}
          className="text-sm text-slate-500 hover:text-orange-500 font-medium transition"
        >
          &larr; Kembali ke Dashboard
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-12">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* KOLOM KIRI: Informasi Utama Order */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Card 1: Data Customer */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
                <h3 className="font-bold text-slate-700">👤 Informasi Pelanggan</h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">
                    Nama Customer <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Contoh: Haji Said"
                    value={formData.customer_name}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none transition" 
                    onChange={(e) => setFormData({...formData, customer_name: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">
                    No. Telepon <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="0812..." 
                    value={formData.customer_phone}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none transition"
                    onChange={(e) => setFormData({...formData, customer_phone: e.target.value})} 
                  />
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                    Akan di-masking ke vendor
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-600 mb-1">
                    Email (Opsional)
                  </label>
                  <input 
                    type="email" 
                    placeholder="customer@email.com"
                    value={formData.customer_email}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none transition" 
                    onChange={(e) => setFormData({...formData, customer_email: e.target.value})} 
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Detail Produk & Pengiriman */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
                <h3 className="font-bold text-slate-700">📦 Detail Pesanan</h3>
              </div>
              <div className="p-6 space-y-4">
                {/* Produk */}
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">
                    Nama Produk <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Contoh: Nasi Ayam Bakar"
                    value={formData.product_name}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none transition" 
                    onChange={(e) => setFormData({...formData, product_name: e.target.value})} 
                  />
                </div>

                {/* Alamat Pengiriman */}
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">
                    Alamat Pengiriman <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    rows={2} 
                    required
                    placeholder="Contoh: Jl. Sudirman No. 123, RT 02/RW 05, Kelurahan ABC"
                    value={formData.delivery_address}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none transition"
                    onChange={(e) => setFormData({...formData, delivery_address: e.target.value})} 
                  />
                </div>

                {/* Waktu Kirim */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">
                      Tanggal Kirim <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="date" 
                      required 
                      value={formData.delivery_date}
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none transition"
                      onChange={(e) => setFormData({...formData, delivery_date: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">
                      Jam Kirim <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="time" 
                      required 
                      value={formData.delivery_time}
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none transition"
                      onChange={(e) => setFormData({...formData, delivery_time: e.target.value})} 
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      💡 Jam akan disimpan di catatan pengiriman
                    </p>
                  </div>
                </div>

                {/* Catatan Pengiriman */}
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">
                    Catatan Pengiriman (Opsional)
                  </label>
                  <textarea 
                    rows={2} 
                    placeholder="Cth: Rumah cat hijau, sebelah warung..."
                    value={formData.delivery_notes}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none transition"
                    onChange={(e) => setFormData({...formData, delivery_notes: e.target.value})} 
                  />
                </div>

                {/* Catatan Umum */}
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">
                    Catatan Tambahan (Opsional)
                  </label>
                  <textarea 
                    rows={2} 
                    placeholder="Cth: Jangan terlalu pedas, minta sendok plastik..."
                    value={formData.notes}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none transition"
                    onChange={(e) => setFormData({...formData, notes: e.target.value})} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: Kalkulasi Harga */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-6">
              <div className="bg-orange-50 px-6 py-3 border-b border-orange-100">
                <h3 className="font-bold text-orange-700 flex items-center gap-2">
                  💰 Kalkulasi Harga
                </h3>
              </div>
              
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Jumlah Box
                  </label>
                  <input 
                    type="number" 
                    required 
                    min="1" 
                    placeholder="0"
                    value={formData.quantity || ''}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-lg font-bold text-slate-700 focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none transition"
                    onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})} 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Harga Satuan (Rp)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-400 font-medium">Rp</span>
                    <input 
                      type="number" 
                      required 
                      min="0" 
                      placeholder="0"
                      value={formData.unit_price || ''}
                      className="w-full p-2.5 pl-10 border border-slate-300 rounded-lg text-lg font-bold text-slate-700 focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none transition"
                      onChange={(e) => setFormData({...formData, unit_price: Number(e.target.value)})} 
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-dashed border-slate-300">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-500 text-sm">Total Omset</span>
                    <span className="text-xl font-bold text-slate-800">
                      Rp {totalAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <p className="text-xs text-right text-slate-400">Total yang ditagihkan ke customer</p>
                </div>

                {/* Rincian Komisi (Visual Only - Info Internal) */}
                <div className="bg-slate-50 rounded-lg p-3 space-y-2 border border-slate-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-600 font-semibold">Komisi Principal (10%)</span>
                    <span className="text-emerald-700 font-bold">
                      + Rp {commissionAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-orange-600 font-semibold">Net Vendor</span>
                    <span className="text-orange-700 font-bold">
                      Rp {netVendorAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold shadow-md hover:bg-orange-600 hover:shadow-lg disabled:bg-slate-300 disabled:shadow-none transition transform active:scale-95"
                >
                  {loading ? 'Menyimpan Order...' : '✨ Buat Order Sekarang'}
                </button>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}