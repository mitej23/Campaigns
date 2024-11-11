import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()
app.set("trust proxy", true)
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
import { setupEmailQueueCron } from "./utils/emailQueueProcessing.js"
import { setupEmailSendQueueCron } from "./utils/emailSendQueueProcessing.js";
import { db } from "./db/index.js"
import { emailOpens } from "./db/schema.js"


app.use("/api/users", userRoutes)
app.use("/api/user-email-accounts", emailAccountRoutes)
app.use("/api/campaigns", campaignRoutes)
app.use("/api/email-template", emailTemplateRoutes)
app.use("/api/contacts", contactsRoutes)
app.get('/tracking/:trackingId', async (req, res) => {
  //eg:  824d850c-03e0-43ab-a105-2de1c82e7ac4-5d42a1d6-40b2-4a7f-845c-eba0347d4304
  const { trackingId } = req.params;
  // first part contactId and secondpart emails table id
  const segments = trackingId.split('-');
  const reconstructedContactId = segments.slice(0, 5).join('-');
  const reconstructedEmailId = segments.slice(5).join('-');
  try {
    await db.insert(emailOpens).values({
      contactId: reconstructedContactId,
      emailId: reconstructedEmailId,
      openedAt: new Date()
    });
    console.log()
  } catch (error) {
    if (error.code) {
      console.log("email already opened")
    } else {
      console.log(error)
    }
  }

  res.writeHead(200, {
    'Content-Type': 'image/gif',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  res.end(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'));

});

// Start the cron jobs
setupEmailQueueCron();
setupEmailSendQueueCron()



export { app }