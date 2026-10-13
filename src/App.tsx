import React, { useState, useEffect } from 'react';
import { Book, CartItem, PurchasedLicense } from './types/book';
import { INITIAL_BOOKS } from './data/initialBooks';
import { Header } from './components/Header';
import { BookCard } from './components/BookCard';
import { SampleReaderModal } from './components/SampleReaderModal';
import { PayPalCheckoutModal } from './components/PayPalCheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { MyLibraryModal } from './components/MyLibraryModal';
import { AuthorPortalModal } from './components/AuthorPortalModal';
import { 
  Sparkles, 
  Search, 
  BookOpen, 
  ShieldCheck, 
  CreditCard, 
  Cpu, 
  ArrowRight,
  Filter
} from 'lucide-react';

export default function App() {
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('omnishelf_books');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_BOOKS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('omnishelf_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  const [purchasedLicenses, setPurchasedLicenses] = useState<PurchasedLicense[]>(() => {
    const saved = localStorage.getItem('omnishelf_licenses');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  // UI state
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  
  // Modals
  const [activeReaderBook, setActiveReaderBook] = useState<Book | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isAuthorOpen, setIsAuthorOpen] = useState(false);
  const [recentOrderSuccess, setRecentOrderSuccess] = useState<{
    orders: PurchasedLicense[];
    email: string;
  } | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('omnishelf_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('omnishelf_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('omnishelf_licenses', JSON.stringify(purchasedLicenses));
  }, [purchasedLicenses]);

  // Cart actions
  const handleAddToCart = (book: Book) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.book.id === book.id);
      if (existing) {
        return prev;
      }
      return [...prev, { book, quantity: 1 }];
    });
  };

  const handleInstantBuy = (book: Book) => {
    handleAddToCart(book);
    setIsCheckoutOpen(true);
  };

  const handleRemoveFromCart = (bookId: string) => {
    setCart((prev) => prev.filter((item) => item.book.id !== bookId));
  };

  const handleOrderSuccess = (newOrders: PurchasedLicense[], email: string) => {
    setPurchasedLicenses((prev) => [...newOrders, ...prev]);
    setCart([]);
    setIsCheckoutOpen(false);
    setRecentOrderSuccess({ orders: newOrders, email });
  };

  const handleAddAuthorBook = (newBook: Book) => {
    setBooks((prev) => [newBook, ...prev]);
  };

  // Filtered & Sorted books
  const filteredBooks = books
    .filter((b) => {
      const matchesCat = activeCategory === 'All' || b.genre === activeCategory;
      const matchesSearch = 
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

  const featuredBook = books[0] || INITIAL_BOOKS[0];

  const isPurchased = (bookId: string) => {
    return purchasedLicenses.some((lic) => lic.bookId === bookId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900 selection:bg-stone-900 selection:text-white">
      
      {/* 3-Zone Header */}
      <Header
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        onOpenCart={() => setIsCheckoutOpen(true)}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onOpenAuthor={() => setIsAuthorOpen(true)}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          const el = document.getElementById('catalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        activeCategory={activeCategory}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Editorial Storefront Hero */}
        <section className="border-b border-stone-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Editorial Headline & Manifesto */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <span className="font-semibold uppercase tracking-wider text-stone-900">
                    The Monograph Edition
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Instant PayPal Settlement</span>
                  <span aria-hidden="true">·</span>
                  <span>Powered by Gemini AI</span>
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-950 leading-[1.08] max-w-2xl">
                  Essential literature, illuminated by conversational intelligence.
                </h1>

                <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl">
                  Omnishelf is an independent digital bookstore. Read curated excerpts in our distraction-free reader, query central theses with our AI companion, and purchase with instant PayPal delivery.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => {
                      const el = document.getElementById('catalog-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all whitespace-nowrap flex items-center gap-2"
                  >
                    <span>Explore eBook Catalog</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveReaderBook(featuredBook)}
                    className="px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-blue-700" />
                    <span>Try AI Sample Reader</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Featured Book Focal Showcase */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative group w-full max-w-sm">
                  <div className="absolute -inset-1 bg-gradient-to-r from-stone-200 to-stone-300 rounded-2xl blur-xs opacity-50 group-hover:opacity-75 transition duration-300" />
                  
                  <div className="relative bg-white border border-stone-200 rounded-xl p-5 shadow-lg flex flex-col space-y-4">
                    <div 
                      onClick={() => setActiveReaderBook(featuredBook)}
                      className="aspect-[3/4] rounded-lg overflow-hidden bg-stone-100 shadow-md cursor-pointer"
                    >
                      <img
                        src={featuredBook.coverImage}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                        <span>Featured Edition</span>
                        <span className="font-mono tabular-nums font-bold text-stone-950 text-sm">
                          ${featuredBook.price.toFixed(2)} USD
                        </span>
                      </div>
                      <h3 
                        onClick={() => setActiveReaderBook(featuredBook)}
                        className="font-serif text-xl font-bold text-stone-950 hover:text-blue-900 cursor-pointer transition-colors"
                      >
                        {featuredBook.title}
                      </h3>
                      <p className="text-xs text-stone-600">By {featuredBook.author}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => setActiveReaderBook(featuredBook)}
                        className="py-2 px-3 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                      >
                        Sample & AI
                      </button>
                      <button
                        onClick={() => handleInstantBuy(featuredBook)}
                        className="py-2 px-3 text-xs font-semibold text-white bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors shadow-xs"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Catalog Section */}
        <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Filter Bar & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-200">
            
            {/* Category Filter Tabs (Interactive Segmented Control) */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-100/80 rounded-xl overflow-x-auto">
              {['All', 'Technology & AI', 'Science & Biology', 'Design & Architecture', 'Speculative Fiction', 'Business & Strategy'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                    activeCategory === cat
                      ? 'bg-white text-stone-950 shadow-2xs font-semibold'
                      : 'text-stone-600 hover:text-stone-950'
                  }`}
                >
                  {cat === 'All' ? 'All eBooks' : cat}
                </button>
              ))}
            </div>

            {/* Search & Sort Controls */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search titles, authors..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 text-stone-900 w-44 sm:w-56"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg focus:outline-hidden text-stone-700"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

          </div>

          {/* Book Catalog Grid (3-column desktop) */}
          {filteredBooks.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-serif text-xl font-semibold text-stone-800 mb-1">
                No matching eBooks found.
              </p>
              <p className="text-xs text-stone-500 mb-4">
                Try adjusting your search query or switching categories.
              </p>
              <button
                onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onReadSample={(b) => setActiveReaderBook(b)}
                  onAddToCart={handleAddToCart}
                  onInstantBuy={handleInstantBuy}
                  isPurchased={isPurchased(book.id)}
                  onReadFull={(b) => setActiveReaderBook(b)}
                />
              ))}
            </div>
          )}

        </section>

        {/* Architectural Trust & Craftsmanship Strip */}
        <section className="bg-stone-900 text-stone-100 py-16 border-t border-stone-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold">
                Publishing Principles
              </span>
              <h2 className="font-serif text-3xl font-bold mt-1 text-white">
                How Omnishelf Protects Authors & Readers
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-stone-800/50 border border-stone-700/60 rounded-xl space-y-3">
                <Cpu className="w-6 h-6 text-blue-400" />
                <h3 className="font-serif text-lg font-bold text-white">
                  Conversational Companion
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Every excerpt can be interrogated with Google Gemini. Read with a synthesized literary assistant that extracts key takeaways, compares methodologies, and summarizes dense concepts.
                </p>
              </div>

              <div className="p-6 bg-stone-800/50 border border-stone-700/60 rounded-xl space-y-3">
                <CreditCard className="w-6 h-6 text-amber-400" />
                <h3 className="font-serif text-lg font-bold text-white">
                  PayPal Express Checkout
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Pay securely with PayPal Smart Buttons or test instantly with our zero-friction simulator. No account sign-up wall or invasive telemetry.
                </p>
              </div>

              <div className="p-6 bg-stone-800/50 border border-stone-700/60 rounded-xl space-y-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <h3 className="font-serif text-lg font-bold text-white">
                  Encrypted Digital Downloads
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Your purchase issues a unique cryptographic license token with automated download fulfillment. Download DRM-free PDFs or read directly in your browser.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Omnishelf Monograph Editions. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => setIsLibraryOpen(true)} className="hover:text-stone-900 transition-colors">
              My Downloads
            </button>
            <button onClick={() => setIsAuthorOpen(true)} className="hover:text-stone-900 transition-colors">
              Author Portal
            </button>
            <span>Standard PayPal Fulfillment</span>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      {activeReaderBook && (
        <SampleReaderModal
          book={activeReaderBook}
          onClose={() => setActiveReaderBook(null)}
          onInstantBuy={handleInstantBuy}
          isPurchased={isPurchased(activeReaderBook.id)}
        />
      )}

      {isCheckoutOpen && (
        <PayPalCheckoutModal
          cart={cart}
          onClose={() => setIsCheckoutOpen(false)}
          onOrderSuccess={handleOrderSuccess}
          onRemoveItem={handleRemoveFromCart}
        />
      )}

      {recentOrderSuccess && (
        <OrderSuccessModal
          orders={recentOrderSuccess.orders}
          books={books}
          customerEmail={recentOrderSuccess.email}
          onClose={() => setRecentOrderSuccess(null)}
          onReadBook={(b) => {
            setRecentOrderSuccess(null);
            setActiveReaderBook(b);
          }}
        />
      )}

      {isLibraryOpen && (
        <MyLibraryModal
          licenses={purchasedLicenses}
          books={books}
          onClose={() => setIsLibraryOpen(false)}
          onReadBook={(b) => {
            setIsLibraryOpen(false);
            setActiveReaderBook(b);
          }}
          onAddLicense={(newLic) => {
            setPurchasedLicenses((prev) => [newLic, ...prev]);
          }}
        />
      )}

      {isAuthorOpen && (
        <AuthorPortalModal
          onClose={() => setIsAuthorOpen(false)}
          onAddBook={handleAddAuthorBook}
        />
      )}

    </div>
  );
}
