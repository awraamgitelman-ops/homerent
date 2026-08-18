import React from 'react';
import { ShieldCheck, Lock, FileText, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useRouter } from '../context/RouterContext';

export const PrivacyPage = () => {
  const { navigate } = useRouter();

  return (
    <div className="doc-page-wrapper">
      <div className="container py-5">
        <div className="doc-main-card">
          <nav aria-label="Хлібні крихти" className="doc-breadcrumbs">
            <button onClick={() => navigate('/')} className="doc-crumb-link">Головна</button>
            <span className="doc-crumb-sep">/</span>
            <span className="doc-crumb-current">Політика конфіденційності</span>
          </nav>

          <div className="doc-header">
            <div className="doc-tag">Юридична інформація</div>
            <h1 className="doc-title">Політика конфіденційності та захисту персональних даних</h1>
            <p className="doc-updated">Останнє оновлення: 18 серпня 2026 року • ТОВ «НОВЕКС ІНВЕСТ» (ЄДРПОУ 43980756)</p>
          </div>

          <div className="doc-divider"></div>

          <div className="doc-content">
            <section className="doc-section">
              <h2>1. Загальні положення</h2>
              <p>
                Ця Політика конфіденційності (далі — «Політика») визначає порядок обробки та захисту персональних даних користувачів веб-сайту <strong>favorit-group.com</strong> (далі — «Сайт»), що належить та адмініструється <strong>ТОВАРИСТВОМ З ОБМЕЖЕНОЮ ВІДПОВІДАЛЬНІСТЮ «НОВЕКС ІНВЕСТ»</strong> (код ЄДРПОУ 43980756, комерційне позначення — Агентство нерухомості «ФАВОРИТ ГРУП», далі — «Компанія»).
              </p>
              <p>
                Компанія з повагою ставиться до конфіденційної інформації кожного користувача та діє у суворій відповідності до Конституції України, Закону України «Про захист персональних даних» № 2297-VI, Закону України «Про електронну комерцію» та чинних міжнародних стандартів приватності.
              </p>
            </section>

            <section className="doc-section">
              <h2>2. Які персональні дані ми збираємо</h2>
              <p>Компанія може здійснювати збір та обробку наступних категорій персональних даних, які користувач добровільно надає під час користування сервісами Сайту:</p>
              <ul>
                <li><strong>Контактна інформація:</strong> прізвище, ім'я, номер мобільного телефону, адреса електронної пошти (email).</li>
                <li><strong>Параметри замовлення послуг:</strong> критерії підбору, оренди або продажу об'єктів нерухомості (район, бюджет, кількість кімнат, бажаний час перегляду об'єкта).</li>
                <li><strong>Технічні дані (Cookies):</strong> IP-адреса, тип браузера, операційна система, тривалість сеансу та історія перегляду сторінок Сайту для оптимізації швидкодії інтерфейсу.</li>
              </ul>
            </section>

            <section className="doc-section">
              <h2>3. Мета та цілі обробки даних</h2>
              <p>Збір та обробка персональних даних здійснюється виключно для досягнення наступних цілей:</p>
              <ul>
                <li>Надання консультацій, оперативна обробка заявок на підбір, купівлю, продаж або оренду нерухомості у м. Полтава.</li>
                <li>Організація та узгодження графіка безкоштовних переглядів об'єктів нерухомості.</li>
                <li>Зворотний зв'язок з клієнтами через телефонні дзвінки, SMS та месенджери (Telegram, Viber).</li>
                <li>Юридична перевірка правовстановлюючих документів та підготовка проектів договорів.</li>
                <li>Аналіз функціональності Сайту та покращення якості клієнтського обслуговування.</li>
              </ul>
            </section>

            <section className="doc-section">
              <h2>4. Захист та збереження інформації</h2>
              <p>
                Компанія впровадила багаторівневі технічні, програмні та організаційні заходи безпеки для захисту персональних даних від несанкціонованого доступу, зміни, розголошення, копіювання чи знищення.
              </p>
              <p>
                Усі дані, що передаються через форми сайту, захищені наскрізним шифруванням SSL/TLS. Доступ до контактних даних мають виключно уповноважені експерти Компанії, які підписали угоду про нерозголошення конфіденційної інформації (NDA).
              </p>
            </section>

            <section className="doc-section">
              <h2>5. Передача даних третім особам</h2>
              <p>
                Компанія гарантує, що персональні дані користувачів <strong>не продаються, не передаються в оренду та не розголошуються третім особам</strong> з комерційною метою.
              </p>
              <p>
                Розкриття інформації третім особам можливе виключно у випадках, прямо передбачених чинним законодавством України (за офіційним судовим рішенням або обґрунтованим запитом уповноважених державних органів).
              </p>
            </section>

            <section className="doc-section">
              <h2>6. Права суб'єктів персональних даних</h2>
              <p>Відповідно до статті 8 Закону України «Про захист персональних даних», кожен користувач має право:</p>
              <ul>
                <li>Знати джерела збору, місцезнаходження своїх персональних даних та мету їх обробки;</li>
                <li>Отримувати інформацію про умови надання доступу до персональних даних;</li>
                <li>Пред'являти вмотивовану вимогу щодо зміни або знищення своїх персональних даних;</li>
                <li>Відкликати згоду на обробку персональних даних у будь-який момент;</li>
                <li>Звертатися зі скаргами на обробку своїх персональних даних до Уповноваженого Верховної Ради України з прав людини або до суду.</li>
              </ul>
            </section>

            <section className="doc-section">
              <h2>7. Контакти для зв'язку</h2>
              <p>З усіх питань щодо реалізації ваших прав, зміни чи видалення персональних даних ви можете звернутися до адміністрації:</p>
              <div className="doc-contacts-box">
                <p><strong>ТОВ «НОВЕКС ІНВЕСТ» (АН «ФАВОРИТ ГРУП»)</strong></p>
                <p><strong>Юридична адреса:</strong> 36014, Україна, м. Полтава, вул. Європейська, буд. 2, оф. 202</p>
                <p><strong>Офіс прийому клієнтів:</strong> 36020, Україна, м. Полтава, вул. Соборності, 22</p>
                <p><strong>Телефон:</strong> <a href="tel:+380986241429">+380 (98) 624-14-29</a></p>
                <p><strong>Email:</strong> <a href="mailto:ah.favorit.group@gmail.com">ah.favorit.group@gmail.com</a></p>
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
