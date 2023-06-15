import express from "express";

const app = express();
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`UC Main CSPS backend API is listening on port ${port}`);
});