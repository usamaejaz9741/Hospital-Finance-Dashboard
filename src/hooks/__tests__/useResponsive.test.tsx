import { renderHook } from '@testing-library/react';
import { act } from '@testing-library/react';
import useResponsive from '../useResponsive';

describe('useResponsive', () => {
  // Store original window dimensions
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

  // Mock resize event
  const triggerResize = (width: number, height: number = 800) => {
    window.innerWidth = width;
    window.innerHeight = height;
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
  };

  afterEach(() => {
    // Restore original window dimensions
    window.innerWidth = originalInnerWidth;
    window.innerHeight = originalInnerHeight;
  });

  test('initializes with correct dimensions', () => {
    const { result } = renderHook(() => useResponsive());

    expect(result.current.width).toBe(window.innerWidth);
    expect(result.current.height).toBe(window.innerHeight);
  });

  test('handles xs breakpoint (475px)', () => {
    const { result } = renderHook(() => useResponsive());

    triggerResize(474); // Below xs
    expect(result.current.isXs).toBe(false);

    triggerResize(475); // At xs
    expect(result.current.isXs).toBe(true);

    triggerResize(476); // Above xs
    expect(result.current.isXs).toBe(true);
  });

  test('handles sm breakpoint (640px)', () => {
    const { result } = renderHook(() => useResponsive());

    triggerResize(639); // Below sm
    expect(result.current.isSm).toBe(false);

    triggerResize(640); // At sm
    expect(result.current.isSm).toBe(true);

    triggerResize(641); // Above sm
    expect(result.current.isSm).toBe(true);
  });

  test('handles md breakpoint (768px)', () => {
    const { result } = renderHook(() => useResponsive());

    triggerResize(767); // Below md
    expect(result.current.isMd).toBe(false);

    triggerResize(768); // At md
    expect(result.current.isMd).toBe(true);

    triggerResize(769); // Above md
    expect(result.current.isMd).toBe(true);
  });

  test('handles lg breakpoint (1024px)', () => {
    const { result } = renderHook(() => useResponsive());

    triggerResize(1023); // Below lg
    expect(result.current.isLg).toBe(false);

    triggerResize(1024); // At lg
    expect(result.current.isLg).toBe(true);

    triggerResize(1025); // Above lg
    expect(result.current.isLg).toBe(true);
  });

  test('handles xl breakpoint (1280px)', () => {
    const { result } = renderHook(() => useResponsive());

    triggerResize(1279); // Below xl
    expect(result.current.isXl).toBe(false);

    triggerResize(1280); // At xl
    expect(result.current.isXl).toBe(true);

    triggerResize(1281); // Above xl
    expect(result.current.isXl).toBe(true);
  });

  test('handles 2xl breakpoint (1536px)', () => {
    const { result } = renderHook(() => useResponsive());

    triggerResize(1535); // Below 2xl
    expect(result.current.is2Xl).toBe(false);

    triggerResize(1536); // At 2xl
    expect(result.current.is2Xl).toBe(true);

    triggerResize(1537); // Above 2xl
    expect(result.current.is2Xl).toBe(true);
  });

  test('updates width and height correctly', () => {
    const { result } = renderHook(() => useResponsive());

    triggerResize(800, 600);
    expect(result.current.width).toBe(800);
    expect(result.current.height).toBe(600);

    triggerResize(1200, 900);
    expect(result.current.width).toBe(1200);
    expect(result.current.height).toBe(900);
  });

  test('multiple breakpoints are active at larger sizes', () => {
    const { result } = renderHook(() => useResponsive());

    triggerResize(1600, 900); // Larger than all breakpoints

    expect(result.current.isXs).toBe(true);
    expect(result.current.isSm).toBe(true);
    expect(result.current.isMd).toBe(true);
    expect(result.current.isLg).toBe(true);
    expect(result.current.isXl).toBe(true);
    expect(result.current.is2Xl).toBe(true);
  });

  test('maintains event listener cleanup', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useResponsive());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});