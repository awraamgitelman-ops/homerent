import React from 'react';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export const TrustSection = () => {
  return (
    <section className="trust-strip-section">
      <div className="container">
        <div className="trust-strip-wrapper">
          <div className="trust-strip-header">
            <div className="tsh-badge">
              <ShieldCheck size={18} />
              <span>Стандарти безпеки</span>
            </div>
            <h3 className="tsh-title">Гарантії захисту кожної угоди</h3>
          </div>

          <div className="trust-strip-items">
            <div className="trust-strip-item">
              <div className="tsi-icon">
                <ShieldCheck size={22} />
              </div>
              <div className="tsi-body">
                <h4>Юридична відповідальність</h4>
                <p>Офіційний договір із ТОВ «НОВЕКС ІНВЕСТ» (ЄДРПОУ 43980756). Повна правова перевірка об'єкта перед угодою.</p>
              </div>
            </div>

            <div className="trust-strip-divider" />

            <div className="trust-strip-item">
              <div className="tsi-icon">
                <Lock size={22} />
              </div>
              <div className="tsi-body">
                <h4>Безпека розрахунків</h4>
                <p>Нотаріальне оформлення попередніх договорів, фіксація домовленостей та захист передачі завдатку.</p>
              </div>
            </div>

            <div className="trust-strip-divider" />

            <div className="trust-strip-item">
              <div className="tsi-icon">
                <CheckCircle2 size={22} />
              </div>
              <div className="tsi-body">
                <h4>Прозорість умов</h4>
                <p>Фіксована комісія за договором без прихованих платежів — оплата виключно за результатом угоди.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .trust-strip-section {
          padding: 20px 0 50px;
          background: #f8fafc;
        }

        .trust-strip-wrapper {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 32px 38px;
          box-shadow: 0 4px 20px -4px rgba(15, 23, 42, 0.04);
        }

        .trust-strip-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          padding-bottom: 18px;
          border-bottom: 1px solid #f1f5f9;
        }

        .tsh-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #eff6ff;
          color: #1e3a8a;
          padding: 6px 14px;
          border-radius: 30px;
          font-size: 0.82rem;
          font-weight: 700;
        }

        .tsh-title {
          font-size: 1.3rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.2px;
        }

        .trust-strip-items {
          display: grid;
          grid-template-columns: 1fr auto 1fr auto 1fr;
          align-items: center;
          gap: 28px;
        }

        .trust-strip-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .tsi-icon {
          width: 44px;
          height: 44px;
          min-width: 44px;
          border-radius: 12px;
          background: #eff6ff;
          color: #1e3a8a;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tsi-body h4 {
          font-size: 1.02rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 6px;
          line-height: 1.3;
        }

        .tsi-body p {
          font-size: 0.86rem;
          color: #64748b;
          line-height: 1.5;
          margin: 0;
        }

        .trust-strip-divider {
          width: 1px;
          height: 56px;
          background: #e2e8f0;
        }

        @media (max-width: 1024px) {
          .trust-strip-wrapper {
            padding: 24px 20px;
          }

          .trust-strip-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .trust-strip-items {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .trust-strip-divider {
            display: none;
          }
        }
      `}</style>
    </section>
  );
};
