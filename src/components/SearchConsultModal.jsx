import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Send, 
  CheckCircle2, 
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
  
  // Rental specific living questions
  const [residents, setResidents] = useState('1-2');
  const [children, setChildren] = useState('no');
  const [pets, setPets] = useState('no');

  // Purchase specific questions
  const [repairPref, setRepairPref] = useState('ready');

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

    const residentsLabel = residents === '1' ? '1 людина'
      : residents === '1-2' ? '1-2 людини (пара)'
      : residents === 'family' ? 'Сім\'я (3-4 людини)'
      : '4+ людей / компанія';

    const childrenLabel = children === 'no' ? 'Без дітей'
      : children === 'young' ? 'З маленькими дітьми (до 6 років)'
      : 'З дітьми шкільного віку';

    const petsLabel = pets === 'no' ? 'Без тварин'
      : pets === 'cat' ? 'З котиком'
      : pets === 'small_dog' ? 'З песиком (маленька порода)'
      : pets === 'big_dog' ? 'З собакою (середня/велика)'
      : 'Інші домашні улюбленці';

    const repairLabel = repairPref === 'ready' ? 'З готовим ремонтом'
      : repairPref === 'rough' ? 'Під чистову / чернова'
      : 'Будь-який стан';

    let extraDetails = '';
    if (dealType === 'rent' && (propCategory === 'apartment' || propCategory === 'house')) {
      extraDetails = `👥 Проживатиме: ${residentsLabel} | 👶 Діти: ${childrenLabel} | 🐾 Тварини: ${petsLabel}`;
    } else if (dealType === 'buy' && (propCategory === 'apartment' || propCategory === 'house')) {
      extraDetails = `🛠️ Бажаний ремонт: ${repairLabel}`;
    }

    try {
      await sendTelegramLeadNotification({
        formType: 'search',
        name,
        phone,
        type: dealType === 'buy' ? 'Підбір нерухомості (Купівля)' : 'Підбір нерухомості (Оренда)',
        dealType,
        propCategory: categoryTitle,
        rooms: rooms === 'all' ? 'Будь-яка кількість' : `${rooms} кімн.`,
        district: districtName,
        budget: budgetFormatted,
        residents: dealType === 'rent' ? residentsLabel : undefined,
        children: dealType === 'rent' ? childrenLabel : undefined,
        pets: dealType === 'rent' ? petsLabel : undefined,
        repairPref: dealType === 'buy' ? repairLabel : undefined,
        comment: comment || undefined
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

  const isResidentialRent = dealType === 'rent' && (propCategory === 'apartment' || propCategory === 'house');
  const isResidentialBuy = dealType === 'buy' && (propCategory === 'apartment' || propCategory === 'house');

  return (
    <div className="modal-backdrop animate-fade" onClick={onClose}>
      <div className="modal-window animate-slide sc-modal-window" onClick={(e) => e.stopPropagation()}>
        <button className="sc-modal-close" onClick={onClose} aria-label="Закрити">
          <X size={20} />
        </button>

        {isSuccess ? (
          <div className="sc-success-box animate-fade">
            <div className="sc-success-left">
              <div className="sc-success-icon-badge">
                <CheckCircle2 size={44} strokeWidth={2.4} />
              </div>
            </div>
            <div className="sc-success-right">
              <div className="sc-success-badge">
                <span>⚡ Заявку прийнято</span>
              </div>
              <h3 className="sc-success-title">Дякуємо! Заявку на підбір прийнято</h3>
              <p className="sc-success-text">
                Рієлтор АН «ФАВОРИТ ГРУП» зателефонує вам протягом 15 хвилин із готовою добіркою найкращих об'єктів у Полтаві під ваші критерії.
              </p>
              <button onClick={onClose} className="btn btn-primary sc-success-btn">
                Зрозуміло
              </button>
            </div>
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

            {/* Logical Rental Questions (Living criteria) */}
            {isResidentialRent && (
              <div className="sc-rent-special-box">
                <div className="sc-box-header">
                  <span>Склад проживаючих (важливо для власників житла)</span>
                </div>

                {/* Question 1: Residents count */}
                <div className="form-group mb-2">
                  <label className="form-sublabel">Скільки людей проживатиме?</label>
                  <div className="sc-option-row">
                    {[
                      { id: '1', label: '1 людина' },
                      { id: '1-2', label: '2 людей (пара)' },
                      { id: 'family', label: 'Сім\'я (3-4)' },
                      { id: '4+', label: '4+ осіб' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        className={`sc-opt-btn ${residents === opt.id ? 'active' : ''}`}
                        onClick={() => setResidents(opt.id)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 2: Children */}
                <div className="form-group mb-2">
                  <label className="form-sublabel">Чи є діти?</label>
                  <div className="sc-option-row">
                    {[
                      { id: 'no', label: 'Без дітей' },
                      { id: 'young', label: 'З дітьми (до 6 років)' },
                      { id: 'school', label: 'З дітьми (школярі)' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        className={`sc-opt-btn ${children === opt.id ? 'active' : ''}`}
                        onClick={() => setChildren(opt.id)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 3: Pets */}
                <div className="form-group mb-0">
                  <label className="form-sublabel">Чи є домашні улюбленці (тварини)?</label>
                  <div className="sc-option-row">
                    {[
                      { id: 'no', label: 'Без тварин' },
                      { id: 'cat', label: 'З котиком' },
                      { id: 'small_dog', label: 'З песиком (маленький)' },
                      { id: 'big_dog', label: 'З собакою (середня/велика)' },
                      { id: 'other', label: 'Інші тварини' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        className={`sc-opt-btn ${pets === opt.id ? 'active' : ''}`}
                        onClick={() => setPets(opt.id)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Logical Buy Questions */}
            {isResidentialBuy && (
              <div className="sc-rent-special-box">
                <div className="sc-box-header">
                  <span>Вимоги до покупки</span>
                </div>

                <div className="form-group mb-0">
                  <label className="form-sublabel">Бажаний стан ремонту</label>
                  <div className="sc-option-row">
                    {[
                      { id: 'ready', label: 'З готовим ремонтом' },
                      { id: 'rough', label: 'Під чистову / чернова' },
                      { id: 'any', label: 'Будь-який стан' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        className={`sc-opt-btn ${repairPref === opt.id ? 'active' : ''}`}
                        onClick={() => setRepairPref(opt.id)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

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
              <label className="form-label">Додаткові побажання (поверх, опалення, меблі тощо)</label>
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

        /* Rent/Buy Special Criteria Box */
        .sc-rent-special-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 14px 16px;
          margin-bottom: 16px;
        }

        .sc-box-header {
          font-size: 0.85rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .form-sublabel {
          display: block;
          font-size: 0.78rem;
          font-weight: 700;
          color: #64748b;
          margin-bottom: 5px;
        }

        .sc-option-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .sc-opt-btn {
          padding: 6px 12px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #475569;
          background: #ffffff;
          border: 1px solid var(--c-border);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .sc-opt-btn:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .sc-opt-btn.active {
          background: var(--c-primary);
          color: #ffffff;
          border-color: var(--c-primary);
          box-shadow: 0 1px 3px rgba(30, 58, 138, 0.2);
        }

        .form-textarea {
          resize: none !important;
        }

        .sc-submit-btn {
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .sc-success-box {
          display: grid;
          grid-template-columns: 80px 1fr;
          align-items: center;
          gap: 28px;
          padding: 24px 16px 20px 8px;
          text-align: left;
        }

        .sc-success-left {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .sc-success-icon-badge {
          width: 80px;
          height: 80px;
          min-width: 80px;
          border-radius: 22px;
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border: 1.5px solid #a7f3d0;
          color: #059669;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px -5px rgba(5, 150, 105, 0.22);
        }

        .sc-success-right {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .sc-success-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #166534;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.76rem;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .sc-success-title {
          font-size: 1.35rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0 0 8px 0;
          line-height: 1.25;
          letter-spacing: -0.3px;
        }

        .sc-success-text {
          font-size: 0.9rem;
          color: #64748b;
          line-height: 1.55;
          margin: 0 0 20px 0;
        }

        .sc-success-btn {
          padding: 10px 28px;
          font-weight: 800;
          border-radius: 12px;
        }

        @media (max-width: 640px) {
          .sc-success-box {
            grid-template-columns: 1fr;
            text-align: center;
            padding: 20px 8px;
            gap: 16px;
          }
          .sc-success-right {
            align-items: center;
          }
        }
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
