import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { 
  X, 
  Menu, 
  ChevronRight, 
  ChevronDown, 
  MapPin, 
  Phone,
  ShieldCheck,
  Building2,
  Plus,
  Heart,
  User,
  Search
} from 'lucide-react';

export const Header = ({ onOpenMap, onOpenSellModal, onOpenSearchModal }) => {
  const { currentPath, navigate } = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  // Close sidebar on navigation change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [currentPath]);

  const handleViberClick = (e) => {
    e.preventDefault();
    const phone = '380986241429';
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

  const handlePickPropertyClick = (e) => {
    if (e) e.preventDefault();
    setIsSidebarOpen(false);
    navigate('/map');
  };

  return (
    <>
      <header className="ref-site-header">
        <div className="ref-header-inner-fluid">
          {/* Left Block: Logo + Navigation Links */}
          <div className="ref-header-left-group">
            {/* 1. Brand Logo: Favorit Group */}
            <div className="ref-logo" onClick={() => navigate('/')} title="Агентство нерухомості ФАВОРИТ ГРУП">
              <img 
                src="/logo-full.png" 
                alt="ФАВОРИТ ГРУП" 
                className="ref-brand-full-logo-img" 
              />
            </div>

            {/* 2. Navigation Links (Adjacent to Logo) */}
            <nav className="ref-desktop-nav">
              <button 
                type="button"
                className={`ref-nav-link ${currentPath.includes('/map') && (currentPath.includes('buy') || currentPath.includes('prodazha')) ? 'active' : ''}`}
                onClick={() => navigate('/map?type=buy')}
              >
                Продаж
              </button>
              <button 
                type="button"
                className={`ref-nav-link ${currentPath.includes('/map') && (currentPath.includes('rent') || (!currentPath.includes('buy') && !currentPath.includes('prodazha'))) ? 'active' : ''}`}
                onClick={() => navigate('/map?type=rent')}
              >
                Оренда
              </button>
              <button 
                type="button"
                className={`ref-nav-link ${currentPath.includes('/services') ? 'active' : ''}`}
                onClick={() => navigate('/services')}
              >
                Послуги
              </button>
              <button 
                type="button"
                className={`ref-nav-link ${currentPath.includes('/contacts') ? 'active' : ''}`}
                onClick={() => navigate('/contacts')}
              >
                Контакти
              </button>
            </nav>
          </div>

          {/* Right Block: Action Buttons, Phone, Messengers & Hamburger */}
          <div className="ref-header-right">
            {/* 1. Підібрати нерухомість Button (Для покупців та орендарів) */}
            <button 
              type="button"
              className="ref-search-consult-btn"
              onClick={() => (onOpenSearchModal ? onOpenSearchModal() : onOpenSellModal ? onOpenSellModal() : navigate('/contacts'))}
              title="Безкоштовна допомога в пошуку та підборі нерухомості"
            >
              <Search size={15} strokeWidth={2.2} />
              <span>Підібрати нерухомість</span>
            </button>

            {/* 2. + Додати оголошення Button (Для власників) */}
            <button 
              type="button"
              className="ref-add-listing-btn"
              onClick={() => (onOpenSellModal ? onOpenSellModal() : navigate('/contacts'))}
              title="Подати оголошення про продаж або оренду"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Додати оголошення</span>
            </button>

            {/* Phone link */}
            <a href="tel:+380986241429" className="ref-phone-link">
              +380 (98) 624-14-29
            </a>

            {/* Messengers */}
            <div className="ref-messengers-group">
              <a
                href="https://viber.click/380986241429"
                onClick={handleViberClick}
                target="_blank"
                rel="noopener noreferrer"
                className="ref-circle-msg ref-vb"
                title="Viber"
                aria-label="Viber"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                  <path d="M19.78 15.3c-.63-.44-1.92-1.07-2.73-1.03-.68.04-1.04.57-1.47.98-.37.36-.78.36-1.23.1-.9-.52-1.72-1.17-2.45-1.91-.71-.73-1.34-1.55-1.85-2.46-.26-.45-.25-.86.11-1.23.41-.43.94-.79.98-1.47.04-.81-.59-2.1-1.03-2.73-.42-.6-1.04-.68-1.63-.45-.63.24-1.21.68-1.52 1.31-.5 1.03-.65 2.14-.37 3.23.55 2.15 1.71 4.07 3.32 5.67 1.62 1.61 3.54 2.76 5.69 3.31 1.09.28 2.2.13 3.23-.37.63-.31 1.07-.89 1.31-1.52.23-.59.15-1.21-.45-1.63zM14.9 3.5c-.24 0-.44.18-.48.42-.05.27.13.52.4.56 3.65.57 6.47 3.4 7.04 7.05.04.27.29.45.56.4.27-.04.45-.29.4-.56-.65-4.14-3.86-7.36-8-8.01-.05-.01-.09-.01-.14-.01zm.55 3.14c-.26-.03-.5.15-.53.41-.03.26.15.5.41.53 1.95.27 3.47 1.8 3.74 3.75.03.24.24.42.47.42.02 0 .04 0 .06 0 .26-.03.44-.27.41-.53-.33-2.43-2.22-4.32-4.66-4.66zm.3 2.79c-.27-.06-.53.11-.59.38-.06.27.11.53.38.59.58.13 1.03.58 1.16 1.16.05.24.26.4.5.4.03 0 .06 0 .09-.01.27-.06.44-.32.38-.59-.2-.88-.88-1.56-1.76-1.76z"/>
                </svg>
              </a>

              <a
                href="https://t.me/ah_favorit_group"
                target="_blank"
                rel="noopener noreferrer"
                className="ref-circle-msg ref-tg"
                title="Telegram"
                aria-label="Telegram"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                  <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-1.97 9.29c-.15.66-.54.82-1.09.51l-3.02-2.22-1.46 1.41c-.16.16-.3.3-.61.3l.22-3.08 5.6-5.06c.24-.22-.05-.34-.38-.13l-6.92 4.36-2.99-.93c-.65-.2-.66-.65.14-.96l11.68-4.5c.54-.2 1.01.12.87.91z"/>
                </svg>
              </a>
            </div>

            {/* Hamburger Button (Sidebar Toggle) */}
            <button 
              type="button"
              className="ref-hamburger-btn"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Відкрити бічне меню"
            >
              <Menu size={30} />
            </button>
          </div>
        </div>
      </header>

      {/* 4. Sliding Sidebar Drawer (Exact Replica of Screenshot 2) */}
      {isSidebarOpen && (
        <div className="ref-sidebar-backdrop animate-fade" onClick={() => setIsSidebarOpen(false)}>
          <aside className="ref-sidebar-panel animate-slide" onClick={(e) => e.stopPropagation()}>
            {/* Sidebar Header */}
            <div className="ref-sidebar-header">
              <div className="ref-logo" onClick={() => { navigate('/'); setIsSidebarOpen(false); }}>
                <img 
                  src="/logo-full.png" 
                  alt="ФАВОРИТ ГРУП" 
                  className="ref-brand-full-logo-img" 
                />
              </div>

              <button 
                type="button" 
                className="ref-sidebar-close-btn"
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Закрити"
              >
                <X size={24} />
              </button>
            </div>

            {/* Sidebar Navigation Items */}
            <div className="ref-sidebar-body">
              <nav className="ref-sidebar-nav">
                {/* 1. Map - Buy */}
                <button 
                  type="button"
                  className="ref-sb-item text-bold-link"
                  onClick={() => { navigate('/map?type=buy'); setIsSidebarOpen(false); }}
                >
                  <span>Продаж</span>
                </button>

                {/* 2. Map - Rent */}
                <button 
                  type="button"
                  className="ref-sb-item text-bold-link"
                  onClick={() => { navigate('/map?type=rent'); setIsSidebarOpen(false); }}
                >
                  <span>Оренда</span>
                </button>

                {/* 3. Catalog */}
                <button 
                  type="button"
                  className="ref-sb-item text-accent-link"
                  onClick={() => { navigate('/catalog'); setIsSidebarOpen(false); }}
                >
                  <span>Каталог об'єктів</span>
                </button>

                {/* Services with Accordion */}
                <div className="ref-sb-dropdown-group">
                  <button 
                    type="button"
                    className="ref-sb-item has-expand"
                    onClick={() => setServicesOpen(!servicesOpen)}
                  >
                    <span>Послуги</span>
                    <ChevronRight size={18} className={`chevron-icon ${servicesOpen ? 'rotate' : ''}`} />
                  </button>
                  {servicesOpen && (
                    <div className="ref-sb-sublist">
                      <button onClick={() => { navigate('/services'); setIsSidebarOpen(false); }}>Всі послуги</button>
                      <button onClick={() => { navigate('/services'); setIsSidebarOpen(false); }}>Купівля та підбір житла</button>
                      <button onClick={() => { navigate('/services'); setIsSidebarOpen(false); }}>Продаж нерухомості з гарантією</button>
                      <button onClick={() => { navigate('/services'); setIsSidebarOpen(false); }}>Оренда та довірче управління</button>
                      <button onClick={() => { navigate('/services'); setIsSidebarOpen(false); }}>Юридична перевірка угод (ДРРП)</button>
                      <button onClick={() => { navigate('/services'); setIsSidebarOpen(false); }}>Експертна оцінка майна</button>
                    </div>
                  )}
                </div>

                {/* 5. About Company */}
                <button 
                  type="button"
                  className="ref-sb-item"
                  onClick={() => { navigate('/about'); setIsSidebarOpen(false); }}
                >
                  <span>Про компанію</span>
                </button>

                {/* 6. Team & Partners */}
                <button 
                  type="button"
                  className="ref-sb-item"
                  onClick={() => { navigate('/about'); setIsSidebarOpen(false); }}
                >
                  <span>Співробітники / партнери</span>
                </button>

                {/* 8. Official Registration */}
                <button 
                  type="button"
                  className="ref-sb-item"
                  onClick={() => { navigate('/requisites'); setIsSidebarOpen(false); }}
                >
                  <span>Реєстраційні дані</span>
                </button>

                {/* 10. Contacts */}
                <button 
                  type="button"
                  className="ref-sb-item"
                  onClick={() => { navigate('/contacts'); setIsSidebarOpen(false); }}
                >
                  <span>Контакти</span>
                </button>
              </nav>

              {/* Sidebar Bottom Contacts Section */}
              <div className="ref-sidebar-footer">
                <div className="ref-sb-hotline-label">Гаряча лінія:</div>
                <a href="tel:+380986241429" className="ref-sb-phone">
                  +380 (98) 624-14-29
                </a>
                <div className="ref-sb-schedule-note">
                  Графік: щоденно 10:00 — 18:00 (без вихідних)
                </div>

                <div className="ref-sb-messengers">
                  <a
                    href="https://viber.click/380986241429"
                    onClick={handleViberClick}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ref-circle-msg ref-vb"
                    title="Viber"
                    aria-label="Viber"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
                      <path d="M19.78 15.3c-.63-.44-1.92-1.07-2.73-1.03-.68.04-1.04.57-1.47.98-.37.36-.78.36-1.23.1-.9-.52-1.72-1.17-2.45-1.91-.71-.73-1.34-1.55-1.85-2.46-.26-.45-.25-.86.11-1.23.41-.43.94-.79.98-1.47.04-.81-.59-2.1-1.03-2.73-.42-.6-1.04-.68-1.63-.45-.63.24-1.21.68-1.52 1.31-.5 1.03-.65 2.14-.37 3.23.55 2.15 1.71 4.07 3.32 5.67 1.62 1.61 3.54 2.76 5.69 3.31 1.09.28 2.2.13 3.23-.37.63-.31 1.07-.89 1.31-1.52.23-.59.15-1.21-.45-1.63zM14.9 3.5c-.24 0-.44.18-.48.42-.05.27.13.52.4.56 3.65.57 6.47 3.4 7.04 7.05.04.27.29.45.56.4.27-.04.45-.29.4-.56-.65-4.14-3.86-7.36-8-8.01-.05-.01-.09-.01-.14-.01zm.55 3.14c-.26-.03-.5.15-.53.41-.03.26.15.5.41.53 1.95.27 3.47 1.8 3.74 3.75.03.24.24.42.47.42.02 0 .04 0 .06 0 .26-.03.44-.27.41-.53-.33-2.43-2.22-4.32-4.66-4.66zm.3 2.79c-.27-.06-.53.11-.59.38-.06.27.11.53.38.59.58.13 1.03.58 1.16 1.16.05.24.26.4.5.4.03 0 .06 0 .09-.01.27-.06.44-.32.38-.59-.2-.88-.88-1.56-1.76-1.76z"/>
                    </svg>
                  </a>

                  <a
                    href="https://t.me/ah_favorit_group"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ref-circle-msg ref-tg"
                    title="Telegram"
                    aria-label="Telegram"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
                      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-1.97 9.29c-.15.66-.54.82-1.09.51l-3.02-2.22-1.46 1.41c-.16.16-.3.3-.61.3l.22-3.08 5.6-5.06c.24-.22-.05-.34-.38-.13l-6.92 4.36-2.99-.93c-.65-.2-.66-.65.14-.96l11.68-4.5c.54-.2 1.01.12.87.91z"/>
                    </svg>
                  </a>
                </div>

                <div className="ref-sb-address">
                  <strong>Адреса офісу:</strong> м. Полтава, вул. Соборності, 22
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Scoped CSS styling for Header and Sidebar */}
      <style>{`
        .ref-site-header {
          background: #ffffff;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
          position: sticky;
          top: 0;
          z-index: 1000;
          height: 104px;
          width: 100%;
        }

        .ref-header-inner-fluid {
          width: 100%;
          padding: 0 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          box-sizing: border-box;
        }

        .ref-header-left-group {
          display: flex;
          align-items: center;
          gap: 36px;
        }

        /* Logo: Favorit Group Full Graphic (Further Enlarged) */
        .ref-logo {
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          user-select: none;
          flex-shrink: 0;
          padding: 0;
        }

        .ref-brand-full-logo-img {
          height: 90px;
          max-height: 94px;
          width: auto;
          object-fit: contain;
          flex-shrink: 0;
          display: block;
          transition: transform 0.2s ease;
        }

        .ref-logo:hover .ref-brand-full-logo-img {
          transform: scale(1.03);
        }

        /* Nav links (Adjacent to Logo) */
        .ref-desktop-nav {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .ref-nav-link {
          font-size: 1.02rem;
          font-weight: 600;
          color: #334155;
          padding: 8px 6px;
          transition: var(--transition);
          position: relative;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .ref-nav-link:hover, .ref-nav-link.active {
          color: #1e3a8a;
          font-weight: 700;
        }

        /* Header Right Controls */
        .ref-header-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ref-search-consult-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1.5px solid #2563eb;
          background: #2563eb;
          color: #ffffff;
          border-radius: 9999px;
          font-weight: 700;
          font-size: 0.88rem;
          padding: 8px 18px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.22);
        }

        .ref-search-consult-btn:hover {
          background: #1d4ed8;
          border-color: #1d4ed8;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
        }

        .ref-add-listing-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1.5px solid #1e3a8a;
          background: rgba(30, 58, 138, 0.05);
          color: #1e3a8a;
          border-radius: 9999px;
          font-weight: 700;
          font-size: 0.88rem;
          padding: 8px 18px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .ref-add-listing-btn:hover {
          background: #1e3a8a;
          color: #ffffff;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(30, 58, 138, 0.25);
        }

        .ref-icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f8fafc;
          color: #1e293b;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ref-icon-btn:hover {
          background: #e0e7ff;
          color: #1e3a8a;
          border-color: #c7d2fe;
          transform: scale(1.06);
        }

        .ref-phone-link {
          font-size: 1.15rem;
          font-weight: 800;
          color: #1e3a8a;
          white-space: nowrap;
          letter-spacing: -0.2px;
          margin-left: 4px;
        }

        .ref-phone-link:hover {
          color: #1e40af;
        }

        .ref-messengers-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ref-circle-msg {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
        }

        .ref-circle-msg:hover {
          transform: scale(1.1);
          opacity: 0.95;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .ref-vb {
          background: #7360f2;
        }

        .ref-tg {
          background: #29b6f6;
        }

        .ref-hamburger-btn {
          color: #1e293b;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 8px;
          background: transparent;
          border: none;
          transition: background 0.2s ease;
        }

        .ref-hamburger-btn:hover {
          color: #1e3a8a;
          background: #f1f5f9;
        }

        /* Sidebar Backdrop */
        .ref-sidebar-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          z-index: 9999;
          display: flex;
          justify-content: flex-end;
        }

        /* Sidebar Panel (Screenshot 2 exact styling) */
        .ref-sidebar-panel {
          width: 100%;
          max-width: 380px;
          height: 100%;
          background: #ffffff;
          box-shadow: -10px 0 35px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
        }

        .ref-sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid #f1f5f9;
        }

        .ref-sidebar-close-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          border: none;
          cursor: pointer;
        }

        .ref-sidebar-close-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .ref-sidebar-body {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .ref-sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .ref-sb-item {
          text-align: left;
          font-size: 1.05rem;
          font-weight: 500;
          color: #475569;
          padding: 4px 0;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
        }

        .ref-sb-item:hover {
          color: #1e3a8a;
        }

        .ref-sb-item.text-bold-link {
          font-weight: 700;
          color: #1e293b;
        }

        .ref-sb-item.text-bold-link:hover {
          color: #1e3a8a;
        }

        .ref-sb-item.text-accent-link {
          color: #1e3a8a;
          font-weight: 600;
        }

        .ref-sb-item.has-expand {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .chevron-icon {
          transition: transform 0.2s;
          color: #94a3b8;
        }

        .chevron-icon.rotate {
          transform: rotate(90deg);
        }

        .ref-sb-sublist {
          padding-left: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 8px;
          margin-bottom: 8px;
        }

        .ref-sb-sublist button {
          text-align: left;
          font-size: 0.92rem;
          color: #64748b;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .ref-sb-sublist button:hover {
          color: #1e3a8a;
        }

        /* Sidebar Footer */
        .ref-sidebar-footer {
          margin-top: 30px;
          padding-top: 24px;
          border-top: 1px solid #f1f5f9;
        }

        .ref-sb-hotline-label {
          font-size: 0.78rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          margin-bottom: 8px;
        }

        .ref-sb-phones-stack {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 8px;
        }

        .ref-sb-phone {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.05rem;
          font-weight: 800;
          color: #1e3a8a;
          transition: color 0.15s ease;
        }

        .ref-sb-phone span {
          font-size: 0.72rem;
          font-weight: 700;
          color: #64748b;
          background: #e2e8f0;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .ref-sb-phone:hover {
          color: #2563eb;
        }

        .ref-sb-schedule-note {
          font-size: 0.82rem;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 14px;
        }

        .ref-sb-messengers {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
        }

        .ref-sb-address {
          font-size: 0.85rem;
          color: #64748b;
          line-height: 1.45;
        }

        @media (max-width: 1200px) {
          .ref-phone-link {
            display: none;
          }
        }

        @media (max-width: 1024px) {
          .ref-desktop-nav {
            display: none;
          }
          .ref-header-inner-fluid {
            padding: 0 20px;
          }
        }

        @media (max-width: 768px) {
          .ref-search-consult-btn span,
          .ref-add-listing-btn span {
            display: none;
          }
          .ref-search-consult-btn,
          .ref-add-listing-btn {
            padding: 8px;
            border-radius: 50%;
            width: 38px;
            height: 38px;
            justify-content: center;
          }
        }

        @media (max-width: 640px) {
          .ref-site-header {
            height: 86px;
          }
          .ref-header-inner-fluid {
            padding: 0 16px;
          }
          .ref-brand-full-logo-img {
            height: 68px;
            max-height: 72px;
          }
          .ref-icon-btn {
            display: none;
          }
        }
      `}</style>
    </>
  );
};
