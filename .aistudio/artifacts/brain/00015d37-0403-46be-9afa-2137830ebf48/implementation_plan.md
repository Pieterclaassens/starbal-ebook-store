# Omnishelf — AI eBook Storefront & Secure PayPal Fulfillment

Omnishelf is an editorial digital bookstore and publishing platform where readers can browse eBooks, engage with an interactive AI sample reader (chapter summaries, contextual QA, and key themes), purchase securely via PayPal Smart Buttons or instant simulator mode, and unlock encrypted, tokenized digital downloads with an in-browser PDF reader.

### User Review & Critical Decisions

> [!IMPORTANT]
> The architectural direction below incorporates your confirmed selections from Phase 1. Review the key features and checkout flows before we proceed to build.

- **Confirmed Decision 1 (AI Capability)**: Interactive AI sample reader with ask-the-book QA and chapter summaries powered by Google Gemini on the server side (`gemini-3.8-flash`).
- **Confirmed Decision 2 (eBook Management & Formats)**: Preloaded curated eBook catalog with realistic sample chapters, an in-browser PDF/document viewer, and an Author Upload Portal for adding custom titles with cover art and downloadable files.
- **Confirmed Decision 3 (Payment & Fulfillment)**: Dual-mode PayPal checkout featuring live PayPal Smart Buttons (configurable PayPal Client ID) and an instant 1-click Test Checkout Simulator for zero-friction end-to-end verification and instant digital license token generation.

---

### 1. Overview & Core Concept

- **What It Does**: Omnishelf provides an end-to-end digital publishing storefront. Visitors can discover books across genres, read curated sample excerpts in a distraction-free reader, query the book's content using an integrated Gemini AI assistant ("Ask the Book"), complete purchases using PayPal, and immediately access an order confirmation page with tokenized, tamper-resistant download links and full-screen document viewing.
- **Target Audience / Persona**: Independent authors, educators, digital publishers, and readers seeking high-quality non-fiction, fiction, tech manuals, and guides with interactive exploration before buying.
- **Key Value**: Bridges the gap between traditional static eBook previews and modern conversational AI, driving higher purchase conversion while delivering a secure, reliable digital download experience.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Browse & Discover**:
   - Clean top bar with category filters (Tech & AI, Science & Philosophy, Design & Architecture, Fiction, Business).
   - Search bar with live title, author, and keyword matching.
   - High-fidelity product cards with book covers, author attribution, pricing, rating, and quick actions ("Read Sample" & "Buy with PayPal").
2. **Interactive AI Sample Reader**:
   - Opens a distraction-free editorial reader drawer or split modal displaying Chapter 1 & 2 excerpts.
   - Side rail with "Ask the Book" powered by Gemini: readers can ask questions about concepts, request executive summaries, or explore character arcs and methodologies.
   - Prominent sticky purchase bar at the bottom: "Unlock Full Book ($X.XX) — Purchase via PayPal".
3. **Checkout & Payment**:
   - Slide-out Cart Drawer and instant Direct Checkout modal.
   - Displays real PayPal Smart Buttons script loader when Client ID is provided, alongside a prominent "Simulate Instant PayPal Order" button for frictionless testing in any environment.
   - Real-time customer billing email validation and order summary breakdown.
4. **Order Confirmation & Secure Download Fulfillment**:
   - Dedicated Post-Purchase Order Receipt view with unique Order ID, cryptographic download token, and expiration indicator.
   - Direct download button generating secure file payload (PDF / EPUB mock blob or author uploaded asset).
   - In-app "Read Online Now" mode rendering the complete book in the reader.
5. **Author Publishing Portal**:
   - Author toggle allowing creators to add new eBooks (Title, Author, Genre, Price, Cover Image, Excerpt Text, Full PDF/Doc content).
   - Local persistence so author-added titles immediately appear on the storefront.

#### Visual Identity & Theme
- **Aesthetic Direction**: Contemporary Editorial Bookstore inspired by high-end literary publishers and independent design monographs. Clean, dignified, content-first.
- **Color Palette & Mood**:
  - Dominant Neutral Canvas (60%): Crisp paper white (`#FAFAF9` / `bg-stone-50`) and deep obsidian slate (`#0F172A`).
  - Structural Surfaces (30%): Warm card backdrops (`#FFFFFF` / `bg-white`), hairline borders (`border-stone-200`), muted typography (`text-stone-600`).
  - Accent Budget (10%): Classic ink cobalt (`#1E40AF` / `bg-blue-800`) and PayPal gold accent (`#F59E0B` / `#0070BA` for checkout trust).
- **Typography & Hierarchy**:
  - Display / Book Titles: High-contrast literary serif (`Playfair Display` or `Cormorant Garamond` web font pairing).
  - Body & UI: Clean, legible sans (`Plus Jakarta Sans` / modern system neo-grotesque).
  - Metrics & Prices: Strict tabular numerals (`font-mono tabular-nums`).
  - Zero-pill discipline: Metadata rendered as unboxed text with subtle typographic separators (`·`).
