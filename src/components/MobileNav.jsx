import React from 'react';
import { useRouter } from '../context/RouterContext';
import { 
  Home, 
  Building2, 
  PlusCircle, 
  MapPin, 
  PhoneCall 
} from 'lucide-react';

export const MobileNav = ({ onOpenSellModal }) => {
  const { currentPath, navigate } = useRouter();

  return (
    <nav className="mobile-fixed-bottom-bar" aria-label="Мобільне меню швидкого доступу">
      <button 
        type="button"
        className={`mfb-item ${currentPath === '#/' ? 'active' : ''}`}
        onClick={() => navigate('#/')}
      >
        <Home size={19} />
        <span>Головна</span>
      </button>

      <button 
        type="button"
        className={`mfb-item ${currentPath.includes('/catalog') ? 'active' : ''}`}
        onClick={() => navigate('#/catalog')}
      >
        <Building2 size={19} />
        <span>Каталог</span>
      </button>

      <button 
        type="button"
        className="mfb-item mfb-accent-btn"
        onClick={onOpenSellModal}
      >
        <div className="mfb-icon-circle">
          <PlusCircle size={22} />
        </div>
        <span>Продати</span>
      </button>

      <button 
        type="button"
        className={`mfb-item ${currentPath.includes('/map') ? 'active' : ''}`}
        onClick={() => navigate('#/map')}
      >
        <MapPin size={19} />
        <span>Карта</span>
      </button>

      <a 
        href="tel:+380988612938"
        className="mfb-item"
      >
        <PhoneCall size={19} />
        <span>Дзвінок</span>
      </a>

      <style>{`
        .mobile-fixed-bottom-bar {
          display: none;
        }

        @media (max-width: 640px) {
          .mobile-fixed-bottom-bar {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 68px;
            background: #ffffff;
            border-top: 1px solid var(--c-border);
            box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.08);
            z-index: 999;
            align-items: center;
            justify-content: space-around;
            padding: 0 4px;
          }

          .mfb-item {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 3px;
            font-size: 0.68rem;
            font-weight: 700;
            color: #64748b;
            padding: 6px 0;
            transition: var(--transition);
          }

          .mfb-item.active {
            color: var(--c-primary);
          }

          .mfb-accent-btn {
            position: relative;
            top: -12px;
          }

          .mfb-icon-circle {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: var(--c-accent);
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
            margin-bottom: 2px;
          }
        }
      `}</style>
    </nav>
  );
};
