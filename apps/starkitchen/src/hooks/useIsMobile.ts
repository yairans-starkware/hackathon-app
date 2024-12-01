import { useEffect, useState } from "react";

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };

    // Initial check
    updateIsMobile();

    // Add resize listener
    window.addEventListener("resize", updateIsMobile);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", updateIsMobile);
    };
  }, []);

  return isMobile;
};
