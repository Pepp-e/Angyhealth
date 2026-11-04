import { describe, expect, it } from "vitest";
import { adjacentMainPath, commitsSwipe, mainNavigation, swipeIntent } from "./main-navigation";

describe("main-screen gestures", () => {
  it("follows the five existing navigation destinations in both directions", () => {
    expect(mainNavigation.map((item) => item.to)).toEqual(["/schermata-5", "/schermata-2", "/", "/schermata-4", "/schermata-6"]);
    expect(adjacentMainPath("/", -100)).toBe("/schermata-4");
    expect(adjacentMainPath("/", 100)).toBe("/schermata-2");
  });
  it("does not wrap the ends or enable secondary screens", () => {
    expect(adjacentMainPath("/schermata-5", 100)).toBeUndefined();
    expect(adjacentMainPath("/schermata-6", -100)).toBeUndefined();
    for (const path of ["/note", "/lettera", "/nuvola-1", "/nuvola-2", "/nuvola-4"]) {
      expect(adjacentMainPath(path, -100)).toBeUndefined();
    }
  });
  it("rejects vertical and diagonal scrolling", () => {
    expect(swipeIntent(10, 70)).toBe("vertical");
    expect(swipeIntent(40, 40)).toBe("vertical");
    expect(swipeIntent(70, 10)).toBe("horizontal");
    expect(swipeIntent(3, 2)).toBe("pending");
  });
  it("returns short swipes and commits deliberate ones", () => {
    expect(commitsSwipe(20, 390, 500)).toBe(false);
    expect(commitsSwipe(105, 390, 500)).toBe(true);
    expect(commitsSwipe(-70, 390, 100)).toBe(true);
  });
});