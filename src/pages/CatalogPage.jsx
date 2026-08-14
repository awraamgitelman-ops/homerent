import React from 'react';
import { PropertyCatalog } from '../components/PropertyCatalog';
import { HeroSearch } from '../components/HeroSearch';
import { Building2 } from 'lucide-react';

export const CatalogPage = ({
  properties,
  filters,
  onSearch,
  onSelectProperty,
  onBookViewing,
  onOpenConsultModal
}) => {
  return (
    <div className="catalog-page-wrapper">
      <div className="catalog-page-hero">
        <div className="container">
          <span className="badge badge-blue mb-2">Актуальна база об'єктів 2026</span>
          <h1 className="cph-title">Нерухомість у Полтаві: Купівля та Оренда</h1>
          <p className="cph-subtitle">
            Перевірені квартири, будинки, земельні ділянки та комерційні площі у всіх районах Полтави (Центр, Левада, Поділ, Алмазний, Сади тощо).
          </p>
        </div>
      </div>

      <div className="container mt-4">
        <HeroSearch
          onSearch={onSearch}
          totalCount={properties.length}
          onOpenConsultModal={onOpenConsultModal}
        />
      </div>

      <PropertyCatalog
        properties={properties}
        filters={filters}
        onSelectProperty={onSelectProperty}
        onBookViewing={onBookViewing}
      />

      <style>{`
        .catalog-page-hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
          color: #ffffff;
          padding: 40px 0;
          text-align: center;
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
          max-width: 720px;
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
