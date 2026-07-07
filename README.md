# VedaGlows Official E-Commerce Storefront

VedaGlows is a modern, premium e-commerce web application focused on Ayurvedic skincare. Built with an elite, cutting-edge technology stack (TanStack Start + React 19 + Vite), this storefront is designed for maximum performance, exceptional SEO, and a flawless user experience.

---

## 🌟 Features

- **Blazing Fast Performance**: Powered by Vite and React 19 Server Components.
- **Premium Aesthetics**: Bespoke design system utilizing Tailwind CSS v4 and Framer Motion-inspired animations.
- **Robust Authentication**: Fully integrated with Supabase Auth for seamless user login and account management.
- **Secure Payments**: Razorpay integration for fast, secure, and compliant Indian checkouts.
- **Technical SEO**: Dynamic XML Sitemaps, JSON-LD Structured Data, and fully optimized Meta/OpenGraph tags for high search engine visibility.
- **Responsive Design**: Mobile-first philosophy ensuring the storefront looks perfect on any device.

---

## 🛠️ Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (Full-stack React framework via Vite)
- **Routing**: [TanStack Router](https://tanstack.com/router) (Type-safe file-based routing)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) (Headless accessibility)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL & GoTrue)
- **Payments**: [Razorpay](https://razorpay.com/)

---

## 📂 Folder Structure

```text
├── .env.example            # Environment variables template
├── package.json            # Dependencies and NPM scripts
├── public/                 # Static assets (images, fonts, robots.txt)
├── scripts/                # Build and deployment utilities
├── supabase/               # Supabase database migrations and types
└── src/
    ├── components/         # Reusable React components (UI, Forms, Marketing)
    ├── hooks/              # Custom React hooks (e.g., use-mobile, use-toast)
    ├── integrations/       # External service wrappers (Supabase clients)
    ├── lib/                # Core utilities, functions, and server-side logic
    └── routes/             # TanStack Router pages (File-based routing)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- NPM, Yarn, pnpm, or Bun (NPM is recommended)
- A Supabase Project
- A Razorpay Account (Test mode for development)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/vedaglows-web.git
   cd vedaglows-web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   *Fill in the `.env` file with your Supabase and Razorpay credentials. See the Environment Variables section for details.*

### Running Development Server

Start the development server with Vite:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### Building for Production

To create a production-ready build:
```bash
npm run build
```
The optimized bundle will be generated in the `out/` and `dist/` directories.

---

## ⚙️ Environment Variables

Your `.env` file must include the following keys to ensure full functionality:

- **`VITE_APP_URL`**: Your production or local URL (e.g., `http://localhost:3000`).
- **`VITE_SUPABASE_URL` / `SUPABASE_URL`**: Found in your Supabase project settings.
- **`VITE_SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_PUBLISHABLE_KEY`**: Found in your Supabase project settings (Anon key).
- **`SUPABASE_SERVICE_ROLE_KEY`**: Your secure backend-only key for administrative overrides. **NEVER expose this to the client.**
- **`RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`**: Found in your Razorpay Dashboard under Settings -> API Keys.

---

## 🔐 Integrations Setup

### Authentication Flow (Supabase)
Authentication is handled entirely via Supabase GoTrue.
- **Middleware**: Server-side route validation occurs in `src/integrations/supabase/auth-middleware.ts`.
- **Protected Routes**: Any route inside `src/routes/_authenticated/` is automatically protected. If an unauthenticated user attempts to access these pages, they are safely redirected to `/auth`.

### Database Architecture
Supabase acts as the primary PostgreSQL database.
- Database schemas and row-level security (RLS) policies govern product availability, cart tracking, and secure order processing.

### Payment Flow (Razorpay)
1. User clicks "Checkout".
2. Server-side logic (`src/lib/orders.functions.ts`) creates an order securely with Razorpay.
3. Razorpay SDK is initialized on the client side, opening the payment modal.
4. Upon successful payment, a callback verifies the signature using `crypto` and `RAZORPAY_KEY_SECRET` to prevent fraud before fulfilling the order.

---

## 📈 SEO & Performance Features

- **Server-Side Generation**: Initial HTML is rendered on the server, drastically improving Largest Contentful Paint (LCP).
- **Dynamic XML Sitemap**: `sitemap.xml` is automatically generated, pinging search engines with the latest product indexing.
- **Lazy Loading**: Below-the-fold images and complex interactive components are deferred to prevent main-thread blocking.
- **Canonical URLs**: Automatically injected to prevent duplicate content indexing.
- **Structured Data**: JSON-LD scripts are embedded for rich snippets on Google Search (Products, FAQs, LocalBusiness).

---

## 💻 NPM Scripts

- `npm run dev`: Starts the local development server.
- `npm run build`: Compiles the application for production.
- `npm run preview`: Bootstraps a local server to preview the production build.
- `npm run lint`: Analyzes code for stylistic and functional errors via ESLint.
- `npm run format`: Automatically formats code via Prettier.

---

## 🚀 Deployment

This project is optimized for deployment on **Vercel** or any standard Node.js hosting environment.

1. Connect your repository to Vercel.
2. Override the Build Command (if necessary) to `npm run build:vercel`.
3. Add all your Environment Variables to the Vercel dashboard.
4. Deploy!

*(Note: Vercel automatically handles HTTP to HTTPS routing and static asset caching).*

---

## 🤝 Troubleshooting

- **Supabase Errors**: If data fails to fetch, ensure your `.env` variables are correct and that RLS policies in your Supabase dashboard allow anonymous read access for public tables.
- **Payment Verification Failing**: Ensure your `RAZORPAY_KEY_SECRET` is exactly matching your Razorpay dashboard and that you are not mixing Test/Live keys.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💡 Credits

Designed and developed by the team at **VedaGlows**.
