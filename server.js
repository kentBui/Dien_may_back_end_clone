const env = require("dotenv");
env.config();

const app = require("./src/app");

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Listen from port: ${port}`);
});
