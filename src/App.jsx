import React, { useState } from 'react';
import { useRouter } from './context/RouterContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileNav } from './components/MobileNav';
import { PropertyModal } from './components/PropertyModal';
import { SellModal } from './components/SellModal';

// Pages
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ServicesPage } from './pages/ServicesPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { AboutPage } from './pages/AboutPage';
import { ContactsPage } from './pages/ContactsPage';
import { LegalPage } from './pages/LegalPage';

// Data
import { PROPERTIES_DATA } from './data/propertiesData';

export function App() {
  const { currentPath, navigate } = useRouter();
  const [properties, setProperties] = useState(PROPERTIES_DATA);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: 'apartment',
    transaction: 'buy',
    district: 'all',
    rooms: 'all',
    priceMin: '',
    priceMax: '',
    currency: 'USD',
    areaMin: '',
    areaMax: '',
    isEoselyaOnly: false
  });

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    // If not already on home or catalog, navigate to catalog
    if (!currentPath.includes('/catalog') && currentPath !== '#/') {
      navigate('#/catalog');
    }
  };

  const handleSelectProperty = (property) => {
    setSelectedProperty(property);
  };

  const handleBookViewing = (property) => {
    setSelectedProperty(property);
  };

  const handleSelectService = (serviceId) => {
    setIsSellModalOpen(true);
  };

  const handleOpenConsultModal = () => {
    setIsSellModalOpen(true);
  };

  // Route Renderer
  const renderCurrentPage = () => {
    const clean = currentPath.toLowerCase();

    if (clean.startsWith('#/catalog')) {
      return (
        <CatalogPage
          properties={properties}
          filters={filters}
          onSearch={handleSearch}
          onSelectProperty={handleSelectProperty}
          onBookViewing={handleBookViewing}
          onOpenConsultModal={handleOpenConsultModal}
        />
      );
    }

    if (clean.startsWith('#/services')) {
      return (
        <ServicesPage
          onSelectService={handleSelectService}
          onOpenConsultModal={handleOpenConsultModal}
        />
      );
    }

    if (clean.startsWith('#/calculator')) {
      return (
        <CalculatorPage
          onOpenConsultModal={handleOpenConsultModal}
        />
      );
    }

    if (clean.startsWith('#/about')) {
      return (
        <AboutPage
          onOpenConsultModal={handleOpenConsultModal}
        />
      );
    }

    if (clean.startsWith('#/contacts')) {
      return <ContactsPage />;
    }

    if (clean.startsWith('#/requisites') || clean.startsWith('#/legal')) {
      return <LegalPage />;
    }

    // Default: HomePage
    return (
      <HomePage
        properties={properties}
        filters={filters}
        onSearch={handleSearch}
        onSelectProperty={handleSelectProperty}
        onBookViewing={handleBookViewing}
        onSelectService={handleSelectService}
        onOpenConsultModal={handleOpenConsultModal}
      />
    );
  };

  return (
    <div className="app-container">
      {/* Site Header */}
      <Header
        onOpenSellModal={() => setIsSellModalOpen(true)}
        onOpenSearchModal={() => navigate('#/catalog')}
      />

      {/* Main Routed Page */}
      <main className="main-content">
        {renderCurrentPage()}
      </main>

      {/* Site Footer */}
      <Footer />

      {/* Fixed Bottom Bar on Mobile */}
      <MobileNav
        onOpenSellModal={() => setIsSellModalOpen(true)}
      />

      {/* Property Details & Booking Modal */}
      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onBookingSuccess={() => {}}
        />
      )}

      {/* Sell / Submit Listing Modal */}
      {isSellModalOpen && (
        <SellModal
          onClose={() => setIsSellModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
