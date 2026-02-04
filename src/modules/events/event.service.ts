import Event from "./event.model";
import redis from "../../config/redis";

const ALL_EVENTS_CACHE = "events:all";

export const createEvent = async (payload: any) => {
  const event = await Event.create(payload);

  // Invalidate cache
  await redis.del(ALL_EVENTS_CACHE);

  return event;
};

export const getAllEvents = async () => {
    const cached = await redis.get(ALL_EVENTS_CACHE);
    if (cached) {
        return JSON.parse(cached);
    }

    const events = await Event.find().populate('creator', 'name');
    await redis.set(ALL_EVENTS_CACHE, JSON.stringify(events), "EX", 300);

    return events;
};

export const getCreatorEvents = async (creatorId: string) => {
    return Event.find({ creator: creatorId})
}