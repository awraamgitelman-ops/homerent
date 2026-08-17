import React from 'react';
import { MortgageCalculator } from '../components/MortgageCalculator';

export const CalculatorPage = ({ onOpenConsultModal }) => {
  return (
    <div className="calc-page-wrapper">
      <div className="calc-page-hero">
        <div className="calc-page-hero-overlay"></div>
        <div className="container text-center calc-page-hero-content">
          <h1 className="cph-title">Розрахунок іпотеки «єОселя» (3% / 7%) та окупності оренди</h1>
          <p className="cph-subtitle">
            Швидкий розрахунок щомісячних платежів, першого внеску та інвестиційної дохідності нерухомості у Полтаві.
          </p>
        </div>
      </div>

      <MortgageCalculator onOpenConsultModal={onOpenConsultModal} />

      <style>{`
        .calc-page-hero {
          position: relative;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.78) 0%, rgba(15, 23, 42, 0.85) 100%),
                      url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Kruhla_Square_-_Poltava_-_Aerial_view_-_1.jpg/1920px-Kruhla_Square_-_Poltava_-_Aerial_view_-_1.jpg') center 40%/cover no-repeat;
          color: #ffffff;
          padding: 56px 0;
          overflow: hidden;
        }

        .calc-page-hero-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(37, 99, 235, 0.12) 0%, rgba(15, 23, 42, 0.35) 100%);
          pointer-events: none;
          z-index: 1;
        }

        .calc-page-hero-content {
          position: relative;
          z-index: 2;
        }

        .cph-title {
          font-size: 2.2rem;
          font-weight: 900;
          color: #ffffff;
          margin-bottom: 8px;
        }

        .cph-subtitle {
          font-size: 0.98rem;
          color: #cbd5e1;
          max-width: 760px;
          margin: 0 auto;
          line-height: 1.5;
        }

        @media (max-width: 640px) {
          .calc-page-hero {
            padding: 40px 0;
          }
          .cph-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};
