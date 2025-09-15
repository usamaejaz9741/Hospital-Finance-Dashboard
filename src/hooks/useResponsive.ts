import { useState, useEffect } from 'react';

interface BreakpointState {
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  is2Xl: boolean;
  width: number;
  height: number;
}

const useResponsive = (): BreakpointState => {
  const [state, setState] = useState<BreakpointState>({
    isXs: false,
    isSm: false,
    isMd: false,
    isLg: false,
    isXl: false,
    is2Xl: false,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setState({
        isXs: width >= 475,
        isSm: width >= 640,
        isMd: width >= 768,
        isLg: width >= 1024,
        isXl: width >= 1280,
        is2Xl: width >= 1536,
        width,
        height,
      });
    };

    // Set initial size
    updateSize();

    // Add event listener
    window.addEventListener('resize', updateSize);

    // Cleanup
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return state;
};

export default useResponsive;
