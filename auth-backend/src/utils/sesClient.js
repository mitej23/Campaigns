import { SESClient } from "@aws-sdk/client-ses";

const REGION = "eu-north-1";
const sesClient = new SESClient({
    region: REGION,
    credentials: {
        accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY
    }
});

export { sesClient };