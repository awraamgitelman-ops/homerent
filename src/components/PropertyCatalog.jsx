import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutGrid, 
  Map as MapIcon, 
  Columns, 
  ArrowUpDown, 
  Filter, 
  Building,
  Sparkles
} from 'lucide-react';
import { PropertyCard } from './PropertyCard';
import { PropertyMap } from './PropertyMap';

export const PropertyCatalog = ({ 
  properties, 
  filters, 
  onSelectProperty, 
  onBookViewing,
  initialViewMode = 'split'
}) => {
  const [viewMode, setViewMode] = useState(initialViewMode); // 'grid' | 'split' | 'map'
  const [sortBy, setSortBy] = useState('default');
  const [currency, setCurrency] = useState(filters?.currency || 'USD');
  const [quickFilter, setQuickFilter] = useState('all');

  useEffect(() => {
    if (initialViewMode) {
      setViewMode(initialViewMode);
    }
  }, [initialViewMode]);

  // Filter and Sort Logic
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // Type Filter
      if (filters?.type && filters.type !== 'all' && p.type !== filters.type) return false;
      // Transaction Filter
      if (filters?.transaction && filters.transaction !== 'all' && p.transaction !== filters.transaction) return false;
      // District Filter
      if (filters?.district && filters.district !== 'all' && p.district !== filters.district) return false;
      // Rooms Filter
      if (filters?.rooms && filters.rooms !== 'all') {
        if (filters.rooms === '4+' && p.rooms < 4) return false;
        if (filters.rooms !== '4+' && filters.rooms !== 'studio' && String(p.rooms) !== filters.rooms) return false;
      }
      // Price Range Filter
      if (filters?.priceMin && (currency === 'USD' ? p.priceUSD : p.priceUAH) < filters.priceMin) return false;
      if (filters?.priceMax && (currency === 'USD' ? p.priceUSD : p.priceUAH) > filters.priceMax) return false;
      // Area Range Filter
      if (filters?.areaMin && p.area < filters.areaMin) return false;
      if (filters?.areaMax && p.area > filters.areaMax) return false;
      // єОселя Checkbox
      if (filters?.isEoselyaOnly && !p.badges.some(b => b.includes('єОселя'))) return false;

      // Quick Filter Chips
      if (quickFilter === '1' && p.rooms !== 1) return false;
      if (quickFilter === '2' && p.rooms !== 2) return false;
      if (quickFilter === '3' && p.rooms !== 3) return false;
      if (quickFilter === 'house' && p.type !== 'house') return false;
      if (quickFilter === 'rent' && p.transaction !== 'rent') return false;
      if (quickFilter === 'eoselya' && !p.badges.some(b => b.includes('єОселя'))) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return (currency === 'USD' ? a.priceUSD - b.priceUSD : a.priceUAH - b.priceUAH);
      if (sortBy === 'price-desc') return (currency === 'USD' ? b.priceUSD - a.priceUSD : b.priceUAH - a.priceUAH);
      if (sortBy === 'area-asc') return a.area - b.area;
      if (sortBy === 'area-desc') return b.area - a.area;
      return 0;
    });
  }, [properties, filters, sortBy, currency, quickFilter]);

  return (
    <section className="catalog-section" id="catalog">
      <div className="container">
        {/* Catalog Control Header */}
        <div className="catalog-header-bar">
          <div className="chb-left">
            <h2 className="catalog-title">
              Каталог нерухомості Полтави
            </h2>
            <span className="catalog-count-badge">
              Знайдено {filteredProperties.length} об'єктів
            </span>
          </div>

          <div className="chb-right">
            {/* Currency Switch */}
            <div className="catalog-curr-toggle">
              <button 
                type="button" 
                className={`cct-btn ${currency === 'USD' ? 'active' : ''}`}
                onClick={() => setCurrency('USD')}
              >
                USD ($)
              </button>
              <button 
                type="button" 
                className={`cct-btn ${currency === 'UAH' ? 'active' : ''}`}
                onClick={() => setCurrency('UAH')}
              >
                UAH (грн)
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="catalog-sort-box">
              <ArrowUpDown size={14} className="text-muted" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="catalog-sort-select"
              >
                <option value="default">Сортування: За замовчуванням</option>
                <option value="price-asc">Ціна: від дешевих до дорогих</option>
                <option value="price-desc">Ціна: від дорогих до дешевих</option>
                <option value="area-desc">Площа: від більшої</option>
                <option value="area-asc">Площа: від меншої</option>
              </select>
            </div>

            {/* View Mode Switches (Desktop & Tablet) */}
            <div className="view-mode-toggle">
              <button
                type="button"
                className={`vmt-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Сітка карток"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                className={`vmt-btn ${viewMode === 'split' ? 'active' : ''}`}
                onClick={() => setViewMode('split')}
                title="Спліт (Картки + Карта)"
              >
                <Columns size={16} />
              </button>
              <button
                type="button"
                className={`vmt-btn ${viewMode === 'map' ? 'active' : ''}`}
                onClick={() => setViewMode('map')}
                title="Тільки Карта Google"
              >
                <MapIcon size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Filter Chips */}
        <div className="quick-filter-chips">
          <button 
            type="button" 
            className={`qfc-btn ${quickFilter === 'all' ? 'active' : ''}`}
            onClick={() => setQuickFilter('all')}
          >
            Всі об'єкти
          </button>
          <button 
            type="button" 
            className={`qfc-btn ${quickFilter === '1' ? 'active' : ''}`}
            onClick={() => setQuickFilter('1')}
          >
            1-кімнатні
          </button>
          <button 
            type="button" 
            className={`qfc-btn ${quickFilter === '2' ? 'active' : ''}`}
            onClick={() => setQuickFilter('2')}
          >
            2-кімнатні
          </button>
          <button 
            type="button" 
            className={`qfc-btn ${quickFilter === '3' ? 'active' : ''}`}
            onClick={() => setQuickFilter('3')}
          >
            3-кімнатні
          </button>
          <button 
            type="button" 
            className={`qfc-btn ${quickFilter === 'house' ? 'active' : ''}`}
            onClick={() => setQuickFilter('house')}
          >
            Будинки та котеджі
          </button>
          <button 
            type="button" 
            className={`qfc-btn ${quickFilter === 'rent' ? 'active' : ''}`}
            onClick={() => setQuickFilter('rent')}
          >
            Оренда
          </button>
          <button 
            type="button" 
            className={`qfc-btn qfc-eoselya ${quickFilter === 'eoselya' ? 'active' : ''}`}
            onClick={() => setQuickFilter('eoselya')}
          >
            <Sparkles size={13} />
            <span>єОселя 3%/7%</span>
          </button>
        </div>

        {/* Main Display Layout */}
        {filteredProperties.length === 0 ? (
          <div className="catalog-empty-state">
            <Building size={48} className="text-muted mb-3" />
            <h3>За вашим запитом об'єктів не знайдено</h3>
            <p>Спробуйте розширити діапазон цін або обрати інший район Полтави.</p>
          </div>
        ) : (
          <div className={`catalog-layout-container mode-${viewMode}`}>
            {/* Cards Column */}
            {(viewMode === 'grid' || viewMode === 'split') && (
              <div className={`properties-grid-box ${viewMode === 'split' ? 'split-cards' : 'full-grid'}`}>
                {filteredProperties.map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    currency={currency}
                    onSelect={onSelectProperty}
                    onBookViewing={onBookViewing}
                  />
                ))}
              </div>
            )}

            {/* Map Column */}
            {(viewMode === 'split' || viewMode === 'map') && (
              <div className={`properties-map-box ${viewMode === 'split' ? 'split-map' : 'full-map'}`}>
                <PropertyMap
                  properties={filteredProperties}
                  currency={currency}
                  onSelectProperty={onSelectProperty}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scoped Styles for PropertyCatalog */}
      <style>{`
        .catalog-section {
          padding: 40px 0 60px;
          background: #f8fafc;
        }

        .catalog-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--c-border);
        }

        .chb-left {
          display: flex;
          align-items: baseline;
          gap: 12px;
        }

        .catalog-title {
          font-size: 1.5rem;
          font-weight: 900;
          color: var(--c-slate);
        }

        .catalog-count-badge {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--c-muted);
          background: #e2e8f0;
          padding: 3px 10px;
          border-radius: var(--radius-full);
        }

        .chb-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .catalog-curr-toggle {
          display: flex;
          background: #e2e8f0;
          padding: 2px;
          border-radius: var(--radius-sm);
        }

        .cct-btn {
          padding: 5px 10px;
          font-size: 0.78rem;
          font-weight: 700;
          color: #475569;
          border-radius: 6px;
        }

        .cct-btn.active {
          background: #ffffff;
          color: #b91c1c;
          box-shadow: var(--shadow-sm);
        }

        .catalog-sort-box {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          border: 1px solid var(--c-border);
          border-radius: var(--radius-sm);
          padding: 4px 10px;
        }

        .catalog-sort-select {
          border: none;
          background: transparent;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--c-slate);
          outline: none;
          cursor: pointer;
        }

        .view-mode-toggle {
          display: flex;
          background: #e2e8f0;
          padding: 2px;
          border-radius: var(--radius-sm);
        }

        .vmt-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #475569;
          border-radius: 6px;
        }

        .vmt-btn.active {
          background: #ffffff;
          color: #b91c1c;
          box-shadow: var(--shadow-sm);
        }

        /* Quick Filter Chips */
        .quick-filter-chips {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 12px;
          margin-bottom: 24px;
        }

        .qfc-btn {
          padding: 6px 14px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #475569;
          background: #ffffff;
          border: 1px solid var(--c-border);
          border-radius: var(--radius-full);
          white-space: nowrap;
          transition: var(--transition);
        }

        .qfc-btn:hover {
          border-color: #b91c1c;
          color: #b91c1c;
        }

        .qfc-btn.active {
          background: #b91c1c;
          color: #ffffff;
          border-color: #b91c1c;
        }

        .qfc-btn.qfc-eoselya {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          border-color: #16a34a;
          color: #16a34a;
          background: #dcfce7;
        }

        .qfc-btn.qfc-eoselya.active {
          background: #16a34a;
          color: #ffffff;
        }

        /* Layout Grid and Split Modes */
        .catalog-layout-container.mode-grid .full-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .catalog-layout-container.mode-split {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 24px;
          align-items: start;
        }

        .split-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 18px;
          max-height: 850px;
          overflow-y: auto;
          padding-right: 6px;
        }

        .split-map {
          position: sticky;
          top: 90px;
          height: 850px;
        }

        .catalog-layout-container.mode-map .full-map {
          height: 720px;
        }

        .catalog-empty-state {
          text-align: center;
          padding: 60px 20px;
          background: #ffffff;
          border-radius: var(--radius-lg);
          border: 1px dashed var(--c-border);
        }

        @media (max-width: 1024px) {
          .catalog-layout-container.mode-split {
            grid-template-columns: 1fr;
          }
          .split-map {
            position: relative;
            top: 0;
            height: 400px;
          }
          .split-cards {
            max-height: none;
          }
        }

        @media (max-width: 640px) {
          .catalog-title {
            font-size: 1.25rem;
          }
          .catalog-layout-container.mode-grid .full-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};
