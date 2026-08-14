import React from 'react';
import { HeroSearch } from '../components/HeroSearch';
import { PropertyCatalog } from '../components/PropertyCatalog';
import { ServicesSection } from '../components/ServicesSection';
import { MortgageCalculator } from '../components/MortgageCalculator';
import { RoadmapSection } from '../components/RoadmapSection';
import { TrustSection } from '../components/TrustSection';

export const HomePage = ({
  properties,
  filters,
  onSearch,
  onSelectProperty,
  onBookViewing,
  onSelectService,
  onOpenConsultModal
}) => {
  return (
    <div className="home-page-wrapper">
      {/* 1. Hero Search Filter */}
      <HeroSearch
        onSearch={onSearch}
        totalCount={properties.length}
        onOpenConsultModal={onOpenConsultModal}
      />

      {/* 2. Interactive Property Catalog */}
      <PropertyCatalog
        properties={properties}
        filters={filters}
        onSelectProperty={onSelectProperty}
        onBookViewing={onBookViewing}
      />

      {/* 3. Agency Services */}
      <ServicesSection
        onSelectService={onSelectService}
        onOpenConsultModal={onOpenConsultModal}
      />

      {/* 4. Mortgage & ROI Calculator */}
      <MortgageCalculator
        onOpenConsultModal={onOpenConsultModal}
      />

      {/* 5. 8-Step Roadmap */}
      <RoadmapSection />

      {/* 6. Trust & Stats Pillars */}
      <TrustSection />
    </div>
  );
};
