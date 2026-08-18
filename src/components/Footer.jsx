import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight, 
  Send, 
  MessageSquare, 
  PhoneCall, 
  FileCheck2, 
  Check, 
  Copy
} from 'lucide-react';

export const Footer = ({ onOpenConsultModal }) => {
  const { navigate } = useRouter();
  const [copiedEdrpou, setCopiedEdrpou] = useState(false);

  const handleCopyEdrpou = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText('43980756');
    setCopiedEdrpou(true);
    setTimeout(() => setCopiedEdrpou(false), 2000);
  };

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

  return (
    <footer className="nx-footer">
      {/* 1. Global Full-width Panoramic Poltava Pre-Footer Separator Strip */}
      <div className="nx-prefooter-strip">
        <div className="nx-pfs-overlay" />
        <div className="container nx-pfs-container">
          <div className="nx-pfs-left">
            <h3 className="nx-pfs-title">Шукаєте нерухомість у Полтаві?</h3>
            <p className="nx-pfs-desc">
              Залиште коротку заявку, і ми підготуємо для вас персональну добірку з найкращих та перевірених об'єктів під ваш бюджет і вимоги.
            </p>
          </div>
          <div className="nx-pfs-right">
            <a href="tel:+380986241429" className="nx-pfs-phone-btn">
              <PhoneCall size={18} />
              <div className="nx-ppb-text">
                <span className="nx-ppb-label">Гаряча лінія</span>
                <span className="nx-ppb-num">+380 (98) 624-14-29</span>
              </div>
            </a>
            <button 
              onClick={onOpenConsultModal} 
              className="btn btn-accent nx-pfs-action-btn"
            >
              <span>Отримати персональну добірку</span>
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Clean horizontal divider line */}
        <div className="nx-footer-divider" />

        {/* 2. Main Footer Grid (Brand moved to the RIGHT) */}
        <div className="nx-footer-grid">
          {/* Navigation Hub */}
          <div className="nx-footer-col">
            <h4 className="nx-col-title">Каталог та пошук</h4>
            <ul className="nx-col-nav">
              <li><button onClick={() => navigate('/catalog')}>Оренда квартир</button></li>
              <li><button onClick={() => navigate('/catalog')}>Купівля квартир у Полтаві</button></li>
              <li><button onClick={() => navigate('/catalog')}>Будинки та котеджі</button></li>
              <li><button onClick={() => navigate('/catalog')}>Комерційна нерухомість</button></li>
              <li><button onClick={() => navigate('/map')}>Інтерактивна карта об'єктів</button></li>
              <li><button onClick={() => navigate('/services')}>Всі послуги агентства</button></li>
            </ul>
          </div>

          {/* Popular Poltava Districts */}
          <div className="nx-footer-col">
            <h4 className="nx-col-title">Популярні райони</h4>
            <ul className="nx-col-nav">
              <li><button onClick={() => navigate('/catalog')}>Центр та Корпусний сад</button></li>
              <li><button onClick={() => navigate('/catalog')}>Левада та Поділ</button></li>
              <li><button onClick={() => navigate('/catalog')}>Алмазний та Сади</button></li>
              <li><button onClick={() => navigate('/catalog')}>Огнівка та Мотель</button></li>
              <li><button onClick={() => navigate('/catalog')}>Половки та Браїлки</button></li>
              <li><button onClick={() => navigate('/catalog')}>Інститут зв'язку та Юрівка</button></li>
            </ul>
          </div>

          {/* Company & Quick Connect Column */}
          <div className="nx-footer-col">
            <h4 className="nx-col-title">Зв'язок з керівником</h4>
            <p className="nx-connect-desc">
              Прямий контакт з керівництвом агентства для вирішення термінових та нестандартних питань:
            </p>

            <div className="nx-messengers-icons">
              <a 
                href="https://wa.me/380986241429" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="nx-msg-icon-btn"
                title="WhatsApp"
                aria-label="WhatsApp"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01zm-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.23 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.15.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.66.31-.23.25-.88.86-.88 2.09s.9 2.43 1.03 2.6c.12.17 1.78 2.71 4.3 3.8 2.53 1.09 2.53.73 2.99.68.45-.04 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.1-.22-.16-.47-.28z"/>
                </svg>
              </a>

              <a 
                href="https://viber.click/380986241429" 
                onClick={handleViberClick} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="nx-msg-icon-btn"
                title="Viber"
                aria-label="Viber"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.78 15.3c-.63-.44-1.92-1.07-2.73-1.03-.68.04-1.04.57-1.47.98-.37.36-.78.36-1.23.1-.9-.52-1.72-1.17-2.45-1.91-.71-.73-1.34-1.55-1.85-2.46-.26-.45-.25-.86.11-1.23.41-.43.94-.79.98-1.47.04-.81-.59-2.1-1.03-2.73-.42-.6-1.04-.68-1.63-.45-.63.24-1.21.68-1.52 1.31-.5 1.03-.65 2.14-.37 3.23.55 2.15 1.71 4.07 3.32 5.67 1.62 1.61 3.54 2.76 5.69 3.31 1.09.28 2.2.13 3.23-.37.63-.31 1.07-.89 1.31-1.52.23-.59.15-1.21-.45-1.63zM14.9 3.5c-.24 0-.44.18-.48.42-.05.27.13.52.4.56 3.65.57 6.47 3.4 7.04 7.05.04.27.29.45.56.4.27-.04.45-.29.4-.56-.65-4.14-3.86-7.36-8-8.01-.05-.01-.09-.01-.14-.01zm.55 3.14c-.26-.03-.5.15-.53.41-.03.26.15.5.41.53 1.95.27 3.47 1.8 3.74 3.75.03.24.24.42.47.42.02 0 .04 0 .06 0 .26-.03.44-.27.41-.53-.33-2.43-2.22-4.32-4.66-4.66zm.3 2.79c-.27-.06-.53.11-.59.38-.06.27.11.53.38.59.58.13 1.03.58 1.16 1.16.05.24.26.4.5.4.03 0 .06 0 .09-.01.27-.06.44-.32.38-.59-.2-.88-.88-1.56-1.76-1.76z"/>
                </svg>
              </a>

              <a 
                href="https://t.me/ah_favorit_group" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="nx-msg-icon-btn"
                title="Telegram"
                aria-label="Telegram"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-1.97 9.29c-.15.66-.54.82-1.09.51l-3.02-2.22-1.46 1.41c-.16.16-.3.3-.61.3l.22-3.08 5.6-5.06c.24-.22-.05-.34-.38-.13l-6.92 4.36-2.99-.93c-.65-.2-.66-.65.14-.96l11.68-4.5c.54-.2 1.01.12.87.91z"/>
                </svg>
              </a>
            </div>

            <div className="nx-doc-links">
              <button onClick={() => navigate('/about')} className="nx-doc-btn">
                <FileCheck2 size={14} />
                <span>Про компанію та команду</span>
              </button>
              <button onClick={() => navigate('/requisites')} className="nx-doc-btn">
                <FileCheck2 size={14} />
                <span>Реквізити ТОВ «НОВЕКС ІНВЕСТ»</span>
              </button>
            </div>
          </div>

          {/* Brand Identity & Location Column (RIGHT SIDE) */}
          <div className="nx-footer-col nx-brand-block">
            <div className="nx-brand-header" onClick={() => navigate('/')} title="ФАВОРИТ ГРУП">
              <img 
                src="/logo-footer-white.png" 
                alt="ФАВОРИТ ГРУП" 
                className="nx-brand-logo-img" 
              />
              <span className="nx-brand-subtitle">Агентство нерухомості • Полтава</span>
            </div>

            <p className="nx-brand-text">
              Агентство нерухомості в Полтаві. Повна юридична перевірка кожного об'єкта, прозорі договори та безпечний супровід угод.
            </p>

            <div className="nx-meta-contacts">
              <div className="nx-mc-row">
                <MapPin size={15} className="text-primary" />
                <span>м. Полтава, вул. Соборності, 22</span>
              </div>
              <div className="nx-mc-row">
                <Clock size={15} className="text-primary" />
                <span>Щоденно: 10:00 — 18:00 (без вихідних)</span>
              </div>
              <div className="nx-mc-row">
                <Phone size={15} className="text-primary" />
                <span>+380 (98) 624-14-29</span>
              </div>
              <div className="nx-mc-row">
                <Mail size={15} className="text-primary" />
                <span>ah.favorit.group@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Certification Bar */}
        <div className="nx-bottom-bar">
          <div className="nx-bb-left">
            <span>© {new Date().getFullYear()} АН «ФАВОРИТ ГРУП» (ТОВ «НОВЕКС ІНВЕСТ», ЄДРПОУ 43980756). Всі права захищено.</span>
          </div>

          <div className="nx-bb-right">
            <button onClick={() => navigate('/privacy')} className="nx-legal-footer-link">Політика конфіденційності</button>
            <span className="nx-bb-divider">•</span>
            <button onClick={() => navigate('/terms')} className="nx-legal-footer-link">Публічна оферта</button>
            <span className="nx-bb-divider">•</span>
            <button onClick={() => navigate('/requisites')} className="nx-legal-footer-link">Реквізити</button>
          </div>
        </div>
      </div>

      {/* Scoped CSS for Modern Footer */}
      <style>{`
        .nx-footer {
          background: #090d16;
          color: #94a3b8;
          padding: 0 0 32px;
          border-top: none;
          position: relative;
        }

        /* 1. Global Full-width Panoramic Poltava Pre-Footer Separator Strip */
        .nx-prefooter-strip {
          position: relative;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.74) 0%, rgba(15, 23, 42, 0.88) 100%),
                      url('/images/poltava-prefooter.jpg') center 42%/cover no-repeat;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #1e293b;
          padding: 40px 0;
          overflow: hidden;
          margin-bottom: 48px;
        }

        .nx-pfs-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(37, 99, 235, 0.14) 0%, rgba(15, 23, 42, 0.45) 100%);
          backdrop-filter: blur(1.5px);
          pointer-events: none;
        }

        .nx-pfs-container {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
        }

        .nx-pfs-left {
          flex: 1;
        }

        .nx-pfs-title {
          font-size: 1.5rem;
          font-weight: 900;
          color: #ffffff;
          margin-bottom: 6px;
          letter-spacing: -0.3px;
        }

        .nx-pfs-desc {
          font-size: 0.92rem;
          color: #cbd5e1;
          max-width: 680px;
          line-height: 1.55;
          margin: 0;
        }

        .nx-pfs-right {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
        }

        .nx-pfs-phone-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.22);
          backdrop-filter: blur(8px);
          border-radius: 12px;
          padding: 9px 16px;
          color: #ffffff;
          transition: all 0.2s ease;
        }

        .nx-pfs-phone-btn:hover {
          background: rgba(255, 255, 255, 0.18);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-2px);
          color: #ffffff;
        }

        .nx-ppb-text {
          display: flex;
          flex-direction: column;
        }

        .nx-ppb-label {
          font-size: 0.68rem;
          color: #94a3b8;
          font-weight: 600;
          text-transform: uppercase;
        }

        .nx-ppb-num {
          font-size: 0.95rem;
          font-weight: 800;
          color: #ffffff;
        }

        .nx-pfs-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          font-size: 0.9rem;
          font-weight: 800;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(245, 158, 11, 0.35);
          white-space: nowrap;
        }

        @media (max-width: 900px) {
          .nx-pfs-container {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
          .nx-pfs-right {
            width: 100%;
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }
          .nx-pfs-phone-btn {
            justify-content: center;
          }
          .nx-pfs-action-btn {
            justify-content: center;
          }
        }

        /* Clean Separator Divider */
        .nx-footer-divider {
          width: 100%;
          height: 1px;
          background: #1e293b;
          margin-bottom: 44px;
        }

        /* 2. Main Grid */
        .nx-footer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1.1fr 1.35fr;
          gap: 40px;
          padding-bottom: 48px;
          border-bottom: 1px solid #1e293b;
        }

        .nx-brand-header {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
          cursor: pointer;
          margin-bottom: 14px;
        }

        .nx-brand-logo-img {
          height: 48px;
          max-height: 52px;
          width: auto;
          object-fit: contain;
          border-radius: 0;
          box-shadow: none;
          flex-shrink: 0;
          display: block;
          transition: transform 0.2s ease;
        }

        .nx-brand-header:hover .nx-brand-logo-img {
          transform: scale(1.03);
        }

        .nx-brand-subtitle {
          display: block;
          font-size: 0.76rem;
          color: #94a3b8;
          font-weight: 600;
          letter-spacing: 0.2px;
        }

        .nx-brand-text {
          font-size: 0.86rem;
          color: #94a3b8;
          line-height: 1.6;
          margin-bottom: 18px;
        }

        .nx-legal-subtle {
          font-size: 0.78rem;
          color: #64748b;
          font-weight: 500;
          margin-bottom: 18px;
        }

        .nx-meta-contacts {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .nx-mc-row {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 0.82rem;
          color: #cbd5e1;
        }

        .nx-col-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 18px;
          letter-spacing: 0.2px;
        }

        .nx-col-nav {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .nx-col-nav button {
          font-size: 0.85rem;
          color: #94a3b8;
          text-align: left;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
          padding: 0;
        }

        .nx-col-nav button:hover {
          color: #60a5fa;
          transform: translateX(4px);
        }

        .nx-connect-desc {
          font-size: 0.84rem;
          color: #94a3b8;
          line-height: 1.5;
          margin-bottom: 14px;
        }

        .nx-messengers-icons {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
        }

        .nx-msg-icon-btn {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 8px;
          color: #94a3b8;
          transition: all 0.2s ease;
        }

        .nx-msg-icon-btn:hover {
          background: #334155;
          color: #ffffff;
          border-color: #475569;
          transform: translateY(-2px);
        }

        .nx-doc-links {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nx-doc-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #94a3b8;
          background: transparent;
          border: 1px solid #1e293b;
          border-radius: 6px;
          padding: 7px 12px;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
        }

        .nx-doc-btn:hover {
          color: #ffffff;
          border-color: #334155;
          background: #1e293b;
        }

        /* 3. Bottom Bar */
        .nx-bottom-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 24px;
          font-size: 0.8rem;
          color: #64748b;
          flex-wrap: wrap;
          gap: 16px;
        }

        .nx-bb-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .nx-legal-footer-link {
          background: none;
          border: none;
          padding: 0;
          color: #94a3b8;
          font-size: 0.78rem;
          cursor: pointer;
          transition: color 0.15s ease;
        }

        .nx-legal-footer-link:hover {
          color: #ffffff;
          text-decoration: underline;
        }

        .nx-bb-divider {
          color: #334155;
          font-size: 0.75rem;
        }

        @media (max-width: 1024px) {
          .nx-prefooter-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .nx-pfc-right {
            width: 100%;
            flex-wrap: wrap;
          }
          .nx-footer-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .nx-footer-grid {
            grid-template-columns: 1fr;
          }
          .nx-pfc-phone-btn, .nx-pfc-action-btn {
            width: 100%;
            justify-content: center;
          }
          .nx-footer {
            padding-bottom: 95px; /* Clear mobile bottom nav */
          }
        }
      `}</style>
    </footer>
  );
};
