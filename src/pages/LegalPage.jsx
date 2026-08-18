import React from 'react';
import { useRouter } from '../context/RouterContext';

export const LegalPage = () => {
  const { navigate } = useRouter();

  return (
    <div className="req-page-wrapper">
      <div className="container">
        <div className="req-content-container">
          {/* Breadcrumbs */}
          <nav aria-label="Хлібні крихти" className="req-breadcrumbs">
            <button onClick={() => navigate('/')} className="req-crumb-link">Головна</button>
            <span className="req-crumb-sep">/</span>
            <span className="req-crumb-current">Реєстраційні дані</span>
          </nav>

          {/* Page Header */}
          <div className="req-header">
            <h1 className="req-title">Реєстраційні дані ТОВ "НОВЕКС ІНВЕСТ"</h1>
            <p className="req-subtitle">
              ФАВОРИТ ГРУП — комерційна назва ТОВ «НОВЕКС ІНВЕСТ» (код ЄДРПОУ 43980756). Компанія здійснює професійну рієлторську діяльність з купівлі, продажу та оренди нерухомості у м. Полтава.
            </p>
          </div>

          <div className="req-divider"></div>

          {/* Details Section */}
          <div className="req-section">
            <div className="req-box-title-row">
              <span className="req-accent-bar"></span>
              <h2 className="req-box-title">Реєстраційні відомості</h2>
            </div>

            <div className="req-fields-list">
              <div className="req-field-item">
                <span className="req-label">ПОВНЕ НАЙМЕНУВАННЯ:</span>
                <span className="req-value">ТОВАРИСТВО З ОБМЕЖЕНОЮ ВІДПОВІДАЛЬНІСТЮ "НОВЕКС ІНВЕСТ"</span>
              </div>

              <div className="req-field-item">
                <span className="req-label">СКОРОЧЕНА НАЗВА:</span>
                <span className="req-value">ТОВ "НОВЕКС ІНВЕСТ"</span>
              </div>

              <div className="req-field-item">
                <span className="req-label">КОД ЄДРПОУ:</span>
                <span className="req-value font-mono">43980756</span>
              </div>

              <div className="req-field-item">
                <span className="req-label">ЮРИДИЧНА АДРЕСА:</span>
                <span className="req-value">36014, Україна, Полтавська обл., м. Полтава, вул. Європейська, буд. 2, офіс 202</span>
              </div>

              <div className="req-field-item">
                <span className="req-label">ФАКТИЧНА АДРЕСА ОФІСУ (ПРИЙОМ КЛІЄНТІВ):</span>
                <span className="req-value">36020, Україна, м. Полтава, вул. Соборності, 22</span>
              </div>

              <div className="req-field-item">
                <span className="req-label">КЕРІВНИК (ДИРЕКТОР):</span>
                <span className="req-value">Омельяненко Владислав Юрійович</span>
              </div>

              <div className="req-field-item">
                <span className="req-label">КОНТАКТНИЙ ТЕЛЕФОН:</span>
                <a href="tel:+380986241429" className="req-value req-link font-mono">+380 (98) 624-14-29</a>
              </div>

              <div className="req-field-item">
                <span className="req-label">ЕЛЕКТРОННА ПОШТА (EMAIL):</span>
                <a href="mailto:ah.favorit.group@gmail.com" className="req-value req-link">ah.favorit.group@gmail.com</a>
              </div>

              <div className="req-field-item">
                <span className="req-label">РЕЖИМ РОБОТИ ОФІСУ:</span>
                <span className="req-value">Пн–Нд: 10:00 — 18:00 (без вихідних)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .req-page-wrapper {
          background: #ffffff;
          min-height: calc(100vh - 200px);
          padding: 40px 0 80px;
        }

        .req-content-container {
          max-width: 860px;
          margin: 0 auto;
        }

        .req-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.86rem;
          margin-bottom: 24px;
        }

        .req-crumb-link {
          background: none;
          border: none;
          padding: 0;
          color: #2563eb;
          cursor: pointer;
          font-weight: 600;
        }

        .req-crumb-link:hover {
          text-decoration: underline;
        }

        .req-crumb-sep {
          color: #94a3b8;
        }

        .req-crumb-current {
          color: #64748b;
        }

        .req-header {
          margin-bottom: 24px;
        }

        .req-title {
          font-size: 2.1rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0 0 14px 0;
          letter-spacing: -0.4px;
          line-height: 1.25;
        }

        .req-subtitle {
          font-size: 1rem;
          color: #475569;
          line-height: 1.65;
          margin: 0;
        }

        .req-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 32px 0;
        }

        .req-section {
          padding-top: 8px;
        }

        .req-box-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 30px;
        }

        .req-accent-bar {
          width: 4px;
          height: 24px;
          background: #65a30d;
          border-radius: 2px;
          flex-shrink: 0;
        }

        .req-box-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.2px;
        }

        .req-fields-list {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .req-field-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .req-label {
          font-size: 0.76rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #64748b;
        }

        .req-value {
          font-size: 1.02rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.5;
        }

        .req-link {
          text-decoration: none;
          color: #0f172a;
          transition: color 0.15s ease;
          width: fit-content;
        }

        .req-link:hover {
          color: #2563eb;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .req-page-wrapper {
            padding: 24px 0 50px;
          }
          .req-title {
            font-size: 1.6rem;
          }
          .req-subtitle {
            font-size: 0.92rem;
          }
          .req-value {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
};
