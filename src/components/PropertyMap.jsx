import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { formatCurrency } from '../utils/formatters';
import { Layers, Map as MapIcon, Compass } from 'lucide-react';

export const PropertyMap = ({ properties, onSelectProperty, currency = 'USD', selectedPropertyId }) => {
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

      const poltava30kmHole = createCirclePoints(49.5883, 34.5514, 30000);

      // Donut polygon
      const mask = L.polygon([worldOuterCoords, poltava30kmHole], {
        color: 'transparent',
        fillColor: '#1e293b',
        fillOpacity: 0.55,
        interactive: false
      }).addTo(map);

      // 30 km boundary line
      const radiusCircle = L.circle(poltavaCenter, {
        radius: 30000,
        color: '#dc2626',
        weight: 2,
        opacity: 0.85,
        fill: false,
        dashArray: '6, 8',
        interactive: false
      }).addTo(map);

      mapInstanceRef.current = map;
      tileLayerRef.current = tileLayer;
      maskLayerRef.current = mask;
      radiusBorderRef.current = radiusCircle;
    }

    return () => {
      // Map cleanup if needed
    };
  }, []);

  // Update Markers with Smooth High-Performance Clustering
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Remove previous cluster group
    if (clusterGroupRef.current) {
      map.removeLayer(clusterGroupRef.current);
    }
    markersRef.current = {};

    // Create a new high-performance cluster group
    const clusterGroup = L.markerClusterGroup({
      maxClusterRadius: (zoom) => (zoom <= 11 ? 80 : zoom <= 13 ? 55 : zoom <= 14 ? 40 : 25),
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      disableClusteringAtZoom: 16, // At zoom 16+ (street level), unpack all into individual price tags
      animateAddingMarkers: false,
      chunkedLoading: true, // Smooth loading for 1,000+ items without UI stutter
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

    // Add Google-styled price badge markers to cluster group
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

      clusterGroup.addLayer(marker);
      markersRef.current[prop.id] = marker;
      bounds.push([prop.lat, prop.lng]);
    });

    map.addLayer(clusterGroup);
    clusterGroupRef.current = clusterGroup;

    if (bounds.length > 0 && !selectedPropertyId) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }

  }, [properties, currency]);

  // Pan to selected marker (auto-zooms through clusters if marker is clustered)
  useEffect(() => {
    if (!selectedPropertyId || !mapInstanceRef.current || !clusterGroupRef.current) return;
    const targetMarker = markersRef.current[selectedPropertyId];
    if (targetMarker) {
      clusterGroupRef.current.zoomToShowLayer(targetMarker, () => {
        targetMarker.openPopup();
      });
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

      {/* Scoped Styles for Clean UI & High-Performance Clusters */}
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

        /* Individual Price Badge styling */
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

        /* Modern High-Performance Cluster Bubbles */
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
          border: 3px solid #ffffff;
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
        }

        .custom-map-cluster-bubble:hover {
          transform: scale(1.15);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
        }

        /* Level 1: < 20 objects (Deep Indigo) */
        .custom-map-cluster-bubble.cluster-lvl-1 {
          background: linear-gradient(135deg, #2563eb, #1e3a8a);
          font-size: 0.88rem;
        }

        /* Level 2: 20-99 objects (Vibrant Purple) */
        .custom-map-cluster-bubble.cluster-lvl-2 {
          background: linear-gradient(135deg, #8b5cf6, #6d28d9);
          font-size: 0.95rem;
        }

        /* Level 3: 100+ objects (Bold Crimson) */
        .custom-map-cluster-bubble.cluster-lvl-3 {
          background: linear-gradient(135deg, #ef4444, #b91c1c);
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
