export type Mark = "X" | "O";
export type Difficulty = "easy" | "medium" | "hard";
export type Board = (Mark | null)[];
export const emptyBoard = (): Board => Array<Mark | null>(9).fill(null);
const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

export function result(board: Board): { winner: Mark | null; line: number[]; draw: boolean } {
  for (const line of lines) {
    const mark = board[line[0] ?? 0];
    if (mark && line.every((i) => board[i] === mark)) return { winner: mark, line, draw: false };
  }
  return { winner: null, line: [], draw: board.every(Boolean) };
}

export function play(board: Board, index: number, mark: Mark): Board {
  const outcome = result(board);
  if (index < 0 || index > 8 || !Number.isInteger(index) || board[index] || outcome.winner || outcome.draw) return board;
  return board.map((cell, i) => i === index ? mark : cell);
}

// Standard minimax on the complete 3×3 game tree: win, block, then prevent forks.
function score(board: Board, turn: Mark, depth: number): number {
  const outcome = result(board);
  if (outcome.winner) return outcome.winner === "O" ? 10 - depth : depth - 10;
  if (outcome.draw) return 0;
  const values = board.flatMap((cell, i) => cell ? [] : [score(play(board, i, turn), turn === "X" ? "O" : "X", depth + 1)]);
  return turn === "O" ? Math.max(...values) : Math.min(...values);
}

export function botMove(board: Board, difficulty: Difficulty = "hard", random: () => number = Math.random): number | null {
  const outcome = result(board);
  if (outcome.winner || outcome.draw) return null;
  const available = board.flatMap((cell, i) => cell ? [] : [i]);
  const randomMove = () => available[Math.min(available.length - 1, Math.max(0, Math.floor(random() * available.length)))] ?? null;
  if (difficulty === "easy") return randomMove();
  if (difficulty === "medium") {
    // Always finish an immediate win before defending against the human.
    for (const mark of ["O", "X"] as const) {
      const tactical = available.find(i => result(play(board, i, mark)).winner === mark);
      if (tactical !== undefined) return tactical;
    }
    if (random() >= 0.6) return randomMove();
  }
  let best = -Infinity;
  let move: number | null = null;
  // Prefer the center/corners when moves have the same outcome.
  for (const i of [4, 0, 2, 6, 8, 1, 3, 5, 7]) {
    if (board[i]) continue;
    const value = score(play(board, i, "O"), "X", 0);
    if (value > best) { best = value; move = i; }
  }
  return move;
}

export function nextSoloStarter(previous: Mark): Mark { return previous === "X" ? "O" : "X"; }