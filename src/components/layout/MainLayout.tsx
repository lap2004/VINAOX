import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { QuoteModal } from '../ui/QuoteModal';
import { ScrollToTop } from '../ui/ScrollToTop';

export interface MainLayoutContext {
  onOpenQuote: (product?: string) => void;
}

export const MainLayout: React.FC = () => {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>(undefined);

  const handleOpenQuote = (product?: string) => {
    setSelectedProduct(product);
    setIsQuoteOpen(true);
  };

  const handleCloseQuote = () => {
    setIsQuoteOpen(false);
    setSelectedProduct(undefined);
  };

  return (
    <div className="site-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ScrollToTop />
      <Header onOpenQuote={handleOpenQuote} />
      <main style={{ flex: 1 }}>
        <Outlet context={{ onOpenQuote: handleOpenQuote } satisfies MainLayoutContext} />
      </main>
      <Footer />
      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={handleCloseQuote}
        defaultProduct={selectedProduct}
      />
    </div>
  );
};
