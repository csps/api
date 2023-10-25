import { Elysia } from "elysia";

const app = new Elysia();
const port = 3000;

app.get("/", () => {
  return "Hello!";
});

app.listen(port, () => {
  console.log(`✨ New CSPS API Backemd Server is running at port ${port}!`);
});
