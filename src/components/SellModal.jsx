import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  Send, 
  CheckCircle2, 
  Building2, 
  MapPin,
  PhoneCall
} from 'lucide-react';
import { POLTAVA_DISTRICTS } from '../data/poltavaDistricts';
import { formatPhoneInput, validatePhone, validateName } from '../utils/formatters';
import { sendTelegramLeadNotification } from '../utils/telegram';

export const SellModal = ({ onClose }) => {
  const [dealType, setDealType] = useState('sell'); // 'sell' | 'rent'
  const [propCategory, setPropCategory] = useState('apartment');
  const [district, setDistrict] = useState('center');
  const [rooms, setRooms] = useState('1');
  const [area, setArea] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+380');
  const [comment, setComment] = useState('');
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePhoneChange = (e) => {
    setPhone(formatPhoneInput(e.target.value));
  };

  const handleDealTypeChange = (type) => {
    setDealType(type);
    if (type === 'rent' && propCategory === 'land') {
      setPropCategory('apartment');
    }
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

    const categoryTitle = propCategory === 'apartment' ? 'Квартира'
      : propCategory === 'house' ? 'Будинок / Котедж'
      : propCategory === 'commercial' ? 'Комерція'
      : propCategory === 'land' ? 'Земельна ділянка'
      : 'Кімната / Подобово';

    const priceLabelFormatted = targetPrice 
      ? (dealType === 'sell' ? `$ ${targetPrice}` : `${targetPrice} грн/місяць`) 
      : 'Потрібна консультація експерта';

    try {
      await sendTelegramLeadNotification({
        formType: 'sell',
        name,
        phone,
        type: dealType === 'sell' ? 'Продаж нерухомості (Власник)' : 'Здача в оренду (Власник)',
        dealType,
        propCategory: categoryTitle,
        district: POLTAVA_DISTRICTS.find(d => d.id === district)?.name || district,
        rooms: rooms || undefined,
        area: area || undefined,
        floor: floor && totalFloors ? `${floor}/${totalFloors}` : (floor || undefined),
        targetPrice: priceLabelFormatted,
        comment: comment || undefined
      });

      setIsSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = dealType === 'sell' ? [
    { id: 'apartment', label: 'Квартира' },
    { id: 'house', label: 'Будинок / Котедж' },
    { id: 'commercial', label: 'Комерція' },
    { id: 'land', label: 'Ділянка' }
  ] : [
    { id: 'apartment', label: 'Квартира' },
    { id: 'house', label: 'Будинок / Котедж' },
    { id: 'commercial', label: 'Комерція' },
    { id: 'room', label: 'Кімната / Подобово' }
  ];

  return (
    <div className="modal-backdrop animate-fade" onClick={onClose}>
      <div className="modal-window animate-slide" onClick={(e) => e.stopPropagation()}>
        <button className="sell-modal-close" onClick={onClose} aria-label="Закрити">
          <X size={20} />
        </button>

        {isSuccess ? (
          <div className="sell-success-box animate-fade">
            <div className="sell-success-left">
              <div className="sell-success-icon-badge">
                <CheckCircle2 size={40} strokeWidth={2.2} />
              </div>
            </div>
            <div className="sell-success-right">
              <h3 className="sell-success-title">Дякуємо! Заявку прийнято</h3>
              <p className="sell-success-text">
                Експерт агентства «ФАВОРИТ ГРУП» зателефонує вам протягом 15 хвилин для узгодження деталей, безкоштовної оцінки вартості та організації співпраці.
              </p>
              <button onClick={onClose} className="btn btn-primary sell-success-btn">
                Зрозуміло
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="sell-form">
            <div className="sell-header">
              <h2 className="sell-title">
                {dealType === 'sell' ? 'Подати заявку на продаж нерухомості' : 'Подати заявку на здачу в оренду'}
              </h2>
              <p className="sell-subtitle">
                {dealType === 'sell'
                  ? 'Продамо вашу нерухомість за максимальною ринковою ціною з повною юридичною безпекою.'
                  : 'Здамо вашу нерухомість перевіреним та платоспроможним орендарям із щомісячним контролем.'}
              </p>
            </div>

            {/* Deal Type Switcher */}
            <div className="deal-toggle-row mb-3">
              <button
                type="button"
                className={`deal-btn ${dealType === 'sell' ? 'active' : ''}`}
                onClick={() => handleDealTypeChange('sell')}
              >
                Хочу продати
              </button>
              <button
                type="button"
                className={`deal-btn ${dealType === 'rent' ? 'active' : ''}`}
                onClick={() => handleDealTypeChange('rent')}
              >
                Хочу здати в оренду
              </button>
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Тип об'єкта</label>
              <div className="cat-pill-row">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`cat-pill ${propCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setPropCategory(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* District and Details Grid */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Район Полтави</label>
                <select 
                  value={district} 
                  onChange={(e) => setDistrict(e.target.value)}
                  className="form-select"
                >
                  {POLTAVA_DISTRICTS.filter(d => d.id !== 'all').map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  {propCategory === 'commercial' ? 'Призначення' : propCategory === 'land' ? 'Призначення ділянки' : 'Кількість кімнат'}
                </label>
                {propCategory === 'commercial' ? (
                  <select 
                    value={rooms} 
                    onChange={(e) => setRooms(e.target.value)}
                    className="form-select"
                  >
                    <option value="Офіс / Кабінет">Офіс / Кабінет</option>
                    <option value="Торгова площа / Магазин">Торгова площа / Магазин</option>
                    <option value="Склад / Виробництво">Склад / Виробництво</option>
                    <option value="Вільне призначення">Вільне призначення</option>
                  </select>
                ) : propCategory === 'land' ? (
                  <select 
                    value={rooms} 
                    onChange={(e) => setRooms(e.target.value)}
                    className="form-select"
                  >
                    <option value="Під житлову забудову (ЖБ)">Під житлову забудову (ЖБ)</option>
                    <option value="Комерційне використання">Комерційне використання</option>
                    <option value="Сільгосп / Садівництво">Сільгосп / Садівництво</option>
                  </select>
                ) : (
                  <select 
                    value={rooms} 
                    onChange={(e) => setRooms(e.target.value)}
                    className="form-select"
                  >
                    <option value="1">1-кімнатна</option>
                    <option value="2">2-кімнатна</option>
                    <option value="3">3-кімнатна</option>
                    <option value="4+">4+ кімнат</option>
                    <option value="Студія / Вільне планування">Студія / Вільне планування</option>
                  </select>
                )}
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Площа (м²)</label>
                <input 
                  type="number" 
                  placeholder="напр. 65" 
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  {dealType === 'sell' ? 'Бажана ціна продажу ($)' : 'Щомісячна орендна плата (грн/міс)'}
                </label>
                <input 
                  type="number" 
                  placeholder={dealType === 'sell' ? 'напр. 45000' : 'напр. 15000'} 
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            {/* Personal Contacts */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Ваше ім'я *</label>
                <input 
                  type="text" 
                  placeholder="Владислав" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>

              <div className="form-group">
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
            </div>

            <div className="form-group">
              <label className="form-label">
                {dealType === 'sell' ? 'Особливості або стан ремонту' : 'Умови оренди та комплектація'}
              </label>
              <textarea 
                rows="2"
                placeholder={dealType === 'sell' 
                  ? 'Вкажіть особливості (стан ремонту, автономне опалення, поверх, терміновий продаж тощо)...' 
                  : 'Вкажіть комплектацію (наявність меблів, техніки, чи дозволені тварини, бажаний термін)...'}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="form-textarea"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn btn-accent btn-block btn-lg"
            >
              <Send size={18} />
              <span>
                {isSubmitting 
                  ? 'Відправка...' 
                  : dealType === 'sell' 
                    ? 'Отримати безкоштовну оцінку та консультацію' 
                    : 'Подати заявку на здачу в оренду'}
              </span>
            </button>
          </form>
        )}
      </div>

      <style>{`
        .sell-modal-close {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
        }

        .sell-header {
          margin-bottom: 20px;
        }

        .sell-title {
          font-size: 1.35rem;
          font-weight: 900;
          color: var(--c-slate);
        }

        .sell-subtitle {
          font-size: 0.85rem;
          color: #64748b;
        }

        .deal-toggle-row {
          display: flex;
          background: #f1f5f9;
          padding: 4px;
          border-radius: var(--radius-sm);
        }

        .deal-btn {
          flex: 1;
          padding: 10px;
          font-weight: 700;
          font-size: 0.9rem;
          color: #64748b;
          border-radius: 6px;
        }

        .deal-btn.active {
          background: #ffffff;
          color: var(--c-primary);
          box-shadow: var(--shadow-sm);
        }

        .cat-pill-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .cat-pill {
          padding: 7px 14px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #475569;
          background: #f8fafc;
          border: 1px solid var(--c-border);
          border-radius: var(--radius-sm);
        }

        .cat-pill.active {
          background: var(--c-primary);
          color: #ffffff;
          border-color: var(--c-primary);
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .form-textarea, textarea {
          resize: none !important;
        }

        .sell-success-box {
          display: flex;
          align-items: flex-start;
          gap: 22px;
          padding: 12px 6px 10px 2px;
          text-align: left;
        }

        .sell-success-left {
          flex-shrink: 0;
          padding-top: 2px;
        }

        .sell-success-icon-badge {
          width: 64px;
          height: 64px;
          min-width: 64px;
          border-radius: 18px;
          background: #f1f5f9;
          border: 1.5px solid #cbd5e1;
          color: #475569;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
        }

        .sell-success-right {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          flex: 1;
        }

        .sell-success-title {
          font-size: 1.32rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0 0 8px 0;
          line-height: 1.25;
          letter-spacing: -0.3px;
        }

        .sell-success-text {
          font-size: 0.92rem;
          color: #64748b;
          line-height: 1.55;
          margin: 0 0 18px 0;
        }

        .sell-success-btn {
          padding: 10px 30px;
          font-weight: 800;
          border-radius: 12px;
        }

        @media (max-width: 640px) {
          .sell-success-box {
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 16px 8px;
            gap: 16px;
          }
          .sell-success-right {
            align-items: center;
          }
          .form-grid-2 {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }
      `}</style>
    </div>
  );
};
