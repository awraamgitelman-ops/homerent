import React, { useState, useMemo } from 'react';
import { PropertyMap } from '../components/PropertyMap';
import { 
  Building2, 
  Search, 
  MapPin, 
  ChevronDown, 
  RotateCcw,
  List,
  Sparkles,
  Layers,
  Calendar,
  Eye,
  ArrowUpDown
} from 'lucide-react';
import { POLTAVA_DISTRICTS, PROPERTY_TYPES, TRANSACTION_TYPES, ROOM_OPTIONS } from '../data/poltavaDistricts';
import { formatCurrency, formatPricePerM2 } from '../utils/formatters';

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
  const [sortBy, setSortBy] = useState('default');
  const [isEoselyaOnly, setIsEoselyaOnly] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [mobileTab, setMobileTab] = useState('map'); // 'map' | 'list' for small screens

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
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return (currency === 'USD' ? a.priceUSD - b.priceUSD : a.priceUAH - b.priceUAH);
      if (sortBy === 'price-desc') return (currency === 'USD' ? b.priceUSD - a.priceUSD : b.priceUAH - a.priceUAH);
      if (sortBy === 'area-desc') return b.area - a.area;
      return 0;
    });
  }, [properties, selectedType, transaction, district, rooms, priceMax, currency, isEoselyaOnly, sortBy]);

  const handleReset = () => {
    setSelectedType('all');
    setTransaction('all');
    setDistrict('all');
    setRooms('all');
    setPriceMax('');
    setIsEoselyaOnly(false);
    setSelectedPropertyId(null);
  };

  const handleCardClick = (prop) => {
    setSelectedPropertyId(prop.id);
  };

  return (
    <div className="map-page-wrapper">
      {/* 1. Top Compact Filter Bar */}
      <div className="map-page-filter-bar">
        <div className="container map-filter-inner">
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
                title="Перемкнути валюту"
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

          {/* Mobile Switcher between Map and List */}
          <div className="mobile-view-tabs">
            <button 
              type="button" 
              className={`mvt-btn ${mobileTab === 'list' ? 'active' : ''}`}
              onClick={() => setMobileTab('list')}
            >
              <List size={15} />
              <span>Список ({filteredProperties.length})</span>
            </button>
            <button 
              type="button" 
              className={`mvt-btn ${mobileTab === 'map' ? 'active' : ''}`}
              onClick={() => setMobileTab('map')}
            >
              <MapPin size={15} />
              <span>Карта</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Permanent Split Layout: LEFT = List of Objects | RIGHT = Google Map */}
      <div className="map-page-body-split">
        {/* LEFT COLUMN: Always Visible Objects List */}
        <aside className={`map-left-sidebar ${mobileTab === 'map' ? 'hide-on-mobile' : ''}`}>
          <div className="mls-header">
            <div className="mls-title-row">
              <h3>Об'єкти у Полтаві</h3>
              <span className="mls-counter">{filteredProperties.length}</span>
            </div>
            
            <div className="mls-sort-row">
              <ArrowUpDown size={13} className="text-muted" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="mls-sort-select"
              >
                <option value="default">За замовчуванням</option>
                <option value="price-asc">Ціна: від дешевих</option>
                <option value="price-desc">Ціна: від дорогих</option>
                <option value="area-desc">Площа: від більшої</option>
              </select>
            </div>
          </div>

          <div className="mls-scrollable-list">
            {filteredProperties.length === 0 ? (
              <div className="mls-empty">
                <Building2 size={36} className="text-muted mb-2" />
                <p>Не знайдено об'єктів за обраними параметрами</p>
                <button onClick={handleReset} className="btn btn-sm btn-outline mt-2">
                  Скинути фільтри
                </button>
              </div>
            ) : (
              filteredProperties.map((prop) => {
                const isSelected = selectedPropertyId === prop.id;
                const displayPrice = currency === 'USD' 
                  ? formatCurrency(prop.priceUSD, 'USD') 
                  : formatCurrency(prop.priceUAH, 'UAH');

                return (
                  <div
                    key={prop.id}
                    className={`mls-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleCardClick(prop)}
                  >
                    <div className="mls-card-img-box">
                      <img src={prop.images[0]} alt={prop.title} className="mls-card-img" loading="lazy" />
                      <span className="mls-card-tag">
                        {prop.transaction === 'buy' ? 'Продаж' : prop.transaction === 'rent' ? 'Оренда' : 'Подобово'}
                      </span>
                    </div>

                    <div className="mls-card-info">
                      <div className="mls-card-price-row">
                        <span className="mls-card-price">{displayPrice}</span>
                        {prop.pricePerM2 > 0 && (
                          <span className="mls-card-m2">{formatPricePerM2(prop.pricePerM2, currency)}</span>
                        )}
                      </div>

                      <h4 className="mls-card-title" title={prop.title}>{prop.title}</h4>
                      
                      <div className="mls-card-loc">
                        <MapPin size={12} className="text-primary flex-shrink-0" />
                        <span>{prop.districtName}, {prop.address}</span>
                      </div>

                      <div className="mls-card-metrics">
                        {prop.rooms > 0 && <span>{prop.rooms} кімн.</span>}
                        <span>{prop.area} м²</span>
                        {prop.floor > 0 && <span>{prop.floor}/{prop.totalFloors} пов.</span>}
                      </div>

                      <div className="mls-card-actions">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm mls-book-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            onBookViewing(prop);
                          }}
                        >
                          <Calendar size={13} />
                          <span>Записатись</span>
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm mls-details-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProperty(prop);
                          }}
                          title="Повний опис"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* RIGHT COLUMN: Full Google Map Viewport */}
        <div className={`map-right-viewport ${mobileTab === 'list' ? 'hide-on-mobile' : ''}`}>
          <PropertyMap
            properties={filteredProperties}
            currency={currency}
            onSelectProperty={onSelectProperty}
            selectedPropertyId={selectedPropertyId}
          />
        </div>
      </div>

      {/* Scoped Styles for MapPage Split Layout */}
      <style>{`
        .map-page-wrapper {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 76px);
          min-height: 550px;
          background: #f8fafc;
          overflow: hidden;
        }

        /* Top Filter Bar */
        .map-page-filter-bar {
          background: #ffffff;
          border-bottom: 1px solid var(--c-border);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          z-index: 10;
          padding: 8px 0;
        }

        .map-filter-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }

        .mf-group {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .mf-select {
          padding: 7px 10px;
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
          border-color: #b91c1c;
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
          width: 85px;
          padding: 6px 8px;
          font-size: 0.82rem;
          font-weight: 700;
          border: none;
          background: transparent;
          outline: none;
        }

        .mf-curr-btn {
          padding: 6px 8px;
          font-size: 0.75rem;
          font-weight: 800;
          color: #ffffff;
          background: #b91c1c;
        }

        .mf-eoselya-label {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.78rem;
          font-weight: 700;
          color: #16a34a;
          background: #dcfce7;
          padding: 6px 9px;
          border-radius: var(--radius-sm);
          cursor: pointer;
        }

        .mf-eoselya-label input {
          accent-color: #16a34a;
        }

        .mf-reset-btn {
          padding: 7px;
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

        .mobile-view-tabs {
          display: none;
        }

        /* Split Body Layout */
        .map-page-body-split {
          flex: 1;
          display: flex;
          height: calc(100% - 49px);
          overflow: hidden;
        }

        /* Left Sidebar: Permanent List */
        .map-left-sidebar {
          width: 420px;
          height: 100%;
          background: #ffffff;
          border-right: 1px solid var(--c-border);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          z-index: 5;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.04);
        }

        .mls-header {
          padding: 12px 16px;
          background: #f8fafc;
          border-bottom: 1px solid var(--c-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .mls-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mls-title-row h3 {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--c-slate);
        }

        .mls-counter {
          background: #b91c1c;
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 1px 7px;
          border-radius: 12px;
        }

        .mls-sort-row {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .mls-sort-select {
          border: none;
          background: transparent;
          font-size: 0.76rem;
          font-weight: 600;
          color: #475569;
          outline: none;
          cursor: pointer;
        }

        .mls-scrollable-list {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* Property Card in Left Sidebar */
        .mls-card {
          display: flex;
          gap: 12px;
          padding: 10px;
          background: #ffffff;
          border: 1px solid var(--c-border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition);
        }

        .mls-card:hover, .mls-card.selected {
          border-color: #b91c1c;
          box-shadow: 0 4px 12px rgba(185, 28, 28, 0.12);
          transform: translateY(-2px);
        }

        .mls-card.selected {
          background: #fff5f5;
        }

        .mls-card-img-box {
          position: relative;
          width: 110px;
          height: 95px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          flex-shrink: 0;
          background: #e2e8f0;
        }

        .mls-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .mls-card-tag {
          position: absolute;
          bottom: 4px;
          left: 4px;
          background: rgba(15, 23, 42, 0.85);
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .mls-card-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .mls-card-price-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 2px;
        }

        .mls-card-price {
          font-size: 1.1rem;
          font-weight: 900;
          color: #b91c1c;
          line-height: 1.1;
        }

        .mls-card-m2 {
          font-size: 0.72rem;
          color: #64748b;
          font-weight: 600;
        }

        .mls-card-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--c-slate);
          margin-bottom: 3px;
          line-height: 1.25;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .mls-card-loc {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          color: #64748b;
          margin-bottom: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mls-card-metrics {
          display: flex;
          gap: 8px;
          font-size: 0.7rem;
          color: #475569;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .mls-card-actions {
          display: flex;
          gap: 6px;
          margin-top: auto;
        }

        .mls-book-btn {
          flex: 1;
          font-size: 0.74rem;
          padding: 5px 8px;
          background: #b91c1c;
        }

        .mls-book-btn:hover {
          background: #991b1b;
        }

        .mls-details-btn {
          padding: 5px 8px;
        }

        .mls-empty {
          text-align: center;
          padding: 40px 10px;
          color: #64748b;
          font-size: 0.88rem;
        }

        /* Right Viewport */
        .map-right-viewport {
          flex: 1;
          height: 100%;
          position: relative;
        }

        .map-right-viewport .property-map-container-wrapper {
          border-radius: 0;
          border: none;
          height: 100%;
          min-height: 100%;
        }

        /* Mobile Adjustments */
        @media (max-width: 900px) {
          .map-page-wrapper {
            height: calc(100vh - 64px - 68px);
          }

          .mobile-view-tabs {
            display: flex;
            background: #e2e8f0;
            padding: 2px;
            border-radius: var(--radius-sm);
          }

          .mvt-btn {
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 5px 10px;
            font-size: 0.76rem;
            font-weight: 700;
            color: #475569;
            border-radius: 4px;
          }

          .mvt-btn.active {
            background: #ffffff;
            color: #b91c1c;
            box-shadow: var(--shadow-sm);
          }

          .map-left-sidebar {
            width: 100%;
          }

          .hide-on-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
