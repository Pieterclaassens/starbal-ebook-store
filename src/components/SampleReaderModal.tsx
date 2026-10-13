import React, { useState } from 'react';
import { Book } from '../types/book';
import { 
  X, 
  Sparkles, 
  Send, 
  Loader2, 
  ShoppingBag, 
  BookOpen, 
  RotateCcw,
  CheckCircle2,
  Type
} from 'lucide-react';

interface SampleReaderModalProps {
  book: Book;
  onClose: () => void;
  onInstantBuy: (book: Book) => void;
  isPurchased?: boolean;
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const SampleReaderModal: React.FC<SampleReaderModalProps> = ({
  book,
  onClose,
  onInstantBuy,
  isPurchased = false,
}) => {
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isSerif, setIsSerif] = useState(true);
  
  // AI Companion State
  const [question, setQuestion] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: `Welcome! I'm your literary companion for "${book.title}". You can ask me to summarize the current chapter, explain core theses, or answer any conceptual questions as you read.`,
    },
  ]);

  const activeChapter = book.chapters[selectedChapterIndex] || book.chapters[0];
  const readingContent = isPurchased && activeChapter.fullContent 
    ? activeChapter.fullContent 
    : activeChapter.excerpt;

  const handleAskAi = async (promptText: string, mode?: string) => {
    if (!promptText.trim() && !mode) return;

    const userText = promptText.trim() || (mode === 'summary' ? 'Summarize this chapter' : mode === 'themes' ? 'Key themes' : 'Actionable takeaways');

    // Add user message to history
    setChatMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setQuestion('');
    setIsLoadingAi(true);

    try {
      const response = await fetch('/api/reader/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookTitle: book.title,
          author: book.author,
          excerpt: readingContent,
          question: userText,
          mode,
          chatHistory: chatMessages.slice(-6),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze text.');
      }

      setChatMessages((prev) => [
        ...prev,
        { role: 'model', text: data.reply || 'No analysis available.' },
      ]);
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: `Error analyzing passage: ${err.message || 'Please try again.'}`,
        },
      ]);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'large': return 'text-lg leading-relaxed';
      case 'xlarge': return 'text-xl leading-loose';
      default: return 'text-base leading-relaxed';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[92vh] flex flex-col bg-stone-50 border border-stone-200 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-stone-200 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <BookOpen className="w-5 h-5 text-stone-700 shrink-0" />
            <div className="min-w-0">
              <h2 className="font-serif font-bold text-lg text-stone-900 truncate">
                {book.title}
              </h2>
              <p className="text-xs text-stone-500 truncate">
                {isPurchased ? 'Full Authorized Edition' : 'Free Interactive Sample Reader'} · By {book.author}
              </p>
            </div>
          </div>

          {/* Reader Preferences Controls & Close */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Font Style Toggle */}
            <div className="flex items-center bg-stone-100 p-1 rounded-lg text-xs">
              <button
                onClick={() => setIsSerif(true)}
                className={`px-2.5 py-1 rounded-md font-serif font-medium transition-colors ${
                  isSerif ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                Serif
              </button>
              <button
                onClick={() => setIsSerif(false)}
                className={`px-2.5 py-1 rounded-md font-sans font-medium transition-colors ${
                  !isSerif ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                Sans
              </button>
            </div>

            {/* Font Size Stepper */}
            <div className="flex items-center gap-1 text-xs text-stone-700 bg-stone-100 px-2 py-1 rounded-lg">
              <Type className="w-3.5 h-3.5 text-stone-500 mr-1" />
              <button
                onClick={() => setFontSize('normal')}
                className={`px-1.5 py-0.5 rounded ${fontSize === 'normal' ? 'font-bold text-stone-950 bg-white shadow-xs' : 'hover:text-stone-950'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-1.5 py-0.5 rounded text-sm ${fontSize === 'large' ? 'font-bold text-stone-950 bg-white shadow-xs' : 'hover:text-stone-950'}`}
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-1.5 py-0.5 rounded text-base ${fontSize === 'xlarge' ? 'font-bold text-stone-950 bg-white shadow-xs' : 'hover:text-stone-950'}`}
              >
                A++
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="Close reader"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reader Body Grid: Main Reading Canvas + AI Companion Rail */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
          
          {/* Main Book Reading Canvas (Left 7 Columns) */}
          <div className="lg:col-span-7 flex flex-col bg-white overflow-y-auto border-r border-stone-200">
            {/* Chapter Selection Bar */}
            <div className="px-8 py-3 bg-stone-50/70 border-b border-stone-200 flex items-center gap-2 overflow-x-auto shrink-0">
              {book.chapters.map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedChapterIndex(idx)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    selectedChapterIndex === idx
                      ? 'bg-stone-900 text-white font-medium'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {ch.title}
                </button>
              ))}
            </div>

            {/* Reading Viewport */}
            <div className="p-8 sm:p-12 max-w-2xl mx-auto w-full flex-1">
              <div className="mb-6 pb-6 border-b border-stone-100">
                <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">
                  {book.genre} · Sample Reader
                </span>
                <h1 className="font-serif text-3xl font-bold text-stone-900 mt-1 mb-2">
                  {activeChapter.title}
                </h1>
                <p className="text-xs text-stone-500">
                  {book.title} — By {book.author}
                </p>
              </div>

              {/* Text Body */}
              <div 
                className={`${isSerif ? 'font-serif' : 'font-sans'} ${getFontSizeClass()} text-stone-800 space-y-6 whitespace-pre-line tracking-normal`}
              >
                {readingContent}
              </div>

              {!isPurchased && (
                <div className="mt-12 p-6 bg-stone-50 border border-dashed border-stone-300 rounded-xl text-center">
                  <p className="font-serif text-lg font-bold text-stone-900 mb-1">
                    End of Preview Excerpt
                  </p>
                  <p className="text-xs text-stone-600 mb-4 max-w-md mx-auto">
                    Unlock the complete {book.pageCount}-page authorized edition with high-resolution schematics, complete chapters, and instant PDF download.
                  </p>
                  <button
                    onClick={() => { onClose(); onInstantBuy(book); }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-800 hover:bg-blue-900 text-white font-medium text-xs rounded-lg shadow-sm transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Purchase Full Book (${book.price.toFixed(2)})</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* AI Reader Companion Rail (Right 5 Columns) */}
          <div className="lg:col-span-5 flex flex-col bg-stone-50/70 overflow-hidden">
            
            {/* Rail Header */}
            <div className="px-5 py-3.5 bg-stone-100 border-b border-stone-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-700" />
                <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Ask the Book (Gemini AI)
                </span>
              </div>
              <button
                onClick={() => setChatMessages([{
                  role: 'model',
                  text: `Chat reset. Ask any question about ${book.title}.`,
                }])}
                className="p-1 text-stone-400 hover:text-stone-700 transition-colors"
                title="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-4 py-2.5 bg-white border-b border-stone-200 flex items-center gap-1.5 overflow-x-auto shrink-0">
              <button
                onClick={() => handleAskAi('', 'summary')}
                disabled={isLoadingAi}
                className="px-2.5 py-1 text-[11px] font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md transition-colors whitespace-nowrap shrink-0 disabled:opacity-50"
              >
                Executive Summary
              </button>
              <button
                onClick={() => handleAskAi('', 'themes')}
                disabled={isLoadingAi}
                className="px-2.5 py-1 text-[11px] font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md transition-colors whitespace-nowrap shrink-0 disabled:opacity-50"
              >
                Core Themes
              </button>
              <button
                onClick={() => handleAskAi('', 'takeaways')}
                disabled={isLoadingAi}
                className="px-2.5 py-1 text-[11px] font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md transition-colors whitespace-nowrap shrink-0 disabled:opacity-50"
              >
                Key Takeaways
              </button>
            </div>

            {/* Message Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[90%] p-3.5 rounded-xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-stone-900 text-white rounded-br-none'
                        : 'bg-white border border-stone-200 text-stone-800 shadow-2xs rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}

              {isLoadingAi && (
                <div className="flex items-center gap-2 p-3 bg-white border border-stone-200 rounded-xl text-xs text-stone-500 shadow-2xs w-fit">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-700" />
                  <span>Synthesizing analysis from excerpt...</span>
                </div>
              )}
            </div>

            {/* Chat Input Box */}
            <div className="p-3 bg-white border-t border-stone-200 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAskAi(question);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={`Ask anything about "${book.title}"...`}
                  disabled={isLoadingAi}
                  className="flex-1 px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 text-stone-900 placeholder:text-stone-400"
                />
                <button
                  type="submit"
                  disabled={isLoadingAi || !question.trim()}
                  className="p-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 disabled:opacity-40 transition-colors shrink-0"
                  aria-label="Send question"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>
        </div>

        {/* Sticky Bottom Purchase Action Bar */}
        <div className="px-6 py-3 bg-white border-t border-stone-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xl font-bold tabular-nums text-stone-950">
              ${book.price.toFixed(2)}
            </span>
            <span className="text-xs text-stone-500 hidden sm:inline">
              Instant digital download · PDF & EPUB formats included
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isPurchased ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>You Own This eBook</span>
              </span>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onInstantBuy(book);
                }}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-800 hover:bg-blue-900 rounded-lg shadow-sm transition-all whitespace-nowrap"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Buy with PayPal (${book.price.toFixed(2)})</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
