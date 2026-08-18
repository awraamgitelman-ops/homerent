import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  PhoneCall,
  FileText,
  Clock,
  MapPin,
  ArrowRight,
  Copy,
  Check,
  Scale,
  Users,
  BadgeCheck,
  Briefcase
} from 'lucide-react';

export const AboutPage = ({ onOpenConsultModal }) => {
  const { navigate } = useRouter();
  const [copiedEdrpou, setCopiedEdrpou] = useState(false);

  const handleCopyEdrpou = () => {
    navigator.clipboard.writeText('43980756');
    setCopiedEdrpou(true);
    setTimeout(() => setCopiedEdrpou(false), 2000);
  };

  return (
    <div className="about-v2-container">
      {/* 1. Modern Premium Hero Header */}
      <section className="av2-hero">
        <div className="container">
          <h1 className="av2-hero-title">
            АН «ФАВОРИТ ГРУП»
          </h1>
          <p className="av2-hero-tagline">
            Новий стандарт безпеки, прозорості та комфорту у сфері нерухомості міста Полтава.
          </p>
        </div>
      </section>

      {/* 2. Main Narrative & Core Values */}
      <section className="av2-content-section">
        <div className="container">
          <div className="av2-narrative-box">
            <div className="av2-section-heading">
              <span className="av2-sub">Наша місія</span>
              <h2>Створюємо цивілізований та захищений ринок нерухомості</h2>
            </div>
            
            <p className="av2-lead-text">
              <strong>Агентство нерухомості «ФАВОРИТ ГРУП»</strong> — це команда досвідчених фахівців, яка встановлює сучасні стандарти безпеки, прозорості та комфорту у сфері нерухомості міста Полтави. Ми відмовилися від застарілих рієлторських методів на користь повної правової відкритості, фіксованих чесних умов та індивідуального супроводу кожного клієнта.
            </p>
          </div>

          {/* 3. Four Core Security Pillars (Interactive Bento Grid) */}
          <div className="av2-pillars-grid">
            <div className="av2-pillar-card">
              <div className="av2-pillar-icon-box bg-blue">
                <Scale size={24} />
              </div>
              <h3>Глибокий юридичний аудит</h3>
              <p>
                Кожен об'єкт перед розміщенням проходить перевірку в Державному реєстрі речових прав (ДРРП), єдиному реєстрі боржників та базах судових рішень. Ви купуєте або орендуєте житло без обтяжень, арештів чи прихованих власників.
              </p>
            </div>

            <div className="av2-pillar-card">
              <div className="av2-pillar-icon-box bg-emerald">
                <ShieldCheck size={24} />
              </div>
              <h3>Офіційні договори та гарантії</h3>
              <p>
                Працюємо виключно в правовому полі України. Інтереси кожної зі сторін (орендаря, орендодавця, покупця та продавця) чітко зафіксовані в офіційному договорі з прозорими строками та фіксованою вартістю послуг.
              </p>
            </div>

            <div className="av2-pillar-card">
              <div className="av2-pillar-icon-box bg-purple">
                <Users size={24} />
              </div>
              <h3>Персональний експерт</h3>
              <p>
                За вашим запитом закріплюється кваліфікований фахівець, який організовує покази у зручний для вас час, веде переговори щодо ціни та супроводжує підписання документів у нотаріуса.
              </p>
            </div>

            <div className="av2-pillar-card">
              <div className="av2-pillar-icon-box bg-amber">
                <BadgeCheck size={24} />
              </div>
              <h3>Чесна комісія без переплат</h3>
              <p>
                Оплата послуг агенції здійснюється виключно за фактом успішного укладення угоди. Жодних передоплат, «платних переглядів» чи неоголошених витрат під час розрахунку.
              </p>
            </div>
          </div>

          {/* 4. Company Identification & Official Details Card */}
          <div className="av2-legal-banner">
            <div className="av2-legal-left">
              <div className="av2-legal-tag">Про нас</div>
              <h3>ТОВАРИСТВО З ОБМЕЖЕНОЮ ВІДПОВІДАЛЬНІСТЮ «НОВЕКС ІНВЕСТ»</h3>

              <div className="av2-details-list">
                <div className="av2-detail-row">
                  <span className="av2-d-label">Повне найменування:</span>
                  <span className="av2-d-val">ТОВАРИСТВО З ОБМЕЖЕНОЮ ВІДПОВІДАЛЬНІСТЮ "НОВЕКС ІНВЕСТ"</span>
                </div>
                <div className="av2-detail-row">
                  <span className="av2-d-label">Скорочена назва:</span>
                  <span className="av2-d-val">ТОВ "НОВЕКС ІНВЕСТ"</span>
                </div>
                <div className="av2-detail-row">
                  <span className="av2-d-label">Код ЄДРПОУ:</span>
                  <span className="av2-d-val font-mono">43980756</span>
                </div>
                <div className="av2-detail-row">
                  <span className="av2-d-label">Керівник (Директор):</span>
                  <span className="av2-d-val">
                    <strong>Омельяненко Владислав Юрійович</strong> (Керівник ТОВ «НОВЕКС ІНВЕСТ»)
                  </span>
                </div>
                <div className="av2-detail-row">
                  <span className="av2-d-label">Юридична адреса:</span>
                  <span className="av2-d-val">36014, Україна, Полтавська обл., м. Полтава, вул. Європейська, буд. 2, офіс 202</span>
                </div>
                <div className="av2-detail-row">
                  <span className="av2-d-label">Фактична адреса офісу (прийом клієнтів):</span>
                  <span className="av2-d-val">36020, Україна, м. Полтава, вул. Соборності, 22</span>
                </div>
                <div className="av2-detail-row">
                  <span className="av2-d-label">Контактний телефон:</span>
                  <span className="av2-d-val font-mono">
                    <a href="tel:+380987204050" style={{ color: 'inherit', textDecoration: 'none' }}>+380 (98) 720-40-50</a>
                  </span>
                </div>
                <div className="av2-detail-row">
                  <span className="av2-d-label">Електронна пошта (Email):</span>
                  <span className="av2-d-val">
                    <a href="mailto:novexinvest.poltava@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>novexinvest.poltava@gmail.com</a>
                  </span>
                </div>
                <div className="av2-detail-row">
                  <span className="av2-d-label">Режим роботи офісу:</span>
                  <span className="av2-d-val">Пн–Нд: 10:00 — 18:00 (без вихідних)</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. 4 Steps to a Safe Deal */}
          <div className="av2-process-block">
            <div className="av2-section-heading text-center">
              <span className="av2-sub">Як ми працюємо</span>
              <h2>4 простих кроки до безпечного результату</h2>
            </div>

            <div className="av2-steps-grid">
              <div className="av2-step-item">
                <div className="av2-step-number">01</div>
                <h4>Заявка та консультація</h4>
                <p>Визначаємо ваші точні критерії, бюджет та бажаний район у Полтаві.</p>
              </div>

              <div className="av2-step-item">
                <div className="av2-step-number">02</div>
                <h4>Організація показів</h4>
                <p>Обираємо найкращі актуальні варіанти та плануємо перегляди в зручний час.</p>
              </div>

              <div className="av2-step-item">
                <div className="av2-step-number">03</div>
                <h4>Юридична перевірка</h4>
                <p>Формуємо витяги з реєстрів та готуємо офіційний проект договору.</p>
              </div>

              <div className="av2-step-item">
                <div className="av2-step-number">04</div>
                <h4>Угода та передача ключів</h4>
                <p>Підписання документів, безпечний розрахунок та отримання ключів від об'єкта.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scoped CSS for AboutPage v2 */}
      <style>{`
        .about-v2-container {
          background: #f8fafc;
          padding-bottom: 80px;
        }

        /* Hero Section */
        .av2-hero {
          position: relative;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.82) 0%, rgba(15, 23, 42, 0.90) 100%),
                      url('/images/poltava-hero.jpg') center 40%/cover no-repeat;
          color: #ffffff;
          padding: 64px 0 56px;
          overflow: hidden;
        }

        .av2-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(37, 99, 235, 0.12) 0%, rgba(15, 23, 42, 0.35) 100%);
          pointer-events: none;
          z-index: 1;
        }

        .av2-hero .container {
          position: relative;
          z-index: 2;
        }

        .av2-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 6px 16px;
          border-radius: 30px;
          font-size: 0.84rem;
          font-weight: 700;
          color: #93c5fd;
          margin-bottom: 16px;
        }

        .av2-hero-title {
          font-size: 2.7rem;
          font-weight: 900;
          letter-spacing: -0.5px;
          color: #ffffff;
          margin-bottom: 14px;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
        }

        .av2-hero-tagline {
          font-size: 1.15rem;
          color: #e2e8f0;
          max-width: 760px;
          line-height: 1.6;
          margin-bottom: 0;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
        }

        /* Content Section */
        .av2-content-section {
          padding-top: 40px;
        }

        .av2-narrative-box {
          background: #ffffff;
          border-radius: 18px;
          border: 1px solid #e2e8f0;
          padding: 36px 40px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
          margin-bottom: 40px;
        }

        .av2-section-heading {
          margin-bottom: 20px;
        }

        .av2-sub {
          display: inline-block;
          font-size: 0.78rem;
          font-weight: 800;
          color: #2563eb;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 6px;
        }

        .av2-section-heading h2 {
          font-size: 1.8rem;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.3px;
        }

        .av2-lead-text {
          font-size: 1.02rem;
          color: #334155;
          line-height: 1.7;
        }

        /* Pillars Grid */
        .av2-pillars-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          margin-bottom: 48px;
        }

        .av2-pillar-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          padding: 32px 28px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
          transition: all 0.2s ease;
        }

        .av2-pillar-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
          transform: translateY(-2px);
        }

        .av2-pillar-icon-box {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }

        .av2-pillar-icon-box.bg-blue {
          background: #eff6ff;
          color: #2563eb;
        }

        .av2-pillar-icon-box.bg-emerald {
          background: #ecfdf5;
          color: #059669;
        }

        .av2-pillar-icon-box.bg-purple {
          background: #faf5ff;
          color: #7c3aed;
        }

        .av2-pillar-icon-box.bg-amber {
          background: #fffbeb;
          color: #d97706;
        }

        .av2-pillar-card h3 {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 10px;
        }

        .av2-pillar-card p {
          font-size: 0.92rem;
          color: #475569;
          line-height: 1.6;
        }

        /* Legal Details Card */
        .av2-legal-banner {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
          margin-bottom: 50px;
          padding: 40px;
        }

        .av2-legal-left {
          width: 100%;
        }

        .av2-legal-tag {
          font-size: 0.76rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: #2563eb;
          background: #eff6ff;
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          margin-bottom: 12px;
        }

        .av2-legal-left h3 {
          font-size: 1.35rem;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 22px;
          line-height: 1.3;
        }

        .av2-copy-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          padding: 3px 8px;
          font-size: 0.74rem;
          font-weight: 700;
          color: #1e293b;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .av2-copy-btn:hover {
          background: #e2e8f0;
        }

        .av2-details-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .av2-detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 10px;
          font-size: 0.92rem;
        }

        .av2-d-label {
          color: #64748b;
        }

        .av2-d-val {
          color: #0f172a;
          font-weight: 700;
          text-align: right;
        }

        @media (max-width: 640px) {
          .av2-legal-banner {
            padding: 24px 20px;
          }
          .av2-detail-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
          .av2-d-val {
            text-align: left;
          }
        }

        .av2-cta-btn {
          background: #2563eb;
          border-color: #2563eb;
          font-weight: 800;
          font-size: 0.88rem;
          padding: 12px;
          border-radius: 8px;
        }

        .av2-cta-btn:hover {
          background: #1d4ed8;
        }

        .av2-sub-btn {
          background: transparent;
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.25);
          font-size: 0.82rem;
          font-weight: 700;
          padding: 10px;
          border-radius: 8px;
        }

        .av2-sub-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: #ffffff;
        }

        /* Steps Block */
        .av2-process-block {
          margin-top: 20px;
        }

        .av2-steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-top: 36px;
        }

        .av2-step-item {
          background: #ffffff;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          padding: 24px 20px;
          position: relative;
        }

        .av2-step-number {
          font-size: 1.6rem;
          font-weight: 900;
          color: #e2e8f0;
          margin-bottom: 8px;
        }

        .av2-step-item h4 {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .av2-step-item p {
          font-size: 0.84rem;
          color: #64748b;
          line-height: 1.5;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .av2-metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .av2-legal-banner {
            grid-template-columns: 1fr;
          }
          .av2-steps-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .av2-hero-title {
            font-size: 2rem;
          }
          .av2-pillars-grid {
            grid-template-columns: 1fr;
          }
          .av2-metrics-grid {
            grid-template-columns: 1fr;
          }
          .av2-steps-grid {
            grid-template-columns: 1fr;
          }
          .av2-legal-left {
            padding: 24px 20px;
          }
          .av2-legal-right {
            padding: 32px 20px;
          }
          .av2-detail-row {
            flex-direction: column;
            gap: 2px;
          }
          .av2-d-val {
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
};
