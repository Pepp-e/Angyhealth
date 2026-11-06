import { describe, expect, it } from "vitest";
import { botMove, emptyBoard, nextSoloStarter, play, result, type Board, type Mark } from "./tris";

describe("Tris rules", () => {
  it("starts empty with nine cells", () => { expect(emptyBoard()).toEqual(Array(9).fill(null)); });
  it("alternates solo starters after the initial human game", () => {
    let starter: Mark = "X";
    const starts = [starter];
    for (let i = 0; i < 4; i++) { starter = nextSoloStarter(starter); starts.push(starter); }
    expect(starts).toEqual(["X", "O", "X", "O", "X"]);
  });
  it("recognizes all eight winning lines for each player", () => {
    for (const line of [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]) {
      for (const mark of ["X", "O"] as const) {
        const board = emptyBoard(); line.forEach(i => { board[i] = mark; });
        expect(result(board)).toEqual({ winner: mark, line, draw: false });
      }
    }
  });
  it("recognizes a full-board draw", () => {
    expect(result(["X","O","X","X","O","O","O","X","X"])).toEqual({ winner: null, line: [], draw: true });
  });
  it("never overwrites a mark or allows moves after victory or draw", () => {
    const board: Board = ["X","X","X",null,"O",null,null,null,"O"];
    expect(play(board, 3, "O")).toBe(board);
    const first = play(emptyBoard(), 0, "X"); expect(play(first, 0, "O")).toBe(first);
    const draw: Board = ["X","O","X","X","O","O","O","X","X"];
    expect(play(draw, 0, "O")).toBe(draw); expect(botMove(draw)).toBeNull();
  });
  it("takes a winning move", () => { expect(botMove(["O","O",null,"X","X",null,null,null,"X"])).toBe(2); });
  it("blocks an immediate human win", () => { expect(botMove(["X","X",null,null,"O",null,null,null,null])).toBe(2); });
  it("does not lose against any sequence of human moves, with either starter", () => {
    function walk(board: Board, turn: Mark) {
      const outcome = result(board);
      expect(outcome.winner).not.toBe("X");
      if (outcome.winner || outcome.draw) return;
      if (turn === "O") { const move = botMove(board); if (move === null) throw Error("Missing bot move"); walk(play(board, move, "O"), "X"); }
      else board.forEach((cell, i) => { if (!cell) walk(play(board, i, "X"), "O"); });
    }
    walk(emptyBoard(), "X"); walk(emptyBoard(), "O");
  });
});