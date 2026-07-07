import { Sparkles, Leaf } from "lucide-react";

export function ImmersiveLoader({ message = "Loading...", fullScreen = false }: { message?: string; fullScreen?: boolean }) {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative flex h-16 w-16 items-center justify-center">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full border-t-2 border-[#143A2A] opacity-20 animate-[spin_2s_linear_infinite]" />
        {/* Inner pulsing glow */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-[#143A2A]/10 to-[#D4B978]/20 blur-md animate-pulse" />
        {/* Center icon */}
        <Leaf className="relative h-6 w-6 text-[#143A2A] animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
        <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-[#D4B978] animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
      </div>
      <p className="text-[11px] uppercase tracking-[0.25em] text-[#143A2A]/70 font-semibold animate-pulse">
        {message}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen w-full grid place-items-center bg-gradient-to-b from-[#F5F2EA] to-[#EDE6D5] relative overflow-hidden">
        {/* Subtle background textures */}
        <div
          className="absolute inset-0 opacity-[0.35] mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(20,58,42,0.06) 1px, transparent 1px)",
            backgroundSize: "22px 22px"
          }}
        />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#D4B978]/15 blur-3xl rounded-full" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#3F8E5E]/15 blur-3xl rounded-full" />
        <div className="relative z-10">{content}</div>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center py-16">
      {content}
    </div>
  );
}
