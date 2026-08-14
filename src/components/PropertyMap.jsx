import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { formatCurrency } from '../utils/formatters';

export const PropertyMap = ({ properties, onSelectProperty, currency = 'USD', selectedPropertyId }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Map if not already created
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [49.5883, 34.5514], // Center of Poltava
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    const bounds = [];

    // Add custom HTML price markers for each property
    properties.forEach((prop) => {
      if (!prop.lat || !prop.lng) return;

      const priceText = currency === 'USD' 
        ? `$ ${(prop.priceUSD / 1000).toFixed(0)} тис.` 
        : `${(prop.priceUAH / 1000).toFixed(0)} тис. грн`;

      const isSelected = selectedPropertyId === prop.id;

      const customIcon = L.divIcon({
        className: 'custom-map-price-marker',
        html: `
          <div class="map-price-badge ${isSelected ? 'selected' : ''} ${prop.type === 'house' ? 'house-badge' : ''}">
            <span>${priceText}</span>
          </div>
        `,
        iconSize: [80, 30],
        iconAnchor: [40, 15]
      });

      const marker = L.marker([prop.lat, prop.lng], { icon: customIcon }).addTo(map);

      // Popup with mini property preview
      const popupHtml = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; width: 220px; padding: 2px;">
          <img src="${prop.images[0]}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 6px; margin-bottom: 6px;" />
          <div style="font-weight: 800; font-size: 1.1rem; color: #1e3a8a; margin-bottom: 2px;">
            ${currency === 'USD' ? formatCurrency(prop.priceUSD, 'USD') : formatCurrency(prop.priceUAH, 'UAH')}
          </div>
          <div style="font-size: 0.82rem; font-weight: 700; color: #0f172a; margin-bottom: 4px; line-height: 1.2;">
            ${prop.title}
          </div>
          <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 8px;">
            ${prop.address}
          </div>
          <button id="map-prop-btn-${prop.id}" style="width: 100%; padding: 6px; background: #1e3a8a; color: white; border: none; border-radius: 4px; font-weight: 700; font-size: 0.8rem; cursor: pointer;">
            Відкрити об'єкт →
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`map-prop-btn-${prop.id}`);
        if (btn) {
          btn.onclick = () => onSelectProperty(prop);
        }
      });

      markersRef.current.push(marker);
      bounds.push([prop.lat, prop.lng]);
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }

  }, [properties, currency, selectedPropertyId]);

  return (
    <div className="property-map-container-wrapper">
      <div ref={mapContainerRef} className="property-leaflet-map" />

      <style>{`
        .property-map-container-wrapper {
          width: 100%;
          height: 100%;
          min-height: 480px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--c-border);
          position: relative;
        }

        .property-leaflet-map {
          width: 100%;
          height: 100%;
          min-height: 480px;
        }

        .custom-map-price-marker {
          background: transparent;
          border: none;
        }

        .map-price-badge {
          background: #1e3a8a;
          color: #ffffff;
          font-weight: 800;
          font-size: 0.78rem;
          padding: 5px 10px;
          border-radius: 20px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
          text-align: center;
          white-space: nowrap;
          border: 2px solid #ffffff;
          transition: transform 0.15s ease, background-color 0.15s ease;
        }

        .map-price-badge:hover, .map-price-badge.selected {
          background: #ef4444;
          transform: scale(1.12);
          z-index: 1000;
        }

        .map-price-badge.house-badge {
          background: #059669;
        }
      `}</style>
    </div>
  );
};
