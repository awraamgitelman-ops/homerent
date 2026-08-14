import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { formatCurrency } from '../utils/formatters';
import { Layers, Map as MapIcon, Compass } from 'lucide-react';

export const PropertyMap = ({ properties, onSelectProperty, currency = 'USD', selectedPropertyId }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const maskLayerRef = useRef(null);
  const radiusBorderRef = useRef(null);
  const markersRef = useRef({});
  const [mapType, setMapType] = useState('roadmap'); // 'roadmap' | 'satellite'

  // Helper to generate circular polygon points around a center
  const createCirclePoints = (centerLat, centerLng, radiusMeters, numPoints = 144) => {
    const points = [];
    const earthRadius = 6378137; // in meters
    const dLat = (radiusMeters / earthRadius) * (180 / Math.PI);
    const dLng = dLat / Math.cos((centerLat * Math.PI) / 180);

    for (let i = 0; i < numPoints; i++) {
      const angle = (i * 360) / numPoints;
      const rad = (angle * Math.PI) / 180;
      const lat = centerLat + dLat * Math.sin(rad);
      const lng = centerLng + dLng * Math.cos(rad);
      points.push([lat, lng]);
    }
    return points;
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const poltavaCenter = [49.5883, 34.5514];

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: poltavaCenter,
        zoom: 12,
        minZoom: 9,
        maxZoom: 20,
        zoomControl: true,
        scrollWheelZoom: true
      });

      // Google Maps Roadmap tiles
      const googleRoadmapUrl = 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
      const tileLayer = L.tileLayer(googleRoadmapUrl, {
        maxZoom: 20,
        attribution: '&copy; Google Maps'
      }).addTo(map);

      // Create 30 km grey mask: everything outside 30 km is shaded grey
      const worldOuterCoords = [
        [-90, -180],
        [-90, 180],
        [90, 180],
        [90, -180]
      ];
      const inner30kmRing = createCirclePoints(poltavaCenter[0], poltavaCenter[1], 30000); // 30,000 meters = 30 km

      const maskPolygon = L.polygon([worldOuterCoords, inner30kmRing], {
        fillColor: '#1e293b',
        fillOpacity: 0.55,
        stroke: false,
        weight: 0,
        interactive: false
      }).addTo(map);

      // 30 km red dashed border
      const circleBorder = L.circle(poltavaCenter, {
        radius: 30000,
        color: '#dc2626',
        weight: 2,
        dashArray: '6, 8',
        fillColor: 'transparent',
        interactive: false
      }).addTo(map);

      tileLayerRef.current = tileLayer;
      maskLayerRef.current = maskPolygon;
      radiusBorderRef.current = circleBorder;
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear previous markers
    Object.values(markersRef.current).forEach(m => map.removeLayer(m));
    markersRef.current = {};

    const bounds = [];

    // Add Google-styled price badge markers
    properties.forEach((prop) => {
      if (!prop.lat || !prop.lng) return;

      // Clean, neat price text without "/міс"
      let priceText = '';
      if (currency === 'USD') {
        if (prop.priceUSD >= 10000) {
          priceText = `$ ${(prop.priceUSD / 1000).toFixed(0)} тис.`;
        } else {
          priceText = `$ ${prop.priceUSD.toLocaleString('uk-UA')}`;
        }
      } else {
        if (prop.priceUAH >= 1000000) {
          const mln = (prop.priceUAH / 1000000).toFixed(2).replace(/\.?0+$/, '');
          priceText = `${mln} млн грн`;
        } else {
          priceText = `${prop.priceUAH.toLocaleString('uk-UA')} грн`;
        }
      }

      const isSelected = selectedPropertyId === prop.id;

      const customIcon = L.divIcon({
        className: 'custom-map-price-marker',
        html: `
          <div class="google-map-price-badge ${isSelected ? 'selected' : ''} ${prop.type === 'house' ? 'house-badge' : ''} ${prop.transaction === 'rent' ? 'rent-badge' : ''}">
            <span>${priceText}</span>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      const marker = L.marker([prop.lat, prop.lng], { icon: customIcon }).addTo(map);

      const fallbackImg = prop.type === 'house' 
        ? 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80'
        : prop.type === 'commercial'
        ? 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80';

      const popupHtml = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; width: 230px; padding: 4px;">
          <img src="${prop.images[0]}" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${fallbackImg}'" style="width: 100%; height: 115px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
          <div style="font-weight: 900; font-size: 1.15rem; color: #1e3a8a; margin-bottom: 2px;">
            ${currency === 'USD' ? formatCurrency(prop.priceUSD, 'USD') : formatCurrency(prop.priceUAH, 'UAH')}
          </div>
          <div style="font-size: 0.85rem; font-weight: 800; color: #0f172a; margin-bottom: 4px; line-height: 1.25;">
            ${prop.title}
          </div>
          <div style="font-size: 0.76rem; color: #64748b; margin-bottom: 10px;">
            📍 ${prop.address}
          </div>
          <div style="display: flex; gap: 6px;">
            <button id="map-prop-btn-${prop.id}" style="flex: 1; padding: 7px 10px; background: #b91c1c; color: white; border: none; border-radius: 6px; font-weight: 800; font-size: 0.8rem; cursor: pointer;">
              Деталі →
            </button>
            <a href="${googleMapsDirectUrl}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; justify-content: center; padding: 7px 10px; background: #f1f5f9; color: #1e293b; border-radius: 6px; font-size: 0.75rem; font-weight: 700; text-decoration: none;" title="Відкрити в Google Maps">
              Google
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`map-prop-btn-${prop.id}`);
        if (btn) {
          btn.onclick = () => onSelectProperty(prop);
        }
      });

      markersRef.current[prop.id] = marker;
      bounds.push([prop.lat, prop.lng]);
    });

    if (bounds.length > 0 && !selectedPropertyId) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }

  }, [properties, currency, selectedPropertyId]);

  // Pan to selected marker if selectedPropertyId changes
  useEffect(() => {
    if (!selectedPropertyId || !mapInstanceRef.current) return;
    const targetMarker = markersRef.current[selectedPropertyId];
    if (targetMarker) {
      mapInstanceRef.current.setView(targetMarker.getLatLng(), 15, { animate: true });
      targetMarker.openPopup();
    }
  }, [selectedPropertyId]);

  // Switch between Google Roadmap & Google Satellite
  const toggleMapLayer = (type) => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    setMapType(type);

    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    const tileUrl = type === 'satellite'
      ? 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}' // Google Hybrid / Satellite
      : 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'; // Google Roadmap

    const newLayer = L.tileLayer(tileUrl, {
      maxZoom: 20,
      attribution: '&copy; Google Maps'
    }).addTo(mapInstanceRef.current);

    // Bring mask to top so shading remains on satellite view
    if (maskLayerRef.current) {
      maskLayerRef.current.bringToFront();
    }
    if (radiusBorderRef.current) {
      radiusBorderRef.current.bringToFront();
    }

    tileLayerRef.current = newLayer;
  };

  return (
    <div className="property-map-container-wrapper">
      {/* 30 km Radius Active Zone Badge */}
      <div className="map-radius-indicator-pill">
        <Compass size={13} className="text-red-500" />
        <span>Зона обслуговування: <strong>Полтава + 30 км</strong></span>
      </div>

      {/* Google Maps Layer Switcher */}
      <div className="google-map-layer-controls">
        <button
          type="button"
          className={`gmc-btn ${mapType === 'roadmap' ? 'active' : ''}`}
          onClick={() => toggleMapLayer('roadmap')}
        >
          <MapIcon size={14} />
          <span>Google Карта</span>
        </button>
        <button
          type="button"
          className={`gmc-btn ${mapType === 'satellite' ? 'active' : ''}`}
          onClick={() => toggleMapLayer('satellite')}
        >
          <Layers size={14} />
          <span>Супутник</span>
        </button>
      </div>

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

        /* 30 km Radius Badge */
        .map-radius-indicator-pill {
          position: absolute;
          bottom: 14px;
          left: 14px;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(15, 23, 42, 0.88);
          color: #ffffff;
          font-size: 0.74rem;
          border-radius: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          pointer-events: none;
        }

        .map-radius-indicator-pill strong {
          color: #fca5a5;
        }

        .google-map-layer-controls {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 1000;
          display: flex;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .gmc-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #475569;
          background: #ffffff;
          transition: var(--transition);
        }

        .gmc-btn:hover {
          background: #f1f5f9;
          color: var(--c-dark);
        }

        .gmc-btn.active {
          background: #b91c1c;
          color: #ffffff;
        }

        /* Marker Container */
        .custom-map-price-marker {
          background: transparent !important;
          border: none !important;
          width: 0 !important;
          height: 0 !important;
        }

        /* Price Badge styling */
        .google-map-price-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          padding: 6px 12px;
          font-size: 0.78rem;
          font-weight: 800;
          color: #ffffff;
          background: #1e3a8a;
          border-radius: 20px;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.35);
          border: 2px solid #ffffff;
          transform: translate(-50%, -50%);
          cursor: pointer;
          user-select: none;
          line-height: 1;
          letter-spacing: 0.3px;
          transition: transform 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
        }

        .google-map-price-badge.rent-badge {
          background: #6d28d9; /* Rich purple */
        }

        .google-map-price-badge.house-badge {
          background: #059669; /* Emerald green */
        }

        .google-map-price-badge:hover, .google-map-price-badge.selected {
          background: #dc2626 !important;
          transform: translate(-50%, -50%) scale(1.14);
          z-index: 1000;
          box-shadow: 0 6px 20px rgba(220, 38, 38, 0.55);
        }
      `}</style>
    </div>
  );
};
