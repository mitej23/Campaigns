import { SendEmailCommand } from "@aws-sdk/client-ses";

export const createSendEmailCommand = (toAddress, fromAddress, subject, content) => {
    return new SendEmailCommand({
        Destination: {
            ToAddresses: [
                toAddress,
            ],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: content,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: subject,
            },
        },
        Source: fromAddress,
    });
};