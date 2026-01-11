import express, { response } from "express";
import dotenv from 'dotenv'
import tasksRouter from './routes/tasksRouters.js'
import { connectDB } from "./config/db.js";
import cors from 'cors';
import path from "path"
dotenv.config();


const app = express();
const _dirname = path.resolve();


app.use(express.json())
if(process.env.NODE_ENV !== 'production'){
app.use(cors({origin:"http://localhost:5173"}))
}

const PORT = process.env.PORT || 5001;

app.use("/api/tasks", tasksRouter)
if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(_dirname,"../frontend/dist")))

 app.get('*',(rep,res) =>{
  res.sendFile(path.join(_dirname,"../frontend/dist/index.html"))
})
}
connectDB().then(() =>{
  app.listen(PORT, () => {
  console.log(`Server bắt đầu trên cổng: http://localhost:${PORT} `);
});
})

