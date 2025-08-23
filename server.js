import express from 'express';
import dotenv from "dotenv";
import connection from './database/connection.js';
import { bootstrap } from './src/bootstrap.js';
import cors from "cors";
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(cors())
app.use(express.json())
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

bootstrap(app)
connection()

app.listen(port, () => {
    console.log(`Server Is Running At Port ${port}`);

})
