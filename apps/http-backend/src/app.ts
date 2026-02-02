import express from "express"
import cors from "cors"
import "dotenv/config";

const app = express()

app.use(cors({
    origin:"http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}))

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true,limit:"16kb"}));
app.use(express.static("public"));


import authRouter from "./routes/auth.route";
app.use("/api/v1/auth", authRouter); 


import {errorHandler} from "./middlewares/error.middleware"
app.use(errorHandler)

export {app}