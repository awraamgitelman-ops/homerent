import React from 'react';
import { ShieldCheck, FileText, CheckCircle2, Building2, UserCheck, Phone, Mail, MapPin } from 'lucide-react';

export const LegalPage = () => {
  return (
    <div className="legal-page-wrapper">
      <div className="legal-hero">
        <div className="legal-hero-overlay"></div>
        <div className="container legal-hero-content">
          <h1 className="lh-title">Реєстраційні дані та реквізити ТОВ «НОВЕКС ІНВЕСТ»</h1>
          <p className="lh-subtitle">
            Повна публічна інформація з Єдиного державного реєстру юридичних осіб (ЄДРПОУ 43980756) для перевірки на Work.ua, державних реєстрах та банках.
          </p>
        </div>
      </div>

      <div className="container py-5">
        <div className="legal-grid">
          {/* Main Details Table Card */}
          <div className="legal-card main-table-card">
            <h2 className="card-title">
              <FileText size={22} className="text-primary" />
              <span>Загальні реєстраційні відомості</span>
            </h2>

            <div className="table-responsive">
              <table className="legal-table">
                <tbody>
                  <tr>
                    <td className="field-name">Повне найменування:</td>
                    <td className="field-value">
                      <strong>ТОВАРИСТВО З ОБМЕЖЕНОЮ ВІДПОВІДАЛЬНІСТЮ "НОВЕКС ІНВЕСТ"</strong>
                    </td>
                  </tr>
                  <tr>
                    <td className="field-name">Скорочене найменування:</td>
                    <td className="field-value">ТОВ "НОВЕКС ІНВЕСТ"</td>
                  </tr>
                  <tr>
                    <td className="field-name">Код ЄДРПОУ:</td>
                    <td className="field-value">
                      <span className="edrpou-tag">43980756</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="field-name">Дата державної реєстрації:</td>
                    <td className="field-value">12.02.2021</td>
                  </tr>
                  <tr>
                    <td className="field-name">Керівник / Директор:</td>
                    <td className="field-value">
                      <strong>Омельяненко Владислав Юрійович</strong>
                    </td>
                  </tr>
                  <tr>
                    <td className="field-name">Статус юридичної особи:</td>
                    <td className="field-value">
                      <span className="badge badge-green">
                        <CheckCircle2 size={13} /> Зареєстровано, діє
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="field-name">Юридична адреса:</td>
                    <td className="field-value">
                      36020, Україна, Полтавська обл., місто Полтава, вул. Соборності, 22
                    </td>
                  </tr>
                  <tr>
                    <td className="field-name">Податковий статус:</td>
                    <td className="field-value">Платник податку на прибуток на загальних підставах, без податкового боргу</td>
                  </tr>
                  <tr>
                    <td className="field-name">Контактний телефон:</td>
                    <td className="field-value">
                      <a href="tel:+380987204050" className="text-primary font-bold">+380 (98) 720-40-50</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="field-name">Офіційний Email:</td>
                    <td className="field-value">novexinvest.poltava@gmail.com</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* KVEDs & Activities */}
          <div className="legal-card kved-card">
            <h2 className="card-title">
              <Building2 size={22} className="text-primary" />
              <span>Види економічної діяльності (КВЕД-2010)</span>
            </h2>

            <div className="kved-list">
              <div className="kved-item main-kved">
                <span className="kved-code">68.31</span>
                <div className="kved-info">
                  <strong>Діяльність агентств нерухомості (Основний)</strong>
                  <p>Посередництво в купівлі, продажу, оренді житлової та нежитлової нерухомості, експертна оцінка за винагороду.</p>
                </div>
              </div>

              <div className="kved-item">
                <span className="kved-code">68.10</span>
                <div className="kved-info">
                  <strong>Купівля та продаж власного нерухомого майна</strong>
                  <p>Операції з власними квартирами, котеджами, комерційними приміщеннями.</p>
                </div>
              </div>

              <div className="kved-item">
                <span className="kved-code">68.20</span>
                <div className="kved-info">
                  <strong>Надання в оренду й експлуатацію власного чи орендованого майна</strong>
                  <p>Довгострокова та подобова оренда, довірче управління активами інвесторів.</p>
                </div>
              </div>

              <div className="kved-item">
                <span className="kved-code">68.32</span>
                <div className="kved-info">
                  <strong>Управління нерухомим майном за винагороду або на основі контракту</strong>
                  <p>Обслуговування ОСББ, бізнес-центрів, житлових комплексів.</p>
                </div>
              </div>

              <div className="kved-item">
                <span className="kved-code">41.20</span>
                <div className="kved-info">
                  <strong>Будівництво житлових і нежитлових будівель</strong>
                  <p>Будівельні та монтажні роботи, зведення котеджів та таунхаусів.</p>
                </div>
              </div>

              <div className="kved-item">
                <span className="kved-code">43.31–43.39</span>
                <div className="kved-info">
                  <strong>Ремонтно-оздоблювальні роботи та Home Staging</strong>
                  <p>Штукатурні, малярні, столярні роботи, укладання плитки, передпродажна підготовка об'єктів.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .legal-hero {
          position: relative;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.78) 0%, rgba(15, 23, 42, 0.85) 100%),
                      url('/images/poltava-hero.jpg') center 40%/cover no-repeat;
          color: #ffffff;
          padding: 56px 0;
          overflow: hidden;
        }

        .legal-hero-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(37, 99, 235, 0.12) 0%, rgba(15, 23, 42, 0.35) 100%);
          pointer-events: none;
          z-index: 1;
        }

        .legal-hero-content {
          position: relative;
          z-index: 2;
          text-align: left;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .lh-title {
          font-size: 2.2rem;
          font-weight: 900;
          color: #ffffff;
          margin-bottom: 10px;
          text-align: left;
        }

        .lh-subtitle {
          font-size: 1rem;
          color: #cbd5e1;
          max-width: 820px;
          margin: 0;
          text-align: left;
          line-height: 1.55;
        }

        .legal-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 32px;
          align-items: start;
        }

        .legal-card {
          background: #ffffff;
          border: 1px solid var(--c-border);
          border-radius: var(--radius-lg);
          padding: 28px;
          box-shadow: var(--shadow-sm);
        }

        .card-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--c-slate);
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--c-border);
        }

        .legal-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }

        .legal-table td {
          padding: 12px 8px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: top;
        }

        .field-name {
          color: #64748b;
          font-weight: 600;
          width: 38%;
        }

        .field-value {
          color: var(--c-dark);
        }

        .edrpou-tag {
          font-size: 1.1rem;
          font-weight: 900;
          color: var(--c-primary);
          background: var(--c-primary-light);
          padding: 2px 10px;
          border-radius: var(--radius-sm);
          letter-spacing: 1px;
        }

        .kved-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .kved-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          background: #f8fafc;
          padding: 14px;
          border-radius: var(--radius-sm);
          border: 1px solid #e2e8f0;
        }

        .kved-item.main-kved {
          background: var(--c-primary-light);
          border-color: #bfdbfe;
        }

        .kved-code {
          font-size: 1rem;
          font-weight: 900;
          color: var(--c-primary);
          background: #ffffff;
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          box-shadow: var(--shadow-sm);
          white-space: nowrap;
        }

        .kved-info strong {
          display: block;
          font-size: 0.92rem;
          color: var(--c-slate);
          margin-bottom: 2px;
        }

        .kved-info p {
          font-size: 0.78rem;
          color: #64748b;
          margin: 0;
          line-height: 1.4;
        }

        @media (max-width: 960px) {
          .legal-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
