import { useEffect, useState } from "react";

const useWindowSize = () => {
  const getSize = () => ({
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    outerHeight: window.outerHeight,
    outerWidth: window.outerWidth
  });

  const [size, setSize] = useState(getSize());

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleResize = () => setSize(getSize());

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return size;
};

export default useWindowSize;
