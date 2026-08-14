import React from 'react';
import { useRouter } from '../context/RouterContext';
import { 
  Building, 
  ShieldCheck, 
  Award, 
  Users, 
  CheckCircle2, 
  PhoneCall,
  FileText
} from 'lucide-react';

export const AboutPage = ({ onOpenConsultModal }) => {
  const { navigate } = useRouter();

  return (
    <div className="about-page-wrapper">
      <div className="about-hero">
        <div className="container text-center">
          <span className="badge badge-blue mb-2">Про компанію</span>
          <h1 className="ah-title">ТОВ «НОВЕКС ІНВЕСТ» — Ваш надійний партнер у Полтаві</h1>
          <p className="ah-subtitle">
            Професійне агентство нерухомості з бездоганною репутацією, прозорими умовами та гарантією безпеки кожної угоди.
          </p>
        </div>
      </div>

      <div className="container py-5">
        <div className="about-grid">
          <div className="about-text-col">
            <h2>Хто ми такі?</h2>
            <p>
              **ТОВ «НОВЕКС ІНВЕСТ»** (код ЄДРПОУ 43980756) — офіційно зареєстроване українське підприємство, що спеціалізується на операціях з нерухомістю (КВЕД 68.31), купівлі, продажу та управлінні житловим і комерційним фондом у місті Полтава та прилеглих районах.
            </p>
            <p>
              Ми об'єднали досвідчених рієлторів, юристів у сфері речових прав та сертифікованих оцінювачів, щоб надати клієнтам сервіс європейського рівня без бюрократії та ризиків.
            </p>

            <h3 className="mt-4">Наші ключові принципи:</h3>
            <ul className="principles-list">
              <li>
                <CheckCircle2 size={18} className="text-green" />
                <div>
                  <strong>100% юридична перевірка:</strong> Жоден об'єкт не виставляється на продаж без перевірки в ДРРП, судових реєстрах та реєстрах боржників.
                </div>
              </li>
              <li>
                <CheckCircle2 size={18} className="text-green" />
                <div>
                  <strong>Фіксована комісія:</strong> Жодних прихованих платежів — оплата здійснюється лише за фактом успішної угоди.
                </div>
              </li>
              <li>
                <CheckCircle2 size={18} className="text-green" />
                <div>
                  <strong>Офіційний договір:</strong> Захист інтересів обох сторін (покупця та продавця) у правовому полі України.
                </div>
              </li>
            </ul>

            <div className="about-actions mt-4">
              <button onClick={() => navigate('#/requisites')} className="btn btn-outline">
                <FileText size={16} />
                <span>Переглянути реєстраційні дані (ЄДРПОУ 43980756)</span>
              </button>
            </div>
          </div>

          {/* Legal Facts Box */}
          <div className="about-card-col">
            <div className="official-facts-card">
              <div className="ofc-header">
                <ShieldCheck size={28} className="text-primary" />
                <div>
                  <h4>Офіційні реквізити</h4>
                  <span>ТОВ «НОВЕКС ІНВЕСТ»</span>
                </div>
              </div>

              <div className="ofc-body">
                <div className="ofc-row">
                  <span>Код ЄДРПОУ:</span>
                  <strong>43980756</strong>
                </div>
                <div className="ofc-row">
                  <span>Керівник:</span>
                  <strong>Омельяненко Владислав Юрійович</strong>
                </div>
                <div className="ofc-row">
                  <span>Основний КВЕД:</span>
                  <strong>68.31 Агентства нерухомості</strong>
                </div>
                <div className="ofc-row">
                  <span>Юридична адреса:</span>
                  <strong>м. Полтава, вул. Європейська, буд. 2, оф. 202</strong>
                </div>
                <div className="ofc-row">
                  <span>Телефон:</span>
                  <strong>+380 (98) 861-29-38</strong>
                </div>
                <div className="ofc-row">
                  <span>Email:</span>
                  <strong>novexinvest.poltava@gmail.com</strong>
                </div>
              </div>

              <button onClick={onOpenConsultModal} className="btn btn-primary btn-block mt-3">
                <PhoneCall size={16} />
                <span>Зв'язатися з керівником</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .about-hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
          color: #ffffff;
          padding: 45px 0;
        }

        .ah-title {
          font-size: 2.2rem;
          font-weight: 900;
          color: #ffffff;
          margin-bottom: 8px;
        }

        .ah-subtitle {
          font-size: 0.95rem;
          color: #cbd5e1;
          max-width: 760px;
          margin: 0 auto;
        }

        .about-grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 40px;
          align-items: start;
        }

        .about-text-col h2 {
          font-size: 1.8rem;
          margin-bottom: 16px;
        }

        .about-text-col p {
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 14px;
        }

        .principles-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 12px;
        }

        .principles-list li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.9rem;
          color: #334155;
        }

        .official-facts-card {
          background: #f8fafc;
          border: 1px solid var(--c-border);
          border-radius: var(--radius-lg);
          padding: 28px;
          box-shadow: var(--shadow-md);
        }

        .ofc-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--c-border);
          margin-bottom: 16px;
        }

        .ofc-header h4 {
          font-size: 1.15rem;
          color: var(--c-slate);
        }

        .ofc-header span {
          font-size: 0.8rem;
          color: var(--c-muted);
        }

        .ofc-body {
          display: flex;
          flex-direction: column;
          gap: 12px;
          font-size: 0.88rem;
        }

        .ofc-row {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px dashed #e2e8f0;
          padding-bottom: 8px;
        }

        .ofc-row span {
          color: #64748b;
        }

        .ofc-row strong {
          color: var(--c-dark);
          text-align: right;
        }

        @media (max-width: 860px) {
          .about-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
