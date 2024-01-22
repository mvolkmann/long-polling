import express from 'express';

const app = express();
app.use(express.static('public'));

app.get('/greet', (req, res) => {
  res.send('Hello World!');
});

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

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

app.get('/score', async (req, res) => {
  let score;
  while (true) {
    score = getScore();
    if (score !== lastScore) break;
    await sleep(2000);
  }

  lastScore = score;
  res.setHeader('Transfer-Encoding', 'chunked');
  res.write(score);
  res.end();
});

app.listen(3000, function () {
  console.log('listening on port', this.address().port);
});
