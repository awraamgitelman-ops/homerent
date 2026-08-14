import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Building, 
  PlusCircle, 
  Menu, 
  X, 
  ChevronDown, 
  Search,
  ShieldCheck,
  Calculator,
  Briefcase
} from 'lucide-react';

export const Header = ({ onOpenSellModal, onOpenSearchModal }) => {
  const { currentPath, navigate } = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPath]);

  const handleViberClick = (e) => {
    e.preventDefault();
    const phone = '380988612938';
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = `viber://chat?number=${phone}`;
      setTimeout(() => {
        window.location.href = `https://viber.click/${phone}`;
      }, 500);
    } else {
      window.location.href = `viber://chat?number=%2B${phone}`;
      setTimeout(() => {
        window.open(`https://viber.click/${phone}`, '_blank');
      }, 500);
    }
  };

  return (
    <header className="site-header">
      {/* Top Contact Bar */}
      <div className="header-top">
        <div className="container header-top-inner">
          <div className="ht-left">
            <a href="tel:+380988612938" className="ht-phone">
              <Phone size={14} className="text-primary" />
              <span>+380 (98) 861-29-38</span>
            </a>

            <div className="ht-messengers">
              <a
                href="https://t.me/rudmonolit"
                target="_blank"
                rel="noopener noreferrer"
                className="ht-msg-btn msg-tg"
                title="Написати у Telegram"
              >
                <span>Telegram</span>
              </a>

              <a
                href="https://viber.click/380988612938"
                onClick={handleViberClick}
                target="_blank"
                rel="noopener noreferrer"
                className="ht-msg-btn msg-vb"
                title="Написати у Viber"
              >
                <span>Viber</span>
              </a>

              <a
                href="https://wa.me/380988612938"
                target="_blank"
                rel="noopener noreferrer"
                className="ht-msg-btn msg-wa"
                title="Написати у WhatsApp"
              >
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="ht-right">
            <div className="ht-item">
              <MapPin size={13} className="text-primary" />
              <span>м. Полтава, вул. Європейська, 2 (оф. 202)</span>
            </div>
            <div className="ht-item">
              <Clock size={13} className="text-primary" />
              <span>Пн–Нд: 09:00 — 20:00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="header-main">
        <div className="container header-main-inner">
          {/* Brand Logo */}
          <div className="brand-logo" onClick={() => navigate('#/')}>
            <div className="logo-icon">
              <Building size={24} />
            </div>
            <div className="logo-text-block">
              <span className="brand-title">НОВЕКС ІНВЕСТ</span>
              <span className="brand-sub">Агентство нерухомості • Полтава</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav">
            <button 
              onClick={() => navigate('#/catalog')} 
              className={`nav-link ${currentPath.includes('/catalog') ? 'active' : ''}`}
            >
              Каталог об'єктів
            </button>

            {/* Dropdown: Послуги */}
            <div className="nav-dropdown-wrapper">
              <button 
                onClick={() => navigate('#/services')} 
                className={`nav-link has-arrow ${currentPath.includes('/services') ? 'active' : ''}`}
              >
                <span>Послуги</span>
                <ChevronDown size={14} />
              </button>
              <div className="nav-dropdown-menu">
                <button onClick={() => navigate('#/services')} className="dropdown-item">Всі послуги агентства</button>
                <button onClick={() => navigate('#/services/buy')} className="dropdown-item">Купівля та підбір житла</button>
                <button onClick={() => navigate('#/services/sell')} className="dropdown-item">Продаж нерухомості з гарантією</button>
                <button onClick={() => navigate('#/services/rent')} className="dropdown-item">Довгострокова оренда та управління</button>
                <button onClick={() => navigate('#/services/legal')} className="dropdown-item">Юридична перевірка угод (ДРРП)</button>
                <button onClick={() => navigate('#/services/valuation')} className="dropdown-item">Експертна оцінка майна</button>
              </div>
            </div>

            <button 
              onClick={() => navigate('#/calculator')} 
              className={`nav-link ${currentPath.includes('/calculator') ? 'active' : ''}`}
            >
              Іпотека (єОселя)
            </button>

            {/* Dropdown: Про компанію */}
            <div className="nav-dropdown-wrapper">
              <button 
                onClick={() => navigate('#/about')} 
                className={`nav-link has-arrow ${currentPath.includes('/about') || currentPath.includes('/requisites') ? 'active' : ''}`}
              >
                <span>Про компанію</span>
                <ChevronDown size={14} />
              </button>
              <div className="nav-dropdown-menu">
                <button onClick={() => navigate('#/about')} className="dropdown-item">Про ТОВ «НОВЕКС ІНВЕСТ»</button>
                <button onClick={() => navigate('#/requisites')} className="dropdown-item">Реєстраційні дані (ЄДРПОУ 43980756)</button>
              </div>
            </div>

            <button 
              onClick={() => navigate('#/contacts')} 
              className={`nav-link ${currentPath.includes('/contacts') ? 'active' : ''}`}
            >
              Контакти
            </button>
          </nav>

          {/* Desktop Actions */}
          <div className="header-actions">
            <button 
              onClick={onOpenSellModal}
              className="btn btn-accent btn-sm header-sell-btn"
            >
              <PlusCircle size={16} />
              <span>Подати оголошення</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button 
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Меню"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer-overlay animate-fade" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-drawer animate-slide" onClick={(e) => e.stopPropagation()}>
            <div className="md-header">
              <div className="brand-logo" onClick={() => { navigate('#/'); setIsMobileMenuOpen(false); }}>
                <div className="logo-icon"><Building size={20} /></div>
                <div className="logo-text-block">
                  <span className="brand-title">НОВЕКС ІНВЕСТ</span>
                  <span className="brand-sub">Полтава</span>
                </div>
              </div>
              <button className="md-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="md-content">
              {/* Action Buttons in Drawer */}
              <button 
                onClick={() => { onOpenSellModal(); setIsMobileMenuOpen(false); }} 
                className="btn btn-accent btn-block mb-4"
              >
                <PlusCircle size={18} />
                <span>Подати оголошення (Продати/Здати)</span>
              </button>

              <nav className="md-nav-list">
                <button onClick={() => navigate('#/catalog')} className="md-nav-item">
                  Каталог нерухомості Полтави
                </button>

                {/* Accordion: Послуги */}
                <div className="md-accordion">
                  <button className="md-accordion-btn" onClick={() => setServicesOpen(!servicesOpen)}>
                    <span>Послуги агентства</span>
                    <ChevronDown size={16} className={`chevron ${servicesOpen ? 'rotate' : ''}`} />
                  </button>
                  {servicesOpen && (
                    <div className="md-accordion-content">
                      <button onClick={() => navigate('#/services')} className="md-sub-item">Всі послуги</button>
                      <button onClick={() => navigate('#/services/buy')} className="md-sub-item">Купівля та підбір квартир</button>
                      <button onClick={() => navigate('#/services/sell')} className="md-sub-item">Продаж вашої нерухомості</button>
                      <button onClick={() => navigate('#/services/rent')} className="md-sub-item">Оренда та управління</button>
                      <button onClick={() => navigate('#/services/legal')} className="md-sub-item">Юридичний супровід</button>
                    </div>
                  )}
                </div>

                <button onClick={() => navigate('#/calculator')} className="md-nav-item">
                  Іпотечний калькулятор (єОселя)
                </button>

                {/* Accordion: Про нас */}
                <div className="md-accordion">
                  <button className="md-accordion-btn" onClick={() => setAboutOpen(!aboutOpen)}>
                    <span>Про компанію</span>
                    <ChevronDown size={16} className={`chevron ${aboutOpen ? 'rotate' : ''}`} />
                  </button>
                  {aboutOpen && (
                    <div className="md-accordion-content">
                      <button onClick={() => navigate('#/about')} className="md-sub-item">Про ТОВ «НОВЕКС ІНВЕСТ»</button>
                      <button onClick={() => navigate('#/requisites')} className="md-sub-item">Реєстраційні дані (ЄДРПОУ 43980756)</button>
                    </div>
                  )}
                </div>

                <button onClick={() => navigate('#/contacts')} className="md-nav-item">
                  Контакти та офіс
                </button>
              </nav>

              {/* Direct Contacts in Drawer */}
              <div className="md-contacts-box">
                <a href="tel:+380988612938" className="md-phone-link">
                  <Phone size={16} className="text-primary" />
                  <span>+380 (98) 861-29-38</span>
                </a>
                <div className="md-messengers-row">
                  <a href="https://t.me/rudmonolit" target="_blank" rel="noopener noreferrer" className="md-msg-item md-tg">
                    Telegram
                  </a>
                  <a href="https://viber.click/380988612938" onClick={handleViberClick} target="_blank" rel="noopener noreferrer" className="md-msg-item md-vb">
                    Viber
                  </a>
                  <a href="https://wa.me/380988612938" target="_blank" rel="noopener noreferrer" className="md-msg-item md-wa">
                    WhatsApp
                  </a>
                </div>
                <div className="md-address">
                  <MapPin size={14} className="text-primary" />
                  <span>м. Полтава, вул. Європейська, буд. 2 (офіс 202)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scoped Styles for Header */}
      <style>{`
        .site-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: #ffffff;
          box-shadow: var(--shadow-sm);
        }

        /* Top Bar */
        .header-top {
          background: #f1f5f9;
          border-bottom: 1px solid #e2e8f0;
          font-size: 0.8rem;
          color: #475569;
        }

        .header-top-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 38px;
        }

        .ht-left, .ht-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .ht-phone {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          color: var(--c-primary);
          white-space: nowrap;
        }

        .ht-messengers {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ht-msg-btn {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.72rem;
          font-weight: 700;
          color: #ffffff;
          transition: var(--transition);
        }

        .msg-tg { background: #29b6f6; }
        .msg-vb { background: #7360f2; }
        .msg-wa { background: #25d366; }

        .ht-msg-btn:hover {
          opacity: 0.85;
          transform: translateY(-1px);
        }

        .ht-item {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        /* Main Header */
        .header-main-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          user-select: none;
        }

        .logo-icon {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, var(--c-primary) 0%, #1e40af 100%);
          color: #ffffff;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(30, 58, 138, 0.25);
        }

        .brand-title {
          display: block;
          font-size: 1.25rem;
          font-weight: 900;
          color: var(--c-slate);
          letter-spacing: -0.5px;
          line-height: 1.1;
        }

        .brand-sub {
          display: block;
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--c-muted);
          margin-top: 2px;
        }

        /* Desktop Nav */
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-link {
          padding: 8px 14px;
          font-size: 0.92rem;
          font-weight: 600;
          color: #334155;
          border-radius: var(--radius-sm);
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .nav-link:hover, .nav-link.active {
          color: var(--c-primary);
          background: var(--c-primary-light);
        }

        /* Dropdowns with Hover Bridge */
        .nav-dropdown-wrapper {
          position: relative;
          padding-top: 4px;
          padding-bottom: 4px;
        }

        .nav-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          min-width: 260px;
          background: #ffffff;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--c-border);
          padding: 8px 0;
          display: none;
          z-index: 1000;
          animation: fadeIn 0.15s ease;
        }

        .nav-dropdown-menu::before {
          content: '';
          position: absolute;
          top: -12px;
          left: 0;
          right: 0;
          height: 12px;
          background: transparent;
        }

        .nav-dropdown-wrapper:hover .nav-dropdown-menu {
          display: block;
        }

        .dropdown-item {
          width: 100%;
          text-align: left;
          padding: 10px 18px;
          font-size: 0.88rem;
          font-weight: 600;
          color: #334155;
          display: block;
        }

        .dropdown-item:hover {
          background: var(--c-primary-light);
          color: var(--c-primary);
          padding-left: 22px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mobile-menu-toggle {
          display: none;
          padding: 6px;
          color: var(--c-dark);
        }

        /* Mobile Drawer */
        .mobile-drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          z-index: 9999;
          display: flex;
          justify-content: flex-end;
        }

        .mobile-drawer {
          background: #ffffff;
          width: 88%;
          max-width: 380px;
          height: 100%;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-xl);
        }

        .md-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid var(--c-border);
        }

        .md-close-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
        }

        .md-content {
          padding: 20px;
          overflow-y: auto;
          flex: 1;
        }

        .md-nav-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .md-nav-item {
          width: 100%;
          text-align: left;
          padding: 12px 14px;
          font-size: 1rem;
          font-weight: 700;
          color: var(--c-slate);
          border-radius: var(--radius-sm);
        }

        .md-nav-item:hover {
          background: var(--c-primary-light);
          color: var(--c-primary);
        }

        .md-accordion {
          border-bottom: 1px solid #f1f5f9;
        }

        .md-accordion-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          font-size: 1rem;
          font-weight: 700;
          color: var(--c-slate);
        }

        .md-accordion-btn .chevron {
          transition: transform 0.2s;
        }

        .md-accordion-btn .chevron.rotate {
          transform: rotate(180deg);
        }

        .md-accordion-content {
          padding: 4px 0 8px 14px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .md-sub-item {
          width: 100%;
          text-align: left;
          padding: 8px 12px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #475569;
        }

        .md-contacts-box {
          margin-top: 24px;
          padding-top: 18px;
          border-top: 1px solid var(--c-border);
        }

        .md-phone-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 800;
          font-size: 1.05rem;
          color: var(--c-primary);
          margin-bottom: 12px;
        }

        .md-messengers-row {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .md-msg-item {
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 700;
          color: #ffffff;
        }

        .md-tg { background: #29b6f6; }
        .md-vb { background: #7360f2; }
        .md-wa { background: #25d366; }

        .md-address {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          color: #64748b;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .desktop-nav {
            display: none;
          }
          .mobile-menu-toggle {
            display: block;
          }
          .ht-right {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .header-main-inner {
            height: 60px;
          }
          .logo-icon {
            width: 36px;
            height: 36px;
          }
          .brand-title {
            font-size: 1.05rem;
          }
          .brand-sub {
            display: none;
          }
          .header-sell-btn {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};
