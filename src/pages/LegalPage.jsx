import React, { useState } from 'react';
import { Copy, Check, Building2, ShieldCheck, FileCheck } from 'lucide-react';

export const LegalPage = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="req-page-wrapper">
      <div className="container py-5">
        <div className="req-main-card">
          {/* Card Header */}
          <div className="req-header">
            <h1 className="req-title">Реєстраційні дані ТОВ "НОВЕКС ІНВЕСТ"</h1>
            <p className="req-subtitle">
              ФАВОРИТ ГРУП — комерційна назва ТОВ «НОВЕКС ІНВЕСТ» (код ЄДРПОУ 43980756). Компанія здійснює професійну рієлторську діяльність з купівлі, продажу та оренди нерухомості у м. Полтава.
            </p>
          </div>

          <div className="req-divider"></div>

          {/* Inner Details Card */}
          <div className="req-inner-box">
            <div className="req-box-title-row">
              <span className="req-accent-bar"></span>
              <h2 className="req-box-title">Реєстраційні відомості</h2>
            </div>

            <div className="req-fields-list">
              <div className="req-field-item">
                <div className="req-label">ПОВНЕ НАЙМЕНУВАННЯ:</div>
                <div className="req-value">ТОВАРИСТВО З ОБМЕЖЕНОЮ ВІДПОВІДАЛЬНІСТЮ "НОВЕКС ІНВЕСТ"</div>
              </div>

              <div className="req-field-item">
                <div className="req-label">СКОРОЧЕНА НАЗВА:</div>
                <div className="req-value">ТОВ "НОВЕКС ІНВЕСТ"</div>
              </div>

              <div className="req-field-item">
                <div className="req-label">КОД ЄДРПОУ:</div>
                <div className="req-edrpou-row">
                  <span className="req-value req-edrpou-green">43980756</span>
                  <button 
                    onClick={() => handleCopy('43980756')} 
                    className="req-copy-btn"
                    title="Скопіювати код ЄДРПОУ"
                  >
                    {copied ? <Check size={13} className="text-green" /> : <Copy size={13} />}
                    <span>{copied ? 'Скопійовано' : 'Копіювати'}</span>
                  </button>
                </div>
              </div>

              <div className="req-field-item">
                <div className="req-label">ЮРИДИЧНА АДРЕСА:</div>
                <div className="req-value">36014, Україна, Полтавська обл., м. Полтава, вул. Європейська, буд. 2, офіс 202</div>
              </div>

              <div className="req-field-item">
                <div className="req-label">ФАКТИЧНА АДРЕСА ОФІСУ (ПРИЙОМ КЛІЄНТІВ):</div>
                <div className="req-value">36020, Україна, м. Полтава, вул. Соборності, 22</div>
              </div>

              <div className="req-field-item">
                <div className="req-label">КЕРІВНИК (ДИРЕКТОР):</div>
                <div className="req-value">Омельяненко Владислав Юрійович</div>
              </div>

              <div className="req-field-item">
                <div className="req-label">КОНТАКТНИЙ ТЕЛЕФОН:</div>
                <a href="tel:+380987204050" className="req-value req-link font-mono">+380 (98) 720-40-50</a>
              </div>

              <div className="req-field-item">
                <div className="req-label">ЕЛЕКТРОННА ПОШТА (EMAIL):</div>
                <a href="mailto:novexinvest.poltava@gmail.com" className="req-value req-link">novexinvest.poltava@gmail.com</a>
              </div>

              <div className="req-field-item">
                <div className="req-label">РЕЖИМ РОБОТИ ОФІСУ:</div>
                <div className="req-value">Пн–Нд: 10:00 — 18:00 (без вихідних)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .req-page-wrapper {
          background: #f8fafc;
          min-height: calc(100vh - 200px);
          padding: 40px 0 60px;
        }

        .req-main-card {
          max-width: 960px;
          margin: 0 auto;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 40px 44px;
          box-shadow: 0 4px 24px rgba(15, 23, 42, 0.05);
        }

        .req-header {
          margin-bottom: 24px;
        }

        .req-title {
          font-size: 1.85rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0 0 12px 0;
          letter-spacing: -0.3px;
        }

        .req-subtitle {
          font-size: 0.95rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
        }

        .req-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 28px 0;
        }

        .req-inner-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 32px 36px;
        }

        .req-box-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 26px;
        }

        .req-accent-bar {
          width: 4px;
          height: 24px;
          background: #65a30d;
          border-radius: 2px;
          flex-shrink: 0;
        }

        .req-box-title {
          font-size: 1.22rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .req-fields-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .req-field-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .req-label {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #64748b;
        }

        .req-value {
          font-size: 0.96rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.45;
        }

        .req-edrpou-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .req-edrpou-green {
          font-size: 1.25rem;
          font-weight: 900;
          color: #16a34a;
          letter-spacing: 0.5px;
        }

        .req-copy-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          padding: 3px 9px;
          font-size: 0.74rem;
          font-weight: 700;
          color: #1e293b;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .req-copy-btn:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
        }

        .req-link {
          text-decoration: none;
          color: #0f172a;
          transition: color 0.15s ease;
        }

        .req-link:hover {
          color: #2563eb;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .req-page-wrapper {
            padding: 20px 0 40px;
          }
          .req-main-card {
            padding: 24px 18px;
            border-radius: 16px;
          }
          .req-title {
            font-size: 1.45rem;
          }
          .req-inner-box {
            padding: 20px 16px;
          }
        }
      `}</style>
    </div>
  );
};
