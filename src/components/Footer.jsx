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
  Copy,
  Sparkles
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
    <footer className="nx-footer">
      <div className="container">
        {/* 1. Pre-Footer Action Banner */}
        <div className="nx-prefooter-card">
          <div className="nx-pfc-left">
            <div className="nx-pfc-badge">
              <Sparkles size={14} />
              <span>Індивідуальний підбір нерухомості</span>
            </div>
            <h3 className="nx-pfc-title">Потрібна допомога у виборі чи продажу житла в Полтаві?</h3>
            <p className="nx-pfc-desc">
              Залиште заявку на безкоштовну консультацію юриста або отримайте персональну добірку з 1 198+ об'єктів без комісійних націнок.
            </p>
          </div>
          <div className="nx-pfc-right">
            <a href="tel:+380988612938" className="nx-pfc-phone-btn">
              <PhoneCall size={18} />
              <div className="nx-ppb-text">
                <span className="nx-ppb-label">Гаряча лінія агенції</span>
                <span className="nx-ppb-num">+380 (98) 861-29-38</span>
              </div>
            </a>
            <button 
              onClick={onOpenConsultModal} 
              className="btn btn-primary nx-pfc-action-btn"
            >
              <span>Замовити консультацію</span>
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>

        {/* 2. Main Footer Grid (Brand moved to the RIGHT) */}
        <div className="nx-footer-grid">
          {/* Navigation Hub */}
          <div className="nx-footer-col">
            <h4 className="nx-col-title">Каталог та пошук</h4>
            <ul className="nx-col-nav">
              <li><button onClick={() => navigate('#/catalog')}>Оренда квартир</button></li>
              <li><button onClick={() => navigate('#/catalog')}>Купівля квартир у Полтаві</button></li>
              <li><button onClick={() => navigate('#/catalog')}>Будинки та котеджі</button></li>
              <li><button onClick={() => navigate('#/catalog')}>Комерційна нерухомість</button></li>
              <li><button onClick={() => navigate('#/map')}>Інтерактивна карта об'єктів</button></li>
              <li><button onClick={() => navigate('#/services')}>Всі послуги агентства</button></li>
            </ul>
          </div>

          {/* Popular Poltava Districts */}
          <div className="nx-footer-col">
            <h4 className="nx-col-title">Популярні райони</h4>
            <ul className="nx-col-nav">
              <li><button onClick={() => navigate('#/catalog')}>Центр та Корпусний сад</button></li>
              <li><button onClick={() => navigate('#/catalog')}>Левада та Поділ</button></li>
              <li><button onClick={() => navigate('#/catalog')}>Алмазний та Сади</button></li>
              <li><button onClick={() => navigate('#/catalog')}>Огнівка та Мотель</button></li>
              <li><button onClick={() => navigate('#/catalog')}>Половки та Браїлки</button></li>
              <li><button onClick={() => navigate('#/catalog')}>Інститут зв'язку та Юрівка</button></li>
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
                href="https://viber.click/380988612938" 
                onClick={handleViberClick} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="nx-msg-icon-btn"
                title="Viber"
                aria-label="Viber"
              >
                <MessageSquare size={17} />
              </a>

              <a 
                href="https://t.me/novexinvest" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="nx-msg-icon-btn"
                title="Telegram"
                aria-label="Telegram"
              >
                <Send size={17} />
              </a>

              <a 
                href="https://wa.me/380988612938" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="nx-msg-icon-btn"
                title="WhatsApp"
                aria-label="WhatsApp"
              >
                <Phone size={17} />
              </a>
            </div>

            <div className="nx-doc-links">
              <button onClick={() => navigate('#/about')} className="nx-doc-btn">
                <FileCheck2 size={14} />
                <span>Про компанію та команду</span>
              </button>
            </div>
          </div>

          {/* Brand Identity & Location Column (RIGHT SIDE) */}
          <div className="nx-footer-col nx-brand-block">
            <div className="nx-brand-header" onClick={() => navigate('#/')} title="ФАВОРИТ ГРУП">
              <img 
                src="/logo-footer-white.png" 
                alt="ФАВОРИТ ГРУП" 
                className="nx-brand-logo-img" 
              />
              <span className="nx-brand-subtitle">Агентство нерухомості • Полтава</span>
            </div>

            <p className="nx-brand-text">
              Офіційне агентство нерухомості Полтави. Повна юридична перевірка кожного об'єкта, прозорі договори та безпечний супровід угод.
            </p>

            <div className="nx-legal-subtle">
              <span>ТОВ «НОВЕКС ІНВЕСТ» • ЄДРПОУ 43980756</span>
            </div>

            <div className="nx-meta-contacts">
              <div className="nx-mc-row">
                <MapPin size={15} className="text-primary" />
                <span>м. Полтава, вул. Соборності, 22</span>
              </div>
              <div className="nx-mc-row">
                <Clock size={15} className="text-primary" />
                <span>Пн–Нд: 09:00 — 20:00 (без вихідних)</span>
              </div>
              <div className="nx-mc-row">
                <Mail size={15} className="text-primary" />
                <span>novexinvest.poltava@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Certification Bar */}
        <div className="nx-bottom-bar">
          <div className="nx-bb-left">
            <span>© {new Date().getFullYear()} ТОВ «НОВЕКС ІНВЕСТ». Всі права захищено.</span>
            <span className="nx-bb-divider">/</span>
            <span>Ліцензована діяльність у м. Полтава</span>
          </div>

          <div className="nx-bb-right">
            <span className="nx-office-subtle">Офіс приймає клієнтів: Полтава, вул. Соборності, 22</span>
          </div>
        </div>
      </div>

      {/* Scoped CSS for Modern Footer */}
      <style>{`
        .nx-footer {
          background: #090d16;
          color: #94a3b8;
          padding: 60px 0 30px;
          border-top: 1px solid #1e293b;
          position: relative;
        }

        /* 1. Pre-Footer Action Banner */
        .nx-prefooter-card {
          background: linear-gradient(135deg, #172554 0%, #1e1b4b 100%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          padding: 32px 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          margin-bottom: 56px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        }

        .nx-pfc-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.76rem;
          font-weight: 700;
          color: #93c5fd;
          margin-bottom: 10px;
        }

        .nx-pfc-title {
          font-size: 1.45rem;
          font-weight: 900;
          color: #ffffff;
          margin-bottom: 6px;
          letter-spacing: -0.3px;
        }

        .nx-pfc-desc {
          font-size: 0.9rem;
          color: #cbd5e1;
          max-width: 600px;
          line-height: 1.5;
        }

        .nx-pfc-right {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
        }

        .nx-pfc-phone-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 12px;
          padding: 10px 18px;
          color: #ffffff;
          transition: all 0.2s ease;
        }

        .nx-pfc-phone-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: #60a5fa;
        }

        .nx-ppb-text {
          display: flex;
          flex-direction: column;
        }

        .nx-ppb-label {
          font-size: 0.7rem;
          color: #94a3b8;
          font-weight: 600;
        }

        .nx-ppb-num {
          font-size: 0.95rem;
          font-weight: 800;
          color: #ffffff;
        }

        .nx-pfc-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 22px;
          font-size: 0.9rem;
          font-weight: 800;
          border-radius: 12px;
          background: #2563eb;
          border-color: #2563eb;
          white-space: nowrap;
        }

        .nx-pfc-action-btn:hover {
          background: #1d4ed8;
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

        .nx-bb-left {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .nx-bb-divider {
          color: #334155;
        }

        .nx-office-subtle {
          font-size: 0.78rem;
          color: #64748b;
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
