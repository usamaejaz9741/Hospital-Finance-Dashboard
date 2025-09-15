declare global {
  interface Window {
    ResizeObserver: {
      new(): ResizeObserver;
    };
    IntersectionObserver: {
      new(callback: IntersectionObserverCallback, options?: IntersectionObserverInit): IntersectionObserver;
    };
  }
}