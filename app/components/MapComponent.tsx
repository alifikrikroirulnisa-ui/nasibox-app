"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Hapus atau comment bagian local path yang lama, ganti dengan ini:
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// ... sisanya ke bawah tetap sama

interface MapComponentProps {
  center: [number, number];
  onMapClick: (lat: number, lng: number) => void;
  markers: Array<{
    position: [number, number];
    popup?: string;
  }>;
}

export default function MapComponent({ center, onMapClick, markers }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map
    mapRef.current = L.map(containerRef.current).setView(center, 13);

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapRef.current);

    // Add click handler
    mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    });

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Add new markers
    markers.forEach((marker) => {
      const leafletMarker = L.marker(marker.position).addTo(mapRef.current!);
      
      if (marker.popup) {
        leafletMarker.bindPopup(marker.popup);
      }
    });

    // Fit bounds if markers exist
    if (markers.length > 0) {
      const group = new L.FeatureGroup(markers.map(m => L.marker(m.position)));
      mapRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [markers]);

  return <div ref={containerRef} className="w-full h-full" />;
}