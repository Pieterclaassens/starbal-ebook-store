import React, { useState } from 'react';
import { Book } from '../types/book';
import { 
  X, 
  Upload, 
  Plus, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  DollarSign,
  FileText
} from 'lucide-react';

interface AuthorPortalModalProps {
  onClose: () => void;
  onAddBook: (newBook: Book) => void;
}

export const AuthorPortalModal: React.FC<AuthorPortalModalProps> = ({
  onClose,
  onAddBook,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [author, setAuthor] = useState('');
  const [authorBio, setAuthorBio] = useState('');
  const [genre, setGenre] = useState<Book['genre']>('Technology & AI');
  const [price, setPrice] = useState('19.99');
  const [pageCount, setPageCount] = useState('240');
  const [summary, setSummary] = useState('');
  const [sampleExcerpt, setSampleExcerpt] = useState('');
  const [fullContent, setFullContent] = useState('');
  const [coverImage, setCoverImage] = useState('/src/assets/images/book_architectural_mind_1791893448141.jpg');
  const [isSuccess, setIsSuccess] = useState(false);

  const presetCovers = [
    { label: 'Architectural Blueprint', url: '/src/assets/images/book_architectural_mind_1791893448141.jpg' },
    { label: 'Synthetic Biology', url: '/src/assets/images/book_synthetic_biology_1791893448350.jpg' },
    { label: 'Scandinavian Wood', url: '/src/assets/images/book_nordic_clarity_1791893449076.jpg' },
    { label: 'Cosmic Orbit', url: '/src/assets/images/book_silicon_solitude_1791893449605.jpg' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !summary) return;

    const newBook: Book = {
      id: `author-book-${Date.now()}`,
      title,
      subtitle: subtitle || 'An Author Monograph',
      author,
      authorBio: authorBio || `Author and publisher of ${title}.`,
      genre,
      price: parseFloat(price) || 19.99,
      rating: 5.0,
      reviewCount: 1,
      pageCount: parseInt(pageCount, 10) || 200,
      publicationYear: new Date().getFullYear(),
      coverImage,
      summary,
      tableOfContents: [
        'Chapter 1: Foundations & Core Paradigm',
        'Chapter 2: Structural Methodologies',
        'Chapter 3: Strategic Implementation',
      ],
      chapters: [
        {
          title: 'Chapter 1: Foundations & Core Paradigm',
          excerpt: sampleExcerpt || summary,
          fullContent: fullContent || sampleExcerpt || summary,
        },
      ],
      fileFormat: 'PDF',
      fileSize: '12.5 MB',
      isbn: `978-0-${Math.floor(100000 + Math.random() * 900000)}-1`,
      featured: false,
    };

    onAddBook(newBook);
    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-serif font-bold text-xl text-stone-900">
              Author Publishing Portal
            </h2>
            <p className="text-xs text-stone-500">
              Publish new eBooks to Omnishelf with instant PayPal checkout and AI reader capabilities
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {isSuccess ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900 mb-1">
                eBook Successfully Published!
              </h3>
              <p className="text-xs text-stone-600 max-w-md">
                "{title}" is now live on Omnishelf. Visitors can read excerpts with the AI companion and buy securely via PayPal.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Book Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. The Neuro-Symbolic Leap"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g. Modern Hybrid Intelligence"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Dr. H. Vance"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Genre
                  </label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value as Book['genre'])}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900"
                  >
                    <option value="Technology & AI">Technology & AI</option>
                    <option value="Science & Biology">Science & Biology</option>
                    <option value="Design & Architecture">Design & Architecture</option>
                    <option value="Speculative Fiction">Speculative Fiction</option>
                    <option value="Business & Strategy">Business & Strategy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Price (USD) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-xs text-stone-500 font-mono">$</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full pl-6 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Cover Art Selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Select Cover Artwork
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {presetCovers.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCoverImage(preset.url)}
                      className={`p-1.5 rounded-lg border text-left transition-all ${
                        coverImage === preset.url
                          ? 'border-stone-900 bg-stone-100 ring-1 ring-stone-900'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt=""
                        className="w-full aspect-[3/4] object-cover rounded bg-stone-100 mb-1"
                      />
                      <span className="block text-[11px] font-medium text-stone-700 truncate">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Book Synopsis / Back Cover Blurb *
                </label>
                <textarea
                  required
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="A concise summary of the thesis, intended audience, and practical relevance..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900"
                />
              </div>

              {/* Sample Excerpt (For AI Reader) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-stone-700">
                    Chapter 1 Excerpt (Enabled for Interactive AI Sample Reader)
                  </label>
                  <span className="text-[11px] text-blue-700 flex items-center gap-1 font-medium">
                    <Sparkles className="w-3 h-3" />
                    <span>Gemini QA Enabled</span>
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={sampleExcerpt}
                  onChange={(e) => setSampleExcerpt(e.target.value)}
                  placeholder="Paste Chapter 1 text or introductory excerpt here. The AI Companion will read this and answer reader questions..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 font-serif"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish eBook to Storefront</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
