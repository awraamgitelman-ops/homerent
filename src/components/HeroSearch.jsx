import React, { useState, useMemo, useEffect } from 'react';
import { 
  Building2, 
  Home, 
  Trees, 
  Briefcase, 
  TrendingUp, 
  Search, 
  RotateCcw, 
  SlidersHorizontal,
  ChevronDown,
  MapPin,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { POLTAVA_DISTRICTS, PROPERTY_TYPES, TRANSACTION_TYPES, ROOM_OPTIONS } from '../data/poltavaDistricts';

export const HeroSearch = ({ onSearch, properties = [], totalCount = 1198, onOpenConsultModal }) => {
  const [selectedType, setSelectedType] = useState('apartment');
  const [transaction, setTransaction] = useState('rent');
  const [district, setDistrict] = useState('all');
  const [rooms, setRooms] = useState('all');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [currency, setCurrency] = useState('UAH');
  const [areaMin, setAreaMin] = useState('');
  const [areaMax, setAreaMax] = useState('');

  // Dynamically compute the exact count of matching properties
  const matchingCount = useMemo(() => {
    if (!properties || properties.length === 0) return totalCount;
    return properties.filter((p) => {
      // 1. Transaction
      if (p.transaction !== transaction) return false;

      // 2. Property Type
      if (selectedType !== 'all' && p.type !== selectedType) return false;

      // 3. District
      if (district !== 'all' && p.district !== district && p.districtId !== district) return false;

      // 4. Rooms
      if (rooms !== 'all') {
        if (rooms === '4+') {
          if (p.rooms < 4) return false;
        } else {
          if (String(p.rooms) !== String(rooms)) return false;
        }
      }

      // 5. Price
      const currentPrice = currency === 'USD' ? p.priceUSD : p.priceUAH;
      if (priceMin && currentPrice < Number(priceMin)) return false;
      if (priceMax && currentPrice > Number(priceMax)) return false;

      // 6. Area
      if (areaMin && p.area && p.area < Number(areaMin)) return false;
      if (areaMax && p.area && p.area > Number(areaMax)) return false;

      return true;
    }).length;
  }, [properties, selectedType, transaction, district, rooms, priceMin, priceMax, currency, areaMin, areaMax, totalCount]);

  const applySearch = (overrideParams = {}) => {
    const currentParams = {
      type: selectedType,
      transaction,
      district,
      rooms,
      priceMin: priceMin ? Number(priceMin) : '',
      priceMax: priceMax ? Number(priceMax) : '',
      currency,
      areaMin: areaMin ? Number(areaMin) : '',
      areaMax: areaMax ? Number(areaMax) : '',
      ...overrideParams
    };
    onSearch(currentParams);
  };

  const handleCategoryClick = (typeId) => {
    setSelectedType(typeId);
    applySearch({ type: typeId });
  };

  const handleTransactionChange = (tId) => {
    setTransaction(tId);
    const newCurr = tId === 'rent' ? 'UAH' : 'USD';
    setCurrency(newCurr);
    applySearch({ transaction: tId, currency: newCurr });
  };

  const handleDistrictChange = (dId) => {
    setDistrict(dId);
    applySearch({ district: dId });
  };

  const handleRoomsChange = (rId) => {
    setRooms(rId);
    applySearch({ rooms: rId });
  };

  const handleReset = () => {
    setSelectedType('apartment');
    setTransaction('rent');
    setDistrict('all');
    setRooms('all');
    setPriceMin('');
    setPriceMax('');
    setAreaMin('');
    setAreaMax('');
    setCurrency('UAH');
    onSearch({
      type: 'apartment',
      transaction: 'rent',
      district: 'all',
      rooms: 'all',
      priceMin: '',
      priceMax: '',
      currency: 'UAH',
      areaMin: '',
      areaMax: ''
    });
  };

  const handleApplySearch = (e) => {
    if (e) e.preventDefault();
    applySearch();
    const el = document.getElementById('catalog') || document.querySelector('.catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="hero-search-section">
      <div className="hero-bg-overlay"></div>
      
      <div className="container hero-content">
        {/* Main Headline */}
        <h1 className="hero-headline">
          <span className="hl-accent">ЗНАЙДИ</span> нерухомість у ПОЛТАВІ
        </h1>
        <p className="hero-subheadline">
          Купівля, продаж, оренда квартир, котеджів та комерційних площ.
        </p>

        {/* Hero Search Box */}
        <div className="hero-search-card">
          {/* Top Category Tabs */}
          <div className="hs-tabs-row">
            {PROPERTY_TYPES.map((pt) => {
              const isActive = selectedType === pt.id;
              return (
                <button
                  key={pt.id}
                  type="button"
                  className={`hs-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(pt.id)}
                >
                  {pt.id === 'apartment' && <Building2 size={16} />}
                  {pt.id === 'house' && <Home size={16} />}
                  {pt.id === 'commercial' && <Briefcase size={16} />}
                  <span>{pt.name}</span>
                </button>
              );
            })}
          </div>

          {/* Main Filter Inputs Bar */}
          <div className="hs-main-bar">
            {/* Transaction Type Segment */}
            <div className="hs-filter-item trans-toggle">
              <span className="fi-label">Угода</span>
              <div className="trans-btn-group">
                {TRANSACTION_TYPES.map((tt) => (
                  <button
                    key={tt.id}
                    type="button"
                    className={`trans-btn ${transaction === tt.id ? 'active' : ''}`}
                    onClick={() => handleTransactionChange(tt.id)}
                  >
                    {tt.name}
                  </button>
                ))}
              </div>
            </div>

            {/* District Selector */}
            <div className="hs-filter-item">
              <span className="fi-label">Район Полтави</span>
              <div className="select-wrapper">
                <select 
                  value={district} 
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="hs-select"
                >
                  {POLTAVA_DISTRICTS.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="select-arrow" />
              </div>
            </div>

            {/* Room Count Selector */}
            <div className="hs-filter-item">
              <span className="fi-label">Кімнат</span>
              <div className="select-wrapper">
                <select 
                  value={rooms} 
                  onChange={(e) => setRooms(e.target.value)}
                  className="hs-select"
                >
                  {ROOM_OPTIONS.map((r) => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="select-arrow" />
              </div>
            </div>

            {/* Price Range */}
            <div className="hs-filter-item price-item">
              <div className="fi-label-row">
                <span className="fi-label">Ціна</span>
                <div className="curr-switch">
                  <button 
                    type="button" 
                    className={`curr-btn ${currency === 'USD' ? 'active' : ''}`}
                    onClick={() => setCurrency('USD')}
                  >
                    $
                  </button>
                  <button 
                    type="button" 
                    className={`curr-btn ${currency === 'UAH' ? 'active' : ''}`}
                    onClick={() => setCurrency('UAH')}
                  >
                    грн
                  </button>
                </div>
              </div>
              <div className="range-inputs-row">
                <input 
                  type="number" 
                  placeholder="від" 
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="hs-input-compact"
                />
                <span className="range-sep">—</span>
                <input 
                  type="number" 
                  placeholder="до" 
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="hs-input-compact"
                />
              </div>
            </div>

            {/* Area Range */}
            <div className="hs-filter-item area-item">
              <span className="fi-label">Площа, м²</span>
              <div className="range-inputs-row">
                <input 
                  type="number" 
                  placeholder="від" 
                  value={areaMin}
                  onChange={(e) => setAreaMin(e.target.value)}
                  className="hs-input-compact"
                />
                <span className="range-sep">—</span>
                <input 
                  type="number" 
                  placeholder="до" 
                  value={areaMax}
                  onChange={(e) => setAreaMax(e.target.value)}
                  className="hs-input-compact"
                />
              </div>
            </div>
          </div>

          {/* Bottom Controls Row */}
          <div className="hs-bottom-row">
            <div className="hs-bottom-left">
              <span className="hs-verified-note">✓ Всі {matchingCount} об'єктів перевірені експертами агентства</span>
            </div>

            <div className="hs-bottom-actions">
              <button 
                type="button" 
                onClick={handleReset}
                className="btn btn-outline btn-sm hs-reset-btn"
              >
                <RotateCcw size={14} />
                <span>Очистити</span>
              </button>

              <button 
                type="button" 
                onClick={handleApplySearch}
                className="btn btn-accent btn-sm hs-search-btn"
              >
                <Search size={16} />
                <span>Знайти об'єкти ({matchingCount})</span>
              </button>
            </div>
          </div>
        </div>

        {/* CTA Hero Button */}
        <div className="hero-cta-center">
          <button 
            onClick={onOpenConsultModal}
            className="btn btn-primary hero-cta-btn"
          >
            <span>Отримати індивідуальний підбір об'єктів від рієлтора</span>
          </button>
        </div>
      </div>

      {/* Scoped Styles for HeroSearch */}
      <style>{`
        .hero-search-section {
          position: relative;
          background: linear-gradient(135deg, #3b0764 0%, #581c87 30%, #6d28d9 70%, #7c3aed 100%);
          color: #ffffff;
          padding: 48px 0 56px;
          overflow: hidden;
        }

        .hero-bg-overlay {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
          background-size: 24px 24px;
          opacity: 0.6;
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 10;
          text-align: center;
        }

        .hero-headline {
          font-size: 2.75rem;
          font-weight: 900;
          color: #ffffff;
          letter-spacing: -0.5px;
          margin-top: 0;
          margin-bottom: 14px;
          line-height: 1.15;
        }

        .hl-accent {
          background: #2563eb;
          color: #ffffff;
          padding: 2px 14px;
          border-radius: var(--radius-sm);
          display: inline-block;
          margin-right: 8px;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
        }

        .hero-subheadline {
          font-size: 1.05rem;
          color: #cbd5e1;
          max-width: 760px;
          margin: 0 auto 28px;
          line-height: 1.5;
        }

        /* Search Card */
        .hero-search-card {
          background: #ffffff;
          border-radius: var(--radius-lg);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
          overflow: hidden;
          text-align: left;
          color: var(--c-dark);
          max-width: 1140px;
          margin: 0 auto;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* Category Tabs */
        .hs-tabs-row {
          display: flex;
          background: #f1f5f9;
          border-bottom: 1px solid #e2e8f0;
          overflow-x: auto;
        }

        .hs-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 20px;
          font-size: 0.9rem;
          font-weight: 700;
          color: #475569;
          background: transparent;
          border-right: 1px solid #e2e8f0;
          white-space: nowrap;
          transition: var(--transition);
        }

        .hs-tab-btn:hover {
          background: #e2e8f0;
          color: var(--c-dark);
        }

        .hs-tab-btn.active {
          background: #ffffff;
          color: var(--c-primary);
          border-bottom: 2px solid var(--c-primary);
        }

        .hs-tab-btn.tab-invest {
          background: #1e3a8a;
          color: #ffffff;
        }

        .hs-tab-btn.tab-invest:hover {
          background: #1e40af;
        }

        .hs-tab-btn.tab-invest.active {
          background: #2563eb;
          color: #ffffff;
        }

        /* Main Filter Bar */
        .hs-main-bar {
          padding: 18px 20px;
          display: grid;
          grid-template-columns: 1.2fr 1.6fr 1fr 1.4fr 1.1fr;
          gap: 14px;
          align-items: flex-end;
          background: #ffffff;
        }

        .hs-filter-item {
          display: flex;
          flex-direction: column;
        }

        .fi-label {
          font-size: 0.76rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          margin-bottom: 6px;
          letter-spacing: 0.3px;
        }

        .fi-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .curr-switch {
          display: flex;
          gap: 2px;
          background: #f1f5f9;
          border-radius: 4px;
          padding: 2px;
        }

        .curr-btn {
          font-size: 0.72rem;
          font-weight: 800;
          padding: 1px 6px;
          border-radius: 3px;
          color: #64748b;
        }

        .curr-btn.active {
          background: #ffffff;
          color: var(--c-primary);
          box-shadow: var(--shadow-sm);
        }

        .select-wrapper {
          position: relative;
        }

        .hs-select {
          width: 100%;
          padding: 9px 30px 9px 12px;
          font-size: 0.88rem;
          font-weight: 600;
          color: #1e293b;
          background: #f8fafc;
          border: 1px solid var(--c-border);
          border-radius: var(--radius-sm);
          appearance: none;
          outline: none;
          cursor: pointer;
        }

        .hs-select:focus {
          border-color: var(--c-primary);
          background: #ffffff;
        }

        .select-arrow {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #64748b;
        }

        .trans-btn-group {
          display: flex;
          background: #f1f5f9;
          padding: 3px;
          border-radius: var(--radius-sm);
        }

        .trans-btn {
          flex: 1;
          padding: 7px 8px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #64748b;
          border-radius: 5px;
          white-space: nowrap;
        }

        .trans-btn.active {
          background: #ffffff;
          color: var(--c-primary);
          box-shadow: var(--shadow-sm);
        }

        .range-inputs-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .hs-input-compact {
          width: 100%;
          padding: 9px 8px;
          font-size: 0.85rem;
          font-weight: 600;
          background: #f8fafc;
          border: 1px solid var(--c-border);
          border-radius: var(--radius-sm);
          outline: none;
        }

        .hs-input-compact:focus {
          border-color: var(--c-primary);
          background: #ffffff;
        }

        .range-sep {
          color: #94a3b8;
          font-weight: 700;
        }

        /* Bottom Row */
        .hs-bottom-row {
          padding: 12px 20px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .hs-checkbox-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 0.88rem;
          color: #334155;
          user-select: none;
        }

        .hs-checkbox-label input {
          width: 16px;
          height: 16px;
          accent-color: var(--c-green);
          cursor: pointer;
        }

        .hs-bottom-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .hs-reset-btn {
          font-weight: 600;
          color: #64748b;
        }

        .hs-search-btn {
          padding: 10px 22px;
          font-size: 0.92rem;
        }

        .hero-cta-center {
          margin-top: 28px;
        }

        .hero-cta-btn {
          background: #1e3a8a;
          color: #ffffff;
          padding: 14px 28px;
          font-size: 1rem;
          font-weight: 800;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(30, 58, 138, 0.35);
          border: none;
          transition: all 0.2s ease;
        }

        .hero-cta-btn:hover {
          background: #1e40af;
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(30, 58, 138, 0.45);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .hs-main-bar {
            grid-template-columns: repeat(2, 1fr);
          }
          .hero-headline {
            font-size: 2.2rem;
          }
        }

        @media (max-width: 640px) {
          .hero-search-section {
            padding: 36px 0 45px;
          }
          .hero-headline {
            font-size: 1.65rem;
          }
          .hero-subheadline {
            font-size: 0.88rem;
            margin-bottom: 20px;
          }
          .hs-tabs-row {
            padding: 4px;
          }
          .hs-tab-btn {
            padding: 10px 14px;
            font-size: 0.8rem;
          }
          .hs-main-bar {
            grid-template-columns: 1fr;
            padding: 14px;
            gap: 12px;
          }
          .hs-bottom-row {
            flex-direction: column;
            align-items: stretch;
            padding: 14px;
          }
          .hs-bottom-actions {
            width: 100%;
          }
          .hs-bottom-actions button {
            flex: 1;
          }
          .hero-cta-btn {
            width: 100%;
            font-size: 0.88rem;
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};
