'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { ShoppingBag, ArrowLeft, Plus, Trash2 } from 'lucide-react'

interface MenuItem {
  menu: string
  qty: number
  price: number
}

export default function CreateOrderPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form data
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [commissionPct, setCommissionPct] = useState(10)

  // Menu items
  const [items, setItems] = useState<MenuItem[]>([
    { menu: '', qty: 0, price: 0 }
  ])

  const addMenuItem = () => {
    setItems([...items, { menu: '', qty: 0, price: 0 }])
  }

  const removeMenuItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems.length > 0 ? newItems : [{ menu: '', qty: 0, price: 0 }])
  }

  const updateMenuItem = (index: number, field: keyof MenuItem, value: string | number) => {
    const newItems = [...items]
    newItems[index] = {
      ...newItems[index],
      [field]: field === 'menu' ? value : Number(value)
    }
    setItems(newItems)
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.qty * item.price), 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validasi
      if (!customerName || !customerPhone || !deliveryDate || !deliveryAddress) {
        throw new Error('Mohon isi semua field yang wajib')
      }

      if (items.some(item => !item.menu || item.qty <= 0 || item.price <= 0)) {
        throw new Error('Mohon lengkapi semua item menu')
      }

      const totalAmount = calculateTotal()

      if (totalAmount <= 0) {
        throw new Error('Total order harus lebih dari 0')
      }

      // Insert order - SESUAIKAN DENGAN STRUKTUR DATABASE
      const { data, error: insertError } = await supabase
        .from('orders')
        .insert({
          customer_name: customerName,
          customer_phone: customerPhone,
          delivery_date: deliveryDate,
          delivery_address: deliveryAddress,
          items: items, // Sudah format JSONB
          total_amount: totalAmount,
          notes: notes || null,
          status: 'new',
          commission_pct: commissionPct,
          // JANGAN kirim commission_amount & net_vendor_amount
          // karena sudah auto-calculated di database
        })
        .select()
        .single()

      if (insertError) throw insertError

      alert('✅ Order berhasil dibuat!')
      router.push('/dashboard/principal')

    } catch (err: any) {
      console.error('Error creating order:', err)
      setError(err.message || 'Gagal membuat order')
    } finally {
      setLoading(false)
    }
  }

  const totalAmount = calculateTotal()
  const commissionAmount = totalAmount * (commissionPct / 100)
  const vendorAmount = totalAmount - commissionAmount

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Kembali</span>
            </button>
            <div className="ml-6 flex items-center space-x-2">
              <ShoppingBag className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">Buat Order Baru</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold mb-4">📋 Informasi Customer</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Customer *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="PT Maju Jaya"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nomor HP *
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="081234567890"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  ⚠️ Nomor ini akan di-mask untuk vendor
                </p>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Alamat Pengiriman *
              </label>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Jl. Sudirman No. 123, Jakarta Selatan"
                required
              />
            </div>
          </div>

          {/* Delivery Schedule */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold mb-4">📅 Jadwal Pengiriman</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tanggal Kirim *
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Jam Kirim
                </label>
                <input
                  type="time"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Opsional - bisa dimasukkan di catatan juga
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">🍱 Item Pesanan</h2>
              <button
                type="button"
                onClick={addMenuItem}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Item</span>
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-semibold text-gray-700">Item #{index + 1}</span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMenuItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Nama Menu *
                      </label>
                      <input
                        type="text"
                        value={item.menu}
                        onChange={(e) => updateMenuItem(index, 'menu', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-sm"
                        placeholder="Paket Ayam Bakar"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Jumlah Box *
                      </label>
                      <input
                        type="number"
                        value={item.qty || ''}
                        onChange={(e) => updateMenuItem(index, 'qty', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-sm"
                        placeholder="100"
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Harga Satuan (Rp) *
                      </label>
                      <input
                        type="number"
                        value={item.price || ''}
                        onChange={(e) => updateMenuItem(index, 'price', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-sm"
                        placeholder="25000"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  {item.qty > 0 && item.price > 0 && (
                    <div className="mt-2 text-right">
                      <span className="text-sm text-gray-600">Subtotal: </span>
                      <span className="font-bold text-green-600">
                        Rp {(item.qty * item.price).toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Commission & Notes */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold mb-4">💰 Komisi & Catatan</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Komisi Principal (%)
              </label>
              <input
                type="number"
                value={commissionPct}
                onChange={(e) => setCommissionPct(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                min="0"
                max="100"
                step="0.5"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Catatan Tambahan
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Contoh: Kirim jam 12 siang. Minta packaging premium."
              />
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4">📊 Ringkasan Order</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Total Harga Jual:</span>
                <span className="font-mono font-bold">
                  Rp {totalAmount.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex justify-between text-sm border-t border-white/20 pt-2">
                <span>Komisi Principal ({commissionPct}%):</span>
                <span className="font-mono font-bold">
                  Rp {commissionAmount.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex justify-between text-sm border-t border-white/20 pt-2">
                <span>Net untuk Vendor:</span>
                <span className="font-mono font-bold text-yellow-300">
                  Rp {vendorAmount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              ❌ {error}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : '✅ Simpan Order'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
