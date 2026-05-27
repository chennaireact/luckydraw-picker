import "@testing-library/jest-dom/vitest";

const mockFn = () => {
  const fn = () => {};
  fn.returnValue = undefined;
  fn.returnValues = [];
  fn.called = false;
  fn.calls = [];
  return fn;
};

// Mock HTMLCanvasElement.getContext for jsdom (used by ParticleCanvas)
HTMLCanvasElement.prototype.getContext = function (contextId) {
  if (contextId === "2d") {
    return {
      clearRect: mockFn(),
      beginPath: mockFn(),
      arc: mockFn(),
      fill: mockFn(),
      fillRect: mockFn(),
      strokeRect: mockFn(),
      measureText: mockFn(() => ({ width: 0 })),
      fillText: mockFn(),
      drawImage: mockFn(),
      getImageData: mockFn(() => ({ data: new Uint8ClampedArray(0) })),
      putImageData: mockFn(),
      createImageData: mockFn(() => new ImageData(1, 1)),
      setTransform: mockFn(),
      resetTransform: mockFn(),
      save: mockFn(),
      restore: mockFn(),
      canvas: this,
    };
  }
  return null;
};

// Mock canvas dimensions
Object.defineProperty(HTMLCanvasElement.prototype, "width", {
  configurable: true,
  get() {
    return this._width || 1024;
  },
  set(v) {
    this._width = v;
  },
});
Object.defineProperty(HTMLCanvasElement.prototype, "height", {
  configurable: true,
  get() {
    return this._height || 768;
  },
  set(v) {
    this._height = v;
  },
});

// Mock window.AudioContext for spin sound effects
const createMockOscillator = () => ({
  connect: () => {},
  start: () => {},
  stop: () => {},
  frequency: { value: 440 },
  type: "sine",
});

const createMockGain = () => ({
  connect: () => {},
  gain: {
    setValueAtTime: () => {},
    exponentialRampToValueAtTime: () => {},
  },
});

const mockAudioContext = {
  createOscillator: createMockOscillator,
  createGain: createMockGain,
  destination: {},
  currentTime: 0,
};

window.AudioContext = function AudioContextMock() {
  return mockAudioContext;
};
window.webkitAudioContext = function WebkitAudioContextMock() {
  return mockAudioContext;
};
