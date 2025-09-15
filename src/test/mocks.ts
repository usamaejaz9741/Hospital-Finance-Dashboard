// Type definitions for our mocks
export interface MockResizeObserver {
  observe(target: Element): void;
  unobserve(target: Element): void;
  disconnect(): void;
}

export interface MockIntersectionObserver extends IntersectionObserver {
  observe(target: Element): void;
  unobserve(target: Element): void;
  disconnect(): void;
  takeRecords(): IntersectionObserverEntry[];
}

// Mock implementations
export class MockResizeObserverImpl implements MockResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

export class MockIntersectionObserverImpl implements MockIntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '0px';
  readonly thresholds: ReadonlyArray<number> = [0];

  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] { return []; }
}