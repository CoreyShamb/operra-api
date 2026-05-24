import { registerBillingJob } from "./billing.job";
import { registerEmailJob } from "./email.job";
import { registerReminderJob } from "./reminder.job";

export function registerJobs() {
    registerBillingJob();   // every 6 hours — expire stale subscriptions
    registerEmailJob();     // every 24 hours — renewal reminder emails
    registerReminderJob();  // every 1 hour — appointment reminders
}
