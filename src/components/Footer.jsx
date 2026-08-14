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

        {/* 2. Main Footer Grid */}
        <div className="nx-footer-grid">
          {/* Brand Identity & Location Column */}
          <div className="nx-footer-col nx-brand-block">
            <div className="nx-brand-header" onClick={() => navigate('#/')}>
              <div className="nx-brand-icon">
                <Building2 size={24} />
              </div>
              <div>
                <span className="nx-brand-title">НОВЕКС ІНВЕСТ</span>
                <span className="nx-brand-subtitle">Агентство нерухомості • Полтава</span>
              </div>
            </div>

            <p className="nx-brand-text">
              Офіційне підприємство у сфері нерухомості Полтави. Повна юридична перевірка кожного об'єкта, прозорі договори та безпечний супровід угод.
            </p>

            <div className="nx-legal-subtle">
              <span>ТОВ «НОВЕКС ІНВЕСТ» • ЄДРПОУ 43980756</span>
            </div>

            <div className="nx-meta-contacts">
              <div className="nx-mc-row">
                <MapPin size={15} className="text-primary" />
                <span>м. Полтава, вул. Європейська, 2, оф. 202</span>
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

            <div className="nx-messengers-grid">
              <a 
                href="https://viber.click/380988612938" 
                onClick={handleViberClick} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="nx-msg-card viber"
              >
                <MessageSquare size={16} />
                <span>Viber</span>
              </a>

              <a 
                href="https://t.me/novexinvest" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="nx-msg-card telegram"
              >
                <Send size={16} />
                <span>Telegram</span>
              </a>

              <a 
                href="https://wa.me/380988612938" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="nx-msg-card whatsapp"
              >
                <Phone size={16} />
                <span>WhatsApp</span>
              </a>
            </div>

            <div className="nx-doc-links">
              <button onClick={() => navigate('#/about')} className="nx-doc-btn">
                <FileCheck2 size={14} />
                <span>Про компанію та команду</span>
              </button>
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
            <div className="nx-status-chip">
              <span className="nx-status-dot"></span>
              <span>Офіс приймає клієнтів: Полтава, вул. Європейська, 2</span>
            </div>
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
          grid-template-columns: 1.35fr 1fr 1.05fr 1.2fr;
          gap: 40px;
          padding-bottom: 48px;
          border-bottom: 1px solid #1e293b;
        }

        .nx-brand-header {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          margin-bottom: 14px;
        }

        .nx-brand-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: #2563eb;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
        }

        .nx-brand-title {
          display: block;
          font-size: 1.25rem;
          font-weight: 900;
          color: #ffffff;
          letter-spacing: -0.3px;
        }

        .nx-brand-subtitle {
          display: block;
          font-size: 0.72rem;
          color: #94a3b8;
          font-weight: 600;
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

        .nx-messengers-grid {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }

        .nx-msg-card {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 10px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 700;
          color: #ffffff;
          transition: transform 0.15s ease, opacity 0.15s ease;
        }

        .nx-msg-card:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }

        .nx-msg-card.viber { background: #7360f2; }
        .nx-msg-card.telegram { background: #0088cc; }
        .nx-msg-card.whatsapp { background: #25d366; }

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

        .nx-status-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.76rem;
          color: #94a3b8;
        }

        .nx-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 8px #22c55e;
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
