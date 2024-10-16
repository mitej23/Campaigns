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
import emailAccountRoutes from "./routes/email_accounts.routes.js"
import campaignRoutes from "./routes/campaign.routes.js"
import emailTemplateRoutes from "./routes/email_template.routes.js"
import contactsRoutes from "./routes/contacts.routes.js"

app.use("/api/users", userRoutes)
app.use("/api/user-email-accounts", emailAccountRoutes)
app.use("/api/campaigns", campaignRoutes)
app.use("/api/email-template", emailTemplateRoutes)
app.use("/api/contacts", contactsRoutes)


export { app }