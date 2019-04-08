import { useEffect, useState } from "react";

const useWindowSize = () => {
  const getSize = () => ({
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    outerHeight: window.outerHeight,
    outerWidth: window.outerWidth
  });

  const [size, setSize] = useState(getSize());

  const handleResize = () => setSize(getSize());

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
};

export default useWindowSize;
