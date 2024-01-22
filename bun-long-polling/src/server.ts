import { Hono } from "hono";
import type { Context } from "hono";
import { serveStatic } from "hono/bun";

const app = new Hono();
app.use("/*", serveStatic({ root: "./public" }));

let chiefsHaveBall = true;
let bills = 0;
let chiefs = 0;
let lastScore;

// Randomly get points for a touchdown, field goal, or nothing.
function getPoints() {
  const number = Math.floor(Math.random() * 10);
  const touchdown = 7;
  const fieldGoal = 3;
  return number >= 8 ? touchdown : number >= 6 ? fieldGoal : 0;
}

function getScore() {
  if (chiefsHaveBall) {
    chiefs += getPoints();
  } else {
    bills += getPoints();
  }
  chiefsHaveBall = !chiefsHaveBall;
  return `Chiefs: ${chiefs}, Bills: ${bills}`;
}

app.get("/score", async (c: Context) => {
  let score;
  while (true) {
    score = getScore();
    if (score !== lastScore) break;
    await Bun.sleep(2000);
  }

  lastScore = score;
  c.header("Transfer-Encoding", "chunked");
  return c.text(score);
});

export default app;
