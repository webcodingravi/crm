import 'dotenv/config'
import { fileURLToPath } from 'url'
import path from 'path';
import express from 'express'
import connectDB from './config/db.js';
import customerRouter from './routes/customer.routes.js';
import logRouter from './routes/log.routes.js';
import cors from 'cors'
const app=express();

// Database
await connectDB();

app.use(cors())
// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => res.send("Server Successfully Running"))
app.use("/customer", customerRouter);
app.use("/log", logRouter)

const PORT=process.env.PORT||3000
app.listen(PORT, () => console.log(`Server Running Port on ${PORT}`))