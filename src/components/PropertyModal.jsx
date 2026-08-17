import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  CheckCircle2, 
  Phone, 
  Calendar, 
  Layers, 
  Maximize2, 
  Building2, 
  Flame, 
  Sparkles,
  ShieldCheck,
  Send,
  UserCheck
} from 'lucide-react';
import { formatCurrency, formatPricePerM2, formatPhoneInput, validatePhone, validateName } from '../utils/formatters';
import { sendTelegramLeadNotification } from '../utils/telegram';

export const PropertyModal = ({ property, onClose, onBookingSuccess }) => {
  if (!property) return null;

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+380');
  const [preferredDate, setPreferredDate] = useState('');
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
        type: `Запис на перегляд об'єкта (${property.id})`,
        propertyTitle: property.title,
        district: property.districtName,
        budget: `${formatCurrency(property.priceUSD, 'USD')} / ${formatCurrency(property.priceUAH, 'UAH')}`,
        comment: preferredDate ? `Бажана дата перегляду: ${preferredDate}` : 'Якнайшвидше'
      });

      setIsSuccess(true);
      if (onBookingSuccess) onBookingSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop animate-fade" onClick={onClose}>
      <div className="property-modal-window animate-slide" onClick={(e) => e.stopPropagation()}>
        {/* Modal Close Button */}
        <button className="pm-close-btn" onClick={onClose} aria-label="Закрити">
          <X size={20} />
        </button>

        {/* Modal Content Scrollable Area */}
        <div className="pm-scrollable-content">
          {/* Header Title & Price */}
          <div className="pm-header">
            <div className="pm-header-left">
              <div className="pm-badges-row">
                {property.badges?.filter(b => !b.toLowerCase().includes('перевір')).map((b, i) => (
                  <span key={i} className="badge badge-green">{b}</span>
                ))}
              </div>
              <h2 className="pm-title">{property.title}</h2>
              <div className="pm-address">
                <MapPin size={16} className="text-primary" />
                <span>{property.address} ({property.districtName}, Полтава)</span>
              </div>
            </div>

            <div className="pm-header-right">
              <div className="pm-price-usd">{formatCurrency(property.priceUSD, 'USD')}</div>
              <div className="pm-price-uah">{formatCurrency(property.priceUAH, 'UAH')}</div>
              {property.pricePerM2 > 0 && (
                <div className="pm-price-m2">{formatPricePerM2(property.pricePerM2, 'USD')}</div>
              )}
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div className="pm-gallery-section">
            <div className="pm-main-photo-box">
              <img 
                src={property.images[activePhotoIdx] || property.images[0]} 
                alt={property.title} 
                className="pm-main-img" 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = property.type === 'house' 
                    ? 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80'
                    : property.type === 'commercial'
                    ? 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
                    : 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80';
                }}
              />
            </div>

            {property.images.length > 1 && (
              <div className="pm-thumbs-row">
                {property.images.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`pm-thumb-item ${idx === activePhotoIdx ? 'active' : ''}`}
                    onClick={() => setActivePhotoIdx(idx)}
                  >
                    <img 
                      src={img} 
                      alt="" 
                      className="pm-thumb-img" 
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=200&q=80';
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Two Columns: Specifications & Booking Form */}
          <div className="pm-details-layout">
            {/* Left Column: Specs & Description */}
            <div className="pm-info-col">
              <h3 className="section-subtitle">Основні характеристики</h3>
              <div className="pm-specs-grid">
                <div className="spec-card">
                  <span className="spec-name">Загальна площа</span>
                  <span className="spec-val">{property.area} м²</span>
                </div>
                {property.livingArea > 0 && (
                  <div className="spec-card">
                    <span className="spec-name">Житлова площа</span>
                    <span className="spec-val">{property.livingArea} м²</span>
                  </div>
                )}
                {property.kitchenArea > 0 && (
                  <div className="spec-card">
                    <span className="spec-name">Кухня</span>
                    <span className="spec-val">{property.kitchenArea} м²</span>
                  </div>
                )}
                <div className="spec-card">
                  <span className="spec-name">Кімнат</span>
                  <span className="spec-val">{property.rooms > 0 ? property.rooms : 'Вільне планування'}</span>
                </div>
                {property.floor > 0 && (
                  <div className="spec-card">
                    <span className="spec-name">Поверх</span>
                    <span className="spec-val">{property.floor} з {property.totalFloors}</span>
                  </div>
                )}
                <div className="spec-card">
                  <span className="spec-name">Тип будинку</span>
                  <span className="spec-val">{property.buildingType}</span>
                </div>
                <div className="spec-card">
                  <span className="spec-name">Опалення</span>
                  <span className="spec-val">{property.heating}</span>
                </div>
                <div className="spec-card">
                  <span className="spec-name">Стан</span>
                  <span className="spec-val">{property.condition}</span>
                </div>
              </div>

              <h3 className="section-subtitle mt-4">Опис об'єкта</h3>
              <p className="pm-description-text">{property.description}</p>

              {property.features && property.features.length > 0 && (
                <>
                  <h3 className="section-subtitle mt-4">Переваги та зручності</h3>
                  <div className="pm-features-list">
                    {property.features.map((f, i) => (
                      <div key={i} className="feature-pill">
                        <CheckCircle2 size={14} className="text-green" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Right Column: Booking Form */}
            <div className="pm-booking-col">
              <div className="pm-booking-card">
                <div className="pm-agent-box">
                  <div className="agent-avatar">
                    <UserCheck size={24} />
                  </div>
                  <div className="agent-meta">
                    <span className="agent-name">{property.agent.name}</span>
                    <span className="agent-role">{property.agent.role}</span>
                    <span className="agent-agency">АН «НОВЕКС ІНВЕСТ» Полтава</span>
                  </div>
                </div>

                {isSuccess ? (
                  <div className="booking-success-box animate-fade">
                    <CheckCircle2 size={42} className="text-green mx-auto mb-2" />
                    <h4>Заявку успішно прийнято!</h4>
                    <p>Наш експерт зателефонує вам протягом 10 хвилин для узгодження зручного часу перегляду.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="booking-form">
                    <h4 className="bf-title">
                      <Calendar size={18} className="text-primary" />
                      <span>Записатися на перегляд</span>
                    </h4>
                    <p className="bf-subtitle">Безкоштовний огляд об'єкта у зручний для вас час</p>

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
                      <label className="form-label">Телефон для зв'язку *</label>
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
                      <label className="form-label">Бажаний день / час</label>
                      <input 
                        type="text" 
                        placeholder="Сьогодні після 17:00 / Завтра"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="btn btn-primary btn-block bf-submit-btn"
                    >
                      <Send size={16} />
                      <span>{isSubmitting ? 'Відправка...' : 'Підтвердити запис'}</span>
                    </button>

                    <div className="bf-guarantee">
                      <ShieldCheck size={14} className="text-green" />
                      <span>Гарантія безпеки та конфіденційності даних</span>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scoped Styles for PropertyModal */}
      <style>{`
        .property-modal-window {
          background: #ffffff;
          width: 94%;
          max-width: 980px;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-xl);
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .pm-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          z-index: 10;
        }

        .pm-close-btn:hover {
          background: #e2e8f0;
          color: var(--c-dark);
        }

        .pm-scrollable-content {
          padding: 28px;
          overflow-y: auto;
          flex: 1;
        }

        /* Header */
        .pm-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 20px;
          padding-bottom: 18px;
          border-bottom: 1px solid var(--c-border);
        }

        .pm-header-left {
          flex: 1;
          min-width: 0;
        }

        .pm-badges-row {
          display: flex;
          gap: 6px;
          margin-bottom: 8px;
        }

        .pm-title {
          font-size: 1.45rem;
          font-weight: 900;
          color: var(--c-slate);
          margin-bottom: 6px;
          word-break: break-word;
        }

        .pm-address {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
          color: #64748b;
        }

        .pm-header-right {
          text-align: right;
          flex-shrink: 0;
          white-space: nowrap;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          min-width: max-content;
          padding-top: 4px;
        }

        .pm-price-usd {
          font-size: 1.85rem;
          font-weight: 900;
          color: var(--c-primary);
          line-height: 1.1;
          white-space: nowrap;
          letter-spacing: -0.5px;
        }

        .pm-price-uah {
          font-size: 1.05rem;
          font-weight: 700;
          color: #64748b;
          margin-top: 4px;
          white-space: nowrap;
        }

        .pm-price-m2 {
          font-size: 0.82rem;
          color: #94a3b8;
          margin-top: 2px;
          white-space: nowrap;
        }

        /* Gallery */
        .pm-gallery-section {
          margin-bottom: 24px;
        }

        .pm-main-photo-box {
          width: 100%;
          height: 380px;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: #0f172a;
        }

        .pm-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pm-thumbs-row {
          display: flex;
          gap: 10px;
          margin-top: 10px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .pm-thumb-item {
          width: 84px;
          height: 60px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          opacity: 0.65;
          flex-shrink: 0;
        }

        .pm-thumb-item.active, .pm-thumb-item:hover {
          opacity: 1;
          border-color: var(--c-primary);
        }

        .pm-thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Details Layout */
        .pm-details-layout {
          display: grid;
          grid-template-columns: 1.35fr 0.95fr;
          gap: 28px;
          align-items: start;
        }

        .section-subtitle {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--c-slate);
          margin-bottom: 12px;
        }

        .pm-specs-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .spec-card {
          background: #f8fafc;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--c-border);
          display: flex;
          flex-direction: column;
        }

        .spec-name {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
        }

        .spec-val {
          font-size: 0.9rem;
          font-weight: 800;
          color: var(--c-dark);
          margin-top: 2px;
        }

        .pm-description-text {
          font-size: 0.95rem;
          color: #334155;
          line-height: 1.6;
        }

        .pm-features-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .feature-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #f1f5f9;
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          font-weight: 600;
          color: #1e293b;
        }

        /* Booking Form Column */
        .pm-booking-card {
          background: #f8fafc;
          border: 1px solid var(--c-border);
          border-radius: var(--radius-md);
          padding: 20px;
          box-shadow: var(--shadow-sm);
        }

        .pm-agent-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 16px;
          margin-bottom: 16px;
          border-bottom: 1px solid var(--c-border);
        }

        .agent-avatar {
          width: 44px;
          height: 44px;
          background: var(--c-primary-light);
          color: var(--c-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .agent-name {
          display: block;
          font-weight: 800;
          font-size: 0.95rem;
          color: var(--c-slate);
        }

        .agent-role {
          display: block;
          font-size: 0.76rem;
          color: #64748b;
        }

        .agent-agency {
          display: block;
          font-size: 0.72rem;
          color: var(--c-primary);
          font-weight: 700;
        }

        .bf-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--c-dark);
        }

        .bf-subtitle {
          font-size: 0.8rem;
          color: #64748b;
          margin-bottom: 14px;
        }

        .bf-guarantee {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 10px;
        }

        .booking-success-box {
          text-align: center;
          padding: 24px 12px;
        }

        @media (max-width: 768px) {
          .pm-details-layout {
            grid-template-columns: 1fr;
          }
          .pm-header {
            flex-direction: column;
          }
          .pm-header-right {
            text-align: left;
          }
          .pm-main-photo-box {
            height: 240px;
          }
        }
      `}</style>
    </div>
  );
};
