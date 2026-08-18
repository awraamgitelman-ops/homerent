import React from 'react';
import { FileCheck, ShieldCheck, CheckCircle2, Building2, ArrowLeft } from 'lucide-react';
import { useRouter } from '../context/RouterContext';

export const OfferPage = () => {
  const { navigate } = useRouter();

  return (
    <div className="doc-page-wrapper">
      <div className="container py-5">
        <div className="doc-main-card">
          <nav aria-label="Хлібні крихти" className="doc-breadcrumbs">
            <button onClick={() => navigate('/')} className="doc-crumb-link">Головна</button>
            <span className="doc-crumb-sep">/</span>
            <span className="doc-crumb-current">Публічна оферта</span>
          </nav>

          <div className="doc-header">
            <div className="doc-tag">Юридична інформація</div>
            <h1 className="doc-title">Договір публічної оферти про надання рієлторських послуг</h1>
            <p className="doc-updated">Останнє оновлення: 18 серпня 2026 року • ТОВ «НОВЕКС ІНВЕСТ» (ЄДРПОУ 43980756)</p>
          </div>

          <div className="doc-divider"></div>

          <div className="doc-content">
            <section className="doc-section">
              <h2>1. Загальні положення та правова основа</h2>
              <p>
                Цей документ є офіційною публічною пропозицією (публічною офертою відповідно до статей 633, 641, 642 Цивільного кодексу України) <strong>ТОВАРИСТВА З ОБМЕЖЕНОЮ ВІДПОВІДАЛЬНІСТЮ «НОВЕКС ІНВЕСТ»</strong> (код ЄДРПОУ 43980756, комерційне найменування — Агентство нерухомості «ФАВОРИТ ГРУП», далі — «Виконавець») укласти договір про надання інформаційно-консультаційних та рієлторських послуг з будь-якою дієздатною фізичною або юридичною особою (далі — «Замовник» або «Клієнт»).
              </p>
              <p>
                Оформлення заявки через веб-сайт <strong>favorit-group.com</strong>, здійснення телефонного дзвінка до контакт-центру, запис на перегляд об'єкта нерухомості або фактичне використання послуг Виконавця є повним і беззастережним прийняттям (акцептом) умов цього Договору.
              </p>
            </section>

            <section className="doc-section">
              <h2>2. Визначення термінів</h2>
              <ul>
                <li><strong>Виконавець:</strong> ТОВ «НОВЕКС ІНВЕСТ» (АН «ФАВОРИТ ГРУП»), що здійснює професійну діяльність агентств нерухомості (КВЕД 68.31).</li>
                <li><strong>Замовник:</strong> фізична або юридична особа, яка замовляє послуги з пошуку, підбору, оренди, купівлі або продажу об'єктів нерухомості у м. Полтава.</li>
                <li><strong>Сайт:</strong> офіційний веб-ресурс Виконавця, доступний в мережі Інтернет за адресою favorit-group.com.</li>
                <li><strong>Послуги:</strong> комплекс рієлторських, інформаційних, маркетингових та консультаційних дій, спрямованих на підбір нерухомості, організацію оглядів та юридичний супровід угоди.</li>
              </ul>
            </section>

            <section className="doc-section">
              <h2>3. Предмет договору</h2>
              <p>
                Виконавець бере на себе зобов'язання за дорученням Замовника надати комплекс послуг на ринку нерухомості міста Полтава, а саме:
              </p>
              <ul>
                <li>Пошук та персональний підбір житлової та комерційної нерухомості за індивідуальними критеріями Замовника;</li>
                <li>Організація та проведення безкоштовних показів (переглядів) обраних об'єктів;</li>
                <li>Маркетингове просування об'єктів нерухомості від власників;</li>
                <li>Перевірка правовстановлюючих документів та юридичної чистоти об'єктів перед укладенням угоди;</li>
                <li>Підготовка проекту договору купівлі-продажу або довгострокової оренди та супровід процесу підписання.</li>
              </ul>
            </section>

            <section className="doc-section">
              <h2>4. Права та обов'язки сторін</h2>
              <p><strong>Виконавець зобов'язується:</strong></p>
              <ul>
                <li>Надавати достовірну та актуальну інформацію про стан, вартість та характеристики об'єктів нерухомості;</li>
                <li>Діяти виключно в законних інтересах Замовника, забезпечуючи конфіденційність персональних даних;</li>
                <li>Організовувати перегляди у зручний для Замовника час за попереднім узгодженням.</li>
              </ul>
              <p><strong>Замовник зобов'язується:</strong></p>
              <ul>
                <li>Надавати точні критерії підбору та дійсні контактні дані для комунікації;</li>
                <li>Своєчасно прибувати на узгоджені перегляди об'єктів або завчасно попереджати про перенесення часу.</li>
              </ul>
            </section>

            <section className="doc-section">
              <h2>5. Вартість послуг та порядок розрахунків</h2>
              <p>
                5.1. Консультації фахівців агенції, доступ до онлайн-каталогу та перегляди об'єктів нерухомості є <strong>повністю безкоштовними</strong>.
              </p>
              <p>
                5.2. Оплата послуг Виконавця (комісійна винагорода) здійснюється <strong>виключно за фактом успішного укладення</strong> договору оренди або договору купівлі-продажу нерухомості між Замовником та власником об'єкта.
              </p>
              <p>
                5.3. Розмір винагороди визначається за домовленістю сторін та фіксується в індивідуальній угоді. Жодних прихованих платежів чи неоголошених передоплат не стягується.
              </p>
            </section>

            <section className="doc-section">
              <h2>6. Реквізити Виконавця</h2>
              <div className="doc-contacts-box">
                <p><strong>ТОВАРИСТВО З ОБМЕЖЕНОЮ ВІДПОВІДАЛЬНІСТЮ «НОВЕКС ІНВЕСТ»</strong></p>
                <p>Комерційна назва: <strong>Агентство нерухомості «ФАВОРИТ ГРУП»</strong></p>
                <p>Код ЄДРПОУ: <strong>43980756</strong></p>
                <p>Директор: <strong>Омельяненко Владислав Юрійович</strong></p>
                <p><strong>Юридична адреса:</strong> 36014, Україна, м. Полтава, вул. Європейська, буд. 2, оф. 202</p>
                <p><strong>Офіс прийому клієнтів:</strong> 36020, Україна, м. Полтава, вул. Соборності, 22</p>
                <p><strong>Телефон:</strong> <a href="tel:+380987204050">+380 (98) 720-40-50</a></p>
                <p><strong>Email:</strong> <a href="mailto:novexinvest.poltava@gmail.com">novexinvest.poltava@gmail.com</a></p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <style>{`
        .doc-page-wrapper {
          background: #f8fafc;
          min-height: calc(100vh - 200px);
          padding: 40px 0 60px;
        }

        .doc-main-card {
          max-width: 960px;
          margin: 0 auto;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 44px 48px;
          box-shadow: 0 4px 24px rgba(15, 23, 42, 0.05);
        }

        .doc-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.86rem;
          margin-bottom: 24px;
        }

        .doc-crumb-link {
          background: none;
          border: none;
          padding: 0;
          color: #2563eb;
          cursor: pointer;
          font-weight: 600;
        }

        .doc-crumb-link:hover {
          text-decoration: underline;
        }

        .doc-crumb-sep {
          color: #94a3b8;
        }

        .doc-crumb-current {
          color: #64748b;
        }

        .doc-tag {
          display: inline-block;
          font-size: 0.76rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: #2563eb;
          background: #eff6ff;
          padding: 4px 12px;
          border-radius: 20px;
          margin-bottom: 12px;
        }

        .doc-title {
          font-size: 2rem;
          font-weight: 900;
          color: #0f172a;
          line-height: 1.25;
          margin: 0 0 10px 0;
          letter-spacing: -0.4px;
        }

        .doc-updated {
          font-size: 0.88rem;
          color: #64748b;
          margin: 0;
        }

        .doc-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 30px 0;
        }

        .doc-content {
          color: #334155;
          font-size: 0.95rem;
          line-height: 1.7;
        }

        .doc-section {
          margin-bottom: 32px;
        }

        .doc-section h2 {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 12px 0;
          letter-spacing: -0.2px;
        }

        .doc-section p {
          margin: 0 0 12px 0;
        }

        .doc-section ul {
          margin: 0 0 16px 0;
          padding-left: 22px;
        }

        .doc-section li {
          margin-bottom: 8px;
        }

        .doc-contacts-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px 24px;
          margin-top: 14px;
        }

        .doc-contacts-box p {
          margin: 0 0 8px 0;
        }

        .doc-contacts-box p:last-child {
          margin-bottom: 0;
        }

        .doc-contacts-box a {
          color: #2563eb;
          text-decoration: none;
          font-weight: 600;
        }

        .doc-contacts-box a:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .doc-page-wrapper {
            padding: 20px 0 40px;
          }
          .doc-main-card {
            padding: 26px 20px;
            border-radius: 16px;
          }
          .doc-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};
