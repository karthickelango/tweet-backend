import express from "express";
import mongoose from "mongoose";
import { PORT, dbURL } from "./config.js";
import userRoures from "./routes/userRoutes.js"
import tweetRoutes from "./routes/tweetRoutes.js"
import followRoute from "./routes/followRoutes.js";
import cors from "cors";
// connect to express app
const app = express()
//middleware
app.use(express.json())
app.use(cors())

app.get('/',  (req, res) => {
    return res.status(234).send('user auth')
})
// Router 
app.use('/', followRoute)
app.use('/tweets', tweetRoutes)
app.use('/', userRoures)
//connect to MongoBD
mongoose.connect(dbURL).then(() => {
    console.log('Connected to DB')
    app.listen(PORT, () => {
        console.log(`Listening Port: ${PORT}`)
    })
}).catch((error) => {
    console.log(error)
})


