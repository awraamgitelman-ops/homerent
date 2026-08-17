import React, { useState } from 'react';
import { useRouter } from './context/RouterContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileNav } from './components/MobileNav';
import { PropertyModal } from './components/PropertyModal';
import { SellModal } from './components/SellModal';
import { SearchConsultModal } from './components/SearchConsultModal';

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
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
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
    if (!currentPath.includes('/catalog') && currentPath !== '/') {
      navigate('/catalog');
    }
  };

  const handleOpenMap = () => {
    navigate('/map');
  };

  // Deep linking: Automatically open property modal if URL contains /property/:id or ?id=:id
  React.useEffect(() => {
    try {
      const path = (window.location.pathname + window.location.search).toLowerCase();
      let targetId = null;

      if (path.includes('/property/')) {
        targetId = path.split('/property/')[1]?.split('?')[0]?.split('/')[0];
      } else if (path.includes('/realty/')) {
        targetId = path.split('/realty/')[1]?.split('?')[0]?.split('/')[0];
      } else if (window.location.search) {
        const params = new URLSearchParams(window.location.search);
        targetId = params.get('property') || params.get('id');
      }

      if (targetId) {
        const matched = properties.find(p => String(p.id).toLowerCase() === String(targetId).toLowerCase());
        if (matched) {
          setSelectedProperty(matched);
        }
      }
    } catch (e) {}
  }, [properties, currentPath]);

  const handleSelectProperty = (property) => {
    setSelectedProperty(property);
    if (property && property.id) {
      try {
        if (!window.location.pathname.includes(`/property/${property.id}`)) {
          window.history.pushState(null, '', `/property/${property.id}`);
        }
      } catch (e) {}
    }
  };

  const handleClosePropertyModal = () => {
    setSelectedProperty(null);
    try {
      if (window.location.pathname.startsWith('/property/') || window.location.pathname.startsWith('/realty/')) {
        window.history.pushState(null, '', '/catalog');
      }
    } catch (e) {}
  };

  const handleBookViewing = (property) => {
    handleSelectProperty(property);
  };

  const handleSelectService = (serviceId) => {
    setIsSellModalOpen(true);
  };

  const handleOpenConsultModal = () => {
    setIsSearchModalOpen(true);
  };

  // Route Renderer
  const renderCurrentPage = () => {
    const clean = currentPath.toLowerCase().replace(/^#/, '');

    // Dedicated Map Page (Separate Tab with its own URL /map)
    if (clean.startsWith('/map')) {
      return (
        <MapPage
          properties={properties}
          onSelectProperty={handleSelectProperty}
          onBookViewing={handleBookViewing}
          onOpenConsultModal={handleOpenConsultModal}
        />
      );
    }

    if (clean.startsWith('/catalog')) {
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

    if (clean.startsWith('/services')) {
      return (
        <ServicesPage
          onSelectService={handleSelectService}
          onOpenConsultModal={handleOpenConsultModal}
        />
      );
    }

    if (clean.startsWith('/calculator')) {
      return (
        <ServicesPage
          onSelectService={handleSelectService}
          onOpenConsultModal={handleOpenConsultModal}
        />
      );
    }

    if (clean.startsWith('/about')) {
      return (
        <AboutPage
          onOpenConsultModal={handleOpenConsultModal}
        />
      );
    }

    if (clean.startsWith('/contacts')) {
      return <ContactsPage />;
    }

    if (clean.startsWith('/requisites') || clean.startsWith('/legal')) {
      return <AboutPage onOpenConsultModal={handleOpenConsultModal} />;
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
        onOpenMap={handleOpenMap}
        initialViewMode="split"
      />
    );
  };

  const isMapRoute = currentPath.toLowerCase().replace(/^#/, '').startsWith('/map');

  return (
    <div className="app-container">
      {/* Site Header */}
      <Header
        onOpenMap={handleOpenMap}
        onOpenSellModal={() => setIsSellModalOpen(true)}
        onOpenSearchModal={() => setIsSearchModalOpen(true)}
      />

      {/* Main Routed Page */}
      <main className={`main-content ${isMapRoute ? 'map-route-active' : ''}`}>
        {renderCurrentPage()}
      </main>

      {/* Site Footer (Hidden on full-screen map route for immersive view) */}
      {!isMapRoute && <Footer onOpenConsultModal={handleOpenConsultModal} />}

      {/* Fixed Bottom Bar on Mobile */}
      <MobileNav
        onOpenSellModal={() => setIsSellModalOpen(true)}
      />

      {/* Property Details & Booking Modal */}
      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          onClose={handleClosePropertyModal}
          onBookingSuccess={() => {}}
        />
      )}

      {/* Sell / Submit Listing Modal */}
      {isSellModalOpen && (
        <SellModal
          onClose={() => setIsSellModalOpen(false)}
        />
      )}

      {/* Personalized Property Search & Consultation Modal */}
      {isSearchModalOpen && (
        <SearchConsultModal
          onClose={() => setIsSearchModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
