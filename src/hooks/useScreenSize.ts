import { useState, useEffect } from "react";

const useScreenSize = () => {
  const getSize = () => ({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [size, setSize] = useState(getSize);

  useEffect(() => {
    const handleResize = () => {
      setSize(getSize());
    };

    // Set initial size
    handleResize();

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);
  const isSmScreen = size?.width <= 640;

  return { size, isSmScreen };
};

export default useScreenSize;
