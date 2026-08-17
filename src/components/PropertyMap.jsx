import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { formatCurrency } from '../utils/formatters';
import { Layers, Map as MapIcon, Compass } from 'lucide-react';

export const PropertyMap = ({ properties, onSelectProperty, currency = 'USD', selectedPropertyId, viewMode }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const maskLayerRef = useRef(null);
  const radiusBorderRef = useRef(null);
  const clusterGroupRef = useRef(null);
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

  // 1. Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const officeCoords = [49.58614557355438, 34.558981902833345];
    const poltavaCenter = officeCoords;

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

      const poltava30kmHole = createCirclePoints(officeCoords[0], officeCoords[1], 30000);

      // Donut polygon
      const mask = L.polygon([worldOuterCoords, poltava30kmHole], {
        color: 'transparent',
        fillColor: '#1e293b',
        fillOpacity: 0.55,
        interactive: false
      }).addTo(map);

      // 30 km boundary line
      const radiusCircle = L.circle(officeCoords, {
        radius: 30000,
        color: '#2563eb',
        weight: 2,
        opacity: 0.85,
        fill: false,
        dashArray: '6, 8',
        interactive: false
      }).addTo(map);

      // Prominent Office Pin Marker at вул. Соборності, 22
      const officeIcon = L.divIcon({
        className: 'custom-office-marker',
        html: `
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); color: #ffffff; border: 2px solid #f59e0b; border-radius: 20px; padding: 4px 12px; font-weight: 800; font-size: 11px; display: inline-flex; align-items: center; gap: 5px; box-shadow: 0 6px 18px rgba(0,0,0,0.35); white-space: nowrap; cursor: pointer; transform: translate(-50%, -50%);">
            <span style="color: #fbbf24;">🏢</span>
            <span>Офіс «ФАВОРИТ ГРУП»</span>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      const officeMarker = L.marker(officeCoords, { icon: officeIcon, zIndexOffset: 2000 }).addTo(map);
      officeMarker.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 8px 6px; text-align: center; width: 220px;">
          <div style="font-weight: 900; font-size: 1.05rem; color: #1e3a8a; margin-bottom: 4px;">Головний офіс «ФАВОРИТ ГРУП»</div>
          <div style="font-size: 0.85rem; font-weight: 700; color: #0f172a; margin-bottom: 4px;">📍 м. Полтава, вул. Соборності, 22</div>
          <div style="font-size: 0.78rem; color: #64748b;">Пн–Нд: 09:00 — 20:00 (без вихідних)</div>
        </div>
      `, { autoPan: true, autoPanPadding: [50, 50] });

      mapInstanceRef.current = map;
      tileLayerRef.current = tileLayer;
      maskLayerRef.current = mask;
      radiusBorderRef.current = radiusCircle;
    }
  }, []);

  // 1.1 Robust Container Resizing & Invalidation (Fixes partial map tile loading on view mode toggle)
  useEffect(() => {
    if (!mapInstanceRef.current || !mapContainerRef.current) return;

    const triggerInvalidation = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize({ pan: false, debounceMoveend: true });
      }
    };

    // Trigger immediately and at staggered intervals to catch CSS grid/split transitions
    triggerInvalidation();
    const timer1 = setTimeout(triggerInvalidation, 50);
    const timer2 = setTimeout(triggerInvalidation, 150);
    const timer3 = setTimeout(triggerInvalidation, 350);
    const timer4 = setTimeout(triggerInvalidation, 600);

    // Modern ResizeObserver on the map DOM container element
    let resizeObserver = null;
    if (window.ResizeObserver && mapContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        triggerInvalidation();
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    const onWindowResize = () => triggerInvalidation();
    window.addEventListener('resize', onWindowResize);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', onWindowResize);
    };
  }, [viewMode, properties]);

  // 2. Populate and manage MarkerClusterGroup with singleMarkerMode & stable popups
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Remove previous cluster group cleanly
    if (clusterGroupRef.current) {
      map.removeLayer(clusterGroupRef.current);
      clusterGroupRef.current = null;
    }
    markersRef.current = {};

    // Create marker cluster group:
    // - singleMarkerMode: true ensures ALL objects on high/mid zoom (<15) are uniform circular bubbles!
    // - disableClusteringAtZoom: 15 unpacks ALL bubbles into rectangular price tags on street zoom!
    const clusterGroup = L.markerClusterGroup({
      maxClusterRadius: 45,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      singleMarkerMode: false, // Single markers show their real rectangular price badges!
      disableClusteringAtZoom: 14, // Completely unpacks all clusters into price tags on 3rd zoom stage (zoom 14+)
      animate: true,
      animateAddingMarkers: false,
      chunkedLoading: true,
      chunkInterval: 50,
      chunkDelay: 20,
      iconCreateFunction: function (cluster) {
        const count = cluster.getChildCount();
        let size = 42;
        let lvlClass = 'cluster-lvl-1';

        if (count >= 100) {
          size = 54;
          lvlClass = 'cluster-lvl-3';
        } else if (count >= 20) {
          size = 48;
          lvlClass = 'cluster-lvl-2';
        }

        return L.divIcon({
          html: `
            <div class="custom-map-cluster-bubble ${lvlClass}">
              <span class="cmc-count">${count}</span>
            </div>
          `,
          className: 'custom-cluster-wrapper',
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2]
        });
      }
    });

    const bounds = [];

    properties.forEach((prop) => {
      if (!prop.lat || !prop.lng) return;

      // Price text formatting
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

      // Individual Price Badge Icon (shown when zoom >= 15)
      const customIcon = L.divIcon({
        className: 'custom-map-price-marker',
        html: `
          <div class="google-map-price-badge ${prop.type === 'house' ? 'house-badge' : ''} ${prop.transaction === 'rent' ? 'rent-badge' : ''}">
            <span>${priceText}</span>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      const marker = L.marker([prop.lat, prop.lng], { icon: customIcon });
      const googleMapsDirectUrl = `https://www.google.com/maps/search/?api=1&query=${prop.lat},${prop.lng}`;
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
          <div>
            <button id="map-prop-btn-${prop.id}" style="width: 100%; padding: 8px 12px; background: #1e3a8a; color: white; border: none; border-radius: 8px; font-weight: 800; font-size: 0.85rem; cursor: pointer; transition: background 0.2s;">
              Деталі →
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        autoPan: true,
        autoPanPadding: [50, 50],
        closeButton: true
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`map-prop-btn-${prop.id}`);
        if (btn) {
          btn.onclick = () => onSelectProperty(prop);
        }
      });

      clusterGroup.addLayer(marker);
      markersRef.current[prop.id] = marker;
      bounds.push([prop.lat, prop.lng]);
    });

    map.addLayer(clusterGroup);
    clusterGroupRef.current = clusterGroup;

    // Center map on objects if initial load
    if (bounds.length > 0 && !selectedPropertyId) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }

  }, [properties, currency]);

  // 3. Pan to selected marker smoothly when chosen from list (auto-unpacks cluster and keeps popup OPEN)
  useEffect(() => {
    if (!selectedPropertyId || !mapInstanceRef.current || !clusterGroupRef.current) return;
    const targetMarker = markersRef.current[selectedPropertyId];
    if (targetMarker) {
      clusterGroupRef.current.zoomToShowLayer(targetMarker, () => {
        targetMarker.openPopup();
      });
    }
  }, [selectedPropertyId]);

  // 4. Switch between Google Roadmap & Google Satellite
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

    // Bring mask and boundary to top so shading remains on satellite view
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
        <Compass size={13} className="text-primary" />
        <span>Зона обслуговування: <strong>Полтава + 30 км</strong></span>
      </div>

      {/* Layer Switcher (Google Roadmap / Satellite) */}
      <div className="google-map-layer-controls">
        <button
          type="button"
          className={`gmc-btn ${mapType === 'roadmap' ? 'active' : ''}`}
          onClick={() => toggleMapLayer('roadmap')}
        >
          <MapIcon size={14} />
          <span>Карта</span>
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

      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="leaflet-map-canvas" />

      {/* Scoped Styles for Clean UI, Uniform Bubbles & Stable Popups */}
      <style>{`
        .property-map-container-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 480px;
        }

        .leaflet-map-canvas {
          width: 100%;
          height: 100%;
          min-height: 480px;
          border-radius: var(--radius-lg);
          background: #e2e8f0;
        }

        .map-radius-indicator-pill {
          position: absolute;
          top: 12px;
          left: 12px;
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
          color: #93c5fd;
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
          background: #d97706;
          color: #ffffff;
        }

        /* Marker Container */
        .custom-map-price-marker {
          background: transparent !important;
          border: none !important;
          width: 0 !important;
          height: 0 !important;
        }

        /* Individual Price Badge styling (Shown at street zoom 15+) */
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

        .google-map-price-badge:hover {
          background: #2563eb !important;
          transform: translate(-50%, -50%) scale(1.12);
          z-index: 1000;
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.55);
        }

        /* Modern High-Performance Cluster & Single Bubbles */
        .custom-cluster-wrapper {
          background: transparent !important;
          border: none !important;
        }

        .custom-map-cluster-bubble {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          color: #ffffff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 900;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
          border: 2.5px solid #ffffff;
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
        }

        .custom-map-cluster-bubble:hover {
          transform: scale(1.15);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
        }

        /* Single item bubble: count 1 (Clean Sky/Blue) */
        .custom-map-cluster-bubble.cluster-lvl-single {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          font-size: 0.82rem;
        }

        /* Level 1: 2-19 objects (Deep Indigo) */
        .custom-map-cluster-bubble.cluster-lvl-1 {
          background: linear-gradient(135deg, #2563eb, #1e3a8a);
          font-size: 0.88rem;
        }

        /* Level 2: 20-99 objects (Vibrant Purple) */
        .custom-map-cluster-bubble.cluster-lvl-2 {
          background: linear-gradient(135deg, #8b5cf6, #6d28d9);
          font-size: 0.95rem;
        }

        /* Level 3: 100+ objects (Royal Navy Blue) */
        .custom-map-cluster-bubble.cluster-lvl-3 {
          background: linear-gradient(135deg, #1d4ed8, #0f172a);
          font-size: 1.05rem;
        }

        .cmc-count {
          line-height: 1;
          letter-spacing: -0.3px;
        }
      `}</style>
    </div>
  );
};
