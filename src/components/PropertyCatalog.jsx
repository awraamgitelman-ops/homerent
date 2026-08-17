import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  LayoutGrid, 
  Map as MapIcon, 
  Columns, 
  ArrowUpDown, 
  Building, 
  RotateCcw, 
  Key, 
  Home, 
  Building2, 
  Briefcase, 
  MapPin, 
  ChevronDown, 
  Check,
  Plus
} from 'lucide-react';
import { PropertyCard } from './PropertyCard';
import { PropertyMap } from './PropertyMap';
import { POLTAVA_DISTRICTS } from '../data/poltavaDistricts';

export const PropertyCatalog = ({ 
  properties, 
  filters, 
  onSelectProperty, 
  onBookViewing,
  initialViewMode = 'split'
}) => {
  const [viewMode, setViewMode] = useState(initialViewMode); // 'grid' | 'split' | 'map'
  const [activeTransaction, setActiveTransaction] = useState(filters?.transaction && filters.transaction !== 'all' ? filters.transaction : 'rent'); // 'rent' | 'buy'
  const [selectedCategory, setSelectedCategory] = useState(filters?.type && filters.type !== 'all' ? filters.type : 'apartment'); // 'apartment' | 'house' | 'commercial'
  const [subFilter, setSubFilter] = useState('all'); // Sub-filter within the category
  const [selectedDistrict, setSelectedDistrict] = useState(filters?.district || 'all');
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
  const districtDropdownRef = useRef(null);

  const [sortBy, setSortBy] = useState('default');
  const [currency, setCurrency] = useState(activeTransaction === 'rent' ? 'UAH' : 'USD');
  const [priceMin, setPriceMin] = useState(filters?.priceMin || '');
  const [priceMax, setPriceMax] = useState(filters?.priceMax || '');
  const [recLimit, setRecLimit] = useState(6);

  useEffect(() => {
    if (initialViewMode) {
      setViewMode(initialViewMode);
    }
  }, [initialViewMode]);

  // Synchronize when filters prop is updated from HeroSearch
  useEffect(() => {
    if (filters) {
      if (filters.transaction && filters.transaction !== 'all') {
        setActiveTransaction(filters.transaction);
        setCurrency(filters.transaction === 'rent' ? 'UAH' : 'USD');
      }
      if (filters.type && filters.type !== 'all') {
        setSelectedCategory(filters.type);
      }
      if (filters.district) {
        setSelectedDistrict(filters.district);
      }
      if (filters.rooms && filters.rooms !== 'all') {
        setSubFilter(filters.rooms);
      } else if (filters.rooms === 'all') {
        setSubFilter('all');
      }
      if (filters.priceMin !== undefined) {
        setPriceMin(filters.priceMin);
      }
      if (filters.priceMax !== undefined) {
        setPriceMax(filters.priceMax);
      }
    }
  }, [filters]);

  // Click outside to close custom district dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (districtDropdownRef.current && !districtDropdownRef.current.contains(e.target)) {
        setIsDistrictDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Switch between Rent & Buy
  const handleSwitchTab = (tab) => {
    setActiveTransaction(tab);
    setCurrency(tab === 'rent' ? 'UAH' : 'USD');
    setSubFilter('all');
    setPriceMin('');
    setPriceMax('');
    setRecLimit(6);
  };

  // Switch category (Apartments / Houses / Commercial)
  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setSubFilter('all');
    setRecLimit(6);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSubFilter('all');
    setSelectedDistrict('all');
    setPriceMin('');
    setPriceMax('');
    setSortBy('default');
    setRecLimit(6);
  };

  // Dynamic live counts for current transaction
  const currentTransProps = useMemo(() => {
    return properties.filter(p => p.transaction === activeTransaction);
  }, [properties, activeTransaction]);

  const aptCount = useMemo(() => {
    return currentTransProps.filter(p => p.type === 'apartment').length;
  }, [currentTransProps]);

  const houseCount = useMemo(() => {
    return currentTransProps.filter(p => p.type === 'house').length;
  }, [currentTransProps]);

  const commCount = useMemo(() => {
    return currentTransProps.filter(p => p.type === 'commercial').length;
  }, [currentTransProps]);

  const rentTotal = properties.filter(p => p.transaction === 'rent').length;
  const buyTotal = properties.filter(p => p.transaction === 'buy').length;

  // Current district object for display
  const currentDistrictObj = useMemo(() => {
    return POLTAVA_DISTRICTS.find(d => d.id === selectedDistrict) || POLTAVA_DISTRICTS[0];
  }, [selectedDistrict]);

  // Strict Filter & Sort Logic
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // 1. Strict Transaction (rent vs buy)
      if (p.transaction !== activeTransaction) return false;

      // 2. Strict Concrete Category (No "all objects" mode)
      if (p.type !== selectedCategory) return false;

      // 3. District Filter
      if (selectedDistrict !== 'all' && p.district !== selectedDistrict) return false;

      // 4. Price Range Filter
      const currentPrice = currency === 'USD' ? p.priceUSD : p.priceUAH;
      if (priceMin && currentPrice < Number(priceMin)) return false;
      if (priceMax && currentPrice > Number(priceMax)) return false;

      // 5. Tailored Category-Specific Sub-filters
      if (selectedCategory === 'apartment') {
        if (subFilter === '1' && p.rooms !== 1) return false;
        if (subFilter === '2' && p.rooms !== 2) return false;
        if (subFilter === '3' && p.rooms !== 3) return false;
        if (subFilter === '4+' && p.rooms < 4) return false;
        if (subFilter === 'newbuild' && !p.badges.some(b => b.includes('Новобудова')) && !p.description.toLowerCase().includes('новобудов')) return false;
        if (subFilter === 'renovated' && !p.badges.some(b => b.includes('Євроремонт')) && !p.description.toLowerCase().includes('євроремонт') && !p.description.toLowerCase().includes('ремонт')) return false;
        if (subFilter === 'autonomous' && !p.badges.some(b => b.includes('Автономне')) && !p.description.toLowerCase().includes('автономн') && !p.description.toLowerCase().includes('індивідуальн')) return false;
      }

      if (selectedCategory === 'house') {
        if (subFilter === 'under100' && p.area >= 100) return false;
        if (subFilter === '100-200' && (p.area < 100 || p.area > 200)) return false;
        if (subFilter === '200+' && p.area <= 200) return false;
        if (subFilter === 'cottage' && !p.title.toLowerCase().includes('котедж') && !p.title.toLowerCase().includes('таунхаус') && !p.description.toLowerCase().includes('котедж') && !p.description.toLowerCase().includes('таунхаус')) return false;
        if (subFilter === 'renovated' && !p.badges.some(b => b.includes('Євроремонт')) && !p.description.toLowerCase().includes('євроремонт') && !p.description.toLowerCase().includes('ремонт')) return false;
        if (subFilter === 'autonomous' && !p.badges.some(b => b.includes('Автономне')) && !p.description.toLowerCase().includes('автономн') && !p.description.toLowerCase().includes('котел')) return false;
      }

      if (selectedCategory === 'commercial') {
        const text = (p.title + ' ' + p.description).toLowerCase();
        if (subFilter === 'office' && !text.includes('офіс') && !text.includes('кабінет')) return false;
        if (subFilter === 'retail' && !text.includes('торгов') && !text.includes('магазин') && !text.includes('салон') && !text.includes('кафе')) return false;
        if (subFilter === 'warehouse' && !text.includes('склад') && !text.includes('виробництв') && !text.includes('бокс') && !text.includes('ангар')) return false;
        if (subFilter === 'facade' && !text.includes('фасад') && !text.includes('червона лінія') && !text.includes('центр')) return false;
        if (subFilter === 'under100' && p.area >= 100) return false;
        if (subFilter === '100+' && p.area < 100) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return (currency === 'USD' ? a.priceUSD - b.priceUSD : a.priceUAH - b.priceUAH);
      if (sortBy === 'price-desc') return (currency === 'USD' ? b.priceUSD - a.priceUSD : b.priceUAH - a.priceUAH);
      if (sortBy === 'area-asc') return a.area - b.area;
      if (sortBy === 'area-desc') return b.area - a.area;
      return 0;
    });
  }, [properties, activeTransaction, selectedCategory, selectedDistrict, subFilter, sortBy, currency, priceMin, priceMax]);

  // Total available recommendations pool (excluding already filtered IDs)
  const fullRecommendationsPool = useMemo(() => {
    const filteredIds = new Set(filteredProperties.map(p => p.id));
    
    // 1. Try properties from the same transaction and category not already shown
    let pool = properties.filter(p => p.transaction === activeTransaction && p.type === selectedCategory && !filteredIds.has(p.id));
    
    // 2. If pool is small, take from same transaction
    if (pool.length < 18) {
      const more = properties.filter(p => p.transaction === activeTransaction && !filteredIds.has(p.id) && !pool.some(x => x.id === p.id));
      pool = [...pool, ...more];
    }
    
    return pool;
  }, [filteredProperties, properties, activeTransaction, selectedCategory]);

  // Sliced recommendations according to recLimit
  const recommendedProperties = useMemo(() => {
    return fullRecommendationsPool.slice(0, recLimit);
  }, [fullRecommendationsPool, recLimit]);

  // Section title formatter
  const getSectionTitle = () => {
    const action = activeTransaction === 'rent' ? 'Оренда' : 'Продаж';
    if (selectedCategory === 'apartment') return `${action} квартир у Полтаві`;
    if (selectedCategory === 'house') return `${action} будинків та котеджів у Полтаві`;
    if (selectedCategory === 'commercial') return `${action} комерційної нерухомості у Полтаві`;
    return `${action} нерухомості у Полтаві`;
  };

  return (
    <section className="catalog-section" id="catalog">
      <div className="container">
        {/* 1. Main Mode Switcher: Купівля vs Оренда */}
        <div className="catalog-main-tabs">
          <button 
            type="button" 
            className={`cmt-tab ${activeTransaction === 'buy' ? 'active buy' : ''}`}
            onClick={() => handleSwitchTab('buy')}
          >
            <Home size={18} />
            <span>Купівля (Продаж)</span>
            <span className="cmt-count">{buyTotal}</span>
          </button>

          <button 
            type="button" 
            className={`cmt-tab ${activeTransaction === 'rent' ? 'active rent' : ''}`}
            onClick={() => handleSwitchTab('rent')}
          >
            <Key size={18} />
            <span>Оренда нерухомості</span>
            <span className="cmt-count">{rentTotal}</span>
          </button>
        </div>

        {/* 2. Concrete Category Selector (Квартири, Будинки, Комерція) */}
        <div className="catalog-category-selector">
          <button
            type="button"
            className={`cat-tab-btn ${selectedCategory === 'apartment' ? 'active' : ''}`}
            onClick={() => handleSelectCategory('apartment')}
          >
            <Building2 size={18} />
            <span>Квартири</span>
            <span className="cat-badge">{aptCount}</span>
          </button>

          <button
            type="button"
            className={`cat-tab-btn ${selectedCategory === 'house' ? 'active' : ''}`}
            onClick={() => handleSelectCategory('house')}
          >
            <Home size={18} />
            <span>Будинки та котеджі</span>
            <span className="cat-badge">{houseCount}</span>
          </button>

          <button
            type="button"
            className={`cat-tab-btn ${selectedCategory === 'commercial' ? 'active' : ''}`}
            onClick={() => handleSelectCategory('commercial')}
          >
            <Briefcase size={18} />
            <span>Комерційна нерухомість</span>
            <span className="cat-badge">{commCount}</span>
          </button>
        </div>

        {/* 3. Catalog Control Header & Fast Filter Options */}
        <div className="catalog-header-bar">
          <div className="chb-left">
            <h2 className="catalog-title">{getSectionTitle()}</h2>
            <span className="catalog-count-badge">
              Знайдено {filteredProperties.length} об'єктів
            </span>
          </div>

          <div className="chb-right">
            {/* Custom Modern District Dropdown */}
            <div className="custom-district-dropdown-container" ref={districtDropdownRef}>
              <button
                type="button"
                className={`cdd-trigger-btn ${isDistrictDropdownOpen ? 'open' : ''}`}
                onClick={() => setIsDistrictDropdownOpen(!isDistrictDropdownOpen)}
                title="Обрати район Полтави"
              >
                <MapPin size={15} className="cdd-pin-icon" />
                <span className="cdd-selected-name">
                  {selectedDistrict === 'all' ? 'Всі райони Полтави' : currentDistrictObj.name.split(' (')[0]}
                </span>
                <ChevronDown size={14} className={`cdd-arrow ${isDistrictDropdownOpen ? 'rotated' : ''}`} />
              </button>

              {isDistrictDropdownOpen && (
                <div className="cdd-menu-card">
                  <div className="cdd-menu-header">
                    <span>Райони міста Полтава</span>
                  </div>
                  <div className="cdd-options-list">
                    {POLTAVA_DISTRICTS.map((d) => {
                      const isSelected = selectedDistrict === d.id;
                      return (
                        <button
                          key={d.id}
                          type="button"
                          className={`cdd-option-item ${isSelected ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedDistrict(d.id);
                            setIsDistrictDropdownOpen(false);
                          }}
                        >
                          <div className="cdd-opt-text">
                            <span className="cdd-opt-title">{d.name}</span>
                            {d.area && <span className="cdd-opt-sub">{d.area} район</span>}
                          </div>
                          {isSelected && <Check size={15} className="cdd-check-icon" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Price Filter Box */}
            <div className="catalog-price-filter-box">
              <span className="cpf-label">Ціна:</span>
              <input
                type="number"
                placeholder="від"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="cpf-input"
              />
              <span className="cpf-dash">—</span>
              <input
                type="number"
                placeholder="до"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="cpf-input"
              />
              {(priceMin || priceMax) && (
                <button
                  type="button"
                  className="cpf-clear"
                  onClick={() => { setPriceMin(''); setPriceMax(''); }}
                  title="Очистити ціну"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Currency Switch */}
            <div className="catalog-curr-toggle">
              <button 
                type="button" 
                className={`cct-btn ${currency === 'UAH' ? 'active' : ''}`}
                onClick={() => setCurrency('UAH')}
              >
                UAH (грн)
              </button>
              <button 
                type="button" 
                className={`cct-btn ${currency === 'USD' ? 'active' : ''}`}
                onClick={() => setCurrency('USD')}
              >
                USD ($)
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
                <option value="price-asc">Ціна: від дешевих</option>
                <option value="price-desc">Ціна: від дорогих</option>
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

        {/* 4. Tailored Sub-Filter Chips for the Selected Category */}
        <div className="category-subfilters-bar">
          {/* APARTMENT SUB-FILTERS */}
          {selectedCategory === 'apartment' && (
            <div className="subfilters-chips-scroll">
              <button
                type="button"
                className={`sfc-btn ${subFilter === 'all' ? 'active' : ''}`}
                onClick={() => setSubFilter('all')}
              >
                Всі квартири
              </button>
              <button
                type="button"
                className={`sfc-btn ${subFilter === '1' ? 'active' : ''}`}
                onClick={() => setSubFilter('1')}
              >
                1-кімнатні
              </button>
              <button
                type="button"
                className={`sfc-btn ${subFilter === '2' ? 'active' : ''}`}
                onClick={() => setSubFilter('2')}
              >
                2-кімнатні
              </button>
              <button
                type="button"
                className={`sfc-btn ${subFilter === '3' ? 'active' : ''}`}
                onClick={() => setSubFilter('3')}
              >
                3-кімнатні
              </button>
              <button
                type="button"
                className={`sfc-btn ${subFilter === '4+' ? 'active' : ''}`}
                onClick={() => setSubFilter('4+')}
              >
                4+ кімнатні
              </button>
              <button
                type="button"
                className={`sfc-btn ${subFilter === 'newbuild' ? 'active' : ''}`}
                onClick={() => setSubFilter('newbuild')}
              >
                Новобудови
              </button>
              <button
                type="button"
                className={`sfc-btn ${subFilter === 'renovated' ? 'active' : ''}`}
                onClick={() => setSubFilter('renovated')}
              >
                З євроремонтом
              </button>
              <button
                type="button"
                className={`sfc-btn ${subFilter === 'autonomous' ? 'active' : ''}`}
                onClick={() => setSubFilter('autonomous')}
              >
                Автономне опалення
              </button>
            </div>
          )}

          {/* HOUSE SUB-FILTERS */}
          {selectedCategory === 'house' && (
            <div className="subfilters-chips-scroll">
              <button
                type="button"
                className={`sfc-btn ${subFilter === 'all' ? 'active' : ''}`}
                onClick={() => setSubFilter('all')}
              >
                Всі будинки
              </button>
              <button
                type="button"
                className={`sfc-btn ${subFilter === 'under100' ? 'active' : ''}`}
                onClick={() => setSubFilter('under100')}
              >
                До 100 м²
              </button>
              <button
                type="button"
                className={`sfc-btn ${subFilter === '100-200' ? 'active' : ''}`}
                onClick={() => setSubFilter('100-200')}
              >
                100 — 200 м²
              </button>
              <button
                type="button"
                className={`sfc-btn ${subFilter === '200+' ? 'active' : ''}`}
                onClick={() => setSubFilter('200+')}
              >
                200+ м²
              </button>
              <button
                type="button"
                className={`sfc-btn ${subFilter === 'cottage' ? 'active' : ''}`}
                onClick={() => setSubFilter('cottage')}
              >
                Котеджі / Таунхауси
              </button>
              <button
                type="button"
                className={`sfc-btn ${subFilter === 'renovated' ? 'active' : ''}`}
                onClick={() => setSubFilter('renovated')}
              >
                З євроремонтом
              </button>
              <button
                type="button"
                className={`sfc-btn ${subFilter === 'autonomous' ? 'active' : ''}`}
                onClick={() => setSubFilter('autonomous')}
              >
                Автономне опалення
              </button>
            </div>
          )}

          {/* COMMERCIAL SUB-FILTERS */}
          {selectedCategory === 'commercial' && (
            <div className="subfilters-chips-scroll">
              <button
                type="button"
                className={`sfc-btn ${subFilter === 'all' ? 'active' : ''}`}
                onClick={() => setSubFilter('all')}
              >
                Вся комерція
              </button>
              <button
                type="button"
                className={`sfc-btn ${subFilter === 'office' ? 'active' : ''}`}
                onClick={() => setSubFilter('office')}
              >
                Офісні приміщення
              </button>
              <button
                type="button"
                className={`sfc-btn ${subFilter === 'retail' ? 'active' : ''}`}
                onClick={() => setSubFilter('retail')}
              >
                Торгові площі / Магазини
              </button>
              <button
                type="button"
                className={`sfc-btn ${subFilter === 'warehouse' ? 'active' : ''}`}
                onClick={() => setSubFilter('warehouse')}
              >
                Склади та виробництво
              </button>
              <button
                type="button"
                className={`sfc-btn ${subFilter === 'facade' ? 'active' : ''}`}
                onClick={() => setSubFilter('facade')}
              >
                Фасадні приміщення
              </button>
              <button
                type="button"
                className={`sfc-btn ${subFilter === 'under100' ? 'active' : ''}`}
                onClick={() => setSubFilter('under100')}
              >
                До 100 м²
              </button>
              <button
                type="button"
                className={`sfc-btn ${subFilter === '100+' ? 'active' : ''}`}
                onClick={() => setSubFilter('100+')}
              >
                100+ м²
              </button>
            </div>
          )}

          {/* Reset Filters Chip */}
          {(subFilter !== 'all' || selectedDistrict !== 'all' || priceMin || priceMax || sortBy !== 'default') && (
            <button
              type="button"
              className="sfc-reset-btn"
              onClick={handleResetFilters}
              title="Скинути фільтри"
            >
              <RotateCcw size={13} />
              <span>Скинути фільтри</span>
            </button>
          )}
        </div>

        {/* 5. Main Display Layout (Cards / Split Map) */}
        {filteredProperties.length === 0 ? (
          <div className="catalog-empty-wrapper">
            <div className="catalog-empty-state">
              <div className="ces-icon-circle">
                <Building size={32} className="text-muted" />
              </div>
              <h3 className="ces-title">За вашими параметрами точних збігів не знайдено</h3>
              <p className="ces-desc">
                Спробуйте розширити діапазон цін або обрати інший підфільтр. Нижче ми підібрали для вас найпопулярніші актуальні варіанти у Полтаві:
              </p>
              <button 
                onClick={handleResetFilters} 
                className="btn btn-sm btn-primary ces-reset-btn"
              >
                <RotateCcw size={14} />
                <span>Скинути фільтри пошуку</span>
              </button>
            </div>

            {/* Recommendations Block in 2 Columns */}
            {recommendedProperties.length > 0 && (
              <div className="catalog-recommended-block">
                <div className="crb-header">
                  <span className="crb-badge">Рекомендовані варіанти</span>
                  <h3 className="crb-title">Можливо, вам також підійдуть ці об'єкти у Полтаві:</h3>
                </div>
                <div className="recommended-grid-2col">
                  {recommendedProperties.map((prop) => (
                    <PropertyCard
                      key={`empty-rec-${prop.id}`}
                      property={prop}
                      currency={currency}
                      onSelect={onSelectProperty}
                      onBookViewing={onBookViewing}
                    />
                  ))}
                </div>

                {/* Show More Button */}
                {fullRecommendationsPool.length > recLimit && (
                  <div className="crb-more-center">
                    <button
                      type="button"
                      className="crb-more-btn"
                      onClick={() => setRecLimit(prev => prev + 6)}
                    >
                      <Plus size={16} />
                      <span>Показати ще варіанти ({fullRecommendationsPool.length - recLimit})</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className={`catalog-layout-container mode-${viewMode}`}>
              {/* Cards Column in 2-column format */}
              {(viewMode === 'grid' || viewMode === 'split') && (
                <div className={`properties-grid-box ${viewMode === 'split' ? 'split-cards' : 'full-grid-2col'}`}>
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
                    viewMode={viewMode}
                  />
                </div>
              )}
            </div>

            {/* Bottom Recommendations Block even when results were found (always 2 columns in a row) */}
            {recommendedProperties.length > 0 && viewMode !== 'map' && (
              <div className="catalog-bottom-recommendations">
                <div className="crb-header">
                  <span className="crb-badge">Також рекомендуємо переглянути</span>
                  <h3 className="crb-title">Інші актуальні варіанти нерухомості у Полтаві:</h3>
                </div>
                <div className="recommended-grid-2col">
                  {recommendedProperties.map((prop) => (
                    <PropertyCard
                      key={`found-rec-${prop.id}`}
                      property={prop}
                      currency={currency}
                      onSelect={onSelectProperty}
                      onBookViewing={onBookViewing}
                    />
                  ))}
                </div>

                {/* Show More Button */}
                {fullRecommendationsPool.length > recLimit && (
                  <div className="crb-more-center">
                    <button
                      type="button"
                      className="crb-more-btn"
                      onClick={() => setRecLimit(prev => prev + 6)}
                    >
                      <Plus size={16} />
                      <span>Показати ще варіанти ({fullRecommendationsPool.length - recLimit})</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Scoped Styles for PropertyCatalog */}
      <style>{`
        .catalog-section {
          padding: 30px 0 60px;
          background: #f8fafc;
        }

        /* 1. Large Primary Tabs (Rent vs Buy) */
        .catalog-main-tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .cmt-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          font-size: 1rem;
          font-weight: 800;
          color: #475569;
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: var(--radius-md);
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .cmt-tab:hover {
          border-color: #cbd5e1;
          background: #f1f5f9;
        }

        .cmt-tab.active.rent {
          background: #6d28d9;
          color: #ffffff;
          border-color: #6d28d9;
          box-shadow: 0 4px 14px rgba(109, 40, 217, 0.25);
        }

        .cmt-tab.active.buy {
          background: #1e3a8a;
          color: #ffffff;
          border-color: #1e3a8a;
          box-shadow: 0 4px 14px rgba(30, 58, 138, 0.25);
        }

        .cmt-count {
          background: rgba(0, 0, 0, 0.15);
          font-size: 0.8rem;
          padding: 2px 8px;
          border-radius: 12px;
        }

        .cmt-tab.active .cmt-count {
          background: rgba(255, 255, 255, 0.25);
        }

        /* 2. Concrete Category Selector (Apartments, Houses, Commercial) */
        .catalog-category-selector {
          display: flex;
          gap: 10px;
          margin-bottom: 24px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .cat-tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          font-size: 0.92rem;
          font-weight: 800;
          color: #334155;
          background: #ffffff;
          border: 1.5px solid #cbd5e1;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .cat-tab-btn:hover {
          border-color: #0f172a;
          color: #0f172a;
          background: #f8fafc;
        }

        .cat-tab-btn.active {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
        }

        .cat-badge {
          background: #f1f5f9;
          color: #475569;
          font-size: 0.76rem;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 10px;
        }

        .cat-tab-btn.active .cat-badge {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }

        /* 3. Catalog Header Bar */
        .catalog-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--c-border);
        }

        .chb-left {
          display: flex;
          align-items: baseline;
          gap: 12px;
          flex-wrap: wrap;
        }

        .catalog-title {
          font-size: 1.35rem;
          font-weight: 900;
          color: var(--c-slate);
        }

        .catalog-count-badge {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--c-muted);
          background: #e2e8f0;
          padding: 3px 10px;
          border-radius: var(--radius-full);
        }

        .chb-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        /* Custom Beautiful District Dropdown */
        .custom-district-dropdown-container {
          position: relative;
        }

        .cdd-trigger-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #1e293b;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .cdd-trigger-btn:hover, .cdd-trigger-btn.open {
          border-color: #2563eb;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }

        .cdd-pin-icon {
          color: #2563eb;
          flex-shrink: 0;
        }

        .cdd-selected-name {
          max-width: 170px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .cdd-arrow {
          color: #64748b;
          transition: transform 0.2s ease;
        }

        .cdd-arrow.rotated {
          transform: rotate(180deg);
        }

        .cdd-menu-card {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          z-index: 1100;
          min-width: 290px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 12px 36px rgba(15, 23, 42, 0.18), 0 4px 12px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          animation: cddFadeIn 0.15s ease-out;
        }

        @keyframes cddFadeIn {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .cdd-menu-header {
          padding: 10px 14px;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: #94a3b8;
          background: #f8fafc;
          border-bottom: 1px solid #f1f5f9;
        }

        .cdd-options-list {
          max-height: 280px;
          overflow-y: auto;
          padding: 6px;
        }

        .cdd-option-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 8px 10px;
          background: transparent;
          border: none;
          border-radius: 6px;
          text-align: left;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .cdd-option-item:hover {
          background: #f1f5f9;
        }

        .cdd-option-item.selected {
          background: #eff6ff;
        }

        .cdd-opt-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .cdd-opt-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: #1e293b;
        }

        .cdd-option-item.selected .cdd-opt-title {
          color: #1d4ed8;
          font-weight: 800;
        }

        .cdd-opt-sub {
          font-size: 0.7rem;
          color: #64748b;
        }

        .cdd-check-icon {
          color: #2563eb;
          flex-shrink: 0;
        }

        /* Price Filter Inputs in Catalog Bar */
        .catalog-price-filter-box {
          display: flex;
          align-items: center;
          background: #ffffff;
          border: 1px solid var(--c-border);
          border-radius: var(--radius-sm);
          padding: 3px 8px;
          gap: 4px;
        }

        .cpf-label {
          font-size: 0.76rem;
          font-weight: 700;
          color: #64748b;
        }

        .cpf-input {
          width: 70px;
          padding: 4px 4px;
          font-size: 0.82rem;
          font-weight: 700;
          border: none;
          background: #f8fafc;
          border-radius: 4px;
          outline: none;
          color: #0f172a;
        }

        .cpf-dash {
          color: #94a3b8;
          font-size: 0.8rem;
        }

        .cpf-clear {
          background: transparent;
          color: #94a3b8;
          font-size: 0.75rem;
          padding: 2px 4px;
          cursor: pointer;
        }

        .cpf-clear:hover {
          color: #2563eb;
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
          color: #1e3a8a;
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
          font-size: 0.82rem;
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
          color: #1e3a8a;
          box-shadow: var(--shadow-sm);
        }

        /* 4. Sub-Filter Chips Bar */
        .category-subfilters-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .subfilters-chips-scroll {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 6px;
        }

        .sfc-btn {
          padding: 6px 14px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #475569;
          background: #ffffff;
          border: 1px solid var(--c-border);
          border-radius: var(--radius-full);
          white-space: nowrap;
          transition: var(--transition);
          cursor: pointer;
        }

        .sfc-btn:hover {
          border-color: #334155;
          color: #0f172a;
        }

        .sfc-btn.active {
          background: #2563eb;
          color: #ffffff;
          border-color: #2563eb;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
        }

        .sfc-reset-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          font-size: 0.78rem;
          font-weight: 700;
          color: #1e40af;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .sfc-reset-btn:hover {
          background: #dbeafe;
        }

        /* 5. Strict 2-Column Grid Layout */
        .properties-grid-box.full-grid-2col,
        .recommended-grid-2col {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
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
          top: 80px;
          height: 850px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }

        .full-map {
          height: 750px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }

        .catalog-empty-wrapper {
          display: flex;
          flex-direction: column;
          gap: 36px;
        }

        .catalog-empty-state {
          text-align: center;
          padding: 48px 24px;
          background: #ffffff;
          border-radius: var(--radius-lg);
          border: 1.5px dashed var(--c-border);
          box-shadow: var(--shadow-sm);
          max-width: 680px;
          margin: 0 auto;
        }

        .ces-icon-circle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #f1f5f9;
          margin-bottom: 16px;
        }

        .ces-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .ces-desc {
          font-size: 0.9rem;
          color: #64748b;
          max-width: 520px;
          margin: 0 auto 20px;
          line-height: 1.5;
        }

        .ces-reset-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .catalog-recommended-block {
          background: #ffffff;
          padding: 32px 24px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--c-border);
          box-shadow: var(--shadow-sm);
        }

        .catalog-bottom-recommendations {
          margin-top: 48px;
          padding: 36px 24px;
          background: #ffffff;
          border-radius: var(--radius-lg);
          border: 1px solid var(--c-border);
          box-shadow: var(--shadow-sm);
        }

        .crb-header {
          margin-bottom: 24px;
        }

        .crb-badge {
          display: inline-block;
          font-size: 0.76rem;
          font-weight: 800;
          color: #2563eb;
          background: #eff6ff;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .crb-title {
          font-size: 1.3rem;
          font-weight: 900;
          color: #0f172a;
        }

        /* Show More Button Styling */
        .crb-more-center {
          display: flex;
          justify-content: center;
          margin-top: 28px;
        }

        .crb-more-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          font-size: 0.92rem;
          font-weight: 800;
          color: #1e3a8a;
          background: #f1f5f9;
          border: 2px solid #cbd5e1;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .crb-more-btn:hover {
          background: #2563eb;
          color: #ffffff;
          border-color: #2563eb;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
          transform: translateY(-1px);
        }

        @media (max-width: 1024px) {
          .catalog-layout-container.mode-split {
            grid-template-columns: 1fr;
          }
          .split-map {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .properties-grid-box.full-grid-2col,
          .recommended-grid-2col {
            grid-template-columns: 1fr;
          }
          .catalog-header-bar {
            flex-direction: column;
            align-items: flex-start;
          }
          .chb-right {
            width: 100%;
            justify-content: flex-start;
          }
          .catalog-price-filter-box {
            width: 100%;
          }
          .cpf-input {
            flex: 1;
          }
        }
      `}</style>
    </section>
  );
};
