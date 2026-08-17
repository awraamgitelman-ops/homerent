import React from 'react';
import { ServicesSection } from '../components/ServicesSection';
import { RoadmapSection } from '../components/RoadmapSection';
import { ShieldCheck, CheckCircle2, PhoneCall } from 'lucide-react';

export const ServicesPage = ({ onSelectService, onOpenConsultModal }) => {
  return (
    <div className="services-page-wrapper">
      <div className="services-hero">
        <div className="services-hero-overlay"></div>
        <div className="container text-center services-hero-content">
          <span className="badge badge-blue mb-2">Професійні послуги у Полтаві</span>
          <h1 className="sh-title">Послуги Агентства Нерухомості «ФАВОРИТ ГРУП»</h1>
          <p className="sh-subtitle">
            Повний комплекс рієлторських, юридичних та оціночних послуг для фізичних та юридичних осіб у місті Полтава та області.
          </p>
        </div>
      </div>

      <ServicesSection
        onSelectService={onSelectService}
        onOpenConsultModal={onOpenConsultModal}
      />

      <RoadmapSection />

      <style>{`
        .services-hero {
          position: relative;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.78) 0%, rgba(15, 23, 42, 0.85) 100%),
                      url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Kruhla_Square_-_Poltava_-_Aerial_view_-_1.jpg/1920px-Kruhla_Square_-_Poltava_-_Aerial_view_-_1.jpg') center 40%/cover no-repeat;
          color: #ffffff;
          padding: 56px 0;
          overflow: hidden;
        }

        .services-hero-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(37, 99, 235, 0.15) 0%, rgba(15, 23, 42, 0.45) 100%);
          backdrop-filter: blur(1.5px);
          pointer-events: none;
        }

        .services-hero-content {
          position: relative;
          z-index: 2;
        }

        .sh-title {
          font-size: 2.2rem;
          font-weight: 900;
          color: #ffffff;
          margin-bottom: 8px;
        }

        .sh-subtitle {
          font-size: 0.98rem;
          color: #cbd5e1;
          max-width: 720px;
          margin: 0 auto;
          line-height: 1.5;
        }

        @media (max-width: 640px) {
          .services-hero {
            padding: 40px 0;
          }
          .sh-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};
