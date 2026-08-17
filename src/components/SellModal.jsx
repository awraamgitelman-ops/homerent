import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  MapPin,
  Sparkles,
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
        type: dealType === 'sell' ? 'Заявка на продаж нерухомості від власника' : 'Заявка на здачу в оренду від власника',
        propertyTitle: `Власник: ${propCategory === 'apartment' ? 'Квартира' : propCategory === 'house' ? 'Будинок' : 'Комерція'}, ${rooms} кімн., ${area ? area + ' м²' : ''}`,
        district: POLTAVA_DISTRICTS.find(d => d.id === district)?.name || district,
        budget: targetPrice ? `$ ${targetPrice}` : 'Потрібна оцінка експерта',
        comment: comment || 'Без коментаря'
      });

      setIsSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop animate-fade" onClick={onClose}>
      <div className="modal-window animate-slide" onClick={(e) => e.stopPropagation()}>
        <button className="sell-modal-close" onClick={onClose} aria-label="Закрити">
          <X size={20} />
        </button>

        {isSuccess ? (
          <div className="sell-success-box animate-fade">
            <h3 className="text-xl font-bold mb-2">Дякуємо! Заявку прийнято</h3>
            <p className="text-muted mb-4">
              Експерт агентства «ФАВОРИТ ГРУП» зателефонує вам протягом 15 хвилин для узгодження деталей, безкоштовної оцінки ринкової вартості та організації зйомки.
            </p>
            <button onClick={onClose} className="btn btn-primary">
              Зрозуміло
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="sell-form">
            <div className="sell-header">
              <span className="badge badge-gold mb-2">Для власників нерухомості у Полтаві</span>
              <h2 className="sell-title">Подати заявку на продаж або оренду</h2>
              <p className="sell-subtitle">
                Продамо вашу нерухомість за максимальною ринковою ціною з повною юридичною безпекою.
              </p>
            </div>

            {/* Deal Type Switcher */}
            <div className="deal-toggle-row mb-3">
              <button
                type="button"
                className={`deal-btn ${dealType === 'sell' ? 'active' : ''}`}
                onClick={() => setDealType('sell')}
              >
                Хочу продати
              </button>
              <button
                type="button"
                className={`deal-btn ${dealType === 'rent' ? 'active' : ''}`}
                onClick={() => setDealType('rent')}
              >
                Хочу здати в оренду
              </button>
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Тип об'єкта</label>
              <div className="cat-pill-row">
                <button
                  type="button"
                  className={`cat-pill ${propCategory === 'apartment' ? 'active' : ''}`}
                  onClick={() => setPropCategory('apartment')}
                >
                  Квартира
                </button>
                <button
                  type="button"
                  className={`cat-pill ${propCategory === 'house' ? 'active' : ''}`}
                  onClick={() => setPropCategory('house')}
                >
                  Будинок / Котедж
                </button>
                <button
                  type="button"
                  className={`cat-pill ${propCategory === 'commercial' ? 'active' : ''}`}
                  onClick={() => setPropCategory('commercial')}
                >
                  Комерція
                </button>
                <button
                  type="button"
                  className={`cat-pill ${propCategory === 'land' ? 'active' : ''}`}
                  onClick={() => setPropCategory('land')}
                >
                  Ділянка
                </button>
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
                <label className="form-label">Кількість кімнат</label>
                <select 
                  value={rooms} 
                  onChange={(e) => setRooms(e.target.value)}
                  className="form-select"
                >
                  <option value="1">1-кімнатна</option>
                  <option value="2">2-кімнатна</option>
                  <option value="3">3-кімнатна</option>
                  <option value="4+">4+ кімнат</option>
                  <option value="studio">Студія / Вільне планування</option>
                </select>
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
                <label className="form-label">Бажана ціна ($)</label>
                <input 
                  type="number" 
                  placeholder="напр. 45000" 
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
              <label className="form-label">Додаткові побажання або стан ремонту</label>
              <textarea 
                rows="2"
                placeholder="Вкажіть особливості (новий котел, закритий двір, терміновий продаж тощо)..."
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
              <span>{isSubmitting ? 'Відправка...' : 'Отримати безкоштовну оцінку та консультацію'}</span>
            </button>

            <div className="sell-guarantee-note">
              <ShieldCheck size={14} className="text-green" />
              <span>Офіційний договір із ТОВ «НОВЕКС ІНВЕСТ» (код ЄДРПОУ 43980756)</span>
            </div>
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

        .sell-guarantee-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.76rem;
          color: #64748b;
          margin-top: 12px;
        }

        .sell-success-box {
          text-align: center;
          padding: 30px 10px;
        }

        @media (max-width: 640px) {
          .form-grid-2 {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }
      `}</style>
    </div>
  );
};
