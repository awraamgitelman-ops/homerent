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
        <div className="container text-center">
          <span className="badge badge-blue mb-2">Зв'яжіться з нами</span>
          <h1 className="ch-title">Контакти агентства «НОВЕКС ІНВЕСТ» у Полтаві</h1>
          <p className="ch-subtitle">
            Завітайте до нашого офісу або зателефонуйте для отримання вичерпної консультації з будь-яких питань нерухомості.
          </p>
        </div>
      </div>

      <div className="container py-5">
        <div className="contacts-grid">
          {/* Col 1: Contact Cards */}
          <div className="contacts-info-col">
            <h2>Офіс та канали зв'язку</h2>
            <p className="text-muted mb-4">
              Ми завжди на зв'язку у месенджерах та готові зустріти вас у центрі Полтави за попереднім записом або у робочий час.
            </p>

            <div className="ci-card">
              <div className="ci-icon"><MapPin size={22} /></div>
              <div>
                <h4>Адреса офісу</h4>
                <p>36014, Україна, Полтавська обл., м. Полтава, вул. Європейська, буд. 2, офіс 202</p>
              </div>
            </div>

            <div className="ci-card">
              <div className="ci-icon"><Phone size={22} /></div>
              <div>
                <h4>Прямий телефон</h4>
                <a href="tel:+380988612938" className="ci-phone-link">+380 (98) 861-29-38</a>
                <span className="d-block text-muted text-xs mt-1">Прийом дзвінків: щодня з 09:00 до 20:00</span>
              </div>
            </div>

            <div className="ci-card">
              <div className="ci-icon"><Clock size={22} /></div>
              <div>
                <h4>Графік роботи</h4>
                <p>Понеділок — Неділя: 09:00 — 20:00 (без перерви та вихідних)</p>
              </div>
            </div>

            <div className="ci-messengers-box mt-3">
              <h4>Швидкий зв'язок у месенджерах:</h4>
              <div className="ci-msg-buttons">
                <a href="https://t.me/rudmonolit" target="_blank" rel="noopener noreferrer" className="btn btn-msg btn-tg">
                  Telegram
                </a>
                <a href="https://viber.click/380988612938" onClick={handleViberClick} target="_blank" rel="noopener noreferrer" className="btn btn-msg btn-vb">
                  Viber
                </a>
                <a href="https://wa.me/380988612938" target="_blank" rel="noopener noreferrer" className="btn btn-msg btn-wa">
                  WhatsApp
                </a>
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
                  <CheckCircle2 size={42} className="text-green mx-auto mb-2" />
                  <h4>Повідомлення надіслано!</h4>
                  <p className="text-muted text-sm">Дякуємо за звернення. Менеджер агентства відповість вам протягом кількох хвилин.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
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

                  <div className="form-group">
                    <label className="form-label">Телефон *</label>
                    <input 
                      type="tel" 
                      placeholder="+380 (98) 000-00-00"
                      value={phone}
                      onChange={handlePhoneChange}
                      className="form-input"
                    />
                    {errors.phone && <div className="form-error">{errors.phone}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Повідомлення або питання</label>
                    <textarea 
                      rows="3"
                      placeholder="Мене цікавить підбір 2-кімнатної квартири на Леваді..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="form-textarea"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="btn btn-primary btn-block"
                  >
                    <Send size={16} />
                    <span>{isSubmitting ? 'Відправка...' : 'Надіслати запит'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .contacts-hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
          color: #ffffff;
          padding: 45px 0;
        }

        .ch-title {
          font-size: 2.2rem;
          font-weight: 900;
          color: #ffffff;
          margin-bottom: 8px;
        }

        .ch-subtitle {
          font-size: 0.95rem;
          color: #cbd5e1;
          max-width: 720px;
          margin: 0 auto;
        }

        .contacts-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 40px;
        }

        .ci-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          background: #f8fafc;
          border: 1px solid var(--c-border);
          border-radius: var(--radius-md);
          padding: 18px;
          margin-bottom: 14px;
        }

        .ci-icon {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-sm);
          background: var(--c-primary-light);
          color: var(--c-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .ci-card h4 {
          font-size: 0.95rem;
          margin-bottom: 4px;
          color: var(--c-slate);
        }

        .ci-card p {
          font-size: 0.85rem;
          color: #64748b;
          line-height: 1.45;
        }

        .ci-phone-link {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--c-primary);
        }

        .ci-msg-buttons {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .btn-msg {
          flex: 1;
          color: #ffffff;
          font-weight: 700;
          font-size: 0.85rem;
          padding: 10px;
          border-radius: var(--radius-sm);
          text-align: center;
        }

        .btn-tg { background: #29b6f6; }
        .btn-vb { background: #7360f2; }
        .btn-wa { background: #25d366; }

        .cf-form-card {
          background: #ffffff;
          border: 1px solid var(--c-border);
          border-radius: var(--radius-lg);
          padding: 28px;
          box-shadow: var(--shadow-md);
        }

        .cf-success-box {
          text-align: center;
          padding: 24px;
        }

        @media (max-width: 860px) {
          .contacts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
