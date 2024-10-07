import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))

// middlewares

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

// routes
import userRoutes from "./routes/user.routes.js"
import campaignRoutes from "./routes/campaign.routes.js"
import emailTemplateRoutes from "./routes/email_template.routes.js"

app.use("/api/users", userRoutes)
app.use("/api/campaigns", campaignRoutes)
app.use("/api/email-template", emailTemplateRoutes)


export { app }