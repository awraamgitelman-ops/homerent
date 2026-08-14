import React, { useState, useMemo } from 'react';
import { PropertyMap } from '../components/PropertyMap';
import { PropertyCard } from '../components/PropertyCard';
import { 
  Building2, 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  ChevronDown, 
  DollarSign, 
  RotateCcw,
  List,
  Sparkles,
  Layers
} from 'lucide-react';
import { POLTAVA_DISTRICTS, PROPERTY_TYPES, TRANSACTION_TYPES, ROOM_OPTIONS } from '../data/poltavaDistricts';
import { formatCurrency } from '../utils/formatters';

export const MapPage = ({
  properties,
  onSelectProperty,
  onBookViewing,
  onOpenConsultModal
}) => {
  const [selectedType, setSelectedType] = useState('all');
  const [transaction, setTransaction] = useState('all');
  const [district, setDistrict] = useState('all');
  const [rooms, setRooms] = useState('all');
  const [priceMax, setPriceMax] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [isEoselyaOnly, setIsEoselyaOnly] = useState(false);
  const [isListDrawerOpen, setIsListDrawerOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);

  // Filter properties
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (selectedType !== 'all' && p.type !== selectedType) return false;
      if (transaction !== 'all' && p.transaction !== transaction) return false;
      if (district !== 'all' && p.district !== district) return false;
      if (rooms !== 'all') {
        if (rooms === '4+' && p.rooms < 4) return false;
        if (rooms !== '4+' && rooms !== 'studio' && String(p.rooms) !== rooms) return false;
      }
      if (priceMax && (currency === 'USD' ? p.priceUSD : p.priceUAH) > Number(priceMax)) return false;
      if (isEoselyaOnly && !p.badges.some(b => b.includes('єОселя'))) return false;
      return true;
    });
  }, [properties, selectedType, transaction, district, rooms, priceMax, currency, isEoselyaOnly]);

  const handleReset = () => {
    setSelectedType('all');
    setTransaction('all');
    setDistrict('all');
    setRooms('all');
    setPriceMax('');
    setIsEoselyaOnly(false);
  };

  const handleMarkerSelect = (prop) => {
    setSelectedPropertyId(prop.id);
    onSelectProperty(prop);
  };

  return (
    <div className="map-page-wrapper">
      {/* 1. Top Compact Control Filter Bar */}
      <div className="map-page-filter-bar">
        <div className="container map-filter-inner">
          {/* Quick Filters */}
          <div className="mf-group">
            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
              className="mf-select"
            >
              <option value="all">Всі типи нерухомості</option>
              {PROPERTY_TYPES.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>

            <select 
              value={transaction} 
              onChange={(e) => setTransaction(e.target.value)}
              className="mf-select"
            >
              <option value="all">Купівля та Оренда</option>
              <option value="buy">Тільки купівля</option>
              <option value="rent">Тільки оренда</option>
              <option value="daily">Подобово</option>
            </select>

            <select 
              value={district} 
              onChange={(e) => setDistrict(e.target.value)}
              className="mf-select"
            >
              {POLTAVA_DISTRICTS.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            <select 
              value={rooms} 
              onChange={(e) => setRooms(e.target.value)}
              className="mf-select"
            >
              {ROOM_OPTIONS.map(r => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>

            {/* Price Max input */}
            <div className="mf-price-box">
              <input 
                type="number"
                placeholder="Ціна до"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="mf-input"
              />
              <button 
                type="button" 
                className="mf-curr-btn"
                onClick={() => setCurrency(currency === 'USD' ? 'UAH' : 'USD')}
              >
                {currency === 'USD' ? '$' : 'грн'}
              </button>
            </div>

            {/* єОселя Checkbox */}
            <label className="mf-eoselya-label">
              <input 
                type="checkbox" 
                checked={isEoselyaOnly} 
                onChange={(e) => setIsEoselyaOnly(e.target.checked)}
              />
              <span>єОселя 3%/7%</span>
            </label>

            {(selectedType !== 'all' || transaction !== 'all' || district !== 'all' || rooms !== 'all' || priceMax || isEoselyaOnly) && (
              <button type="button" onClick={handleReset} className="mf-reset-btn" title="Скинути фільтри">
                <RotateCcw size={14} />
              </button>
            )}
          </div>

          {/* Right Action: Counter & Toggle Sidebar List */}
          <div className="mf-right-actions">
            <span className="mf-count-badge">
              На карті: <strong>{filteredProperties.length}</strong> об'єктів
            </span>

            <button 
              type="button"
              className={`btn btn-sm ${isListDrawerOpen ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setIsListDrawerOpen(!isListDrawerOpen)}
            >
              <List size={16} />
              <span>{isListDrawerOpen ? 'Сховати список' : 'Список об\'єктів'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Full-Screen Map Container with Collapsible Cards Sidebar */}
      <div className="map-page-body-container">
        {/* The Google Map View */}
        <div className="map-full-viewport">
          <PropertyMap
            properties={filteredProperties}
            currency={currency}
            onSelectProperty={handleMarkerSelect}
            selectedPropertyId={selectedPropertyId}
          />
        </div>

        {/* Side Panel with Property Cards */}
        {isListDrawerOpen && (
          <div className="map-side-cards-panel animate-slide">
            <div className="mscp-header">
              <h3>Об'єкти у Полтаві ({filteredProperties.length})</h3>
              <button onClick={() => setIsListDrawerOpen(false)} className="mscp-close-btn">
                ✕
              </button>
            </div>
            <div className="mscp-list">
              {filteredProperties.map((prop) => (
                <div 
                  key={prop.id}
                  className={`mscp-card-item ${selectedPropertyId === prop.id ? 'active' : ''}`}
                  onClick={() => handleMarkerSelect(prop)}
                >
                  <img src={prop.images[0]} alt="" className="mscp-img" />
                  <div className="mscp-meta">
                    <span className="mscp-price">
                      {currency === 'USD' ? formatCurrency(prop.priceUSD, 'USD') : formatCurrency(prop.priceUAH, 'UAH')}
                    </span>
                    <span className="mscp-title">{prop.title}</span>
                    <span className="mscp-address">📍 {prop.districtName}, {prop.address}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Scoped Styles for MapPage */}
      <style>{`
        .map-page-wrapper {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 76px);
          min-height: 600px;
          background: #f8fafc;
          overflow: hidden;
        }

        .map-page-filter-bar {
          background: #ffffff;
          border-bottom: 1px solid var(--c-border);
          box-shadow: var(--shadow-sm);
          z-index: 10;
          padding: 10px 0;
        }

        .map-filter-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .mf-group {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .mf-select {
          padding: 8px 12px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #1e293b;
          background: #f1f5f9;
          border: 1px solid var(--c-border);
          border-radius: var(--radius-sm);
          outline: none;
          cursor: pointer;
        }

        .mf-select:focus {
          border-color: var(--c-primary);
          background: #ffffff;
        }

        .mf-price-box {
          display: flex;
          align-items: center;
          background: #f1f5f9;
          border: 1px solid var(--c-border);
          border-radius: var(--radius-sm);
          overflow: hidden;
        }

        .mf-input {
          width: 90px;
          padding: 7px 8px;
          font-size: 0.82rem;
          font-weight: 700;
          border: none;
          background: transparent;
          outline: none;
        }

        .mf-curr-btn {
          padding: 6px 8px;
          font-size: 0.76rem;
          font-weight: 800;
          color: #ffffff;
          background: #b91c1c;
        }

        .mf-eoselya-label {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #16a34a;
          background: #dcfce7;
          padding: 6px 10px;
          border-radius: var(--radius-sm);
          cursor: pointer;
        }

        .mf-eoselya-label input {
          accent-color: #16a34a;
        }

        .mf-reset-btn {
          padding: 8px;
          background: #e2e8f0;
          border-radius: var(--radius-sm);
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mf-reset-btn:hover {
          color: var(--c-red);
        }

        .mf-right-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mf-count-badge {
          font-size: 0.85rem;
          color: #475569;
        }

        .mf-count-badge strong {
          color: #b91c1c;
          font-size: 1rem;
        }

        /* Body & Map Viewport */
        .map-page-body-container {
          flex: 1;
          display: flex;
          position: relative;
          height: 100%;
        }

        .map-full-viewport {
          flex: 1;
          height: 100%;
          width: 100%;
        }

        .map-full-viewport .property-map-container-wrapper {
          border-radius: 0;
          border: none;
          height: 100%;
          min-height: 100%;
        }

        /* Sliding Side Cards Panel */
        .map-side-cards-panel {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 360px;
          background: #ffffff;
          box-shadow: -8px 0 25px rgba(0, 0, 0, 0.15);
          z-index: 500;
          display: flex;
          flex-direction: column;
          border-left: 1px solid var(--c-border);
        }

        .mscp-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid var(--c-border);
          background: #f8fafc;
        }

        .mscp-header h3 {
          font-size: 1rem;
          font-weight: 800;
          color: var(--c-slate);
        }

        .mscp-close-btn {
          font-size: 1.1rem;
          color: #64748b;
          padding: 4px;
        }

        .mscp-list {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .mscp-card-item {
          display: flex;
          gap: 10px;
          padding: 8px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--c-border);
          background: #ffffff;
          cursor: pointer;
          transition: var(--transition);
        }

        .mscp-card-item:hover, .mscp-card-item.active {
          border-color: #b91c1c;
          background: #fef2f2;
          transform: translateX(-3px);
        }

        .mscp-img {
          width: 80px;
          height: 65px;
          object-fit: cover;
          border-radius: 6px;
          flex-shrink: 0;
        }

        .mscp-meta {
          display: flex;
          flex-direction: column;
          justify-content: center;
          line-height: 1.25;
        }

        .mscp-price {
          font-size: 0.95rem;
          font-weight: 900;
          color: #b91c1c;
        }

        .mscp-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--c-slate);
          margin: 2px 0;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .mscp-address {
          font-size: 0.72rem;
          color: #64748b;
        }

        @media (max-width: 768px) {
          .map-page-wrapper {
            height: calc(100vh - 64px - 68px); /* clear mobile header and bottom bar */
          }
          .map-side-cards-panel {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
