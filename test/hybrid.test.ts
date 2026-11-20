// Unit tests for the HybridScribe routing policy ("privacy budget").
// Run with: npm test
import { describe, it, expect } from "vitest";
import { InferenceMode } from "firebase/ai";
import { chooseMode, LONG_DOC_THRESHOLD } from "../src/hybrid";

describe("chooseMode — hybrid routing policy", () => {
  it("Privacy Lock forces ONLY_ON_DEVICE, even for long documents", () => {
    const long = "x".repeat(LONG_DOC_THRESHOLD + 500);
    const { mode, reason } = chooseMode(long, true);
    expect(mode).toBe(InferenceMode.ONLY_ON_DEVICE);
    expect(reason).toMatch(/Privacy Lock/);
  });

  it("long documents (> threshold) route ONLY_IN_CLOUD", () => {
    const long = "word ".repeat(LONG_DOC_THRESHOLD); // well over threshold
    const { mode, reason } = chooseMode(long, false);
    expect(mode).toBe(InferenceMode.ONLY_IN_CLOUD);
    expect(reason).toMatch(/Long document/);
  });

  it("text exactly at the threshold still prefers on-device", () => {
    const atThreshold = "x".repeat(LONG_DOC_THRESHOLD);
    const { mode } = chooseMode(atThreshold, false);
    expect(mode).toBe(InferenceMode.PREFER_ON_DEVICE);
  });

  it("short notes route PREFER_ON_DEVICE", () => {
    const { mode, reason } = chooseMode("Team standup notes. Todo: send the report.", false);
    expect(mode).toBe(InferenceMode.PREFER_ON_DEVICE);
    expect(reason).toMatch(/Gemini Nano on-device first/);
  });

  it("empty note still prefers on-device (UI guards empty input separately)", () => {
    const { mode } = chooseMode("", false);
    expect(mode).toBe(InferenceMode.PREFER_ON_DEVICE);
  });
});
