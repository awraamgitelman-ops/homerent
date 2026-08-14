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
  Building2
} from 'lucide-react';

export const Header = ({ onOpenMap, onOpenSellModal }) => {
  const { currentPath, navigate } = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  // Close sidebar on navigation change
  useEffect(() => {
    setIsSidebarOpen(false);
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

  const handlePickPropertyClick = (e) => {
    if (e) e.preventDefault();
    setIsSidebarOpen(false);
    navigate('#/map');
  };

  return (
    <>
      <header className="ref-site-header">
        <div className="container ref-header-inner">
          {/* 1. Left: Brand Logo */}
          <div className="ref-logo" onClick={() => navigate('#/')}>
            <div className="ref-logo-top">
              <img 
                src="/logo-transparent-filleted.png" 
                alt="НОВА ОСЕЛЯ" 
                className="ref-brand-logo-img" 
              />
              <span className="ref-logo-title">НОВА ОСЕЛЯ</span>
            </div>
            <span className="ref-logo-sub">АГЕНТСТВО НЕРУХОМОСТІ</span>
          </div>

          {/* 2. Center: Navigation Links */}
          <nav className="ref-desktop-nav">
            <button 
              type="button"
              className={`ref-nav-link text-highlight ${currentPath.includes('/map') ? 'active' : ''}`}
              onClick={handlePickPropertyClick}
            >
              Підібрати нерухомість
            </button>
            <button 
              type="button"
              className={`ref-nav-link ${currentPath.includes('/services') ? 'active' : ''}`}
              onClick={() => navigate('#/services')}
            >
              Послуги
            </button>
            <button 
              type="button"
              className={`ref-nav-link ${currentPath.includes('/about') ? 'active' : ''}`}
              onClick={() => navigate('#/about')}
            >
              Відгуки
            </button>
            <button 
              type="button"
              className={`ref-nav-link ${currentPath.includes('/contacts') ? 'active' : ''}`}
              onClick={() => navigate('#/contacts')}
            >
              Контакти
            </button>
          </nav>

          {/* 3. Right: Phone, Messengers & Hamburger */}
          <div className="ref-header-right">
            <a href="tel:+380988612938" className="ref-phone-link">
              +380 (98) 861-29-38
            </a>

            <div className="ref-messengers-group">
              {/* Viber Round Button */}
              <a
                href="https://viber.click/380988612938"
                onClick={handleViberClick}
                target="_blank"
                rel="noopener noreferrer"
                className="ref-circle-msg ref-vb"
                title="Viber"
              >
                <svg width="21" height="21" viewBox="0 0 24 24" fill="#ffffff">
                  <path d="M19.5 3.5C17.3 1.3 14.3 0 11.2 0 5 0 0 5 0 11.2c0 2.2.6 4.3 1.8 6.1L.1 23.4c-.1.4.2.8.6.7l6.3-1.6c1.7 1 3.7 1.5 5.7 1.5 6.2 0 11.2-5 11.2-11.2 0-3.1-1.2-6.1-3.4-8.3zM12 20.3c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4c-1-1.5-1.6-3.3-1.6-5.1 0-5.1 4.2-9.3 9.3-9.3 2.5 0 4.8 1 6.6 2.7 1.8 1.8 2.7 4.1 2.7 6.6 0 5.1-4.2 9.3-9.3 9.3zm5.1-6.9c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9 0 1.7 1.2 3.4 1.4 3.6.2.2 2.4 3.7 5.9 5.2.8.4 1.5.6 2 .8.8.3 1.6.2 2.2.1.7-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.1-1.4-.1-.2-.3-.3-.6-.4z"/>
                </svg>
              </a>

              {/* Telegram Round Button */}
              <a
                href="https://t.me/novexinvest"
                target="_blank"
                rel="noopener noreferrer"
                className="ref-circle-msg ref-tg"
                title="Telegram"
              >
                <svg width="21" height="21" viewBox="0 0 24 24" fill="#ffffff">
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
              <Menu size={32} />
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
              <div className="ref-logo" onClick={() => { navigate('#/'); setIsSidebarOpen(false); }}>
                <div className="ref-logo-top">
                  <img 
                    src="/logo-transparent-filleted.png" 
                    alt="НОВА ОСЕЛЯ" 
                    className="ref-brand-logo-img" 
                  />
                  <span className="ref-logo-title">НОВА ОСЕЛЯ</span>
                </div>
                <span className="ref-logo-sub">АГЕНТСТВО НЕРУХОМОСТІ</span>
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
                {/* 1. Pick Property (Opens Map) */}
                <button 
                  type="button"
                  className="ref-sb-item text-bold-link"
                  onClick={handlePickPropertyClick}
                >
                  <span>Підібрати нерухомість (Карта Полтави)</span>
                </button>

                {/* 2. Blog / News */}
                <button 
                  type="button"
                  className="ref-sb-item text-accent-link"
                  onClick={() => { navigate('#/catalog'); setIsSidebarOpen(false); }}
                >
                  <span>Каталог об'єктів 2026</span>
                </button>

                {/* 3. Reviews */}
                <button 
                  type="button"
                  className="ref-sb-item"
                  onClick={() => { navigate('#/about'); setIsSidebarOpen(false); }}
                >
                  <span>Відгуки клієнтів</span>
                </button>

                {/* 4. Services with Accordion */}
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
                      <button onClick={() => { navigate('#/services'); setIsSidebarOpen(false); }}>Всі послуги</button>
                      <button onClick={() => { navigate('#/services'); setIsSidebarOpen(false); }}>Купівля та підбір житла</button>
                      <button onClick={() => { navigate('#/services'); setIsSidebarOpen(false); }}>Продаж нерухомості з гарантією</button>
                      <button onClick={() => { navigate('#/services'); setIsSidebarOpen(false); }}>Оренда та довірче управління</button>
                      <button onClick={() => { navigate('#/services'); setIsSidebarOpen(false); }}>Юридична перевірка угод (ДРРП)</button>
                      <button onClick={() => { navigate('#/services'); setIsSidebarOpen(false); }}>Експертна оцінка майна</button>
                    </div>
                  )}
                </div>

                {/* 5. About Company */}
                <button 
                  type="button"
                  className="ref-sb-item"
                  onClick={() => { navigate('#/about'); setIsSidebarOpen(false); }}
                >
                  <span>Про компанію</span>
                </button>

                {/* 6. Team & Partners */}
                <button 
                  type="button"
                  className="ref-sb-item"
                  onClick={() => { navigate('#/about'); setIsSidebarOpen(false); }}
                >
                  <span>Співробітники / партнери</span>
                </button>

                {/* 7. Vacancies */}
                <button 
                  type="button"
                  className="ref-sb-item"
                  onClick={() => { onOpenSellModal(); setIsSidebarOpen(false); }}
                >
                  <span>Вакансії та співпраця</span>
                </button>

                {/* 9. Official Registration */}
                <button 
                  type="button"
                  className="ref-sb-item"
                  onClick={() => { navigate('#/requisites'); setIsSidebarOpen(false); }}
                >
                  <span>Реєстраційні дані (ЄДРПОУ 43980756)</span>
                </button>

                {/* 10. Contacts */}
                <button 
                  type="button"
                  className="ref-sb-item"
                  onClick={() => { navigate('#/contacts'); setIsSidebarOpen(false); }}
                >
                  <span>Контакти</span>
                </button>
              </nav>

              {/* Sidebar Bottom Contacts Section */}
              <div className="ref-sidebar-footer">
                <a href="tel:+380988612938" className="ref-sb-phone">
                  +380 (98) 861-29-38
                </a>

                <div className="ref-sb-messengers">
                  <a
                    href="https://viber.click/380988612938"
                    onClick={handleViberClick}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ref-circle-msg ref-vb"
                    title="Viber"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
                      <path d="M19.5 3.5C17.3 1.3 14.3 0 11.2 0 5 0 0 5 0 11.2c0 2.2.6 4.3 1.8 6.1L.1 23.4c-.1.4.2.8.6.7l6.3-1.6c1.7 1 3.7 1.5 5.7 1.5 6.2 0 11.2-5 11.2-11.2 0-3.1-1.2-6.1-3.4-8.3zM12 20.3c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4c-1-1.5-1.6-3.3-1.6-5.1 0-5.1 4.2-9.3 9.3-9.3 2.5 0 4.8 1 6.6 2.7 1.8 1.8 2.7 4.1 2.7 6.6 0 5.1-4.2 9.3-9.3 9.3zm5.1-6.9c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9 0 1.7 1.2 3.4 1.4 3.6.2.2 2.4 3.7 5.9 5.2.8.4 1.5.6 2 .8.8.3 1.6.2 2.2.1.7-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.1-1.4-.1-.2-.3-.3-.6-.4z"/>
                    </svg>
                  </a>

                  <a
                    href="https://t.me/rudmonolit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ref-circle-msg ref-tg"
                    title="Telegram"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
                      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-1.97 9.29c-.15.66-.54.82-1.09.51l-3.02-2.22-1.46 1.41c-.16.16-.3.3-.61.3l.22-3.08 5.6-5.06c.24-.22-.05-.34-.38-.13l-6.92 4.36-2.99-.93c-.65-.2-.66-.65.14-.96l11.68-4.5c.54-.2 1.01.12.87.91z"/>
                    </svg>
                  </a>
                </div>

                <div className="ref-sb-address">
                  <strong>Адреса офісу:</strong> м. Полтава, вул. Європейська, 2 (офіс 202)
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
          height: 94px;
        }

        .ref-header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
        }

        /* Logo (Exact balanced lockup) */
        .ref-logo {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          cursor: pointer;
          user-select: none;
        }

        .ref-logo-top {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ref-brand-logo-img {
          width: 38px;
          height: 38px;
          object-fit: contain;
          flex-shrink: 0;
        }

        .ref-logo-title {
          font-size: 1.7rem;
          font-weight: 900;
          color: #1e3a8a;
          letter-spacing: -0.2px;
          line-height: 1;
        }

        .ref-logo-sub {
          font-size: 0.65rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: 2.8px;
          text-transform: uppercase;
          line-height: 1;
          margin-top: 4px;
          padding-left: 1px;
          white-space: nowrap;
        }

        /* Nav links */
        .ref-desktop-nav {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .ref-nav-link {
          font-size: 1.06rem;
          font-weight: 600;
          color: #334155;
          padding: 10px 6px;
          transition: var(--transition);
          position: relative;
        }

        .ref-nav-link:hover, .ref-nav-link.active {
          color: #1e3a8a;
        }

        .ref-nav-link.text-highlight {
          font-weight: 800;
          color: #1e293b;
          font-size: 1.1rem;
        }

        .ref-nav-link.text-highlight:hover {
          color: #1e3a8a;
        }

        /* Header Right */
        .ref-header-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .ref-phone-link {
          font-size: 1.22rem;
          font-weight: 900;
          color: #1e3a8a;
          white-space: nowrap;
          letter-spacing: -0.2px;
        }

        .ref-phone-link:hover {
          color: #1e40af;
        }

        .ref-messengers-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ref-circle-msg {
          width: 40px;
          height: 40px;
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
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 8px;
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

        .ref-sb-phone {
          display: block;
          font-size: 1.25rem;
          font-weight: 800;
          color: #1e3a8a;
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

        @media (max-width: 1024px) {
          .ref-desktop-nav {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .ref-site-header {
            height: 64px;
          }
          .ref-phone-link {
            display: none;
          }
          .ref-logo-title {
            font-size: 1.1rem;
          }
          .ref-logo-tag {
            display: none;
          }
        }
      `}</style>
    </>
  );
};
