import React from 'react';
import { MortgageCalculator } from '../components/MortgageCalculator';

export const CalculatorPage = ({ onOpenConsultModal }) => {
  return (
    <div className="calc-page-wrapper">
      <div className="calc-page-hero">
        <div className="container text-center">
          <span className="badge badge-blue mb-2">Фінансовий калькулятор</span>
          <h1 className="cph-title">Розрахунок іпотеки «єОселя» (3% / 7%) та окупності оренди</h1>
          <p className="cph-subtitle">
            Швидкий розрахунок щомісячних платежів, першого внеску та інвестиційної дохідності нерухомості у Полтаві.
          </p>
        </div>
      </div>

      <MortgageCalculator onOpenConsultModal={onOpenConsultModal} />

      <style>{`
        .calc-page-hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
          color: #ffffff;
          padding: 45px 0;
        }

        .cph-title {
          font-size: 2.2rem;
          font-weight: 900;
          color: #ffffff;
          margin-bottom: 8px;
        }

        .cph-subtitle {
          font-size: 0.95rem;
          color: #cbd5e1;
          max-width: 760px;
          margin: 0 auto;
        }

        @media (max-width: 640px) {
          .cph-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};
