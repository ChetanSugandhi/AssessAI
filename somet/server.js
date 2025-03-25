import "dotenv/config"
import app from "./app.js";
import { createServer } from "http";

const server = createServer(app);

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`server running on ${port}`));
