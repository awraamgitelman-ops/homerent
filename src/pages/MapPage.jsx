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
  DollarSign,
  Key,
  Home
} from 'lucide-react';
import { POLTAVA_DISTRICTS, ROOM_OPTIONS } from '../data/poltavaDistricts';
import { formatCurrency, formatPricePerM2 } from '../utils/formatters';

export const MapPage = ({
  properties,
  onSelectProperty,
  onBookViewing,
  onOpenConsultModal
}) => {
  // Strict separation: 'rent' | 'buy' (no mixed all-in-one)
  const [transaction, setTransaction] = useState('rent');
  const [selectedType, setSelectedType] = useState('apartment');
  const [district, setDistrict] = useState('all');
  const [rooms, setRooms] = useState('all');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [currency, setCurrency] = useState('UAH'); // UAH for rent, USD for buy
  const [sortBy, setSortBy] = useState('default');
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [mobileTab, setMobileTab] = useState('map'); // 'map' | 'list' for small screens

  // Switch between Rent & Buy strictly
  const handleSwitchTransaction = (type) => {
    setTransaction(type);
    setCurrency(type === 'rent' ? 'UAH' : 'USD');
    setPriceMin('');
    setPriceMax('');
    setSelectedPropertyId(null);
  };

  // Filter properties strictly by transaction
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // 1. Strict Transaction separation
      if (p.transaction !== transaction) return false;

      // 2. Concrete Type Filter (No 'all types')
      if (p.type !== selectedType) return false;

      // 3. District Filter
      if (district !== 'all' && p.district !== district) return false;

      // 4. Rooms Filter
      if (rooms !== 'all') {
        if (rooms === '4+' && p.rooms < 4) return false;
        if (rooms !== '4+' && rooms !== 'studio' && String(p.rooms) !== rooms) return false;
      }
      
      // 5. Price Range Filter
      const currentPrice = currency === 'USD' ? p.priceUSD : p.priceUAH;
      if (priceMin && currentPrice < Number(priceMin)) return false;
      if (priceMax && currentPrice > Number(priceMax)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return (currency === 'USD' ? a.priceUSD - b.priceUSD : a.priceUAH - b.priceUAH);
      if (sortBy === 'price-desc') return (currency === 'USD' ? b.priceUSD - a.priceUSD : b.priceUAH - a.priceUAH);
      if (sortBy === 'area-desc') return b.area - a.area;
      return 0;
    });
  }, [properties, transaction, selectedType, district, rooms, priceMin, priceMax, currency, sortBy]);

  // Counts for each mode
  const rentCount = properties.filter(p => p.transaction === 'rent').length;
  const buyCount = properties.filter(p => p.transaction === 'buy').length;

  const handleReset = () => {
    setSelectedType('apartment');
    setDistrict('all');
    setRooms('all');
    setPriceMin('');
    setPriceMax('');
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
      {/* 1. Top Control Bar: Mode Toggle + Clean Filters (Positioned solidly on top of map) */}
      <div className="map-page-filter-bar">
        <div className="map-filter-inner-fluid">
          {/* Strict Mode Switcher: Оренда vs Купівля */}
          <div className="map-mode-toggle-group">
            <button
              type="button"
              className={`mmt-btn ${transaction === 'rent' ? 'active rent' : ''}`}
              onClick={() => handleSwitchTransaction('rent')}
            >
              <Key size={15} />
              <span>Оренда нерухомості</span>
              <span className="mmt-badge">{rentCount}</span>
            </button>

            <button
              type="button"
              className={`mmt-btn ${transaction === 'buy' ? 'active buy' : ''}`}
              onClick={() => handleSwitchTransaction('buy')}
            >
              <Home size={15} />
              <span>Купівля (Продаж)</span>
              <span className="mmt-badge">{buyCount}</span>
            </button>
          </div>

          {/* Sub Filters Row */}
          <div className="mf-group">
            {/* Concrete Type Selector - Without "All Types" */}
            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
              className="mf-select mf-type-select"
            >
              <option value="apartment">🏢 Квартири</option>
              <option value="house">🏡 Будинки та котеджі</option>
              <option value="commercial">🏬 Комерційні приміщення</option>
              {transaction === 'buy' && <option value="land">🌲 Земельні ділянки</option>}
            </select>

            {/* District */}
            <select 
              value={district} 
              onChange={(e) => setDistrict(e.target.value)}
              className="mf-select"
            >
              {POLTAVA_DISTRICTS.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            {/* Rooms (if not commercial) */}
            {selectedType !== 'commercial' && selectedType !== 'land' && (
              <select 
                value={rooms} 
                onChange={(e) => setRooms(e.target.value)}
                className="mf-select"
              >
                {ROOM_OPTIONS.map(r => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            )}

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

            {(selectedType !== 'apartment' || district !== 'all' || rooms !== 'all' || priceMin || priceMax) && (
              <button type="button" onClick={handleReset} className="mf-reset-btn" title="Скинути фільтри">
                <RotateCcw size={13} />
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

        {/* Tailored Quick Price Range Chips for Active Mode */}
        <div className="mf-quick-prices-fluid">
          <span className="mf-qp-title">Діапазон цін:</span>
          {transaction === 'rent' ? (
            currency === 'UAH' ? (
              <>
                <button 
                  type="button" 
                  className={`mf-qp-chip ${!priceMin && priceMax === '12000' ? 'active' : ''}`}
                  onClick={() => handleSetPriceRange('', '12000')}
                >
                  до 12 000 грн
                </button>
                <button 
                  type="button" 
                  className={`mf-qp-chip ${priceMin === '12000' && priceMax === '18000' ? 'active' : ''}`}
                  onClick={() => handleSetPriceRange('12000', '18000')}
                >
                  12 000 — 18 000 грн
                </button>
                <button 
                  type="button" 
                  className={`mf-qp-chip ${priceMin === '18000' && priceMax === '25000' ? 'active' : ''}`}
                  onClick={() => handleSetPriceRange('18000', '25000')}
                >
                  18 000 — 25 000 грн
                </button>
                <button 
                  type="button" 
                  className={`mf-qp-chip ${priceMin === '25000' && !priceMax ? 'active' : ''}`}
                  onClick={() => handleSetPriceRange('25000', '')}
                >
                  від 25 000 грн
                </button>
              </>
            ) : (
              <>
                <button 
                  type="button" 
                  className={`mf-qp-chip ${!priceMin && priceMax === '300' ? 'active' : ''}`}
                  onClick={() => handleSetPriceRange('', '300')}
                >
                  до $ 300
                </button>
                <button 
                  type="button" 
                  className={`mf-qp-chip ${priceMin === '300' && priceMax === '500' ? 'active' : ''}`}
                  onClick={() => handleSetPriceRange('300', '500')}
                >
                  $ 300 — $ 500
                </button>
                <button 
                  type="button" 
                  className={`mf-qp-chip ${priceMin === '500' && !priceMax ? 'active' : ''}`}
                  onClick={() => handleSetPriceRange('500', '')}
                >
                  від $ 500
                </button>
              </>
            )
          ) : (
            currency === 'USD' ? (
              <>
                <button 
                  type="button" 
                  className={`mf-qp-chip ${!priceMin && priceMax === '35000' ? 'active' : ''}`}
                  onClick={() => handleSetPriceRange('', '35000')}
                >
                  до $ 35 000
                </button>
                <button 
                  type="button" 
                  className={`mf-qp-chip ${priceMin === '35000' && priceMax === '50000' ? 'active' : ''}`}
                  onClick={() => handleSetPriceRange('35000', '50000')}
                >
                  $ 35 000 — $ 50 000
                </button>
                <button 
                  type="button" 
                  className={`mf-qp-chip ${priceMin === '50000' && priceMax === '80000' ? 'active' : ''}`}
                  onClick={() => handleSetPriceRange('50000', '80000')}
                >
                  $ 50 000 — $ 80 000
                </button>
                <button 
                  type="button" 
                  className={`mf-qp-chip ${priceMin === '80000' && !priceMax ? 'active' : ''}`}
                  onClick={() => handleSetPriceRange('80000', '')}
                >
                  від $ 80 000
                </button>
              </>
            ) : (
              <>
                <button 
                  type="button" 
                  className={`mf-qp-chip ${!priceMin && priceMax === '1500000' ? 'active' : ''}`}
                  onClick={() => handleSetPriceRange('', '1500000')}
                >
                  до 1.5 млн грн
                </button>
                <button 
                  type="button" 
                  className={`mf-qp-chip ${priceMin === '1500000' && priceMax === '2500000' ? 'active' : ''}`}
                  onClick={() => handleSetPriceRange('1500000', '2500000')}
                >
                  1.5 — 2.5 млн грн
                </button>
                <button 
                  type="button" 
                  className={`mf-qp-chip ${priceMin === '2500000' && !priceMax ? 'active' : ''}`}
                  onClick={() => handleSetPriceRange('2500000', '')}
                >
                  від 2.5 млн грн
                </button>
              </>
            )
          )}
        </div>
      </div>

      {/* 2. Permanent Split Layout: LEFT = List of Objects | RIGHT = Google Map */}
      <div className="map-page-body-split">
        {/* LEFT COLUMN: Always Visible Objects List */}
        <aside className={`map-left-sidebar ${mobileTab === 'map' ? 'hide-on-mobile' : ''}`}>
          <div className="mls-header">
            <div className="mls-title-row">
              <h3>{transaction === 'rent' ? 'Оренда в Полтаві' : 'Продаж у Полтаві'}</h3>
              <span className={`mls-counter ${transaction === 'rent' ? 'rent-badge' : 'buy-badge'}`}>
                {filteredProperties.length}
              </span>
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
                <p>Не знайдено об'єктів за обраними критеріями</p>
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
                      <span className={`mls-card-tag ${prop.transaction === 'rent' ? 'tag-rent' : 'tag-buy'}`}>
                        {prop.transaction === 'rent' ? 'Оренда' : 'Купівля'}
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
          height: calc(100vh - 86px);
          min-height: 550px;
          background: #f8fafc;
          overflow: hidden;
        }

        /* Top Filter Bar (Solidly on top of map) */
        .map-page-filter-bar {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 4px 18px rgba(15, 23, 42, 0.08);
          position: relative;
          z-index: 1000;
          padding: 8px 0 4px;
          width: 100%;
          flex-shrink: 0;
        }

        .map-filter-inner-fluid {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          padding: 0 24px;
          width: 100%;
          box-sizing: border-box;
        }

        /* Primary Mode Switcher */
        .map-mode-toggle-group {
          display: flex;
          background: #e2e8f0;
          padding: 3px;
          border-radius: var(--radius-md);
          gap: 2px;
        }

        .mmt-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          font-size: 0.82rem;
          font-weight: 800;
          color: #475569;
          border-radius: 6px;
          transition: all 0.15s ease;
        }

        .mmt-btn.active.rent {
          background: #6d28d9;
          color: #ffffff;
          box-shadow: var(--shadow-sm);
        }

        .mmt-btn.active.buy {
          background: #1e3a8a;
          color: #ffffff;
          box-shadow: var(--shadow-sm);
        }

        .mmt-badge {
          background: rgba(0, 0, 0, 0.15);
          font-size: 0.7rem;
          padding: 1px 6px;
          border-radius: 10px;
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
          border-color: #1e3a8a;
          background: #ffffff;
        }

        /* Price Filter Range Box */
        .mf-price-container {
          display: flex;
          align-items: center;
          background: #f1f5f9;
          border: 1px solid var(--c-border);
          border-radius: var(--radius-sm);
          overflow: hidden;
          padding-left: 8px;
        }

        .mf-price-label {
          font-size: 0.76rem;
          font-weight: 700;
          color: #64748b;
          margin-right: 4px;
        }

        .mf-price-input {
          width: 65px;
          padding: 6px 4px;
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
          background: #1e293b;
          transition: background-color 0.2s;
        }

        .mf-curr-btn:hover {
          background: #0f172a;
        }

        /* Quick Price Range Chips Row */
        .mf-quick-prices-fluid {
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
          padding: 3px 10px;
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
          border-color: #1e293b;
          color: #1e293b;
          background: #ffffff;
        }

        .mf-qp-chip.active {
          background: #1e293b;
          color: #ffffff;
          border-color: #1e293b;
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

        .mls-counter.rent-badge {
          background: #6d28d9;
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 1px 7px;
          border-radius: 12px;
        }

        .mls-counter.buy-badge {
          background: #1e3a8a;
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
          border-color: #2563eb;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
          transform: translateY(-2px);
        }

        .mls-card.selected {
          background: #eff6ff;
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
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .mls-card-tag.tag-rent {
          background: #6d28d9;
        }

        .mls-card-tag.tag-buy {
          background: #1e3a8a;
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
          color: #1e3a8a;
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
          align-items: center;
          gap: 8px;
          font-size: 0.74rem;
          font-weight: 700;
          color: #475569;
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
          background: #1e3a8a;
          border: none;
        }

        .mls-book-btn:hover {
          background: #1e40af;
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
            height: calc(100vh - 94px - 68px);
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
            color: #1e3a8a;
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
