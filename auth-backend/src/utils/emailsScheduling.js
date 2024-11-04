import { v4 as uuidv4 } from 'uuid';
import { emails, emailConditions, emailQueue, emailSendQueue, emailOpens, contacts, campaignContact } from "../db/schema.js"
import { addHours, addMinutes } from 'date-fns';
import { db } from '../db/index.js';
import { eq, inArray } from 'drizzle-orm';
// import { sendEmail } from './email-service';

// Email Sequence Creation
async function createEmailSequence(campaignId, emailSequence) {
    const allConditionEmails = []
    for (const email of emailSequence) {
        await db.insert(emails).values({
            id: email.id,
            campaignId,
            templateId: email.templateId,
            delayHours: email.delayHours,
            parentEmailId: email.parentEmailId || null,
            hasCondition: !!email.condition,
        });

        if (email.condition) {
            console.log(email.condition)
            allConditionEmails.push({
                id: uuidv4(),
                emailId: email.id,
                conditionType: email.condition.type,
                trueEmailId: email.condition.trueBranch?.emailId,
                falseEmailId: email.condition.falseBranch?.emailId,
                trueDelayHours: email.condition.trueBranch?.delayHours,
                falseDelayHours: email.condition.falseBranch?.delayHours,
            });
        }
    }
    for (const conditionEmail of allConditionEmails) {
        await db.insert(emailConditions).values(conditionEmail);
    }
}

// Email Scheduling
async function scheduleInitialEmails(emailSequence, campaignId, contactIds) {
    for (const contactId of contactIds) {
        for (const email of emailSequence) {
            if (email.parentEmailId == null) {
                const scheduledTime = addMinutes(new Date(), email.delayHours);
                await db.insert(emailQueue).values({
                    id: uuidv4(),
                    contactId,
                    emailId: email.id,
                    scheduledTime,
                    status: 'pending',
                });
            }
        }
    }
}

async function getContactsForCampaign(campaignId) {
    const campaignContactsResult = await db.select().from(campaignContact).where(eq(campaignContact.campaignId, campaignId));

    const contactIds = campaignContactsResult.map(cc => cc.contactId);
    const contactsResult = await db.select().from(contacts).where(inArray(contacts.id, contactIds));
    return contactsResult;
}

// Conditional Email Logic
async function processConditionalEmail(emailId, contactId) {
    const condition = await db.select().from(emailConditions).where({ emailId });
    if (condition) {
        const emailOpensCount = await db.select().where({ contactId, emailId: condition.trueEmailId }).from(emailOpens).count();
        if (emailOpensCount > 0) {
            // Move to true branch
            await db.insert(emailQueue).values({
                id: uuidv4(),
                contactId,
                emailId: condition.trueEmailId,
                scheduledTime: new Date(new Date().getTime() + (condition.trueDelayHours * 60 * 60 * 1000)),
                status: 'pending',
            });
        } else {
            // Move to false branch
            await db.insert(emailQueue).values({
                id: uuidv4(),
                contactId,
                emailId: condition.falseEmailId,
                scheduledTime: new Date(new Date().getTime() + (condition.falseDelayHours * 60 * 60 * 1000)),
                status: 'pending',
            });
        }
    }
}

// Email Sending
async function processSendQueue() {
    const pendingEmails = await db.select().from(emailQueue).where({ status: 'pending', scheduledTime: { lte: new Date() } });
    for (const email of pendingEmails) {
        await db.update(emailQueue).set({ status: 'processing' }).where({ id: email.id });
        await db.insert(emailSendQueue).values({
            id: uuidv4(),
            contactId: email.contactId,
            emailId: email.emailId,
            sendTime: new Date(),
            status: 'pending',
        });
        // await sendEmail(email.contactId, email.emailId);
        // await emailQueue.delete().where({ id: email.id });
    }
}

// Email Tracking
async function logEmailOpen(contactId, emailId) {
    await db.insert(emailOpens).values({
        id: uuidv4(),
        contactId,
        emailId,
        openedAt: new Date(),
    });
}



async function scheduleEmailSending(campaignId) {
    await processSendQueue(campaignId);
}

export {
    processConditionalEmail,
    logEmailOpen,
    processSendQueue,
    scheduleInitialEmails,
    createEmailSequence,
    scheduleEmailSending,
    getContactsForCampaign
}