- **Interactive Feedback & Motion**:
  - Subtle card lift (`2px translateY`) on hover.
  - Smooth drawer transitions for cart and sample reader using Motion.
  - Interactive Gemini streaming response animation with typing indicators.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dual PayPal Processing (SDK + Simulator Mode)**
  - *Chosen Approach*: Implement official `@paypal/paypal-js` Smart Buttons rendering with sandbox/live credentials input in an author settings drawer, paired with an integrated Test Checkout Simulator that produces genuine order objects, licenses, and receipts.
  - *Why*: Allows immediate, verifiable end-to-end checkout testing in preview without forcing testers to have active sandbox credentials, while still providing production-ready PayPal buttons.
- **Decision 2: Server-Side Gemini Integration for AI Reader**
  - *Chosen Approach*: Express server endpoint (`POST /api/reader/ask`) utilizing `@google/genai` and `gemini-3.8-flash` with system prompts grounding answers strictly in the book's excerpt and metadata.
  - *Why*: Keeps the Gemini API key strictly server-side, conforms with security guidelines, and supports streaming responses.
- **Decision 3: Tokenized Digital Fulfillment & Client Storage**
  - *Chosen Approach*: On order completion, generate a unique fulfillment token stored in order history. Download handler validates token, records download counts, and serves downloadable binary blobs or opens the full-fidelity PDF reader.
  - *Why*: Gives customers immediate access to their files, prevents unauthorized direct file scraping, and maintains clear audit receipts.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Client Browser (React 19)                     │
│                                                                        │
│  ┌───────────────────┐  ┌───────────────────┐  ┌──────────────────┐    │
│  │ Book Catalog Grid │  │ AI Sample Reader  │  │ Cart & Checkout  │    │
│  │ & Category Nav    │  │ ("Ask the Book")  │  │ (PayPal Buttons) │    │
│  └────────┬──────────┘  └────────┬──────────┘  └────────┬─────────┘    │
│           │                      │                      │              │
│  ┌────────▼──────────────────────▼──────────────────────▼───────────┐  │
│  │                    App State & Storage Store                     │  │
│  │        (Books Catalog · Cart · Orders & Fulfillment Tokens)      │  │
│  └───────────────────────────────┬──────────────────────────────────┘  │
└──────────────────────────────────┼─────────────────────────────────────┘
                                   │
              HTTP / JSON APIs     │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Node.js / Express Server                        │
│                                                                        │
│  ┌─────────────────────────┐         ┌──────────────────────────────┐  │
│  │  POST /api/reader/ask   │         │  POST /api/checkout/verify   │  │
│  │  (Gemini 3.8 Flash SDK) │         │  (Token generation & orders) │  │
│  └────────────┬────────────┘         └──────────────┬───────────────┘  │
│               │                                     │                  │
│               ▼                                     ▼                  │
│       Google GenAI API                   Secure Order Registry         │
└────────────────────────────────────────────────────────────────────────┘
```

#### Data Model & State
1. **eBook Entity**:
   - `id`, `title`, `author`, `genre`, `price`, `rating`, `reviewCount`, `pageCount`, `coverImage`, `summary`, `tableOfContents`, `sampleChapters` (title, content), `fullContent` (complete readable text/PDF data URI), `fileFormat` ('PDF' | 'EPUB' | 'BUNDLE'), `fileSize`.
2. **Order & License Entity**:
   - `orderId`, `customerEmail`, `bookId`, `bookTitle`, `purchaseDate`, `amountPaid`, `paymentMethod` ('paypal' | 'paypal_sandbox' | 'simulator'), `downloadToken`, `downloadLimit`, `downloadsRemaining`, `expiresAt`.
3. **AI Reader Session**:
   - Active book excerpt context, conversational message history (user questions and Gemini answers), precomputed key themes and chapter synopsis.

#### Interactive Component & State Mapping
- `Header`: 3-zone contract with brand title, navigation tabs (Catalog, My Library & Downloads, Author Portal), and Cart indicator.
- `BookCatalog`: Filter controls (search, genre chips, sort by popularity/price), book grid with responsive cards.
- `SampleReaderModal`: Excerpt reading panel with font size adjustment, side-by-side or collapsible "Ask the Book" Gemini panel with suggested questions ("Summarize Chapter 1", "What is the core thesis?", "Key takeaways").
- `PayPalCheckoutDrawer`: Item details, customer email input, PayPal Smart Buttons container, "Simulate Success" testing button, and coupon/discount state.
- `OrderSuccessModal`: Displays purchase receipt, order ID, tokenized "Download eBook (PDF)" button triggering file download, and "Read in Browser" action.
- `AuthorPortalModal`: Form to add new books with custom cover uploads, price setting, and file attachments.
- `MyLibraryDrawer`: Allows customers to re-access previously purchased titles using their email or order token.
