import React, { useState } from 'react';
import { 
  Calculator, 
  Sparkles, 
  TrendingUp, 
  Building2, 
  DollarSign, 
  ShieldCheck,
  Send,
  HelpCircle
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const MortgageCalculator = ({ onOpenConsultModal }) => {
  const [calcTab, setCalcTab] = useState('eoselya'); // 'eoselya' | 'roi'
  
  // єОселя state
  const [propertyPrice, setPropertyPrice] = useState(50000); // USD
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [ratePercent, setRatePercent] = useState(3); // 3% or 7%
  const [loanTermYears, setLoanTermYears] = useState(20);

  // ROI state
  const [roiPriceUSD, setRoiPriceUSD] = useState(45000);
  const [monthlyRentUSD, setMonthlyRentUSD] = useState(380);
  const [annualExpensesUSD, setAnnualExpensesUSD] = useState(350);

  // Calculations: єОселя
  const downPaymentUSD = (propertyPrice * downPaymentPercent) / 100;
  const loanAmountUSD = propertyPrice - downPaymentUSD;
  const monthlyRate = (ratePercent / 100) / 12;
  const totalMonths = loanTermYears * 12;
  
  const monthlyPaymentUSD = loanAmountUSD > 0 && monthlyRate > 0
    ? (loanAmountUSD * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    : 0;

  const totalPaymentUSD = monthlyPaymentUSD * totalMonths;
  const totalInterestUSD = totalPaymentUSD - loanAmountUSD;

  // Calculations: ROI
  const grossAnnualIncome = monthlyRentUSD * 12;
  const netAnnualIncome = grossAnnualIncome - annualExpensesUSD;
  const roiPercentage = roiPriceUSD > 0 ? ((netAnnualIncome / roiPriceUSD) * 100).toFixed(1) : 0;
  const paybackYears = netAnnualIncome > 0 ? (roiPriceUSD / netAnnualIncome).toFixed(1) : 0;

  return (
    <section className="calc-section" id="calculator">
      <div className="container">
        <div className="calc-header text-center">
          <div className="badge badge-blue mb-2">Фінансовий інструмент для покупців та інвесторів</div>
          <h2 className="calc-main-title">Іпотечний та інвестиційний калькулятор</h2>
          <p className="calc-main-subtitle">
            Розрахуйте щомісячний платіж за державною програмою «єОселя» або оцініть дохідність від здачі нерухомості в оренду у Полтаві.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="calc-card">
          <div className="calc-nav-tabs">
            <button
              type="button"
              className={`cnt-btn ${calcTab === 'eoselya' ? 'active' : ''}`}
              onClick={() => setCalcTab('eoselya')}
            >
              <Sparkles size={16} />
              <span>Державна програма «єОселя» (3% / 7%)</span>
            </button>

            <button
              type="button"
              className={`cnt-btn ${calcTab === 'roi' ? 'active' : ''}`}
              onClick={() => setCalcTab('roi')}
            >
              <TrendingUp size={16} />
              <span>Окупність та дохідність оренди (ROI)</span>
            </button>
          </div>

          {calcTab === 'eoselya' ? (
            /* єОселя Calculator */
            <div className="calc-body-grid">
              {/* Inputs */}
              <div className="calc-inputs-col">
                {/* Rate Option Switch */}
                <div className="form-group mb-4">
                  <label className="form-label">Пільгова ставка програми єОселя</label>
                  <div className="rate-selector-grid">
                    <button
                      type="button"
                      className={`rate-box ${ratePercent === 3 ? 'active' : ''}`}
                      onClick={() => setRatePercent(3)}
                    >
                      <span className="rate-val">3% річних</span>
                      <span className="rate-desc">Військовослужбовці ЗСУ, силовики, медики, педагоги, науковці</span>
                    </button>
                    <button
                      type="button"
                      className={`rate-box ${ratePercent === 7 ? 'active' : ''}`}
                      onClick={() => setRatePercent(7)}
                    >
                      <span className="rate-val">7% річних</span>
                      <span className="rate-desc">Ветерани, ВПО, громадяни без власного житла</span>
                    </button>
                  </div>
                </div>

                {/* Property Price */}
                <div className="form-group">
                  <div className="slider-label-row">
                    <span className="form-label">Вартість квартири</span>
                    <span className="slider-val-tag">{formatCurrency(propertyPrice, 'USD')}</span>
                  </div>
                  <input
                    type="range"
                    min="15000"
                    max="150000"
                    step="1000"
                    value={propertyPrice}
                    onChange={(e) => setPropertyPrice(Number(e.target.value))}
                    className="calc-range-slider"
                  />
                  <div className="slider-hints">
                    <span>$ 15 000</span>
                    <span>$ 80 000</span>
                    <span>$ 150 000</span>
                  </div>
                </div>

                {/* Down Payment */}
                <div className="form-group">
                  <div className="slider-label-row">
                    <span className="form-label">Початковий внесок ({downPaymentPercent}%)</span>
                    <span className="slider-val-tag">{formatCurrency(downPaymentUSD, 'USD')}</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="70"
                    step="5"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="calc-range-slider"
                  />
                  <div className="slider-hints">
                    <span>20% (мін.)</span>
                    <span>50%</span>
                    <span>70%</span>
                  </div>
                </div>

                {/* Loan Term */}
                <div className="form-group">
                  <div className="slider-label-row">
                    <span className="form-label">Термін кредитування</span>
                    <span className="slider-val-tag">{loanTermYears} років</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={loanTermYears}
                    onChange={(e) => setLoanTermYears(Number(e.target.value))}
                    className="calc-range-slider"
                  />
                  <div className="slider-hints">
                    <span>1 рік</span>
                    <span>10 років</span>
                    <span>20 років</span>
                  </div>
                </div>
              </div>

              {/* Results Summary Box */}
              <div className="calc-results-col">
                <div className="calc-summary-card">
                  <span className="csc-caption">Орієнтовний щомісячний платіж</span>
                  <div className="csc-main-number">
                    {formatCurrency(Math.round(monthlyPaymentUSD), 'USD')}
                    <span className="csc-sub-num"> / міс (~ {Math.round(monthlyPaymentUSD * 41.5).toLocaleString('uk-UA')} грн)</span>
                  </div>

                  <div className="csc-breakdown">
                    <div className="csc-row">
                      <span>Сума кредиту:</span>
                      <strong>{formatCurrency(loanAmountUSD, 'USD')}</strong>
                    </div>
                    <div className="csc-row">
                      <span>Перший внесок ({downPaymentPercent}%):</span>
                      <strong>{formatCurrency(downPaymentUSD, 'USD')}</strong>
                    </div>
                    <div className="csc-row">
                      <span>Переплата за {loanTermYears} р.:</span>
                      <strong>{formatCurrency(Math.round(totalInterestUSD), 'USD')}</strong>
                    </div>
                    <div className="csc-row">
                      <span>Пільгова відсоткова ставка:</span>
                      <strong className="text-green">{ratePercent}% річних</strong>
                    </div>
                  </div>

                  <button
                    onClick={onOpenConsultModal}
                    className="btn btn-accent btn-block mt-4"
                  >
                    <span>Отримати акредитацію банку по єОселі</span>
                  </button>
                  <p className="calc-disclaimer">
                    * Розрахунок є орієнтовним. Точні умови залежать від банку-партнера (Ощадбанк, ПриватБанк, Укргазбанк, Sky Bank, Sense Bank).
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* ROI Calculator */
            <div className="calc-body-grid">
              <div className="calc-inputs-col">
                <div className="form-group">
                  <label className="form-label">Вартість квартири ($)</label>
                  <input
                    type="number"
                    value={roiPriceUSD}
                    onChange={(e) => setRoiPriceUSD(Number(e.target.value))}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Очікувана оренда на місяць ($)</label>
                  <input
                    type="number"
                    value={monthlyRentUSD}
                    onChange={(e) => setMonthlyRentUSD(Number(e.target.value))}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Річні витрати (податки, дрібний ремонт, амортизація) ($)</label>
                  <input
                    type="number"
                    value={annualExpensesUSD}
                    onChange={(e) => setAnnualExpensesUSD(Number(e.target.value))}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="calc-results-col">
                <div className="calc-summary-card">
                  <span className="csc-caption">Річна прибутковість (ROI)</span>
                  <div className="csc-main-number text-green">
                    {roiPercentage}%
                    <span className="csc-sub-num"> річних</span>
                  </div>

                  <div className="csc-breakdown">
                    <div className="csc-row">
                      <span>Чистий дохід на рік:</span>
                      <strong>{formatCurrency(netAnnualIncome, 'USD')}</strong>
                    </div>
                    <div className="csc-row">
                      <span>Чистий дохід на місяць:</span>
                      <strong>{formatCurrency(Math.round(netAnnualIncome / 12), 'USD')}</strong>
                    </div>
                    <div className="csc-row">
                      <span>Термін повної окупності:</span>
                      <strong className="text-primary">{paybackYears} років</strong>
                    </div>
                  </div>

                  <button
                    onClick={onOpenConsultModal}
                    className="btn btn-primary btn-block mt-4"
                  >
                    <span>Підібрати ліквідну квартиру під оренду</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .calc-section {
          padding: 60px 0;
          background: #f1f5f9;
        }

        .calc-header {
          max-width: 780px;
          margin: 0 auto 36px;
        }

        .calc-main-title {
          font-size: 2rem;
          font-weight: 900;
          color: var(--c-slate);
          margin-bottom: 10px;
        }

        .calc-main-subtitle {
          font-size: 0.95rem;
          color: var(--c-muted);
        }

        .calc-card {
          background: #ffffff;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          border: 1px solid var(--c-border);
          overflow: hidden;
          max-width: 1040px;
          margin: 0 auto;
        }

        .calc-nav-tabs {
          display: flex;
          background: #f8fafc;
          border-bottom: 1px solid var(--c-border);
        }

        .cnt-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px 20px;
          font-size: 0.95rem;
          font-weight: 700;
          color: #64748b;
          border-bottom: 2px solid transparent;
        }

        .cnt-btn.active {
          background: #ffffff;
          color: var(--c-primary);
          border-bottom-color: var(--c-primary);
        }

        .calc-body-grid {
          display: grid;
          grid-template-columns: 1.25fr 1fr;
          gap: 32px;
          padding: 32px;
        }

        .rate-selector-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .rate-box {
          background: #f8fafc;
          border: 2px solid var(--c-border);
          border-radius: var(--radius-md);
          padding: 12px;
          text-align: left;
          display: flex;
          flex-direction: column;
        }

        .rate-box.active {
          border-color: var(--c-primary);
          background: var(--c-primary-light);
        }

        .rate-val {
          font-size: 1.1rem;
          font-weight: 900;
          color: var(--c-primary);
        }

        .rate-desc {
          font-size: 0.72rem;
          color: #64748b;
          margin-top: 4px;
        }

        .slider-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .slider-val-tag {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--c-primary);
          background: var(--c-primary-light);
          padding: 2px 10px;
          border-radius: var(--radius-full);
        }

        .calc-range-slider {
          width: 100%;
          accent-color: var(--c-primary);
          cursor: pointer;
        }

        .slider-hints {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          color: #94a3b8;
          margin-top: 4px;
        }

        .calc-summary-card {
          background: #f8fafc;
          border: 1px solid var(--c-border);
          border-radius: var(--radius-md);
          padding: 24px;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .csc-caption {
          font-size: 0.82rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
        }

        .csc-main-number {
          font-size: 2.2rem;
          font-weight: 900;
          color: var(--c-primary);
          line-height: 1.1;
          margin: 6px 0 18px;
        }

        .csc-sub-num {
          font-size: 0.95rem;
          color: #64748b;
          font-weight: 600;
        }

        .csc-breakdown {
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-top: 1px solid var(--c-border);
          padding-top: 16px;
        }

        .csc-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.88rem;
          color: #475569;
        }

        .calc-disclaimer {
          font-size: 0.72rem;
          color: #94a3b8;
          margin-top: 12px;
          line-height: 1.4;
        }

        @media (max-width: 860px) {
          .calc-body-grid {
            grid-template-columns: 1fr;
            padding: 20px;
          }
          .cnt-btn {
            padding: 12px;
            font-size: 0.85rem;
          }
          .rate-selector-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};
