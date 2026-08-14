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
  Copy, 
  Check, 
  FileText,
  HelpCircle,
  Compass,
  Layers
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
    <footer className="nx-editorial-footer">
      <div className="container">
        {/* Top Section: Brand Identity & Direct Contact Cards */}
        <div className="nef-top-section">
          <div className="nef-brand-info">
            <div className="nef-logo-wrap" onClick={() => navigate('#/')}>
              <Building2 size={26} className="nef-logo-icon" />
              <div className="nef-logo-titles">
                <span className="nef-title">НОВЕКС ІНВЕСТ</span>
                <span className="nef-subtitle">Агентство нерухомості</span>
              </div>
            </div>
            
            <p className="nef-manifesto">
              Професійні операції з житловою та комерційною нерухомістю у місті Полтава. Повний комплекс послуг: оренда, купівля, продаж, юридичний аудит та оцінка активів.
            </p>

            <div className="nef-hours">
              <Clock size={14} className="nef-dim-icon" />
              <span>Відділ обслуговування клієнтів: щоденно 09:00 — 20:00</span>
            </div>
          </div>

          {/* Quick Contact Matrix */}
          <div className="nef-contacts-matrix">
            <a href="tel:+380988612938" className="nef-contact-card primary">
              <div className="ncc-icon"><Phone size={18} /></div>
              <div className="ncc-data">
                <span className="ncc-label">Гаряча лінія</span>
                <span className="ncc-val">+380 (98) 861-29-38</span>
              </div>
              <ArrowUpRight size={16} className="ncc-arrow" />
            </a>

            <div className="nef-messengers-row">
              <a 
                href="https://viber.click/380988612938" 
                onClick={handleViberClick} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="nef-msg-btn viber"
              >
                <MessageSquare size={15} />
                <span>Viber</span>
              </a>

              <a 
                href="https://t.me/novexinvest" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="nef-msg-btn telegram"
              >
                <Send size={15} />
                <span>Telegram</span>
              </a>

              <a 
                href="https://wa.me/380988612938" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="nef-msg-btn whatsapp"
              >
                <Phone size={15} />
                <span>WhatsApp</span>
              </a>
            </div>

            <div className="nef-info-row">
              <div className="nef-info-item">
                <MapPin size={14} className="nef-accent-icon" />
                <span>м. Полтава, вул. Європейська, 2 (офіс 202)</span>
              </div>
              <div className="nef-info-item">
                <Mail size={14} className="nef-accent-icon" />
                <span>novexinvest.poltava@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Organized Horizontal Category & District Hubs */}
        <div className="nef-hub-section">
          {/* Categories Strip */}
          <div className="nef-hub-block">
            <div className="nef-hub-header">
              <Layers size={15} className="nef-accent-icon" />
              <span>Категорії нерухомості</span>
            </div>
            <div className="nef-tags-cloud">
              <button onClick={() => navigate('#/catalog')} className="nef-tag">Оренда квартир</button>
              <button onClick={() => navigate('#/catalog')} className="nef-tag">Купівля квартир</button>
              <button onClick={() => navigate('#/catalog')} className="nef-tag">Будинки та котеджі</button>
              <button onClick={() => navigate('#/catalog')} className="nef-tag">Комерційні об'єкти</button>
              <button onClick={() => navigate('#/map')} className="nef-tag">Карта об'єктів Полтави</button>
              <button onClick={() => navigate('#/services')} className="nef-tag">Послуги та супровід</button>
              <button onClick={onOpenConsultModal} className="nef-tag highlight">Безкоштовна консультація</button>
            </div>
          </div>

          {/* Districts Strip */}
          <div className="nef-hub-block">
            <div className="nef-hub-header">
              <Compass size={15} className="nef-accent-icon" />
              <span>Райони міста Полтава</span>
            </div>
            <div className="nef-tags-cloud">
              <button onClick={() => navigate('#/catalog')} className="nef-tag">Центр</button>
              <button onClick={() => navigate('#/catalog')} className="nef-tag">Левада</button>
              <button onClick={() => navigate('#/catalog')} className="nef-tag">Поділ</button>
              <button onClick={() => navigate('#/catalog')} className="nef-tag">Алмазний</button>
              <button onClick={() => navigate('#/catalog')} className="nef-tag">Сади-1</button>
              <button onClick={() => navigate('#/catalog')} className="nef-tag">Сади-2</button>
              <button onClick={() => navigate('#/catalog')} className="nef-tag">Огнівка</button>
              <button onClick={() => navigate('#/catalog')} className="nef-tag">Половки</button>
              <button onClick={() => navigate('#/catalog')} className="nef-tag">Браїлки</button>
              <button onClick={() => navigate('#/catalog')} className="nef-tag">Мотель</button>
              <button onClick={() => navigate('#/catalog')} className="nef-tag">Інститут зв'язку</button>
              <button onClick={() => navigate('#/catalog')} className="nef-tag">Юрівка</button>
              <button onClick={() => navigate('#/catalog')} className="nef-tag">Дублянщина</button>
              <button onClick={() => navigate('#/catalog')} className="nef-tag">Яківці</button>
            </div>
          </div>
        </div>

        {/* Corporate Legal & Verified Credentials Panel */}
        <div className="nef-legal-panel">
          <div className="nef-lp-left">
            <div className="nef-lp-badge">
              <ShieldCheck size={15} className="text-primary" />
              <span>Правова ідентифікація</span>
            </div>
            <div className="nef-lp-company">
              <strong>ТОВАРИСТВО З ОБМЕЖЕНОЮ ВІДПОВІДАЛЬНІСТЮ «НОВЕКС ІНВЕСТ»</strong>
              <span className="nef-lp-kved">Основний вид діяльності: 68.31 Агентства нерухомості</span>
            </div>
          </div>

          <div className="nef-lp-right">
            <div className="nef-edrpou-chip">
              <span>ЄДРПОУ: <strong>43980756</strong></span>
              <button 
                onClick={handleCopyEdrpou} 
                className="nef-copy-btn" 
                title="Копіювати код ЄДРПОУ"
              >
                {copiedEdrpou ? <Check size={13} className="text-green" /> : <Copy size={13} />}
                <span>{copiedEdrpou ? 'Скопійовано' : 'Копіювати'}</span>
              </button>
            </div>

            <div className="nef-lp-links">
              <button onClick={() => navigate('#/about')} className="nef-btn-link">
                <FileText size={14} />
                <span>Про компанію</span>
              </button>
              <button onClick={() => navigate('#/requisites')} className="nef-btn-link">
                <FileText size={14} />
                <span>Реєстраційні дані</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Minimal Copyright Bar */}
        <div className="nef-bottom-bar">
          <div className="nef-bb-left">
            <span>© {new Date().getFullYear()} ТОВ «НОВЕКС ІНВЕСТ». Усі права захищено відповідно до чинного законодавства України.</span>
          </div>
          <div className="nef-bb-right">
            <span>м. Полтава, Україна</span>
          </div>
        </div>
      </div>

      {/* Scoped CSS for Modern Editorial Footer */}
      <style>{`
        .nx-editorial-footer {
          background: #080c14;
          color: #94a3b8;
          padding: 56px 0 32px;
          border-top: 1px solid #1e293b;
          font-family: inherit;
        }

        /* 1. Top Section */
        .nef-top-section {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 48px;
          padding-bottom: 36px;
          border-bottom: 1px solid #1e293b;
          align-items: start;
        }

        .nef-logo-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          margin-bottom: 16px;
        }

        .nef-logo-icon {
          color: #3b82f6;
        }

        .nef-logo-titles {
          display: flex;
          flex-direction: column;
        }

        .nef-title {
          font-size: 1.3rem;
          font-weight: 900;
          color: #ffffff;
          letter-spacing: -0.3px;
        }

        .nef-subtitle {
          font-size: 0.74rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }

        .nef-manifesto {
          font-size: 0.88rem;
          line-height: 1.6;
          color: #94a3b8;
          max-width: 520px;
          margin-bottom: 16px;
        }

        .nef-hours {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: #64748b;
        }

        .nef-dim-icon {
          color: #475569;
        }

        .nef-accent-icon {
          color: #3b82f6;
        }

        /* Contacts Matrix */
        .nef-contacts-matrix {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .nef-contact-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          background: #0f172a;
          border: 1px solid #1e293b;
          border-radius: 12px;
          color: #ffffff;
          transition: all 0.2s ease;
        }

        .nef-contact-card:hover {
          border-color: #3b82f6;
          background: #131d35;
          transform: translateY(-1px);
        }

        .ncc-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          margin-right: 14px;
          flex-shrink: 0;
        }

        .ncc-data {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .ncc-label {
          font-size: 0.72rem;
          color: #94a3b8;
          font-weight: 600;
        }

        .ncc-val {
          font-size: 1.05rem;
          font-weight: 800;
          color: #ffffff;
        }

        .ncc-arrow {
          color: #64748b;
        }

        .nef-messengers-row {
          display: flex;
          gap: 10px;
        }

        .nef-msg-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #ffffff;
          transition: all 0.15s ease;
        }

        .nef-msg-btn:hover {
          opacity: 0.92;
          transform: translateY(-1px);
        }

        .nef-msg-btn.viber { background: #6c5ce7; }
        .nef-msg-btn.telegram { background: #0088cc; }
        .nef-msg-btn.whatsapp { background: #20bf6b; }

        .nef-info-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 4px;
        }

        .nef-info-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: #cbd5e1;
        }

        /* 2. Middle Hubs Section */
        .nef-hub-section {
          padding: 32px 0;
          border-bottom: 1px solid #1e293b;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .nef-hub-block {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .nef-hub-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: #cbd5e1;
        }

        .nef-tags-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .nef-tag {
          padding: 6px 14px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #cbd5e1;
          background: #0f172a;
          border: 1px solid #1e293b;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .nef-tag:hover {
          border-color: #3b82f6;
          color: #ffffff;
          background: #172554;
        }

        .nef-tag.highlight {
          background: #172554;
          color: #93c5fd;
          border-color: #2563eb;
          font-weight: 700;
        }

        .nef-tag.highlight:hover {
          background: #2563eb;
          color: #ffffff;
        }

        /* 3. Legal Panel */
        .nef-legal-panel {
          padding: 28px 0;
          border-bottom: 1px solid #1e293b;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          flex-wrap: wrap;
        }

        .nef-lp-left {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .nef-lp-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.74rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: #60a5fa;
        }

        .nef-lp-company strong {
          display: block;
          font-size: 0.95rem;
          color: #ffffff;
          margin-bottom: 2px;
        }

        .nef-lp-kved {
          font-size: 0.8rem;
          color: #64748b;
        }

        .nef-lp-right {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .nef-edrpou-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #0f172a;
          border: 1px solid #334155;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.8rem;
          color: #e2e8f0;
        }

        .nef-copy-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 4px;
          padding: 3px 6px;
          font-size: 0.72rem;
          color: #cbd5e1;
          cursor: pointer;
        }

        .nef-copy-btn:hover {
          background: #334155;
          color: #ffffff;
        }

        .nef-lp-links {
          display: flex;
          gap: 8px;
        }

        .nef-btn-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 12px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #cbd5e1;
          background: transparent;
          border: 1px solid #1e293b;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .nef-btn-link:hover {
          background: #1e293b;
          color: #ffffff;
          border-color: #334155;
        }

        /* 4. Bottom Bar */
        .nef-bottom-bar {
          padding-top: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.78rem;
          color: #475569;
          flex-wrap: wrap;
          gap: 12px;
        }

        @media (max-width: 900px) {
          .nef-top-section {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .nef-legal-panel {
            flex-direction: column;
            align-items: flex-start;
          }
          .nef-lp-right {
            width: 100%;
            justify-content: flex-start;
          }
        }

        @media (max-width: 600px) {
          .nef-messengers-row {
            flex-direction: column;
          }
          .nef-tags-cloud {
            gap: 6px;
          }
          .nef-tag {
            font-size: 0.78rem;
            padding: 5px 10px;
          }
          .nx-editorial-footer {
            padding-bottom: 95px; /* Clear mobile bottom nav */
          }
        }
      `}</style>
    </footer>
  );
};
