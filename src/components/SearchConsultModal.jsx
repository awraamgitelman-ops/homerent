import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  MapPin,
  PhoneCall,
  Key,
  Home
} from 'lucide-react';
import { POLTAVA_DISTRICTS } from '../data/poltavaDistricts';
import { formatPhoneInput, validatePhone, validateName } from '../utils/formatters';
import { sendTelegramLeadNotification } from '../utils/telegram';

export const SearchConsultModal = ({ onClose }) => {
  const [dealType, setDealType] = useState('buy'); // 'buy' | 'rent'
  const [propCategory, setPropCategory] = useState('apartment');
  const [district, setDistrict] = useState('all');
  const [rooms, setRooms] = useState('all');
  const [budget, setBudget] = useState('');
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
      : 'Кімната';

    const districtName = district === 'all' ? 'Будь-який район Полтави' : (POLTAVA_DISTRICTS.find(d => d.id === district)?.name || district);

    const budgetFormatted = budget 
      ? (dealType === 'buy' ? `$ ${budget}` : `${budget} грн/міс`) 
      : 'Будь-який бюджет';

    try {
      await sendTelegramLeadNotification({
        name,
        phone,
        type: dealType === 'buy' ? 'Заявка на підбір нерухомості (Купівля)' : 'Заявка на підбір нерухомості (Оренда)',
        propertyTitle: `Клієнт шукає: ${categoryTitle}, ${rooms === 'all' ? 'Будь-яка к-сть кімнат' : rooms + ' кімн.'}`,
        district: districtName,
        budget: budgetFormatted,
        comment: comment || 'Без додаткових побажань'
      });

      setIsSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = dealType === 'buy' ? [
    { id: 'apartment', label: 'Квартира' },
    { id: 'house', label: 'Будинок / Котедж' },
    { id: 'commercial', label: 'Комерція' },
    { id: 'land', label: 'Ділянка' }
  ] : [
    { id: 'apartment', label: 'Квартира' },
    { id: 'house', label: 'Будинок / Котедж' },
    { id: 'commercial', label: 'Комерція' }
  ];

  return (
    <div className="modal-backdrop animate-fade" onClick={onClose}>
      <div className="modal-window animate-slide sc-modal-window" onClick={(e) => e.stopPropagation()}>
        <button className="sc-modal-close" onClick={onClose} aria-label="Закрити">
          <X size={20} />
        </button>

        {isSuccess ? (
          <div className="sc-success-box animate-fade">
            <div className="sc-success-icon">
              <CheckCircle2 size={48} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Дякуємо! Заявку на підбір прийнято</h3>
            <p className="text-muted mb-4">
              Рієлтор АН «ФАВОРИТ ГРУП» зателефонує вам протягом 15 хвилин із готовою добіркою найкращих об'єктів у Полтаві під ваші критерії.
            </p>
            <button onClick={onClose} className="btn btn-primary">
              Зрозуміло
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="sc-form">
            <div className="sc-header">
              <h2 className="sc-title">
                {dealType === 'buy' ? 'Підібрати нерухомість для купівлі' : 'Підібрати житло або комерцію в оренду'}
              </h2>
              <p className="sc-subtitle">
                Підберемо найкращі актуальні варіанти закритих та відкритих баз Полтави за 15 хвилин.
              </p>
            </div>

            {/* Deal Type Switcher */}
            <div className="sc-toggle-row mb-3">
              <button
                type="button"
                className={`sc-toggle-btn ${dealType === 'buy' ? 'active' : ''}`}
                onClick={() => handleDealTypeChange('buy')}
              >
                <Home size={15} />
                <span>Хочу купити</span>
              </button>
              <button
                type="button"
                className={`sc-toggle-btn ${dealType === 'rent' ? 'active' : ''}`}
                onClick={() => handleDealTypeChange('rent')}
              >
                <Key size={15} />
                <span>Хочу орендувати</span>
              </button>
            </div>

            {/* Category Pills */}
            <div className="form-group mb-3">
              <label className="form-label">Що саме ви шукаєте?</label>
              <div className="sc-cat-row">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`sc-cat-pill ${propCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setPropCategory(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* District and Rooms */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Бажаний район Полтави</label>
                <select 
                  value={district} 
                  onChange={(e) => setDistrict(e.target.value)}
                  className="form-select"
                >
                  <option value="all">Всі райони Полтави</option>
                  {POLTAVA_DISTRICTS.filter(d => d.id !== 'all').map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  {propCategory === 'commercial' ? 'Формат приміщення' : propCategory === 'land' ? 'Призначення ділянки' : 'Кількість кімнат'}
                </label>
                {propCategory === 'commercial' ? (
                  <select 
                    value={rooms} 
                    onChange={(e) => setRooms(e.target.value)}
                    className="form-select"
                  >
                    <option value="all">Будь-який формат</option>
                    <option value="Офіс / Кабінет">Офіс / Кабінет</option>
                    <option value="Торгова площа / Магазин">Торгова площа / Магазин</option>
                    <option value="Склад / Виробництво">Склад / Виробництво</option>
                  </select>
                ) : propCategory === 'land' ? (
                  <select 
                    value={rooms} 
                    onChange={(e) => setRooms(e.target.value)}
                    className="form-select"
                  >
                    <option value="all">Будь-яке призначення</option>
                    <option value="Під житлову забудову (ЖБ)">Під житлову забудову (ЖБ)</option>
                    <option value="Комерційне використання">Комерційне використання</option>
                  </select>
                ) : (
                  <select 
                    value={rooms} 
                    onChange={(e) => setRooms(e.target.value)}
                    className="form-select"
                  >
                    <option value="all">Будь-яка кількість</option>
                    <option value="1">1-кімнатна</option>
                    <option value="2">2-кімнатна</option>
                    <option value="3">3-кімнатна</option>
                    <option value="4+">4+ кімнат</option>
                  </select>
                )}
              </div>
            </div>

            {/* Budget */}
            <div className="form-group mb-3">
              <label className="form-label">
                {dealType === 'buy' ? 'Орієнтовний бюджет ($)' : 'Орієнтовний бюджет (грн/міс)'}
              </label>
              <input 
                type="number" 
                placeholder={dealType === 'buy' ? 'напр. 35000' : 'напр. 12000'} 
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="form-input"
              />
            </div>

            {/* Personal Contacts */}
            <div className="form-grid-2">
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
              <label className="form-label">Додаткові побажання (поверх, ремонт, опалення тощо)</label>
              <textarea 
                rows="2"
                placeholder="Наприклад: середній поверх, індивідуальне опалення, поруч парк або школа..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="form-textarea"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn btn-primary btn-block btn-lg sc-submit-btn"
            >
              <Search size={18} />
              <span>
                {isSubmitting ? 'Підбираємо варіанти...' : 'Підібрати варіанти нерухомості'}
              </span>
            </button>

            <div className="sc-guarantee-note">
              <ShieldCheck size={14} className="text-green" />
              <span>Послуги надає АН «ФАВОРИТ ГРУП» • ТОВ «НОВЕКС ІНВЕСТ» (ЄДРПОУ 43980756)</span>
            </div>
          </form>
        )}
      </div>

      <style>{`
        .sc-modal-window {
          max-width: 540px;
          background: #ffffff;
          border-radius: var(--radius-lg);
          padding: 28px;
          position: relative;
        }

        .sc-modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sc-modal-close:hover {
          background: #e2e8f0;
          color: var(--c-dark);
        }

        .sc-header {
          margin-bottom: 20px;
        }

        .sc-title {
          font-size: 1.35rem;
          font-weight: 900;
          color: var(--c-slate);
          margin-top: 4px;
          line-height: 1.25;
        }

        .sc-subtitle {
          font-size: 0.85rem;
          color: #64748b;
          margin-top: 4px;
        }

        .sc-toggle-row {
          display: flex;
          background: #f1f5f9;
          padding: 4px;
          border-radius: var(--radius-sm);
          gap: 4px;
        }

        .sc-toggle-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 9px;
          font-weight: 700;
          font-size: 0.88rem;
          color: #64748b;
          border-radius: 6px;
          transition: all 0.15s ease;
        }

        .sc-toggle-btn.active {
          background: #ffffff;
          color: var(--c-primary);
          box-shadow: var(--shadow-sm);
        }

        .sc-cat-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .sc-cat-pill {
          padding: 7px 14px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #475569;
          background: #f8fafc;
          border: 1px solid var(--c-border);
          border-radius: var(--radius-sm);
          transition: all 0.15s ease;
          cursor: pointer;
        }

        .sc-cat-pill:hover {
          border-color: #cbd5e1;
          background: #f1f5f9;
        }

        .sc-cat-pill.active {
          background: var(--c-primary);
          color: #ffffff;
          border-color: var(--c-primary);
        }

        .sc-submit-btn {
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .sc-guarantee-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.76rem;
          color: #64748b;
          margin-top: 14px;
          text-align: center;
        }

        .sc-success-box {
          text-align: center;
          padding: 24px 10px;
        }

        .sc-success-icon {
          display: flex;
          justify-content: center;
          margin-bottom: 12px;
        }

        @media (max-width: 640px) {
          .sc-modal-window {
            padding: 20px 16px;
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
