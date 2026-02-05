import { notificationQueue } from "./notification.queue";
import Reminder from "./reminder.model";

export const scheduleReminder = async (
    userId: string,
    eventId: string,
    remindAt: Date
) => {
    const reminder = await Reminder.create({
        user: userId,
        event: eventId,
        remindAt,
    })

    const delay = remindAt.getTime() - Date.now();

    if (delay > 0) {
        await notificationQueue.add(
            "sendReminder",
            { reminderId: reminder._id },
            { delay }
        )
    }

    return reminder;
}