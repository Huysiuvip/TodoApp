import express, { response } from "express";
import dotenv from 'dotenv'
import tasksRouter from './routes/tasksRouters.js'
import { connectDB } from "./config/db.js";
import cors from 'cors';
dotenv.config();


const app = express();



app.use(express.json())
app.use(cors({origin:"http://localhost:5173"}))
const PORT = process.env.PORT || 5001;

app.use("/api/tasks", tasksRouter)
connectDB().then(() =>{
  app.listen(PORT, () => {
  console.log(`Server bắt đầu trên cổng: http://localhost:${PORT} `);
});
})

