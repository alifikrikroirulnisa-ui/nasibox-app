'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface Order {
  id: number;
  customer_name: string;
  delivery_date: string;
  total_amount: number;
  status: string;
  assigned_vendor_id: string | null;
  created_at: string;
}

interface Vendor {
  id: string;
  full_name: string;
}

export default function DashboardPrincipal() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  
  // Stats
  const [totalOrders, setTotalOrders] = useState(0);
  const [newOrders, setNewOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [activeVendors, setActiveVendors] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      setOrders(ordersData || []);

      // Calculate stats
      const all = ordersData || [];
      setTotalOrders(all.length);
      setNewOrders(all.filter(o => o.status === 'new').length);
      setCompletedOrders(all.filter(o => o.status === 'completed').length);
      
      // Calculate revenue (only from completed orders)
      const completed = all.filter(o => o.status === 'completed');
      const revenue = completed.reduce((sum, o) => sum + (o.total_amount || 0), 0);
      setTotalRevenue(revenue);
      setTotalCommission(revenue * 0.10); // 10% commission

      // Fetch vendors
      const { data: vendorsData, error: vendorsError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'vendor');

      if (vendorsError) throw vendorsError;

      setVendors(vendorsData || []);
      setActiveVendors((vendorsData || []).length);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVendorName = (vendorId: string | null) => {
    if (!vendorId) return 'Belum di-assign';
    const vendor = vendors.find(v => v.id === vendorId);
    return vendor?.full_name || 'Unknown Vendor';
  };

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: { label: string; className: string } } = {
      'new': { label: 'NEW', className: 'bg-yellow-500 text-white' },
      'assigned': { label: 'ASSIGNED', className: 'bg-blue-500 text-white' },
      'production': { label: 'PRODUCTION', className: 'bg-purple-500 text-white' },
      'delivery': { label: 'DELIVERY', className: 'bg-orange-500 text-white' },
      'completed': { label: 'SELESAI', className: 'bg-green-500 text-white' },
      'complaint': { label: 'KOMPLAIN', className: 'bg-red-500 text-white' },
      'cancelled': { label: 'DIBATAL', className: 'bg-gray-500 text-white' },
    };
    const badge = badges[status] || { label: status.toUpperCase(), className: 'bg-gray-400 text-white' };
    return (
      <span className={`px-2 py-1 text-xs font-bold rounded ${badge.className}`}>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 text-white p-2 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Principal</h1>
        </div>
        <button
          onClick={() => router.push('/dashboard/principal/orders/create')}
          className="bg-orange-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-orange-600 transition flex items-center gap-2 shadow-md"
        >
          <span className="text-lg">➕</span> Buat Order Baru
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Order */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-600 font-medium">Total Order</h3>
              <div className="bg-blue-50 p-2 rounded-lg">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-800">{totalOrders}</p>
          </div>

          {/* Order Baru */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-600 font-medium">Order Baru</h3>
              <div className="bg-yellow-50 p-2 rounded-lg">
                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-800">{newOrders}</p>
          </div>

          {/* Selesai */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-600 font-medium">Selesai</h3>
              <div className="bg-green-50 p-2 rounded-lg">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-800">{completedOrders}</p>
          </div>

          {/* Vendor Aktif */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-600 font-medium">Vendor Aktif</h3>
              <div className="bg-purple-50 p-2 rounded-lg">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-800">{activeVendors}/{vendors.length}</p>
          </div>
        </div>

        {/* Revenue & Commission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm border border-orange-200 p-6">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-orange-700 font-bold">Total Revenue</h3>
            </div>
            <p className="text-4xl font-bold text-green-700 mb-1">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </p>
            <p className="text-sm text-orange-600">Total penjualan dari order selesai</p>
          </div>

          {/* Total Komisi */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-blue-700 font-bold">Total Komisi</h3>
            </div>
            <p className="text-4xl font-bold text-blue-700 mb-1">
              Rp {totalCommission.toLocaleString('id-ID')}
            </p>
            <p className="text-sm text-blue-600">Komisi dari order selesai</p>
          </div>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Terbaru */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-bold text-orange-700">Order Terbaru</h3>
                </div>
                <button
                  onClick={() => router.push('/dashboard/principal/orders')}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Lihat Semua →
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="p-12 text-center">
                  <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-slate-500 font-medium">Belum ada order</p>
                  <p className="text-sm text-slate-400 mt-1">Klik tombol "Buat Order Baru" untuk memulai</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">No. Order</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Tanggal Kirim</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Vendor</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50 transition cursor-pointer" onClick={() => router.push(`/dashboard/principal/orders/${order.id}`)}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                            NBA{String(order.id).padStart(12, '0')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                            {order.customer_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                            {new Date(order.delivery_date).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                            Rp {(order.total_amount || 0).toLocaleString('id-ID')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                            {getVendorName(order.assigned_vendor_id)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Pending Payout */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-purple-50 px-6 py-4 border-b border-purple-100">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="font-bold text-purple-700">Pending Payout</h3>
                </div>
              </div>
              <div className="p-6 text-center">
                <p className="text-slate-500 text-sm">Tidak ada pending payout</p>
              </div>
            </div>

            {/* Info Pembayaran */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-orange-50 px-6 py-4 border-b border-orange-100">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-bold text-orange-700">Info Pembayaran</h3>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">Bank:</p>
                  <p className="text-slate-900 font-bold">BRI</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">No. Rekening:</p>
                  <p className="text-slate-900 font-mono font-bold">003501000013561</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">Atas Nama:</p>
                  <p className="text-slate-900 font-bold">NANANG BUDIYANTO</p>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">WhatsApp:</p>
                  <a 
                    href="https://wa.me/6281229203175" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 font-bold flex items-center gap-1"
                  >
                    +6281229203175
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}