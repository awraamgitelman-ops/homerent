import React from 'react';
import { 
  PhoneCall, 
  Search, 
  Eye, 
  Handshake, 
  ShieldCheck, 
  FileText, 
  Scale, 
  KeyRound 
} from 'lucide-react';

export const RoadmapSection = () => {
  const steps = [
    {
      num: '01',
      icon: PhoneCall,
      title: 'Заявка та консультація',
      desc: 'Обговорюємо ваші критерії: район Полтави, бюджет, поверх, тип будинку та готовність ремонту.'
    },
    {
      num: '02',
      icon: Search,
      title: 'Персональна добірка',
      desc: 'Надаємо каталог перевірених об\'єктів, включаючи ексклюзивні та закриті пропозиції.'
    },
    {
      num: '03',
      icon: Eye,
      title: 'Організація переглядів',
      desc: 'Супровід експерта на авто агентства. Оцінюємо стан комунікацій, ОСББ та інфраструктуру.'
    },
    {
      num: '04',
      icon: Handshake,
      title: 'Переговори та торг',
      desc: 'Відстоюємо найкращу ціну для покупця та фіксуємо умови угоди попереднім договором.'
    },
    {
      num: '05',
      icon: ShieldCheck,
      title: 'Юридичний аудит ДРРП',
      desc: 'Повна перевірка об\'єкта, арештів, іпотек, співвласників, зареєстрованих осіб та історії приватизації.'
    },
    {
      num: '06',
      icon: FileText,
      title: 'Підготовка документів',
      desc: 'Оформлення експертної оцінки, довідок про відсутність заборгованостей, погодження в банку (єОселя).'
    },
    {
      num: '07',
      icon: Scale,
      title: 'Нотаріальна угода',
      desc: 'Підписання основного договору купівлі-продажу у перевіреного державного чи приватного нотаріуса.'
    },
    {
      num: '08',
      icon: KeyRound,
      title: 'Отримання ключів',
      desc: 'Підписання акта прийому-передачі, передача ключів та витягу з реєстру речових прав на нерухоме майно.'
    }
  ];

  return (
    <section className="roadmap-section">
      <div className="container">
        <div className="roadmap-header text-center">
          <span className="badge badge-gold mb-2">Прозорість та надійність</span>
          <h2 className="roadmap-title">8 етапів безпечної купівлі нерухомості</h2>
          <p className="roadmap-subtitle">
            Як проходить процес придбання або продажу житла з агентством «НОВЕКС ІНВЕСТ» у Полтаві.
          </p>
        </div>

        <div className="roadmap-grid">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="roadmap-card">
                <div className="rc-top-row">
                  <span className="rc-num">{s.num}</span>
                  <div className="rc-icon">
                    <Icon size={20} />
                  </div>
                </div>
                <h3 className="rc-title">{s.title}</h3>
                <p className="rc-desc">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .roadmap-section {
          padding: 60px 0;
          background: #f8fafc;
          border-top: 1px solid var(--c-border);
        }

        .roadmap-header {
          max-width: 760px;
          margin: 0 auto 40px;
        }

        .roadmap-title {
          font-size: 2rem;
          font-weight: 900;
          color: var(--c-slate);
          margin-bottom: 10px;
        }

        .roadmap-subtitle {
          font-size: 0.95rem;
          color: var(--c-muted);
        }

        .roadmap-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .roadmap-card {
          background: #ffffff;
          border: 1px solid var(--c-border);
          border-radius: var(--radius-md);
          padding: 22px;
          box-shadow: var(--shadow-sm);
          position: relative;
          transition: var(--transition);
        }

        .roadmap-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
          border-color: var(--c-primary);
        }

        .rc-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .rc-num {
          font-size: 1.4rem;
          font-weight: 900;
          color: var(--c-primary);
          opacity: 0.85;
        }

        .rc-icon {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--c-primary-light);
          color: var(--c-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .rc-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--c-slate);
          margin-bottom: 8px;
          line-height: 1.25;
        }

        .rc-desc {
          font-size: 0.82rem;
          color: #64748b;
          line-height: 1.5;
        }

        @media (max-width: 1024px) {
          .roadmap-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .roadmap-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};
