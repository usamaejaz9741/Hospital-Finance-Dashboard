import { WebVitalsMonitor, WebVitalMetric } from '../webVitals';

// Create mock entry list
const createMockEntryList = (entries: PerformanceEntry[]): PerformanceObserverEntryList => ({
  getEntries: () => entries,
  getEntriesByName: () => entries,
  getEntriesByType: () => entries
});

// Mock PerformanceObserver
const mockObserve = jest.fn();
const mockDisconnect = jest.fn();

class MockPerformanceObserver implements PerformanceObserver {
  private readonly callback: PerformanceObserverCallback;

  constructor(callback: PerformanceObserverCallback) {
    this.callback = callback;
  }

  observe(options: PerformanceObserverInit): void {
    mockObserve(options);
    
    setTimeout(() => {
      // Simulate asynchronous events
      if (options.entryTypes?.includes('layout-shift')) {
        this.callback(createMockEntryList([{
          entryType: 'layout-shift',
          name: 'layout-shift',
          startTime: 100,
          duration: 0,
          value: 0.05,
          hadRecentInput: false,
          toJSON: () => ({})
        } as PerformanceEntry]), this);
      }

      if (options.entryTypes?.includes('first-input')) {
        this.callback(createMockEntryList([{
          entryType: 'first-input',
          name: 'first-input',
          startTime: 100,
          duration: 0,
          processingStart: 150,
          toJSON: () => ({})
        } as PerformanceEntry]), this);
      }
    }, 0);
  }

  disconnect(): void {
    mockDisconnect();
  }

  takeRecords = () => [];
}

// Set up global mocks
beforeAll(() => {
  // Mock PerformanceObserver
  global.PerformanceObserver = MockPerformanceObserver as unknown as typeof PerformanceObserver;
  
  // Mock window.performance
  const mockGetEntriesByType = jest.fn().mockImplementation((type: string) => {
    if (type === 'navigation') {
      return [{
        type: 'navigate'
      }] as PerformanceNavigationTiming[];
    }
    return [];
  });

  if (typeof global.window === 'undefined') {
    Object.defineProperty(global, 'window', {
      value: {
        performance: {
          getEntriesByType: mockGetEntriesByType,
          timing: {},
          navigation: {}
        }
      },
      writable: true,
      configurable: true
    });
  } else {
    global.window.performance = {
      getEntriesByType: mockGetEntriesByType,
      timing: {},
      navigation: {}
    } as unknown as Performance;
  }
});

describe('WebVitalsMonitor', () => {
  let monitor: WebVitalsMonitor;
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    monitor = new WebVitalsMonitor();
  });

  afterEach(() => {
    try {
      monitor.stopMonitoring();
    } catch (error) {
      // Ignore errors during cleanup
    }
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should start and stop monitoring', () => {
    // Act
    monitor.startMonitoring();

    // Assert
    expect(mockObserve).toHaveBeenCalledWith(
      expect.objectContaining({ 
        entryTypes: expect.arrayContaining(['layout-shift']),
        buffered: true 
      })
    );
    
    // Act
    monitor.stopMonitoring();

    // Assert
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('should collect CLS metric', async () => {
    // Setup fake timers and monitor
    jest.useFakeTimers();
    monitor.startMonitoring();

    // Mock layout shift entry
    const observer = new MockPerformanceObserver(list => {
      const entries = list.getEntries();
      if (entries[0]) {
        expect(entries[0].entryType).toBe('layout-shift');
        expect((entries[0] as unknown as { value: number }).value).toBe(0.05);
      }
    });
    
    // Trigger observation
    observer.observe({ entryTypes: ['layout-shift'] });

    // Fast-forward all pending timers
    jest.runAllTimers();
    
    // Allow pending promises to resolve
    await Promise.resolve();

    // Run assertions
    const metrics = monitor.getMetrics();
    const clsMetric = metrics.find((m: WebVitalMetric) => m.name === 'CLS');
    
    expect(clsMetric).toBeDefined();
    expect(clsMetric?.value).toBe(50); // 0.05 * 1000
    expect(clsMetric?.rating).toBe('good'); // 50 is less than good threshold of 100
  });

  it('should collect FID metric', async () => {
    // Setup fake timers and monitor
    jest.useFakeTimers();
    monitor.startMonitoring();

    // Mock first input entry
    const observer = new MockPerformanceObserver(list => {
      const entries = list.getEntries();
      if (entries[0]) {
        expect(entries[0].entryType).toBe('first-input');
        expect((entries[0] as unknown as { processingStart: number }).processingStart).toBe(150);
        expect(entries[0].startTime).toBe(100);
      }
    });
    
    // Trigger observation
    observer.observe({ entryTypes: ['first-input'] });

    // Fast-forward all pending timers
    jest.runAllTimers();
    
    // Allow pending promises to resolve
    await Promise.resolve();

    // Run assertions
    const metrics = monitor.getMetrics();
    const fidMetric = metrics.find((m: WebVitalMetric) => m.name === 'FID');
    
    expect(fidMetric).toBeDefined();
    expect(fidMetric?.value).toBe(50); // 150 - 100
    expect(fidMetric?.rating).toBe('good');
  });
});