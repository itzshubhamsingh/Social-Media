const express = require("express")
const app = express()
const mongoose = require("mongoose")
const morgan = require("morgan")
const dotenv = require("dotenv")
const helmet = require("helmet")
const userRout = require("./routes/users")
const authRout = require("./routes/auth")
const postRout = require("./routes/post")

dotenv.config();
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("Connection success")
}).catch((e)=>{
    console.log("Connection unsuccessful:" + e)
})
// middleware
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))
app.use("/api/users", userRout)
app.use("/api/auth", authRout)
app.use("/api/post", postRout)

app.get("/", (req, res)=>{
    res.send("Welcome to home")
})

app.listen(8000, ()=>{
    console.log("Backend is running")
})