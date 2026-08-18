import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  CheckCircle2, 
  Phone, 
  Calendar, 
  Clock,
  Layers, 
  Maximize2, 
  Building2, 
  Flame, 
  ShieldCheck, 
  Send, 
  UserCheck, 
  Share2, 
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { formatCurrency, formatPricePerM2, formatPhoneInput, validatePhone, validateName } from '../utils/formatters';
import { sendTelegramLeadNotification } from '../utils/telegram';

export const PropertyModal = ({ property, onClose, onBookingSuccess }) => {
  if (!property) return null;

  const getTodayISO = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getTomorrowISO = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+380');
  
  // Date & Time Picker States
  const [selectedDate, setSelectedDate] = useState(getTodayISO());
  const [datePreset, setDatePreset] = useState('today'); // 'today' | 'tomorrow' | 'custom'
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('17:00 — 20:00 (Вечір)'); // '10:00 — 13:00' | '13:00 — 17:00' | '17:00 — 20:00' | 'custom'
  const [customTime, setCustomTime] = useState('16:00');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight' && property.images && property.images.length > 1) {
        setActivePhotoIdx((prev) => (prev + 1) % property.images.length);
      }
      if (e.key === 'ArrowLeft' && property.images && property.images.length > 1) {
        setActivePhotoIdx((prev) => (prev - 1 + property.images.length) % property.images.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, property.images]);

  const handlePhoneChange = (e) => {
    setPhone(formatPhoneInput(e.target.value));
  };

  const handleShare = async (e) => {
    if (e) e.stopPropagation();
    const url = `${window.location.origin}/property/${property.id}`;
    if (navigator.share && /Android|iPhone|iPad/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title: property.title,
          text: `${property.title} — АН «ФАВОРИТ ГРУП» Полтава`,
          url: url,
        });
        return;
      } catch (err) {}
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {}
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

    const formatUkDate = (isoStr) => {
      if (!isoStr) return 'Найближчим часом';
      try {
        const [y, m, d] = isoStr.split('-');
        const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
        const weekdays = ['неділя', 'понеділок', 'вівторок', 'середа', 'четвер', 'п\'ятниця', 'субота'];
        const months = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
        const dayName = weekdays[dateObj.getDay()];
        const monthName = months[dateObj.getMonth()];
        return `${Number(d)} ${monthName} (${dayName})`;
      } catch (e) {
        return isoStr;
      }
    };

    const formattedDate = datePreset === 'today' 
      ? `Сьогодні, ${formatUkDate(selectedDate)}`
      : datePreset === 'tomorrow'
      ? `Завтра, ${formatUkDate(selectedDate)}`
      : formatUkDate(selectedDate);

    const formattedTime = selectedTimeSlot === 'custom'
      ? `${customTime} (точний час)`
      : selectedTimeSlot;

    try {
      await sendTelegramLeadNotification({
        formType: 'viewing',
        name,
        phone,
        type: `Запис на перегляд (${property.transaction === 'rent' ? 'Оренда' : 'Купівля'})`,
        propertyId: property.id,
        propertyTitle: property.title,
        address: property.address,
        district: property.districtName,
        rooms: property.rooms ? `${property.rooms} кімн.` : undefined,
        area: property.area,
        floor: property.floor ? `${property.floor}/${property.totalFloors}` : undefined,
        budget: `${formatCurrency(property.priceUSD, 'USD')} (${formatCurrency(property.priceUAH, 'UAH')})`,
        preferredDate: formattedDate,
        preferredTime: formattedTime,
        sourceUrl: `https://favorit-group.com/property/${property.id}`
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
        {/* Top Header Bar: Badges on Left, Actions on Right */}
        <div className="pm-top-bar">
          <div className="pm-top-badges">
            {property.badges?.filter(b => {
              const lower = b.toLowerCase();
              return !lower.includes('перевір') && !lower.includes('єоселя') && !lower.includes('новобуд');
            }).map((b, i) => (
              <span key={i} className="badge badge-green">{b}</span>
            ))}
          </div>

          <div className="pm-top-actions">
            <button 
              type="button" 
              className={`pm-share-btn ${copiedLink ? 'copied' : ''}`}
              onClick={handleShare}
              title={copiedLink ? 'Посилання скопійовано!' : "Поділитися об'єктом"}
            >
              {copiedLink ? <Check size={15} className="text-green" /> : <Share2 size={15} />}
              <span>{copiedLink ? 'Скопійовано!' : 'Поділитися'}</span>
            </button>
            <button className="pm-close-btn" onClick={onClose} aria-label="Закрити">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="pm-scrollable-content">
          {/* Header Title & Price */}
          <div className="pm-header">
            <div className="pm-header-left">
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
            <div 
              className="pm-main-photo-box" 
              onClick={() => setIsLightboxOpen(true)}
              title="Натисніть для перегляду фото на весь екран"
            >
              <img 
                src={property.images[activePhotoIdx] || property.images[0]} 
                alt={property.title} 
                className="pm-main-img" 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  if (property.images && property.images.length > 0 && e.currentTarget.src !== property.images[0]) {
                    e.currentTarget.src = property.images[0];
                  }
                }}
              />
              <div className="pm-photo-zoom-hint">
                <Maximize2 size={15} />
                <span>На весь екран</span>
              </div>
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
                        if (e.currentTarget.parentElement) {
                          e.currentTarget.parentElement.style.display = 'none';
                        }
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

              {property.features && property.features.filter(f => {
                const lower = f.toLowerCase();
                return !lower.includes('перевір') && !lower.includes('єоселя') && !lower.includes('новобуд');
              }).length > 0 && (
                <>
                  <h3 className="section-subtitle mt-4">Переваги та зручності</h3>
                  <div className="pm-features-list">
                    {property.features.filter(f => {
                      const lower = f.toLowerCase();
                      return !lower.includes('перевір') && !lower.includes('єоселя') && !lower.includes('новобуд');
                    }).map((f, i) => (
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
                  <div className="agent-meta">
                    <span className="agent-name">{property.agent?.name || 'Омельяненко Владислав'}</span>
                    <span className="agent-role">{property.agent?.role || 'Керівник відділу нерухомості АН «ФАВОРИТ ГРУП»'}</span>
                    <span className="agent-agency">АН «ФАВОРИТ ГРУП» Полтава</span>
                  </div>
                </div>

                {isSuccess ? (
                  <div className="booking-success-box animate-fade">
                    <div className="bsb-icon-badge">
                      <CheckCircle2 size={30} strokeWidth={2.2} />
                    </div>
                    <div className="bsb-content">
                      <h4 className="bsb-title">Запис на перегляд оформлено!</h4>
                      <p className="bsb-text">Наш експерт зателефонує вам протягом 10 хвилин для узгодження зручного часу.</p>
                    </div>
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

                    {/* Date selection: Calendar & Tumblers */}
                    <div className="form-group">
                      <label className="form-label bf-label-with-icon">
                        <Calendar size={14} className="text-primary" />
                        <span>Бажаний день перегляду</span>
                      </label>
                      
                      <div className="bf-tumbler-row">
                        <button 
                          type="button" 
                          className={`bf-tumbler-pill ${datePreset === 'today' ? 'active' : ''}`}
                          onClick={() => { setDatePreset('today'); setSelectedDate(getTodayISO()); }}
                        >
                          Сьогодні
                        </button>
                        <button 
                          type="button" 
                          className={`bf-tumbler-pill ${datePreset === 'tomorrow' ? 'active' : ''}`}
                          onClick={() => { setDatePreset('tomorrow'); setSelectedDate(getTomorrowISO()); }}
                        >
                          Завтра
                        </button>
                        <button 
                          type="button" 
                          className={`bf-tumbler-pill ${datePreset === 'custom' ? 'active' : ''}`}
                          onClick={() => setDatePreset('custom')}
                        >
                          Інша дата
                        </button>
                      </div>

                      <div className="bf-calendar-picker-wrap">
                        <input 
                          type="date"
                          min={getTodayISO()}
                          value={selectedDate}
                          onChange={(e) => {
                            setSelectedDate(e.target.value);
                            if (e.target.value === getTodayISO()) setDatePreset('today');
                            else if (e.target.value === getTomorrowISO()) setDatePreset('tomorrow');
                            else setDatePreset('custom');
                          }}
                          className="form-input bf-calendar-input"
                          title="Виберіть дату в календарі"
                        />
                      </div>
                    </div>

                    {/* Time selection: Time Tumblers */}
                    <div className="form-group">
                      <label className="form-label bf-label-with-icon">
                        <Clock size={14} className="text-primary" />
                        <span>Зручний час</span>
                      </label>
                      
                      <div className="bf-time-tumbler-grid">
                        <button 
                          type="button" 
                          className={`bf-time-slot-btn ${selectedTimeSlot === '10:00 — 13:00 (Ранок)' ? 'active' : ''}`}
                          onClick={() => setSelectedTimeSlot('10:00 — 13:00 (Ранок)')}
                        >
                          <span className="bf-ts-hours">10:00 — 13:00</span>
                          <span className="bf-ts-tag">Ранок</span>
                        </button>

                        <button 
                          type="button" 
                          className={`bf-time-slot-btn ${selectedTimeSlot === '13:00 — 17:00 (День)' ? 'active' : ''}`}
                          onClick={() => setSelectedTimeSlot('13:00 — 17:00 (День)')}
                        >
                          <span className="bf-ts-hours">13:00 — 17:00</span>
                          <span className="bf-ts-tag">День</span>
                        </button>

                        <button 
                          type="button" 
                          className={`bf-time-slot-btn ${selectedTimeSlot === '17:00 — 20:00 (Вечір)' ? 'active' : ''}`}
                          onClick={() => setSelectedTimeSlot('17:00 — 20:00 (Вечір)')}
                        >
                          <span className="bf-ts-hours">17:00 — 20:00</span>
                          <span className="bf-ts-tag">Вечір</span>
                        </button>
                      </div>

                      {/* Custom exact time tumbler button & time input */}
                      <div className="bf-custom-time-row">
                        <button
                          type="button"
                          className={`bf-custom-time-toggle ${selectedTimeSlot === 'custom' ? 'active' : ''}`}
                          onClick={() => setSelectedTimeSlot(selectedTimeSlot === 'custom' ? '17:00 — 20:00 (Вечір)' : 'custom')}
                        >
                          <span>Точний час:</span>
                        </button>
                        {selectedTimeSlot === 'custom' && (
                          <input 
                            type="time" 
                            value={customTime}
                            onChange={(e) => setCustomTime(e.target.value)}
                            className="form-input bf-time-input animate-fade"
                          />
                        )}
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="btn btn-primary btn-block bf-submit-btn"
                    >
                      <Send size={16} />
                      <span>{isSubmitting ? 'Відправка...' : 'Підтвердити запис'}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="pm-lightbox-overlay animate-fade" onClick={() => setIsLightboxOpen(false)}>
          <div className="pm-lightbox-header" onClick={(e) => e.stopPropagation()}>
            <div className="pm-lb-counter">
              <span>{activePhotoIdx + 1}</span> / <span>{property.images.length}</span>
            </div>
            <div className="pm-lb-title">{property.title}</div>
            <button 
              type="button" 
              className="pm-lb-close-btn" 
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Закрити перегляд"
            >
              <X size={22} />
            </button>
          </div>

          <div className="pm-lightbox-body" onClick={(e) => e.stopPropagation()}>
            {property.images.length > 1 && (
              <button 
                type="button" 
                className="pm-lb-nav prev"
                onClick={() => setActivePhotoIdx((prev) => (prev - 1 + property.images.length) % property.images.length)}
                aria-label="Попереднє фото"
              >
                <ChevronLeft size={32} />
              </button>
            )}

            <div className="pm-lb-img-container" onClick={() => setIsLightboxOpen(false)}>
              <img 
                src={property.images[activePhotoIdx] || property.images[0]} 
                alt={property.title} 
                className="pm-lb-active-img"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {property.images.length > 1 && (
              <button 
                type="button" 
                className="pm-lb-nav next"
                onClick={() => setActivePhotoIdx((prev) => (prev + 1) % property.images.length)}
                aria-label="Наступне фото"
              >
                <ChevronRight size={32} />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Strip in Lightbox */}
          {property.images.length > 1 && (
            <div className="pm-lightbox-thumbs-bar" onClick={(e) => e.stopPropagation()}>
              {property.images.map((img, idx) => (
                <div 
                  key={idx}
                  className={`pm-lb-thumb ${idx === activePhotoIdx ? 'active' : ''}`}
                  onClick={() => setActivePhotoIdx(idx)}
                >
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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

        .pm-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 28px 12px;
          background: #ffffff;
          border-bottom: 1px solid #f1f5f9;
          gap: 16px;
          flex-shrink: 0;
          z-index: 10;
        }

        .pm-top-badges {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }

        .pm-top-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-left: auto;
          flex-shrink: 0;
        }

        .pm-share-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          color: #334155;
          font-size: 0.82rem;
          font-weight: 700;
          padding: 7px 14px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .pm-share-btn:hover {
          background: #eff6ff;
          border-color: var(--c-primary);
          color: var(--c-primary);
          transform: translateY(-1px);
        }

        .pm-share-btn.copied {
          background: #f0fdf4;
          border-color: #86efac;
          color: #166534;
        }

        .pm-close-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pm-close-btn:hover {
          background: #e2e8f0;
          color: var(--c-dark);
        }

        .pm-scrollable-content {
          padding: 20px 28px 28px;
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
          position: relative;
          cursor: zoom-in;
        }

        .pm-photo-zoom-hint {
          position: absolute;
          bottom: 14px;
          right: 14px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(8px);
          color: #ffffff;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.2s ease;
          pointer-events: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .pm-main-photo-box:hover .pm-photo-zoom-hint {
          background: rgba(37, 99, 235, 0.9);
          border-color: #60a5fa;
          transform: translateY(-2px);
        }

        .pm-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 50% 85%;
          transform: scale(1.12) translateY(-4%);
          transition: transform 0.3s ease;
        }

        .pm-main-photo-box:hover .pm-main-img {
          transform: scale(1.16) translateY(-4%);
        }

        /* Lightbox Fullscreen Styles */
        .pm-lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 15, 29, 0.96);
          backdrop-filter: blur(12px);
          z-index: 100000;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 16px 24px 24px;
          box-sizing: border-box;
          user-select: none;
        }

        .pm-lightbox-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          color: #ffffff;
          padding: 0 8px 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          flex-shrink: 0;
        }

        .pm-lb-counter {
          font-size: 0.95rem;
          font-weight: 800;
          color: #94a3b8;
          background: rgba(255, 255, 255, 0.1);
          padding: 4px 12px;
          border-radius: 20px;
        }

        .pm-lb-counter span:first-child {
          color: #ffffff;
        }

        .pm-lb-title {
          font-size: 1rem;
          font-weight: 700;
          color: #f1f5f9;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 65vw;
        }

        .pm-lb-close-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pm-lb-close-btn:hover {
          background: rgba(239, 68, 68, 0.9);
          border-color: #ef4444;
          transform: scale(1.05);
        }

        .pm-lightbox-body {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          flex: 1;
          min-height: 0;
          padding: 12px 0;
          gap: 16px;
        }

        .pm-lb-nav {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
          z-index: 10;
        }

        .pm-lb-nav:hover {
          background: #2563eb;
          border-color: #60a5fa;
          transform: scale(1.08);
        }

        .pm-lb-img-container {
          flex: 1;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .pm-lb-active-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
        }

        .pm-lightbox-thumbs-bar {
          display: flex;
          gap: 8px;
          justify-content: center;
          overflow-x: auto;
          padding-top: 12px;
          flex-shrink: 0;
        }

        .pm-lb-thumb {
          width: 68px;
          height: 48px;
          border-radius: 6px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          opacity: 0.5;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .pm-lb-thumb:hover,
        .pm-lb-thumb.active {
          opacity: 1;
          border-color: #3b82f6;
          transform: translateY(-2px);
        }

        .pm-lb-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
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
          object-position: center;
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
          padding-bottom: 14px;
          margin-bottom: 16px;
          border-bottom: 1px solid var(--c-border);
        }

        .agent-name {
          display: block;
          font-weight: 800;
          font-size: 1.05rem;
          color: var(--c-slate);
          margin-bottom: 2px;
        }

        .agent-role {
          display: block;
          font-size: 0.82rem;
          color: #64748b;
          margin-bottom: 3px;
        }

        .agent-agency {
          display: block;
          font-size: 0.78rem;
          color: var(--c-primary);
          font-weight: 800;
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

        .bf-label-with-icon {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
          font-weight: 700;
        }

        .bf-tumbler-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          margin-bottom: 8px;
        }

        .bf-tumbler-pill {
          padding: 7px 4px;
          font-size: 0.78rem;
          font-weight: 700;
          border-radius: 8px;
          border: 1.5px solid #e2e8f0;
          background: #ffffff;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }

        .bf-tumbler-pill:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
        }

        .bf-tumbler-pill.active {
          border-color: #1e3a8a;
          background: #1e3a8a;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(30, 58, 138, 0.2);
        }

        .bf-calendar-picker-wrap {
          position: relative;
        }

        .bf-calendar-input {
          cursor: pointer;
          font-weight: 600;
          font-size: 0.88rem;
          color: #0f172a;
          padding: 8px 12px;
          border-radius: 8px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          width: 100%;
        }

        .bf-calendar-input:focus {
          border-color: #1e3a8a;
          outline: none;
          box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1);
        }

        .bf-time-tumbler-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          margin-bottom: 6px;
        }

        .bf-time-slot-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 7px 2px;
          border-radius: 8px;
          border: 1.5px solid #e2e8f0;
          background: #ffffff;
          color: #1e293b;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .bf-time-slot-btn:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
        }

        .bf-time-slot-btn.active {
          border-color: #1e3a8a;
          background: #1e3a8a;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(30, 58, 138, 0.2);
        }

        .bf-ts-hours {
          font-size: 0.74rem;
          font-weight: 800;
          line-height: 1.2;
        }

        .bf-ts-tag {
          font-size: 0.68rem;
          opacity: 0.8;
          font-weight: 600;
          margin-top: 1px;
        }

        .bf-time-slot-btn.active .bf-ts-tag {
          color: #93c5fd;
          opacity: 1;
        }

        .bf-custom-time-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 6px;
        }

        .bf-custom-time-toggle {
          padding: 5px 10px;
          font-size: 0.74rem;
          font-weight: 700;
          border-radius: 6px;
          border: 1.5px dashed #cbd5e1;
          background: transparent;
          color: #64748b;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .bf-custom-time-toggle.active {
          border-style: solid;
          border-color: #1e3a8a;
          color: #1e3a8a;
          background: #eff6ff;
        }

        .bf-time-input {
          width: 120px;
          padding: 5px 8px;
          font-size: 0.82rem;
          font-weight: 700;
          border-radius: 6px;
          border: 1.5px solid #e2e8f0;
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
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px 14px;
          text-align: left;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
        }

        .bsb-icon-badge {
          width: 44px;
          height: 44px;
          min-width: 44px;
          border-radius: 12px;
          background: #f1f5f9;
          border: 1.5px solid #cbd5e1;
          color: #475569;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
          flex-shrink: 0;
          margin-top: 1px;
        }

        .bsb-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          flex: 1;
        }

        .bsb-title {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px 0;
          line-height: 1.25;
        }

        .bsb-text {
          font-size: 0.84rem;
          color: #64748b;
          line-height: 1.45;
          margin: 0;
        }

        @media (max-width: 768px) {
          .pm-top-bar {
            padding: 12px 16px 10px;
          }
          .pm-scrollable-content {
            padding: 16px;
          }
          .pm-details-layout {
            grid-template-columns: 1fr;
          }
          .pm-header {
            flex-direction: column;
            gap: 12px;
          }
          .pm-header-right {
            text-align: left;
            align-items: flex-start;
          }
          .pm-main-photo-box {
            height: 240px;
          }
        }
      `}</style>
    </div>
  );
};
