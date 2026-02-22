import { useEffect, useRef, useState } from "react";

const BASE_URL = import.meta.env.BASE_URL || "/";

function FullscreenIcon({ isFullscreen }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {isFullscreen ? (
        <>
          <path d="M9 9H5V5" />
          <path d="M15 9h4V5" />
          <path d="M9 15H5v4" />
          <path d="M15 15h4v4" />
        </>
      ) : (
        <>
          <path d="M5 9V5h4" />
          <path d="M19 9V5h-4" />
          <path d="M5 15v4h4" />
          <path d="M19 15v4h-4" />
        </>
      )}
    </svg>
  );
}

export default function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(
    !!document.fullscreenElement,
  );

  const [visible, setVisible] = useState(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // fade-out logic
  useEffect(() => {
    const resetTimer = () => {
      setVisible(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        setVisible(false);
      }, 3000);
    };

    resetTimer();

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("touchstart", resetTimer);

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggleFullscreen}
      title={isFullscreen ? "Exit Full Screen" : "Full Screen"}
      aria-label={isFullscreen ? "Exit Full Screen" : "Enter Full Screen"}
      className={`
  fixed bottom-5 right-5 z-50
  h-14 w-14
  flex items-center justify-center

  rounded-3xl
  bg-black/60
  text-amber-300
  backdrop-blur

  transition-all duration-300

  hover:bg-black/75
  hover:scale-105
  active:scale-95

  ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}
`}
    >
      <FullscreenIcon isFullscreen={isFullscreen} />
    </button>
  );
}
