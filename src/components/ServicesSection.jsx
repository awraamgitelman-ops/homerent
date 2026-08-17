import React from 'react';
import { 
  Building2, 
  Search, 
  Tag, 
  KeyRound, 
  Scale, 
  FileCheck2, 
  Paintbrush,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const ServicesSection = ({ onSelectService, onOpenConsultModal }) => {
  const services = [
    {
      id: 'buy',
      icon: Search,
      title: 'Купівля житлової нерухомості',
      desc: 'Повний супровід: підбір варіантів під ваш бюджет, юридичний аудит об\'єкта та власника, безпечне проведення розрахунків у нотаріуса.',
      highlights: ['Безпечна угода', 'Перевірка ДРРП', 'Торг на користь клієнта']
    },
    {
      id: 'sell',
      icon: Tag,
      title: 'Продаж нерухомості за вигідною ціною',
      desc: 'Професійна оцінка, якісна фотозйомка, розміщення на ТОП-майданчиках та закритих базах. Швидкий пошук реального покупця.',
      highlights: ['Оцінка за 1 день', 'Маркетинг об\'єкта', 'Швидкий вихід на угоду']
    },
    {
      id: 'rent',
      icon: KeyRound,
      title: 'Оренда та здача в оренду',
      desc: 'Підбір квартир, будинків та комерції. Перевірка платоспроможності орендарів, складання офіційного типового договору оренди.',
      highlights: ['Офіційний договір', 'Перевірені орендарі', 'Фіксація стану майна']
    },
    {
      id: 'legal',
      icon: Scale,
      title: 'Юридичний супровід та перевірка',
      desc: 'Глибока перевірка історії майна, арештів, іпотек, зареєстрованих осіб та дієздатності продавця юристами з 10+ роками практики.',
      highlights: ['100% захист прав', 'Перевірка обтяжень', 'Нотаріальне посвідчення']
    },
    {
      id: 'renovation',
      icon: Paintbrush,
      title: 'Ремонт, оздоблення та Home Staging',
      desc: 'Передпродажна підготовка для підвищення вартості на 15-20%, косметичний або капітальний ремонт під ключ з гарантією робіт.',
      highlights: ['Збільшення ліквідності', 'Фіксований кошторис', 'Якісні матеріали']
    },
    {
      id: 'commercial',
      icon: Building2,
      title: 'Комерційна нерухомість та інвестиції',
      desc: 'Підбір фасадних приміщень, офісів, складів та торгових площ у Полтаві. Розрахунок термінів окупності (ROI) та супровід договорів оренди/купівлі.',
      highlights: ['Фасадні локації', 'Високий трафік', 'Аналіз дохідності']
    }
  ];

  return (
    <section className="services-section" id="services">
      <div className="container">
        <div className="services-header text-center">
          <span className="badge badge-blue mb-2">Комплексні послуги у Полтаві</span>
          <h2 className="services-main-title">Повний спектр послуг з нерухомості</h2>
          <p className="services-main-subtitle">
            Агентство нерухомості <strong>«ФАВОРИТ ГРУП»</strong> забезпечує 100% юридичну безпеку та прозорість кожної операції на ринку нерухомості Полтави.
          </p>
        </div>

        <div className="services-grid">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.id} className="service-card">
                <div className="sc-icon-box">
                  <Icon size={26} />
                </div>
                <h3 className="sc-title">{s.title}</h3>
                <p className="sc-desc">{s.desc}</p>

                <div className="sc-highlights">
                  {s.highlights.map((h, i) => (
                    <div key={i} className="sc-highlight-item">
                      <CheckCircle2 size={13} className="text-green" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <button 
                  type="button"
                  className="sc-btn"
                  onClick={() => onSelectService(s.id)}
                >
                  <span>Замовити послугу</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Banner CTA */}
        <div className="services-cta-banner">
          <div className="scb-text">
            <h3>Потрібна безкоштовна консультація експерта?</h3>
            <p>Залиште контактний номер, і провідний рієлтор Полтави зателефонує вам для безкоштовного аналізу вашого запиту.</p>
          </div>
          <button 
            onClick={onOpenConsultModal}
            className="btn btn-accent btn-lg"
          >
            Отримати консультацію
          </button>
        </div>
      </div>

      <style>{`
        .services-section {
          padding: 60px 0;
          background: #ffffff;
        }

        .services-header {
          max-width: 780px;
          margin: 0 auto 40px;
        }

        .services-main-title {
          font-size: 2rem;
          font-weight: 900;
          color: var(--c-slate);
          margin-bottom: 10px;
        }

        .services-main-subtitle {
          font-size: 0.95rem;
          color: var(--c-muted);
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .service-card {
          background: #f8fafc;
          border: 1px solid var(--c-border);
          border-radius: var(--radius-lg);
          padding: 28px;
          transition: var(--transition);
          display: flex;
          flex-direction: column;
        }

        .service-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--c-border-hover);
          background: #ffffff;
        }

        .sc-icon-box {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-md);
          background: var(--c-primary-light);
          color: var(--c-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }

        .sc-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--c-slate);
          margin-bottom: 10px;
        }

        .sc-desc {
          font-size: 0.88rem;
          color: #475569;
          line-height: 1.55;
          margin-bottom: 16px;
        }

        .sc-highlights {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 20px;
        }

        .sc-highlight-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #1e293b;
        }

        .sc-btn {
          margin-top: auto;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          font-size: 0.88rem;
          color: var(--c-primary);
        }

        .sc-btn:hover {
          color: var(--c-primary-hover);
          gap: 10px;
        }

        /* Banner CTA */
        .services-cta-banner {
          background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);
          color: #ffffff;
          border-radius: var(--radius-lg);
          padding: 32px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          box-shadow: var(--shadow-xl);
        }

        .scb-text h3 {
          color: #ffffff;
          font-size: 1.4rem;
          margin-bottom: 6px;
        }

        .scb-text p {
          color: #cbd5e1;
          font-size: 0.9rem;
        }

        @media (max-width: 860px) {
          .services-grid {
            grid-template-columns: 1fr;
          }
          .services-cta-banner {
            flex-direction: column;
            text-align: center;
            padding: 24px;
          }
        }
      `}</style>
    </section>
  );
};
