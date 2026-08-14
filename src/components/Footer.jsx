import React from 'react';
import { useRouter } from '../context/RouterContext';
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const Footer = ({ onOpenLegalModal }) => {
  const { navigate } = useRouter();

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
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main-grid">
          {/* Col 1: Brand & Registration */}
          <div className="footer-col brand-col">
            <div className="footer-logo" onClick={() => navigate('#/')}>
              <div className="fl-icon"><Building size={22} /></div>
              <div>
                <span className="fl-name">НОВЕКС ІНВЕСТ</span>
                <span className="fl-sub">Агентство нерухомості • Полтава</span>
              </div>
            </div>

            <p className="footer-desc">
              Провідне агентство нерухомості та управління активами у м. Полтава. Повний спектр послуг з купівлі, продажу, оренди та юридичної експертизи житла.
            </p>

            <div className="footer-legal-badge">
              <ShieldCheck size={16} className="text-green" />
              <span>ТОВ «НОВЕКС ІНВЕСТ» • ЄДРПОУ 43980756</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="footer-col">
            <h4 className="footer-heading">Навігація</h4>
            <ul className="footer-links">
              <li><button onClick={() => navigate('#/catalog')}>Каталог об'єктів Полтави</button></li>
              <li><button onClick={() => navigate('#/services')}>Всі послуги агентства</button></li>
              <li><button onClick={() => navigate('#/calculator')}>Іпотечний калькулятор єОселя</button></li>
              <li><button onClick={() => navigate('#/about')}>Про компанію та команду</button></li>
              <li><button onClick={() => navigate('#/requisites')}>Реєстраційні дані та реквізити</button></li>
              <li><button onClick={() => navigate('#/contacts')}>Контакти та офіс</button></li>
            </ul>
          </div>

          {/* Col 3: Popular Poltava Districts */}
          <div className="footer-col">
            <h4 className="footer-heading">Нерухомість у Полтаві</h4>
            <ul className="footer-links">
              <li><button onClick={() => navigate('#/catalog')}>Квартири в Центрі Полтави</button></li>
              <li><button onClick={() => navigate('#/catalog')}>Житло на Леваді та Подолі</button></li>
              <li><button onClick={() => navigate('#/catalog')}>Квартири на Алмазному та Садах</button></li>
              <li><button onClick={() => navigate('#/catalog')}>Будинки та котеджі (Яківці, Розсошенці)</button></li>
              <li><button onClick={() => navigate('#/catalog')}>Новобудови під «єОселя 3%/7%»</button></li>
              <li><button onClick={() => navigate('#/catalog')}>Комерційні приміщення</button></li>
            </ul>
          </div>

          {/* Col 4: Contacts & Office */}
          <div className="footer-col">
            <h4 className="footer-heading">Контактна інформація</h4>
            <div className="footer-contact-list">
              <a href="tel:+380988612938" className="fc-item fc-phone">
                <Phone size={15} className="text-primary" />
                <span>+380 (98) 861-29-38</span>
              </a>

              <div className="fc-messengers">
                <a href="https://t.me/rudmonolit" target="_blank" rel="noopener noreferrer" className="fc-msg fc-tg">
                  Telegram
                </a>
                <a href="https://viber.click/380988612938" onClick={handleViberClick} target="_blank" rel="noopener noreferrer" className="fc-msg fc-vb">
                  Viber
                </a>
                <a href="https://wa.me/380988612938" target="_blank" rel="noopener noreferrer" className="fc-msg fc-wa">
                  WhatsApp
                </a>
              </div>

              <div className="fc-item">
                <Mail size={15} className="text-primary" />
                <span>novexinvest.poltava@gmail.com</span>
              </div>

              <div className="fc-item">
                <MapPin size={15} className="text-primary" />
                <span>м. Полтава, вул. Європейська, буд. 2 (офіс 202)</span>
              </div>

              <div className="fc-item">
                <Clock size={15} className="text-primary" />
                <span>Пн–Нд: 09:00 — 20:00 (без вихідних)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Copyright Bar */}
        <div className="footer-bottom-bar">
          <div className="fbb-left">
            <span>© {new Date().getFullYear()} ТОВ «НОВЕКС ІНВЕСТ». Всі права захищено.</span>
            <span className="sep">•</span>
            <button onClick={() => navigate('#/requisites')} className="fbb-link">
              Офіційні реєстраційні дані (ЄДРПОУ 43980756)
            </button>
          </div>

          <div className="fbb-right">
            <span>м. Полтава, Україна</span>
          </div>
        </div>
      </div>

      <style>{`
        .site-footer {
          background: #0f172a;
          color: #94a3b8;
          padding: 60px 0 30px;
          border-top: 1px solid #1e293b;
        }

        .footer-main-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1.1fr 1.3fr;
          gap: 36px;
          margin-bottom: 40px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          margin-bottom: 16px;
        }

        .fl-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: var(--c-primary);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .fl-name {
          display: block;
          font-size: 1.2rem;
          font-weight: 900;
          color: #ffffff;
          line-height: 1.1;
        }

        .fl-sub {
          display: block;
          font-size: 0.72rem;
          color: #94a3b8;
        }

        .footer-desc {
          font-size: 0.85rem;
          line-height: 1.55;
          margin-bottom: 18px;
          color: #cbd5e1;
        }

        .footer-legal-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          color: #e2e8f0;
          font-weight: 600;
        }

        .footer-heading {
          font-size: 1rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 18px;
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-links button {
          font-size: 0.86rem;
          color: #cbd5e1;
          text-align: left;
        }

        .footer-links button:hover {
          color: #ffffff;
          transform: translateX(3px);
        }

        .footer-contact-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .fc-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.85rem;
          color: #cbd5e1;
        }

        .fc-phone {
          font-weight: 800;
          font-size: 1rem;
          color: #ffffff;
        }

        .fc-messengers {
          display: flex;
          gap: 6px;
        }

        .fc-msg {
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.72rem;
          font-weight: 700;
          color: #ffffff;
        }

        .fc-tg { background: #29b6f6; }
        .fc-vb { background: #7360f2; }
        .fc-wa { background: #25d366; }

        /* Bottom Bar */
        .footer-bottom-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 24px;
          border-top: 1px solid #1e293b;
          font-size: 0.8rem;
          color: #64748b;
          flex-wrap: wrap;
          gap: 12px;
        }

        .fbb-left {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .fbb-link {
          color: #94a3b8;
          text-decoration: underline;
        }

        .fbb-link:hover {
          color: #ffffff;
        }

        @media (max-width: 1024px) {
          .footer-main-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .footer-main-grid {
            grid-template-columns: 1fr;
          }
          .site-footer {
            padding-bottom: 95px; /* Clear mobile bottom nav */
          }
        }
      `}</style>
    </footer>
  );
};
