import React from 'react';
import { ShieldCheck, Award, Users, Clock, CheckCircle2, Lock } from 'lucide-react';

export const TrustSection = () => {
  return (
    <section className="trust-section">
      <div className="container">
        {/* Core Pillars */}
        <div className="pillars-grid">
          <div className="pillar-item">
            <div className="pillar-icon">
              <ShieldCheck size={28} />
            </div>
            <h4>Офіційна реєстрація та юридична відповідальність</h4>
            <p>Працюємо як зареєстроване товариство «ФАВОРИТ ГРУП» (ТОВ «НОВЕКС ІНВЕСТ», код ЄДРПОУ 43980756). Всі відносини з клієнтами закріплюються офіційним договором.</p>
          </div>

          <div className="pillar-item">
            <div className="pillar-icon">
              <Lock size={28} />
            </div>
            <h4>Безпека розрахунків та завдатків</h4>
            <p>Фіксація домовленостей через нотаріально посвідчені попередні договори. Захист покупця від втрати завдатку та захист продавця від зриву термінів.</p>
          </div>

          <div className="pillar-item">
            <div className="pillar-icon">
              <Award size={28} />
            </div>
            <h4>Без прихованих комісій та платежів</h4>
            <p>Фіксований та прозорий розмір винагороди, що сплачується виключно за фактом успішного укладення угоди у нотаріуса.</p>
          </div>
        </div>
      </div>

      <style>{`
        .trust-section {
          padding: 48px 0 60px;
          background: #ffffff;
        }

        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }

        .pillar-item {
          background: #f8fafc;
          border: 1px solid var(--c-border);
          border-radius: var(--radius-lg);
          padding: 28px;
          transition: all 0.2s ease;
        }

        .pillar-item:hover {
          border-color: #cbd5e1;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
        }

        .pillar-icon {
          width: 54px;
          height: 54px;
          border-radius: var(--radius-md);
          background: var(--c-primary-light);
          color: var(--c-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }

        .pillar-item h4 {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--c-slate);
          margin-bottom: 10px;
          line-height: 1.35;
        }

        .pillar-item p {
          font-size: 0.88rem;
          color: #64748b;
          line-height: 1.55;
          margin: 0;
        }

        @media (max-width: 1024px) {
          .pillars-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
      `}</style>
    </section>
  );
};
