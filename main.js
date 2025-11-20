const express = require("express")
const connectTOMongoDB = require("./db/connectToDB")
const userRouter = require("./routes/userRouter")
const authRouter = require("./auth/authRouter")
const postsRouter = require("./routes/postsRouter")
const isAuth = require("./middlewares/isAuthMiddleware")

const app = express()
app.use(express.json())
connectTOMongoDB()

app.use("/users",userRouter)
app.use("/auth",authRouter)
app.use("/posts",isAuth,postsRouter)

app.get("/",(req,res) => {
    res.send('this is / route')
})

app.listen(3000,() => {
    console.log("server running on http://localhost:3000")
})