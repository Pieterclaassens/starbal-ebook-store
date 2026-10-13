import React from 'react';
import { ShoppingBag, BookOpen, Download, PlusCircle } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenLibrary: () => void;
  onOpenAuthor: () => void;
  onSelectCategory: (cat: string) => void;
  activeCategory: string;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenLibrary,
  onOpenAuthor,
  onSelectCategory,
  activeCategory,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200">
      {/* Strict 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="/" 
          onClick={(e) => { e.preventDefault(); onSelectCategory('All'); }}
          className="text-2xl font-serif font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0 hover:text-stone-700 transition-colors"
        >
          OMNISHELF
        </a>

        {/* Zone 2: 4-5 single-line clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <button
            onClick={() => onSelectCategory('All')}
            className={`whitespace-nowrap shrink-0 hover:text-stone-950 transition-colors ${
              activeCategory === 'All' ? 'text-stone-950 font-semibold underline underline-offset-8 decoration-stone-900' : ''
            }`}
          >
            Catalog
          </button>
          
          <button
            onClick={() => onSelectCategory('Technology & AI')}
            className={`whitespace-nowrap shrink-0 hover:text-stone-950 transition-colors ${
              activeCategory === 'Technology & AI' ? 'text-stone-950 font-semibold underline underline-offset-8 decoration-stone-900' : ''
            }`}
          >
            Tech & AI
          </button>

          <button
            onClick={onOpenLibrary}
            className="flex items-center gap-1.5 whitespace-nowrap shrink-0 hover:text-stone-950 transition-colors"
          >
            <Download className="w-4 h-4 text-stone-500" />
            <span>My Downloads</span>
          </button>

          <button
            onClick={onOpenAuthor}
            className="flex items-center gap-1.5 whitespace-nowrap shrink-0 hover:text-stone-950 transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-stone-500" />
            <span>Author Portal</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCart}
            className="relative inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-900 bg-white border border-stone-300 rounded-lg shadow-xs hover:bg-stone-50 hover:border-stone-400 transition-all whitespace-nowrap shrink-0"
            aria-label="View shopping bag"
          >
            <ShoppingBag className="w-4 h-4 text-stone-700" />
            <span className="hidden sm:inline">Bag</span>
            {cartCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 text-xs font-semibold text-white bg-blue-700 rounded-full tabular-nums">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
