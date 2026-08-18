import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck,
  Building
} from 'lucide-react';
import { formatPhoneInput, validatePhone, validateName } from '../utils/formatters';
import { sendTelegramLeadNotification } from '../utils/telegram';

export const ContactsPage = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+380');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleViberClick = (e) => {
    e.preventDefault();
    const p = '380988612938';
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = `viber://chat?number=${p}`;
      setTimeout(() => { window.location.href = `https://viber.click/${p}`; }, 500);
    } else {
      window.location.href = `viber://chat?number=%2B${p}`;
      setTimeout(() => { window.open(`https://viber.click/${p}`, '_blank'); }, 500);
    }
  };

  const handlePhoneChange = (e) => {
    setPhone(formatPhoneInput(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    const nameErr = validateName(name);
    if (nameErr) errs.name = nameErr;
    const phoneErr = validatePhone(phone);
    if (phoneErr) errs.phone = phoneErr;

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await sendTelegramLeadNotification({
        name,
        phone,
        type: 'Питання / Консультація зі сторінки контактів',
        comment: message || 'Без коментаря'
      });
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contacts-page-wrapper">
      <div className="contacts-hero">
        <div className="contacts-hero-overlay"></div>
        <div className="container contacts-hero-content">
          <h1 className="ch-title">Контакти агентства «ФАВОРИТ ГРУП» у Полтаві</h1>
          <p className="ch-subtitle">
            Завітайте до нашого офісу або зателефонуйте для отримання вичерпної консультації з будь-яких питань нерухомості.
          </p>
        </div>
      </div>

      <div className="container contacts-main-container">
        <div className="contacts-grid">
          {/* Col 1: Contact Cards */}
          <div className="contacts-info-col">
            <h2 className="contacts-section-title">Офіс та канали зв'язку</h2>
            <p className="contacts-section-desc">
              Ми завжди на зв'язку та готові зустріти вас у центрі Полтави за попереднім записом або у робочий час.
            </p>

            <div className="ci-card">
              <div className="ci-icon"><MapPin size={22} /></div>
              <div className="ci-details">
                <h4>Адреса офісу</h4>
                <p>36020, Україна, Полтавська обл., м. Полтава, вул. Соборності, 22</p>
              </div>
            </div>

            <div className="ci-card">
              <div className="ci-icon"><Phone size={22} /></div>
              <div className="ci-details">
                <h4>Гаряча лінія</h4>
                <a href="tel:+380988612938" className="ci-phone-link">+380 (98) 861-29-38</a>
                <p className="ci-subnote">Прийом дзвінків: Щоденно з 10:00 до 18:00 (без вихідних)</p>
              </div>
            </div>

            <div className="ci-card">
              <div className="ci-icon"><Clock size={22} /></div>
              <div className="ci-details">
                <h4>Графік роботи</h4>
                <p>Щоденно з 10:00 до 18:00 (без вихідних)</p>
              </div>
            </div>
          </div>

          {/* Col 2: Feedback Form */}
          <div className="contacts-form-col">
            <div className="cf-form-card">
              <h3>Напишіть нам повідомлення</h3>
              <p className="text-muted text-sm mb-4">Вкажіть ваші контакти, і ми зв'яжемося з вами найближчим часом.</p>

              {isSuccess ? (
                <div className="cf-success-box animate-fade">
                  <h4>Повідомлення надіслано!</h4>
                  <p className="text-muted text-sm">Дякуємо за звернення. Менеджер агентства відповість вам протягом кількох хвилин.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label className="form-label">Ваше ім'я *</label>
                    <input 
                      type="text" 
                      placeholder="Олександр"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-input"
                    />
                    {errors.name && <div className="form-error">{errors.name}</div>}
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">Номер телефону *</label>
                    <input 
                      type="tel" 
                      placeholder="+380 (98) 000-00-00"
                      value={phone}
                      onChange={handlePhoneChange}
                      className="form-input"
                    />
                    {errors.phone && <div className="form-error">{errors.phone}</div>}
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">Ваше питання або коментар</label>
                    <textarea 
                      rows="3"
                      placeholder="Доброго дня! Мене цікавить купівля 2-кімнатної квартири..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="form-textarea"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="btn btn-primary btn-block btn-lg"
                  >
                    <Send size={18} />
                    <span>{isSubmitting ? 'Відправка...' : 'Надіслати повідомлення'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .contacts-hero {
          position: relative;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.78) 0%, rgba(15, 23, 42, 0.85) 100%),
                      url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Kruhla_Square_-_Poltava_-_Aerial_view_-_1.jpg/1920px-Kruhla_Square_-_Poltava_-_Aerial_view_-_1.jpg') center 40%/cover no-repeat;
          color: #ffffff;
          padding: 56px 0;
          overflow: hidden;
        }

        .contacts-hero-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(37, 99, 235, 0.12) 0%, rgba(15, 23, 42, 0.35) 100%);
          pointer-events: none;
          z-index: 1;
        }

        .contacts-hero-content {
          position: relative;
          z-index: 2;
          text-align: left;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .ch-title {
          font-size: 2.2rem;
          font-weight: 900;
          color: #ffffff;
          margin-bottom: 10px;
          line-height: 1.2;
        }

        .ch-subtitle {
          font-size: 1rem;
          color: #cbd5e1;
          max-width: 720px;
          margin: 0 auto;
          line-height: 1.5;
        }

        .contacts-main-container {
          padding-top: 48px;
          padding-bottom: 64px;
        }

        .contacts-grid {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 48px;
          align-items: flex-start;
        }

        .contacts-section-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--c-slate);
          margin-bottom: 8px;
        }

        .contacts-section-desc {
          font-size: 0.95rem;
          color: #64748b;
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .ci-card {
          display: flex;
          align-items: flex-start;
          gap: 18px;
          background: #f8fafc;
          border: 1px solid var(--c-border);
          border-radius: 14px;
          padding: 20px 24px;
          margin-bottom: 18px;
          transition: all 0.2s ease;
        }

        .ci-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.05);
        }

        .ci-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: var(--c-primary-light);
          color: var(--c-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .ci-details {
          flex: 1;
        }

        .ci-card h4 {
          font-size: 1rem;
          font-weight: 800;
          margin-bottom: 6px;
          color: var(--c-slate);
        }

        .ci-card p {
          font-size: 0.92rem;
          color: #64748b;
          line-height: 1.5;
          margin: 0;
        }

        .ci-phones-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 6px;
        }

        .ci-phone-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 1.15rem;
          font-weight: 900;
          color: var(--c-primary);
          transition: color 0.2s ease;
        }

        .ci-phone-tag {
          font-size: 0.7rem;
          font-weight: 700;
          color: #475569;
          background: #e2e8f0;
          padding: 2px 7px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .ci-phone-link:hover {
          color: #1e40af;
        }

        .ci-subnote {
          font-size: 0.82rem;
          color: #94a3b8;
          margin: 0;
        }

        .cf-form-card {
          background: #ffffff;
          border: 1px solid var(--c-border);
          border-radius: 18px;
          padding: 32px;
          box-shadow: 0 12px 32px rgba(15, 23, 42, 0.06);
        }

        .cf-form-card h3 {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--c-slate);
          margin-bottom: 6px;
        }

        .cf-form-card textarea, .form-textarea {
          resize: none !important;
        }

        .cf-success-box {
          text-align: center;
          padding: 32px 20px;
        }

        @media (max-width: 900px) {
          .contacts-grid {
            grid-template-columns: 1fr;
            gap: 36px;
          }
          .contacts-main-container {
            padding-top: 36px;
            padding-bottom: 48px;
          }
        }
      `}</style>
    </div>
  );
};
