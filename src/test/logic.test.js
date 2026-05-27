import { describe, it, expect } from "vitest";

/**
 * Pure logic tests — no React rendering needed.
 * These cover the core algorithms used in the spin reel.
 */

describe("name parsing", () => {
  const parse = (text) =>
    text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  it("parses comma-separated names", () => {
    expect(parse("Nikhil, Surya, Dhanush")).toEqual([
      "Nikhil",
      "Surya",
      "Dhanush",
    ]);
  });

  it("trims whitespace from each name", () => {
    expect(parse("  Nikhil ,  Surya  ,  Dhanush  ")).toEqual([
      "Nikhil",
      "Surya",
      "Dhanush",
    ]);
  });

  it("returns empty array for empty string", () => {
    expect(parse("")).toEqual([]);
  });

  it("filters out entries that are only whitespace", () => {
    expect(parse("Nikhil,   , Surya")).toEqual(["Nikhil", "Surya"]);
  });

  it("handles single name", () => {
    expect(parse("Dhanush")).toEqual(["Dhanush"]);
  });

  it("handles trailing comma", () => {
    expect(parse("Nikhil, Surya,")).toEqual(["Nikhil", "Surya"]);
  });

  it("handles duplicate names", () => {
    expect(parse("Nikhil, Nikhil, Surya")).toEqual([
      "Nikhil",
      "Nikhil",
      "Surya",
    ]);
  });
});

describe("winner pre-selection", () => {
  it("selects a name that exists in the input list", () => {
    const names = ["Nikhil", "Surya", "Dhanush", "Kamlesh"];
    const winner = names[Math.floor(Math.random() * names.length)];
    expect(names).toContain(winner);
  });

  it("works with a two-name list", () => {
    const names = ["Alice", "Bob"];
    const winner = names[Math.floor(Math.random() * names.length)];
    expect(names).toContain(winner);
  });
});

describe("reel building", () => {
  /**
   * Mirrors the reel-building logic from handleSpin:
   * Shuffle each round, push all names. The winner must appear
   * at least once somewhere in the resulting reel.
   */
  function buildReel(names, rounds) {
    const reel = [];
    const src = [...names];
    for (let i = 0; i < rounds; i++) {
      for (let j = src.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [src[j], src[k]] = [src[k], src[j]];
      }
      reel.push(...src);
    }
    return reel;
  }

  it("reel contains all names multiple times", () => {
    const names = ["Nikhil", "Surya", "Dhanush", "Kamlesh"];
    const reel = buildReel(names, 10);
    for (const name of names) {
      const count = reel.filter((n) => n === name).length;
      expect(count).toBeGreaterThan(0);
    }
  });

  it("reel length equals names.length * rounds", () => {
    const names = ["A", "B", "C"];
    const reel = buildReel(names, 5);
    expect(reel.length).toBe(15);
  });

  it("every reel entry is a valid name from the input list", () => {
    const names = ["Alice", "Bob", "Carol"];
    const reel = buildReel(names, 20);
    for (const entry of reel) {
      expect(names).toContain(entry);
    }
  });
});

describe("winner target index search", () => {
  /**
   * Mirrors the target-finding logic from handleSpin.
   */
  function findTargetIndex(reel, wName) {
    let targetIdx = -1;
    const searchStart = Math.max(0, Math.floor(reel.length * 0.75));
    for (let i = reel.length - 1; i >= searchStart; i--) {
      if (reel[i] === wName) {
        targetIdx = i;
        break;
      }
    }
    if (targetIdx === -1) {
      for (let i = reel.length - 1; i >= 0; i--) {
        if (reel[i] === wName) {
          targetIdx = i;
          break;
        }
      }
    }
    return targetIdx;
  }

  it("finds the winner in the later quarter of the reel", () => {
    const reel = ["A", "B", "C", "A", "B", "C", "A", "B", "C", "A", "B", "C"];
    const idx = findTargetIndex(reel, "B");
    expect(idx).toBeGreaterThanOrEqual(Math.floor(reel.length * 0.75));
    expect(reel[idx]).toBe("B");
  });

  it("falls back to any position if not found in later quarter", () => {
    const reel = ["A", "B", "C", "D", "E", "F", "G", "H"]; // B only at index 1
    const idx = findTargetIndex(reel, "B");
    expect(idx).toBe(1);
    expect(reel[idx]).toBe("B");
  });

  it("returns -1 if winner not in reel at all", () => {
    const reel = ["A", "B", "C"];
    const idx = findTargetIndex(reel, "Z");
    expect(idx).toBe(-1);
  });

  it("always points to the actual winner name", () => {
    const names = ["Nikhil", "Surya", "Dhanush", "Kamlesh"];
    const wName = "Dhanush";
    const reel = [];
    const src = [...names];
    for (let i = 0; i < 10; i++) {
      for (let j = src.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [src[j], src[k]] = [src[k], src[j]];
      }
      reel.push(...src);
    }
    const idx = findTargetIndex(reel, wName);
    expect(idx).toBeGreaterThan(-1);
    expect(reel[idx]).toBe(wName);
  });
});

