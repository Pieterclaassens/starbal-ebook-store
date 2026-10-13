import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import crypto from 'crypto';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Google GenAI client (User-Agent header required by skill guidelines)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// In-memory order fulfillment registry for secure tokens
interface OrderRecord {
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
}

const ordersRegistry = new Map<string, OrderRecord>();

// Preseed some demo orders so return visitors or testers can immediately test download fulfillment if desired
const demoToken = 'dl_tok_sample_reader_access';
ordersRegistry.set(demoToken, {
  orderId: 'ORD-DEMO-2026',
  bookId: 'book-1',
  bookTitle: 'The Architectural Mind',
  customerEmail: 'reader@example.com',
  amount: 28.00,
  currency: 'USD',
  paymentMethod: 'paypal',
  downloadToken: demoToken,
  downloadCount: 1,
  maxDownloads: 5,
  purchasedAt: new Date(Date.now() - 3600000).toISOString(),
  expiresAt: new Date(Date.now() + 86400000 * 30).toISOString(),
});

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 1. AI Sample Reader QA & Summaries
app.post('/api/reader/ask', async (req, res) => {
  try {
    const { bookTitle, author, excerpt, question, chatHistory, mode } = req.body;

    if (!question && !mode) {
      return res.status(400).json({ error: 'Question or mode is required' });
    }

    const systemInstruction = `You are "Omnishelf Companion", an erudite literary editor and reading assistant for the eBook "${bookTitle}" by ${author}.
Your purpose is to help prospective and active readers deeply understand the sample excerpt, explore central theses, explain terminology, provide concise chapter summaries, and guide them on what to expect in the full eBook.
Be insightful, warm, concise, and intellectually engaging. Cite specific passages or concepts from the provided excerpt when relevant.

EXCERPT CONTEXT:
${excerpt || 'No excerpt provided. Rely on general literary context of the work.'}
`;

    let prompt = question;
    if (mode === 'summary') {
      prompt = `Provide a crisp, 3-point executive summary of this excerpt, highlighting the primary premise, key breakthrough/insight, and why it is indispensable reading.`;
    } else if (mode === 'themes') {
      prompt = `Extract the 3 core themes or conceptual frameworks introduced in this excerpt, explaining why they matter to the reader.`;
    } else if (mode === 'takeaways') {
      prompt = `What are the top 3 actionable takeaways or mental models a reader immediately gains from reading this chapter?`;
    }

    const contents: any[] = [];
    if (chatHistory && Array.isArray(chatHistory)) {
      for (const msg of chatHistory) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: prompt }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Unable to generate analysis at this time.';
    res.json({ reply });
  } catch (err: any) {
    console.error('Error in /api/reader/ask:', err);
    res.status(500).json({
      error: 'Failed to analyze text with Gemini assistant.',
      details: err?.message || 'Server error',
    });
  }
});

// 2. Complete Order & Issue Cryptographic Download Token
app.post('/api/checkout/complete', (req, res) => {
  try {
    const { items, customerEmail, paymentMethod, paypalOrderId, totalAmount } = req.body;

    if (!items || !items.length || !customerEmail) {
      return res.status(400).json({ error: 'Missing items or customer email' });
    }

    const results: OrderRecord[] = [];

    for (const item of items) {
      const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
      const downloadToken = `dl_tok_${crypto.randomBytes(16).toString('hex')}`;
      
      const record: OrderRecord = {
        orderId,
        bookId: item.id,
        bookTitle: item.title,
        customerEmail,
        amount: item.price,
        currency: 'USD',
        paymentMethod: paymentMethod || 'paypal',
        paypalOrderId: paypalOrderId || undefined,
        downloadToken,
        downloadCount: 0,
        maxDownloads: 5,
        purchasedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 86400000 * 30).toISOString(), // 30 days valid
      };

      ordersRegistry.set(downloadToken, record);
      results.push(record);
    }

    res.json({
      success: true,
      orders: results,
      totalAmount,
      customerEmail,
      message: 'Payment processed and secure download licenses issued.',
    });
  } catch (err: any) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Order processing failed.' });
  }
});

// 3. Verify Download Token and Retrieve License
app.get('/api/orders/verify/:token', (req, res) => {
  const { token } = req.params;
  const order = ordersRegistry.get(token);

  if (!order) {
    return res.status(404).json({ error: 'Invalid or expired download token.' });
  }

  res.json({
    valid: true,
    order: {
      orderId: order.orderId,
      bookId: order.bookId,
      bookTitle: order.bookTitle,
      customerEmail: order.customerEmail,
      purchasedAt: order.purchasedAt,
      expiresAt: order.expiresAt,
      downloadCount: order.downloadCount,
      maxDownloads: order.maxDownloads,
      remainingDownloads: Math.max(0, order.maxDownloads - order.downloadCount),
    },
  });
});

// 4. Secure File Download Trigger
app.post('/api/orders/download/:token', (req, res) => {
  const { token } = req.params;
  const order = ordersRegistry.get(token);

  if (!order) {
    return res.status(404).json({ error: 'Invalid download license token.' });
  }

  if (order.downloadCount >= order.maxDownloads) {
    return res.status(403).json({
      error: 'Download limit reached for this license. Please contact support.',
    });
  }

  order.downloadCount += 1;

  res.json({
    success: true,
    downloadCount: order.downloadCount,
    remainingDownloads: order.maxDownloads - order.downloadCount,
    downloadFilename: `${order.bookTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}_Official_Edition.pdf`,
    licenseKey: `OMNI-LIC-${crypto.randomBytes(8).toString('hex').toUpperCase()}`,
  });
});

// Setup Vite middleware in dev or static server in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();
