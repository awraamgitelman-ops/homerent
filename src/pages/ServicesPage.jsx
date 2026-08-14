import React from 'react';
import { ServicesSection } from '../components/ServicesSection';
import { RoadmapSection } from '../components/RoadmapSection';
import { ShieldCheck, CheckCircle2, PhoneCall } from 'lucide-react';

export const ServicesPage = ({ onSelectService, onOpenConsultModal }) => {
  return (
    <div className="services-page-wrapper">
      <div className="services-hero">
        <div className="container text-center">
          <span className="badge badge-blue mb-2">Професійні послуги у Полтаві</span>
          <h1 className="sh-title">Послуги Агентства Нерухомості «НОВЕКС ІНВЕСТ»</h1>
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
          background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
          color: #ffffff;
          padding: 45px 0;
        }

        .sh-title {
          font-size: 2.2rem;
          font-weight: 900;
          color: #ffffff;
          margin-bottom: 8px;
        }

        .sh-subtitle {
          font-size: 0.95rem;
          color: #cbd5e1;
          max-width: 720px;
          margin: 0 auto;
        }

        @media (max-width: 640px) {
          .sh-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};
