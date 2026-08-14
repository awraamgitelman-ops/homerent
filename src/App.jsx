import React, { useState } from 'react';
import { useRouter } from './context/RouterContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileNav } from './components/MobileNav';
import { PropertyModal } from './components/PropertyModal';
import { SellModal } from './components/SellModal';

// Pages
import { HomePage } from './pages/HomePage';
import { MapPage } from './pages/MapPage';
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
  const [catalogViewMode, setCatalogViewMode] = useState('split');
  const [filters, setFilters] = useState({
    type: 'all',
    transaction: 'rent',
    district: 'all',
    rooms: 'all',
    priceMin: '',
    priceMax: '',
    currency: 'UAH',
    areaMin: '',
    areaMax: ''
  });

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    if (!currentPath.includes('/catalog') && currentPath !== '#/') {
      navigate('#/catalog');
    }
  };

  const handleOpenMap = () => {
    navigate('#/map');
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

    // Dedicated Map Page (Separate Tab with its own URL #/map)
    if (clean.startsWith('#/map')) {
      return (
        <MapPage
          properties={properties}
          onSelectProperty={handleSelectProperty}
          onBookViewing={handleBookViewing}
          onOpenConsultModal={handleOpenConsultModal}
        />
      );
    }

    if (clean.startsWith('#/catalog')) {
      return (
        <CatalogPage
          properties={properties}
          filters={filters}
          onSearch={handleSearch}
          onSelectProperty={handleSelectProperty}
          onBookViewing={handleBookViewing}
          onOpenConsultModal={handleOpenConsultModal}
          initialViewMode={catalogViewMode}
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
        <ServicesPage
          onSelectService={handleSelectService}
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

    // Default: HomePage (Map and Catalog remain on Home as well)
    return (
      <HomePage
        properties={properties}
        filters={filters}
        onSearch={handleSearch}
        onSelectProperty={handleSelectProperty}
        onBookViewing={handleBookViewing}
        onSelectService={handleSelectService}
        onOpenConsultModal={handleOpenConsultModal}
        onOpenMap={handleOpenMap}
        initialViewMode="split"
      />
    );
  };

  const isMapRoute = currentPath.toLowerCase().startsWith('#/map');

  return (
    <div className="app-container">
      {/* Site Header */}
      <Header
        onOpenMap={handleOpenMap}
        onOpenSellModal={() => setIsSellModalOpen(true)}
      />

      {/* Main Routed Page */}
      <main className={`main-content ${isMapRoute ? 'map-route-active' : ''}`}>
        {renderCurrentPage()}
      </main>

      {/* Site Footer (Hidden on full-screen map route for immersive view) */}
      {!isMapRoute && <Footer />}

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
