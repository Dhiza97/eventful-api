import { Worker } from "bullmq";
import redis from "../../config/redis";
import Reminder from "./reminder.model";
import { IUser } from "../users/user.model";
import { IEvent } from "../events/event.model";

new Worker(
  "notifications",
  async (job) => {
    const reminder = await Reminder.findById(job.data.reminderId)
      .populate<{ user: IUser }>("user", "email name")
      .populate<{ event: IEvent }>("event", "title date");

    if (!reminder || reminder.sent) return;

    console.log(`Reminder: ${reminder.event.title} for ${reminder.user.email}`);

    reminder.sent = true;
    await reminder.save();
  },
  { connection: redis },
);
