import React from 'react';
import { PropertyCatalog } from '../components/PropertyCatalog';
import { HeroSearch } from '../components/HeroSearch';

export const CatalogPage = ({
  properties,
  filters,
  onSearch,
  onSelectProperty,
  onBookViewing,
  onOpenConsultModal,
  initialViewMode = 'split'
}) => {
  return (
    <div className="catalog-page-wrapper">
      <HeroSearch
        onSearch={onSearch}
        properties={properties}
        totalCount={properties.length}
        onOpenConsultModal={onOpenConsultModal}
      />

      <PropertyCatalog
        properties={properties}
        filters={filters}
        onSelectProperty={onSelectProperty}
        onBookViewing={onBookViewing}
        initialViewMode={initialViewMode}
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
