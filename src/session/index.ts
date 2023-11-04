import { jwt } from "@elysiajs/jwt";

export default jwt({
  name: "jwt",
  secret: process.env.SECRET_KEY,
});