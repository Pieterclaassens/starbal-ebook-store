export interface Chapter {
  title: string;
  excerpt: string;
  fullContent?: string;
}

export interface Book {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  authorBio: string;
  genre: 'Technology & AI' | 'Science & Biology' | 'Design & Architecture' | 'Speculative Fiction' | 'Business & Strategy';
  price: number;
  rating: number;
  reviewCount: number;
  pageCount: number;
  publicationYear: number;
  coverImage: string;
  summary: string;
  tableOfContents: string[];
  chapters: Chapter[];
  fileFormat: 'PDF' | 'EPUB' | 'BUNDLE';
  fileSize: string;
  isbn: string;
  featured?: boolean;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface PurchasedLicense {
  orderId: string;
  bookId: string;
  bookTitle: string;
  customerEmail: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paypalOrderId?: string;
  downloadToken: string;
  downloadCount: number;
  maxDownloads: number;
  purchasedAt: string;
  expiresAt: string;
  licenseKey?: string;
}
