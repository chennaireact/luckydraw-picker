import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock canvas-confetti
vi.mock("canvas-confetti", () => ({
  default: vi.fn(() => Promise.resolve(null)),
}));

// Mock html2canvas
vi.mock("html2canvas", () => ({
  default: vi.fn(() =>
    Promise.resolve({ toDataURL: () => "data:image/png;base64,stub" }),
  ),
}));

// Mock framer-motion
vi.mock("framer-motion", () => {
  const React = require("react"); // eslint-disable-line no-undef
  return {
    motion: new Proxy(
      {},
      {
        get(_target, prop) {
          if (typeof prop === "string") {
            return React.forwardRef((props, ref) => {
              // Strip framer-motion-specific props that shouldn't be passed to DOM
              const {
                initial,
                animate,
                exit,
                transition,
                whileHover,
                whileTap,
                variants,
                ...rest
              } = props;
              void initial;
              void animate;
              void exit;
              void transition;
              void whileHover;
              void whileTap;
              void variants;
              return React.createElement(prop, { ...rest, ref });
            });
          }
          return undefined;
        },
      },
    ),
    AnimatePresence: ({ children }) => children,
  };
});

import App from "../App.jsx";

describe("App — Input Step", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the input step heading and subtitle", () => {
    render(<App />);
    expect(screen.getByText("Lucky Draw")).toBeInTheDocument();
    expect(screen.getByText("Picker")).toBeInTheDocument();
    expect(screen.getByText("Pick a winner, make it fair")).toBeInTheDocument();
  });

  it("renders event name and participant inputs", () => {
    render(<App />);
    expect(screen.getByPlaceholderText("Ticket Giveaway")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Nikhil, Surya, Dhanush, Kamlesh"),
    ).toBeInTheDocument();
  });

  it("renders the spin duration slider with default 5s", () => {
    render(<App />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveValue("5");
  });

  it("renders the duration badge showing 5s", () => {
    render(<App />);
    const badge = screen.getByText("5s", { selector: ".duration-badge" });
    expect(badge).toBeInTheDocument();
  });

  it("shows disabled button when no input is provided", () => {
    render(<App />);
    const btn = screen.getByRole("button", { name: /enter an event name/i });
    expect(btn).toBeDisabled();
  });

  it('shows "Add at least 2 participants" with contest name but <2 names', () => {
    render(<App />);
    const input = screen.getByPlaceholderText("Ticket Giveaway");
    fireEvent.change(input, { target: { value: "My Event" } });
    const btn = screen.getByRole("button", {
      name: /add at least 2 participants/i,
    });
    expect(btn).toBeDisabled();
  });

  it('shows "0 participants" initially', () => {
    render(<App />);
    expect(screen.getByText("0 participants")).toBeInTheDocument();
  });

  it("shows participant count when names are entered", () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText(
      "Nikhil, Surya, Dhanush, Kamlesh",
    );
    fireEvent.change(textarea, { target: { value: "Alice, Bob" } });
    expect(screen.getByText("2 participants")).toBeInTheDocument();
  });

  it('shows singular "participant" for one name', () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText(
      "Nikhil, Surya, Dhanush, Kamlesh",
    );
    fireEvent.change(textarea, { target: { value: "Alice" } });
    expect(screen.getByText("1 participant")).toBeInTheDocument();
  });

  it("shows empty state when no names entered", () => {
    render(<App />);
    expect(
      screen.getByText("Names will appear here as you type"),
    ).toBeInTheDocument();
  });

  it("lists participant names when entered", () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText(
      "Nikhil, Surya, Dhanush, Kamlesh",
    );
    fireEvent.change(textarea, { target: { value: "Alice, Bob, Carol" } });
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Carol")).toBeInTheDocument();
  });

  it("enables button with valid contest name + 2+ participants", () => {
    render(<App />);
    const input = screen.getByPlaceholderText("Ticket Giveaway");
    fireEvent.change(input, { target: { value: "Giveaway" } });
    const textarea = screen.getByPlaceholderText(
      "Nikhil, Surya, Dhanush, Kamlesh",
    );
    fireEvent.change(textarea, { target: { value: "Alice, Bob" } });
    const btn = screen.getByRole("button", {
      name: /continue with 2 participants/i,
    });
    expect(btn).toBeEnabled();
  });

  it("navigates to spin step on valid submission", () => {
    render(<App />);
    const input = screen.getByPlaceholderText("Ticket Giveaway");
    fireEvent.change(input, { target: { value: "Test Event" } });
    const textarea = screen.getByPlaceholderText(
      "Nikhil, Surya, Dhanush, Kamlesh",
    );
    fireEvent.change(textarea, { target: { value: "Alice, Bob, Carol" } });
    const btn = screen.getByRole("button", {
      name: /continue with 3 participants/i,
    });
    fireEvent.click(btn);
    // Spin step should show contest name and participant count
    expect(screen.getByText("Test Event")).toBeInTheDocument();
    expect(screen.getByText(/3 participants/)).toBeInTheDocument();
  });

  it("renders footer with ChennaiReact link", () => {
    render(<App />);
    expect(screen.getByText("ChennaiReact")).toBeInTheDocument();
  });
});
