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
            <Link 
              href="#pesan" 
              className="bg-white text-amber-700 font-bold px-6 py-3 rounded-full hover:bg-amber-100 transition shadow-lg text-center"
            >
              Pesan Sekarang →
            </Link>
            <button className="border-2 border-white text-white px-6 py-3 rounded-full hover:bg-white hover:text-amber-700 transition">
              Tanya Harga
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
              Bapak/Ibu yang akan mengadakan buku ber, tidak perlu repot masak. Kami siap membantu memenuhi kebutuhan nasi box, insyaAllah amanah 🙏
            </p>
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
            </div>
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
            
            {/* Progress Bar */}
            <div className="mt-8">
              <div className="w-full bg-amber-200 rounded-full h-3">
                <div 
                  className="bg-white h-3 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${Math.min(100, (100 - (timeRemaining.days / 730) * 100)).toFixed(2)}%` 
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-amber-100 mt-2">
                <span>Mulai Hitung Mundur</span>
                <span>18 Feb 2026</span>
              </div>
            </div>
            
            {/* Info Tambahan */}
            <div className="text-center mt-6">
              <p className="text-amber-100 text-sm">
                {timeRemaining.days > 0 ? (
                  `Hanya ${timeRemaining.days} hari lagi menuju Ramadan 2026!`
                ) : (
                  "Ramadan 2026 telah tiba! Selamat menunaikan ibadah puasa."
                )}
              </p>
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
                  <Link href="/pesan" className="hover:text-amber-300 transition">Pesan Sekarang</Link>
                </li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h4 className="text-xl font-bold mb-6 text-amber-300">Hubungi Kami</h4>
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>0812-2920-3175</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>nasibox.andalan@gmail.com</span>
                </div>
              </div>
            </div>
            
            {/* System Info */}
            <div className="border-t border-gray-700 pt-8 md:pt-0 md:border-t-0">
              <div className="bg-gray-900 p-6 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">System v1.0 MVP</p>
                <p className="text-sm text-gray-400">Created for: Nanang Budiyanto</p>
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