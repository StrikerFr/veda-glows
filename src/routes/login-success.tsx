import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Home, User, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";

export const Route = createFileRoute("/login-success")({
  head: () => ({
    meta: [{ title: "Successfully Logged In - VedaGlows" }],
  }),
  component: LoginSuccessPage,
});

function LoginSuccessPage() {
  return (
    <main
      className="min-h-screen relative overflow-hidden flex flex-col"
      style={{
        background:
          "radial-gradient(1200px 600px at 50% 50%, rgba(201,168,106,0.12), transparent 70%), linear-gradient(180deg, #FBF7EF 0%, #F5EEDF 100%)",
      }}
    >
      <Navbar />
      
      {/* Soft texture overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(rgba(20,58,42,0.06) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="flex-1 flex items-center justify-center p-4 relative z-10 pt-20">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-xl border border-foreground/8 shadow-2xl rounded-[2rem] p-8 md:p-12 text-center relative overflow-hidden">
          
          {/* Decorative glows */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4B978]/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#3F8E5E]/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />

          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#143A2A] to-[#1f4a36] rounded-2xl flex items-center justify-center text-[#D4B978] shadow-lg mb-8 relative">
            <CheckCircle2 className="w-10 h-10" />
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-[#D4B978] animate-pulse" />
          </div>

          <span className="inline-block text-[10px] tracking-[0.34em] uppercase text-[#143A2A]/70 font-semibold mb-2">
            Welcome Back
          </span>
          <h1 className="font-serif italic text-4xl text-[#143A2A] mb-4">
            Successfully Logged In
          </h1>
          <p className="text-foreground/70 text-sm mb-10 leading-relaxed">
            Your VedaGlows account is ready. Track your orders, view your rewards, or continue your skin reset journey.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              to="/account"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#143A2A] text-[#F4ECDC] px-6 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#0F2A1F] shadow-lg transition-all hover:scale-[1.02]"
            >
              <User className="w-4 h-4" /> Go to Account
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white border border-[#143A2A]/20 text-[#143A2A] px-6 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-foreground/5 transition-all"
            >
              <Home className="w-4 h-4" /> Go to Home Page
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
