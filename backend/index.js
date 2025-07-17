import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDb } from "./lib/connectdb.js"
import AuthRouter from "./routes/authRoute.js"
import TeacherRouter from "./routes/teacherRoute.js"
import cookieParser from "cookie-parser";
dotenv.config()
const app = express()

const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(cookieParser()); // ✅ This makes req.cookies available
app.use(express.urlencoded({ extended: true }))




app.use("/api/auth", AuthRouter);
app.use("/api/teachers", TeacherRouter);





app.listen(PORT , () => {
  console.log(`Server is running on port  ${PORT}`);

  connectDb().then(() => {
    console.log("Connected to MongoDB successfully");
  }).catch(err => {
    console.error("Failed to connect to MongoDB:", err);
  });
})