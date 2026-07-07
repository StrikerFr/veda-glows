import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function PageLoader() {
  const isLoading = useRouterState({ select: (s) => s.status === "pending" });
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let hideTimeout: NodeJS.Timeout;

    if (isLoading) {
      setShow(true);
      // Start slightly ahead for responsiveness
      setProgress(15);

      interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 90) return p;
          // Smoothly increment towards 90%
          const increment = Math.random() * 8 + 2;
          return p + increment;
        });
      }, 300);
    } else {
      // Complete the bar
      setProgress(100);
      
      // Wait for the transition to finish before hiding
      hideTimeout = setTimeout(() => {
        setShow(false);
        setTimeout(() => setProgress(0), 300); // reset after hidden
      }, 500); 
    }

    return () => {
      clearInterval(interval);
      clearTimeout(hideTimeout);
    };
  }, [isLoading]);

  if (!show && progress === 0) return null;

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-[10000] h-[3px] w-full overflow-hidden">
      <div
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{
          width: `${Math.min(progress, 100)}%`,
          opacity: progress === 100 ? 0 : 1,
          transitionProperty: 'width, opacity',
        }}
      >
        {/* Glow effect at the tip of the loading bar */}
        <div className="absolute right-0 top-0 h-full w-[150px] translate-x-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[2px]" />
      </div>
    </div>
  );
}
