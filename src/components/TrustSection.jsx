import React from 'react';
import { ShieldCheck, Award, Users, Clock, CheckCircle2, Lock } from 'lucide-react';

export const TrustSection = () => {
  return (
    <section className="trust-section">
      <div className="container">
        {/* Stats Row */}
        <div className="stats-cards-grid">
          <div className="stat-card">
            <span className="sc-big-number">450+</span>
            <span className="sc-stat-label">Успішних угод купівлі-продажу та оренди у Полтаві</span>
          </div>
          <div className="stat-card">
            <span className="sc-big-number">100%</span>
            <span className="sc-stat-label">Юридична чистота та перевірка об'єктів у ДРРП</span>
          </div>
          <div className="stat-card">
            <span className="sc-big-number">14-25</span>
            <span className="sc-stat-label">Днів — середній термін продажу об'єкта під ключ</span>
          </div>
          <div className="stat-card">
            <span className="sc-big-number">3% / 7%</span>
            <span className="sc-stat-label">Супровід державної програми іпотеки «єОселя»</span>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="pillars-grid mt-5">
          <div className="pillar-item">
            <div className="pillar-icon">
              <ShieldCheck size={28} />
            </div>
            <h4>Офіційна реєстрація та юридична відповідальність</h4>
            <p>Працюємо як зареєстроване товариство ТОВ «НОВЕКС ІНВЕСТ» (код ЄДРПОУ 43980756). Всі відносини з клієнтами закріплюються офіційним договором.</p>
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
          padding: 60px 0;
          background: #ffffff;
        }

        .stats-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .stat-card {
          background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%);
          border: 1px solid var(--c-border);
          border-radius: var(--radius-md);
          padding: 24px 20px;
          text-align: center;
        }

        .sc-big-number {
          display: block;
          font-size: 2.2rem;
          font-weight: 900;
          color: var(--c-primary);
          line-height: 1.1;
          margin-bottom: 8px;
        }

        .sc-stat-label {
          font-size: 0.85rem;
          color: #475569;
          font-weight: 600;
          line-height: 1.35;
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
        }

        .pillar-item p {
          font-size: 0.88rem;
          color: #64748b;
          line-height: 1.55;
        }

        @media (max-width: 1024px) {
          .stats-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .pillars-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .stats-cards-grid {
            grid-template-columns: 1fr;
          }
          .sc-big-number {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </section>
  );
};