describe("easeOutQuart easing", () => {
  it("returns 0 at progress 0", () => {
    const e = 1 - Math.pow(1 - 0, 4);
    expect(e).toBeCloseTo(0);
  });

  it("returns 1 at progress 1", () => {
    const e = 1 - Math.pow(1 - 1, 4);
    expect(e).toBeCloseTo(1);
  });

  it("is monotonically increasing", () => {
    let prev = 0;
    for (let p = 0; p <= 1; p += 0.01) {
      const e = 1 - Math.pow(1 - p, 4);
      expect(e).toBeGreaterThanOrEqual(prev);
      prev = e;
    }
  });

  it("decelerates — derivative decreases over time", () => {
    // easeOutQuart: f(p) = 1 - (1-p)^4, derivative f'(p) = 4*(1-p)^3
    // Since (1-p) decreases as p increases, the derivative decreases
    // This means the animation starts fast and slows down
    for (let p = 0; p < 0.9; p += 0.1) {
      const d1 = 4 * Math.pow(1 - p, 3);
      const d2 = 4 * Math.pow(1 - (p + 0.1), 3);
      // At early p, velocity (d1) should be greater than later velocity (d2)
      expect(d1).toBeGreaterThan(d2);
    }
  });
});

describe("visibleItems computation", () => {
  const ITEM_H = 88;

  function computeVisible(scrollPx, displayItems) {
    const center = scrollPx / ITEM_H;
    const items = [];
    const range = 6;
    for (let r = -range; r <= range; r++) {
      const idx = Math.round(center) + r;
      if (idx < 0 || idx >= displayItems.length) continue;
      const off = idx - center;
      const absOff = Math.abs(off);
      const opacity =
        absOff < 0.5 ? 1 : Math.max(0.12, 1 - (absOff - 0.3) * 0.35);
      const scale =
        absOff < 0.5 ? 1 : Math.max(0.82, 1 - (absOff - 0.3) * 0.06);
      items.push({
        key: idx,
        text: displayItems[idx],
        offPx: off * ITEM_H,
        opacity,
        scale,
        isCenter: Math.abs(off) < 0.45,
      });
    }
    return items;
  }

  it("returns empty for empty displayItems", () => {
    expect(computeVisible(0, [])).toEqual([]);
  });

  it("center item has isCenter=true and full opacity", () => {
    const items = ["Alice", "Bob", "Carol", "Dave", "Emma"];
    const visible = computeVisible(ITEM_H * 2, items); // center at index 2
    const center = visible.find((v) => v.isCenter);
    expect(center).toBeTruthy();
    expect(center.text).toBe("Carol");
    expect(center.opacity).toBe(1);
    expect(center.scale).toBe(1);
  });

  it("offPx for center item is 0", () => {
    const items = ["Alice", "Bob", "Carol"];
    const visible = computeVisible(ITEM_H * 1, items); // center at index 1
    const center = visible.find((v) => v.isCenter);
    expect(center.offPx).toBeCloseTo(0);
  });

  it("non-center items have reduced opacity", () => {
    const items = ["Alice", "Bob", "Carol", "Dave", "Emma"];
    const visible = computeVisible(ITEM_H * 2, items);
    const nonCenter = visible.filter((v) => !v.isCenter);
    for (const item of nonCenter) {
      expect(item.opacity).toBeLessThan(1);
    }
  });

  it("all visible items reference valid displayItems entries", () => {
    const items = ["Alice", "Bob", "Carol", "Dave", "Emma", "Frank", "Grace"];
    const visible = computeVisible(ITEM_H * 3, items);
    for (const v of visible) {
      expect(v.key).toBeGreaterThanOrEqual(0);
      expect(v.key).toBeLessThan(items.length);
      expect(v.text).toBe(items[v.key]);
    }
  });
});

describe("dynamic font sizing for winner name", () => {
  function getFontSize(len) {
    if (len <= 8) return "clamp(2rem, 7vw, 3.6rem)";
    if (len <= 14) return "clamp(1.6rem, 5.5vw, 2.8rem)";
    if (len <= 20) return "clamp(1.3rem, 4.5vw, 2.2rem)";
    if (len <= 28) return "clamp(1.1rem, 3.5vw, 1.8rem)";
    return "clamp(0.9rem, 2.8vw, 1.5rem)";
  }

  it("short names get the largest font", () => {
    expect(getFontSize(5)).toBe("clamp(2rem, 7vw, 3.6rem)");
    expect(getFontSize(8)).toBe("clamp(2rem, 7vw, 3.6rem)");
  });

  it("medium names get gradually smaller fonts", () => {
    expect(getFontSize(10)).toBe("clamp(1.6rem, 5.5vw, 2.8rem)");
    expect(getFontSize(18)).toBe("clamp(1.3rem, 4.5vw, 2.2rem)");
  });

  it("long names get the smallest font", () => {
    expect(getFontSize(30)).toBe("clamp(0.9rem, 2.8vw, 1.5rem)");
    expect(getFontSize(50)).toBe("clamp(0.9rem, 2.8vw, 1.5rem)");
  });
});

describe("canStart validation", () => {
  it("requires at least 2 names", () => {
    const canStart = (names, contestName) =>
      names.length >= 2 && contestName.trim().length > 0;
    expect(canStart(["Alice"], "Giveaway")).toBe(false);
    expect(canStart(["Alice", "Bob"], "Giveaway")).toBe(true);
  });

  it("requires non-empty contest name", () => {
    const canStart = (names, contestName) =>
      names.length >= 2 && contestName.trim().length > 0;
    expect(canStart(["Alice", "Bob"], "")).toBe(false);
    expect(canStart(["Alice", "Bob"], "   ")).toBe(false);
    expect(canStart(["Alice", "Bob"], "Giveaway")).toBe(true);
  });
});

describe("range fill width calculation", () => {
  it("calculates fill percentage correctly", () => {
    const calc = (val, min, max) => ((val - min) / (max - min)) * 100;
    expect(calc(5, 5, 25)).toBeCloseTo(0);
    expect(calc(15, 5, 25)).toBeCloseTo(50);
    expect(calc(25, 5, 25)).toBeCloseTo(100);
  });
});
