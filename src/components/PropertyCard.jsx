import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  Maximize2, 
  Eye, 
  Phone, 
  CheckCircle2, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { formatCurrency, formatPricePerM2, formatArea } from '../utils/formatters';

export const PropertyCard = ({ property, onSelect, onBookViewing, currency = 'USD' }) => {
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const nextImage = (e) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const displayPrice = currency === 'USD' 
    ? formatCurrency(property.priceUSD, 'USD') 
    : formatCurrency(property.priceUAH, 'UAH');

  return (
    <div className="property-card" onClick={() => onSelect(property)}>
      {/* Image Container with Slider & Badges */}
      <div className="pc-image-wrapper">
        <img 
          src={property.images[activeImgIdx] || property.images[0]} 
          alt={property.title}
          className="pc-img"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = property.type === 'house' 
              ? 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'
              : property.type === 'commercial'
              ? 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
              : 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Badges Overlay */}
        <div className="pc-badges-row">
          {property.badges?.map((badge, idx) => (
            <span 
              key={idx} 
              className={`pc-badge ${badge.includes('Торг') ? 'badge-bargain' : ''}`}
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Image Nav Arrows (if multiple images) */}
        {property.images.length > 1 && (
          <>
            <button className="pc-img-nav prev" onClick={prevImage} aria-label="Попереднє фото">
              <ChevronLeft size={16} />
            </button>
            <button className="pc-img-nav next" onClick={nextImage} aria-label="Наступне фото">
              <ChevronRight size={16} />
            </button>
            <div className="pc-dots-indicator">
              {property.images.map((_, i) => (
                <span key={i} className={`pc-dot ${i === activeImgIdx ? 'active' : ''}`} />
              ))}
            </div>
          </>
        )}

        {/* Transaction Tag */}
        <span className="pc-trans-tag">
          {property.transaction === 'buy' ? 'Продаж' : property.transaction === 'rent' ? 'Оренда' : 'Подобово'}
        </span>
      </div>

      {/* Card Content */}
      <div className="pc-content">
        {/* Price & Price/m2 */}
        <div className="pc-price-row">
          <span className="pc-main-price">{displayPrice}</span>
          {property.pricePerM2 > 0 && (
            <span className="pc-sub-price">
              {formatPricePerM2(property.pricePerM2, currency)}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="pc-title" title={property.title}>
          {property.title}
        </h3>

        {/* Location */}
        <div className="pc-address-row">
          <MapPin size={14} className="text-primary flex-shrink-0" />
          <span>{property.address} ({property.districtName})</span>
        </div>

        {/* Key Metrics Grid */}
        <div className="pc-metrics-grid">
          {property.rooms > 0 && (
            <div className="metric-item">
              <span className="metric-val">{property.rooms}</span>
              <span className="metric-lbl">кімн.</span>
            </div>
          )}
          <div className="metric-item">
            <span className="metric-val">{property.area}</span>
            <span className="metric-lbl">м²</span>
          </div>
          {property.floor > 0 && (
            <div className="metric-item">
              <span className="metric-val">{property.floor}/{property.totalFloors}</span>
              <span className="metric-lbl">поверх</span>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="pc-bottom-actions">
          <button 
            type="button"
            className="btn btn-primary btn-sm pc-view-btn"
            onClick={(e) => {
              e.stopPropagation();
              onBookViewing(property);
            }}
          >
            <Calendar size={14} />
            <span>Записатись на перегляд</span>
          </button>
          
          <button 
            type="button"
            className="btn btn-outline btn-sm pc-more-btn"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(property);
            }}
            title="Детальніше про об'єкт"
          >
            <Eye size={14} />
          </button>
        </div>
      </div>

      {/* Scoped Styles for PropertyCard */}
      <style>{`
        .property-card {
          background: #ffffff;
          border-radius: var(--radius-md);
          border: 1px solid var(--c-border);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
          display: flex;
          flex-direction: column;
          cursor: pointer;
        }

        .property-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--c-border-hover);
        }

        /* Image Wrapper */
        .pc-image-wrapper {
          position: relative;
          width: 100%;
          height: 220px;
          background: #e2e8f0;
          overflow: hidden;
        }

        .pc-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .property-card:hover .pc-img {
          transform: scale(1.03);
        }

        .pc-badges-row {
          position: absolute;
          top: 10px;
          left: 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          z-index: 2;
        }

        .pc-badge {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(4px);
          color: #ffffff;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: var(--radius-sm);
        }

        .pc-badge.badge-bargain {
          background: #f59e0b;
        }

        .pc-trans-tag {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: #1e3a8a;
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 6px;
          z-index: 2;
        }

        /* Carousel Navigation */
        .pc-img-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.85);
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
          z-index: 3;
        }

        .property-card:hover .pc-img-nav {
          opacity: 1;
        }

        .pc-img-nav.prev { left: 8px; }
        .pc-img-nav.next { right: 8px; }

        .pc-dots-indicator {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 4px;
          z-index: 2;
        }

        .pc-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
        }

        .pc-dot.active {
          background: #ffffff;
          width: 12px;
          border-radius: 4px;
        }

        /* Card Content */
        .pc-content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .pc-price-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .pc-main-price {
          font-size: 1.35rem;
          font-weight: 900;
          color: var(--c-primary);
          letter-spacing: -0.5px;
          white-space: nowrap;
        }

        .pc-sub-price {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--c-muted);
          white-space: nowrap;
        }

        .pc-title {
          font-size: 0.98rem;
          font-weight: 700;
          color: var(--c-slate);
          margin-bottom: 6px;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .pc-address-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: #64748b;
          margin-bottom: 12px;
        }

        /* Metrics */
        .pc-metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          background: #f8fafc;
          padding: 8px 10px;
          border-radius: var(--radius-sm);
          margin-bottom: 14px;
          border: 1px solid #f1f5f9;
        }

        .metric-item {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 4px;
        }

        .metric-val {
          font-size: 0.9rem;
          font-weight: 800;
          color: var(--c-dark);
        }

        .metric-lbl {
          font-size: 0.72rem;
          color: #64748b;
          font-weight: 600;
        }

        /* Bottom Actions */
        .pc-bottom-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: auto;
        }

        .pc-view-btn {
          flex: 1;
          font-size: 0.82rem;
          padding: 9px 12px;
        }

        .pc-more-btn {
          width: 36px;
          height: 36px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};
