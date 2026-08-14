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
  ArrowUpDown,
  DollarSign
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
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [currency, setCurrency] = useState('UAH'); // Default UAH for local rentals
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
      
      const propPrice = currency === 'USD' ? p.priceUSD : p.priceUAH;
      if (priceMin && propPrice < Number(priceMin)) return false;
      if (priceMax && propPrice > Number(priceMax)) return false;

      if (isEoselyaOnly && !p.badges.some(b => b.includes('єОселя'))) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return (currency === 'USD' ? a.priceUSD - b.priceUSD : a.priceUAH - b.priceUAH);
      if (sortBy === 'price-desc') return (currency === 'USD' ? b.priceUSD - a.priceUSD : b.priceUAH - a.priceUAH);
      if (sortBy === 'area-desc') return b.area - a.area;
      return 0;
    });
  }, [properties, selectedType, transaction, district, rooms, priceMin, priceMax, currency, isEoselyaOnly, sortBy]);

  const handleReset = () => {
    setSelectedType('all');
    setTransaction('all');
    setDistrict('all');
    setRooms('all');
    setPriceMin('');
    setPriceMax('');
    setIsEoselyaOnly(false);
    setSelectedPropertyId(null);
  };

  const handleCardClick = (prop) => {
    setSelectedPropertyId(prop.id);
  };

  const handleSetPriceRange = (min, max) => {
    setPriceMin(min);
    setPriceMax(max);
  };

  return (
    <div className="map-page-wrapper">
      {/* 1. Top Compact Filter Bar with Full Price Range */}
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

            {/* Price Filter Box: Ціна від - до + Валюта */}
            <div className="mf-price-container">
              <span className="mf-price-label">Ціна:</span>
              <input 
                type="number"
                placeholder="від"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="mf-price-input"
              />
              <span className="mf-price-dash">—</span>
              <input 
                type="number"
                placeholder="до"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="mf-price-input"
              />
              <button 
                type="button" 
                className="mf-curr-btn"
                onClick={() => setCurrency(currency === 'USD' ? 'UAH' : 'USD')}
                title="Перемкнути валюту ($ / грн)"
              >
                {currency === 'USD' ? '$ USD' : 'грн UAH'}
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

            {(selectedType !== 'all' || transaction !== 'all' || district !== 'all' || rooms !== 'all' || priceMin || priceMax || isEoselyaOnly) && (
              <button type="button" onClick={handleReset} className="mf-reset-btn" title="Скинути всі фільтри">
                <RotateCcw size={14} />
                <span>Скинути</span>
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

        {/* Quick Price Range Chips for Fast Selection */}
        <div className="container mf-quick-prices-row">
          <span className="mf-qp-title">Швидкий підбір за ціною:</span>
          {currency === 'UAH' ? (
            <>
              <button 
                type="button" 
                className={`mf-qp-chip ${!priceMin && priceMax === '15000' ? 'active' : ''}`}
                onClick={() => handleSetPriceRange('', '15000')}
              >
                до 15 000 грн
              </button>
              <button 
                type="button" 
                className={`mf-qp-chip ${priceMin === '15000' && priceMax === '20000' ? 'active' : ''}`}
                onClick={() => handleSetPriceRange('15000', '20000')}
              >
                15 000 — 20 000 грн
              </button>
              <button 
                type="button" 
                className={`mf-qp-chip ${priceMin === '20000' && priceMax === '30000' ? 'active' : ''}`}
                onClick={() => handleSetPriceRange('20000', '30000')}
              >
                20 000 — 30 000 грн
              </button>
              <button 
                type="button" 
                className={`mf-qp-chip ${priceMin === '30000' && !priceMax ? 'active' : ''}`}
                onClick={() => handleSetPriceRange('30000', '')}
              >
                від 30 000 грн
              </button>
              <button 
                type="button" 
                className={`mf-qp-chip ${priceMin === '1000000' ? 'active' : ''}`}
                onClick={() => handleSetPriceRange('1000000', '')}
              >
                Продаж (від 1 млн грн)
              </button>
            </>
          ) : (
            <>
              <button 
                type="button" 
                className={`mf-qp-chip ${!priceMin && priceMax === '350' ? 'active' : ''}`}
                onClick={() => handleSetPriceRange('', '350')}
              >
                до $ 350
              </button>
              <button 
                type="button" 
                className={`mf-qp-chip ${priceMin === '350' && priceMax === '500' ? 'active' : ''}`}
                onClick={() => handleSetPriceRange('350', '500')}
              >
                $ 350 — $ 500
              </button>
              <button 
                type="button" 
                className={`mf-qp-chip ${priceMin === '500' && priceMax === '1000' ? 'active' : ''}`}
                onClick={() => handleSetPriceRange('500', '1000')}
              >
                $ 500 — $ 1 000
              </button>
              <button 
                type="button" 
                className={`mf-qp-chip ${priceMin === '30000' ? 'active' : ''}`}
                onClick={() => handleSetPriceRange('30000', '')}
              >
                Купівля (від $ 30 тис.)
              </button>
            </>
          )}
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
                <p>Не знайдено об'єктів за обраною ціною або параметрами</p>
                <button onClick={handleReset} className="btn btn-sm btn-outline mt-2">
                  Скинути фільтри цін
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
          padding: 8px 0 6px;
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

        /* Price Filter Range Box */
        .mf-price-container {
          display: flex;
          align-items: center;
          background: #f8fafc;
          border: 1.5px solid #cbd5e1;
          border-radius: var(--radius-sm);
          overflow: hidden;
          padding-left: 8px;
        }

        .mf-price-label {
          font-size: 0.76rem;
          font-weight: 700;
          color: #475569;
          margin-right: 4px;
        }

        .mf-price-input {
          width: 75px;
          padding: 6px 6px;
          font-size: 0.82rem;
          font-weight: 700;
          border: none;
          background: transparent;
          outline: none;
          color: #0f172a;
        }

        .mf-price-dash {
          color: #94a3b8;
          font-weight: 700;
        }

        .mf-curr-btn {
          padding: 6px 10px;
          font-size: 0.76rem;
          font-weight: 800;
          color: #ffffff;
          background: #b91c1c;
          transition: background-color 0.2s;
        }

        .mf-curr-btn:hover {
          background: #991b1b;
        }

        /* Quick Price Range Chips Row */
        .mf-quick-prices-row {
          display: flex;
          align-items: center;
          gap: 6px;
          overflow-x: auto;
          padding-top: 6px;
          padding-bottom: 2px;
        }

        .mf-qp-title {
          font-size: 0.74rem;
          color: #64748b;
          font-weight: 700;
          white-space: nowrap;
          margin-right: 2px;
        }

        .mf-qp-chip {
          padding: 3px 9px;
          font-size: 0.72rem;
          font-weight: 700;
          color: #475569;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-full);
          white-space: nowrap;
          transition: all 0.15s;
        }

        .mf-qp-chip:hover {
          border-color: #b91c1c;
          color: #b91c1c;
          background: #ffffff;
        }

        .mf-qp-chip.active {
          background: #b91c1c;
          color: #ffffff;
          border-color: #b91c1c;
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
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 10px;
          background: #e2e8f0;
          border-radius: var(--radius-sm);
          font-size: 0.76rem;
          font-weight: 700;
          color: #475569;
        }

        .mf-reset-btn:hover {
          color: var(--c-red);
          background: #cbd5e1;
        }

        .mobile-view-tabs {
          display: none;
        }

        /* Split Body Layout */
        .map-page-body-split {
          flex: 1;
          display: flex;
          height: calc(100% - 78px);
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
