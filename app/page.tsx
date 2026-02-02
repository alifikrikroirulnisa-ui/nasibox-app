"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Menghitung waktu menuju Ramadan 2026 (18 Februari 2026)
    const targetDate = new Date('February 18, 2026 00:00:00').getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        setTimeRemaining({ days, hours, minutes, seconds });
      } else {
        // Jika sudah lewat tanggal target, reset ke 0
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Fungsi untuk membuka WhatsApp
  const openWhatsApp = (messageType: 'order' | 'inquiry') => {
    const phoneNumber = '6281229203175';
    let message = '';
    
    if (messageType === 'order') {
      message = 'Halo Nasi Box Andalan, saya ingin memesan nasi box. Bisa minta informasi lebih lanjut?';
    } else {
      message = 'Halo Nasi Box Andalan, saya ingin menanyakan harga nasi box. Bisa minta daftar harganya?';
    }
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  if (!isClient) {
    // Render loading state atau konten statis selama SSR
    return (
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat halaman...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-6 px-4 md:px-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold">Nasi Box Andalan</h1>
            <p className="text-amber-100 mt-1">Terima 1.000 Nasi Box/Hari</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => openWhatsApp('order')}
              className="bg-white text-amber-700 font-bold px-6 py-3 rounded-full hover:bg-amber-100 transition-all duration-300 shadow-lg text-center flex items-center justify-center gap-2 group"
            >
              <span>Pesan Sekarang</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button 
              onClick={() => openWhatsApp('inquiry')}
              className="border-2 border-white text-white px-6 py-3 rounded-full hover:bg-white hover:text-amber-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              <span>Tanya Harga</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Nasi Box Berkualitas untuk Setiap Momen Spesial Anda
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Bapak/Ibu yang akan mengadakan Acara, tidak perlu repot masak. Kami siap membantu memenuhi kebutuhan nasi box, insyaAllah amanah 🙏
            </p>
            
            {/* CTA Buttons di Hero Section */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <button
                onClick={() => openWhatsApp('order')}
                className="bg-amber-600 text-white font-bold px-8 py-4 rounded-full hover:bg-amber-700 transition-all duration-300 shadow-lg text-lg flex items-center justify-center gap-3 group"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01zm-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.264 8.264 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.183 8.183 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43c.12-.14.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43c-.14 0-.3-.01-.47-.01c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07c0 1.22.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.15-1.18s-.22-.16-.47-.28z"/>
                </svg>
                <span>Pesan via WhatsApp</span>
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </button>
              
              <button 
                onClick={() => openWhatsApp('inquiry')}
                className="border-2 border-amber-600 text-amber-600 font-bold px-8 py-4 rounded-full hover:bg-amber-50 transition-all duration-300 text-lg flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
                  <path d="M12 15h2v2h-2zM12 7h2v6h-2z"/>
                </svg>
                <span>Tanya Harga & Info</span>
              </button>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100 hover:shadow-lg transition">
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg">Kantor & Instansi</h3>
              </div>
              <p className="text-gray-600">Catering untuk rapat, pelatihan, dan kegiatan kantor lainnya.</p>
              <button
                onClick={() => openWhatsApp('inquiry')}
                className="mt-4 text-amber-600 hover:text-amber-700 font-medium text-sm flex items-center gap-1"
              >
                Tanya Harga
                <span>→</span>
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100 hover:shadow-lg transition">
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg">Masjid & Pengajian</h3>
              </div>
              <p className="text-gray-600">Nasi box untuk acara keagamaan dan kegiatan majelis taklim.</p>
              <button
                onClick={() => openWhatsApp('inquiry')}
                className="mt-4 text-amber-600 hover:text-amber-700 font-medium text-sm flex items-center gap-1"
              >
                Tanya Harga
                <span>→</span>
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100 hover:shadow-lg transition">
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg">Event & Acara</h3>
              </div>
              <p className="text-gray-600">Penyediaan nasi box untuk pernikahan, syukuran, dan acara khusus.</p>
              <button
                onClick={() => openWhatsApp('inquiry')}
                className="mt-4 text-amber-600 hover:text-amber-700 font-medium text-sm flex items-center gap-1"
              >
                Tanya Harga
                <span>→</span>
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100 hover:shadow-lg transition">
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg">Komunitas & RT</h3>
              </div>
              <p className="text-gray-600">Catering untuk kegiatan komunitas, arisan, dan pertemuan warga.</p>
              <button
                onClick={() => openWhatsApp('inquiry')}
                className="mt-4 text-amber-600 hover:text-amber-700 font-medium text-sm flex items-center gap-1"
              >
                Tanya Harga
                <span>→</span>
              </button>
            </div>
          </div>

          {/* WhatsApp Floating Button */}
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={() => openWhatsApp('order')}
              className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110 animate-bounce"
              title="Chat via WhatsApp"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411"/>
              </svg>
            </button>
          </div>

          {/* Ramadan Countdown */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-500 rounded-2xl p-8 text-white mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">Menuju Ramadan 2026</h3>
              <p className="text-amber-100">18 Februari 2026</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 lg:gap-10">
              <div className="text-center">
                <div className="bg-white text-amber-700 text-3xl md:text-4xl lg:text-5xl font-bold rounded-lg py-4 px-4 md:px-6 mb-2 min-w-[80px] md:min-w-[100px]">
                  {String(timeRemaining.days).padStart(2, '0')}
                </div>
                <p className="text-amber-100 text-lg">Hari</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white text-amber-700 text-3xl md:text-4xl lg:text-5xl font-bold rounded-lg py-4 px-4 md:px-6 mb-2 min-w-[80px] md:min-w-[100px]">
                  {String(timeRemaining.hours).padStart(2, '0')}
                </div>
                <p className="text-amber-100 text-lg">Jam</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white text-amber-700 text-3xl md:text-4xl lg:text-5xl font-bold rounded-lg py-4 px-4 md:px-6 mb-2 min-w-[80px] md:min-w-[100px]">
                  {String(timeRemaining.minutes).padStart(2, '0')}
                </div>
                <p className="text-amber-100 text-lg">Menit</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white text-amber-700 text-3xl md:text-4xl lg:text-5xl font-bold rounded-lg py-4 px-4 md:px-6 mb-2 min-w-[80px] md:min-w-[100px]">
                  {String(timeRemaining.seconds).padStart(2, '0')}
                </div>
                <p className="text-amber-100 text-lg">Detik</p>
              </div>
            </div>
            
            {/* CTA di Countdown Section */}
            <div className="text-center mt-8">
              <p className="text-amber-100 mb-4">Persiapkan kebutuhan Ramadan Anda dari sekarang!</p>
              <button
                onClick={() => openWhatsApp('order')}
                className="bg-white text-amber-700 font-bold px-8 py-3 rounded-full hover:bg-amber-100 transition-all duration-300 shadow-lg flex items-center gap-2 mx-auto"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01zm-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.264 8.264 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.183 8.183 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43c.12-.14.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43c-.14 0-.3-.01-.47-.01c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07c0 1.22.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.15-1.18s-.22-.16-.47-.28z"/>
                </svg>
                Pesan Nasi Box Ramadan via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Quick Links */}
            <div>
              <h4 className="text-xl font-bold mb-6 text-amber-300">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="hover:text-amber-300 transition">Beranda</Link>
                </li>
                <li>
                  <Link href="/menu" className="hover:text-amber-300 transition">Menu</Link>
                </li>
                <li>
                  <Link href="/galeri" className="hover:text-amber-300 transition">Galeri</Link>
                </li>
                <li>
                  <button 
                    onClick={() => openWhatsApp('order')}
                    className="hover:text-amber-300 transition text-left w-full"
                  >
                    Pesan Sekarang
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h4 className="text-xl font-bold mb-6 text-amber-300">Hubungi Kami</h4>
              <div className="space-y-4">
                <button 
                  onClick={() => openWhatsApp('order')}
                  className="flex items-center hover:text-amber-300 transition"
                >
                  <svg className="w-5 h-5 mr-3 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01zm-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.264 8.264 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.183 8.183 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23z"/>
                  </svg>
                  <span>0812-2920-3175 (WhatsApp)</span>
                </button>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>nasibox.andalan@gmail.com</span>
                </div>
              </div>
              
              {/* WhatsApp Quick Action */}
              <div className="mt-6">
                <button
                  onClick={() => openWhatsApp('order')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01zm-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.264 8.264 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.183 8.183 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23z"/>
                  </svg>
                  Chat Sekarang
                </button>
              </div>
            </div>
            
            {/* System Info */}
            <div className="border-t border-gray-700 pt-8 md:pt-0 md:border-t-0">
              <div className="bg-gray-900 p-6 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">System v1.0 nasibox.andalan@(admin123)</p>
                <p className="text-sm text-gray-400">Created By : Gum</p>
                <div className="mt-4">
                  <Link href="/login" className="inline-block bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition text-sm">
                    Login Sistem
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 Nasi Box Andalan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}