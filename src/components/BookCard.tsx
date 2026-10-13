import React, { useState } from 'react';
import { Book } from '../types/book';
import { Sparkles, ShoppingCart, Star } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onReadSample: (book: Book) => void;
  onAddToCart: (book: Book) => void;
  onInstantBuy: (book: Book) => void;
  isPurchased?: boolean;
  onReadFull?: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onReadSample,
  onAddToCart,
  onInstantBuy,
  isPurchased = false,
  onReadFull,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <article className="group flex flex-col bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200">
      {/* Cover Image Container */}
      <div 
        onClick={() => onReadSample(book)}
        className="relative aspect-[3/4] bg-stone-100 overflow-hidden cursor-pointer"
      >
        {!imageError ? (
          <img
            src={book.coverImage}
            alt={`Cover art for ${book.title}`}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-stone-900 text-stone-100">
            <span className="text-xs uppercase tracking-widest text-stone-400 mb-2">{book.genre}</span>
            <h3 className="font-serif text-xl font-bold mb-1">{book.title}</h3>
            <p className="text-xs text-stone-400">{book.author}</p>
          </div>
        )}

        {/* Quick Sample Read Overlay Ribbon */}
        <div className="absolute inset-0 bg-stone-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/95 text-stone-950 text-xs font-semibold rounded-lg shadow-sm backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-700" />
            <span>Interactive Sample & AI</span>
          </span>
        </div>

        {/* Format Badge (Unboxed clean label top right) */}
        <span className="absolute top-3 right-3 px-2 py-1 bg-stone-950/70 text-stone-100 text-[11px] font-mono tracking-wider rounded-md backdrop-blur-xs">
          {book.fileFormat}
        </span>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-5 flex flex-col flex-1">
        {/* Unboxed Metadata Line with typographic separators (Zero-Pill Discipline) */}
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
          <span className="uppercase tracking-wider font-medium text-[11px] text-stone-700">{book.genre}</span>
          <span aria-hidden="true">·</span>
          <span>{book.pageCount} pages</span>
          <span aria-hidden="true">·</span>
          <span>{book.publicationYear}</span>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onReadSample(book)}
          className="font-serif text-xl font-bold text-stone-900 leading-snug hover:text-blue-900 cursor-pointer transition-colors mb-1 line-clamp-2"
        >
          {book.title}
        </h3>

        {/* Author */}
        <p className="text-xs text-stone-600 mb-3">
          By {book.author}
        </p>

        {/* Summary Snippet */}
        <p className="text-xs text-stone-500 line-clamp-2 mb-4 leading-relaxed flex-1">
          {book.summary}
        </p>

        {/* Price & Rating Row */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100 mb-4">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold font-mono tabular-nums text-stone-950">
              ${book.price.toFixed(2)}
            </span>
            <span className="text-[11px] text-stone-500">USD</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-stone-600">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold tabular-nums">{book.rating}</span>
            <span className="text-stone-400 tabular-nums">({book.reviewCount})</span>
          </div>
        </div>

        {/* Functional Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onReadSample(book)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-700 shrink-0" />
            <span>Sample & AI</span>
          </button>

          {isPurchased ? (
            <button
              onClick={() => onReadFull && onReadFull(book)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors whitespace-nowrap"
            >
              <span>Read Full</span>
            </button>
          ) : (
            <button
              onClick={() => onInstantBuy(book)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-blue-900 rounded-lg transition-colors whitespace-nowrap shadow-xs"
            >
              <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
              <span>Buy Now</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
