// Mock Web API cryptography features for testing environment
const mockCrypto = {
  getRandomValues: (buffer: Uint8Array) => {
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] = Math.floor(Math.random() * 256);
    }
    return buffer;
  },
  subtle: {
    digest: async (_algorithm: string, data: ArrayBuffer) => {
      // Simple mock implementation for testing
      // In reality, this would use a proper hashing algorithm
      const view = new Uint8Array(data);
      const mockHash = new Uint8Array(32); // SHA-256 length
      let sum = 0;
      for (let i = 0; i < view.length; i++) {
        const value = view[i];
        if (value !== undefined) {
          sum = (sum + value) % 256;
          mockHash[i % 32] = sum;
        }
      }
      return mockHash.buffer;
    }
  }
};

const MockTextEncoder = class {
  encode(str: string): Uint8Array {
    const arr = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
      arr[i] = str.charCodeAt(i);
    }
    return arr;
  }
};

// Add mocks to global object
Object.defineProperty(global, 'crypto', { value: mockCrypto });
Object.defineProperty(global, 'TextEncoder', { value: MockTextEncoder });

export {}; // Make this a module