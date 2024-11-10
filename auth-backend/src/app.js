import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { v4 as uuidv4 } from "uuid";

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

app.use("/api/users", userRoutes)
app.use("/api/user-email-accounts", emailAccountRoutes)
app.use("/api/campaigns", campaignRoutes)
app.use("/api/email-template", emailTemplateRoutes)
app.use("/api/contacts", contactsRoutes)
app.get('/tracking/:trackingId', async (req, res) => {
  const { trackingId } = req.params;

  await db.insert(emailOpens).values({
    id: uuidv4(),
    trackingId,
    // You'll need to look up the contactId and emailId based on the trackingId
    // Consider adding a separate tracking table to store this mapping
  });

  // Return a 1x1 transparent GIF
  res.writeHead(200, {
    'Content-Type': 'image/gif',
    'Cache-Control': 'no-store'
  });
  res.end(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'));
});

// Start the cron jobs
// setupEmailQueueCron();
// setupEmailSendQueueCron()

// // Handle application shutdown
// process.on('SIGTERM', () => {
//   shutdownEmailQueueCron();
//   // Other cleanup code...
// });


export { app }