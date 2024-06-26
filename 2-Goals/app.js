import express from "express";

const courseGoals = [];
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

function renderGoalItem(id, text) {
  return `
    <li>
      <span>${text}</span>
      <button 
        hx-delete="/goals/${id}" 
        hx-target="closest li"
      >
        Remove
      </button>
    </li>
  `;
}

app.get("/", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Learn HTMX</title>
      <link rel="stylesheet" href="/main.css" />
      <script src="/htmx.js" defer></script>
    </head>
    <body>
      <main>
        <h1>Manage your course goals</h1>
        <section>
          <form 
            id="goal-form" 
            hx-post="/goals" 
            hx-target="#goals"
            hx-swap="beforeend"
            hx-on::after-request="this.reset()"
            hx-disabled-elt="form button"
          >
            <div>
              <label htmlFor="goal">Goal</label>
              <input type="text" id="goal" name="goal" />
            </div>
            <button type="submit">Add goal</button>
          </form>
        </section>
        <section>
          <ul id="goals"
            hx-swap="outerHTML"
            hx-confirm="Are you sure? Really?"
          >
            ${courseGoals
              .map((goal) => renderGoalItem(goal.id, goal.text))
              .join("")}
          </ul>
        </section>
      </main>
    </body>
  </html>
  `);
});

app.post("/goals", (req, res) => {
  const goalText = req.body.goal;
  const id = new Date().getTime().toString();
  courseGoals.push({ text: goalText, id: id });
  res.send(renderGoalItem(id, goalText));
});

app.delete("/goals/:idx", (req, res) => {
  const index = courseGoals.findIndex((goal) => goal.id === req.params.id);
  courseGoals.splice(index, 1);
  res.send();
});

app.listen(3000);
