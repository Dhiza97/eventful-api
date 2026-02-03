import redis from "../../config/redis";

const CACHE_KEY = "events:all";

export const getAllEvents = async () => {
  const cachedEvents = await redis.get(CACHE_KEY);

  if (cachedEvents) {
    return JSON.parse(cachedEvents);
  }

  const events = await EventModel.find();

  await redis.set(CACHE_KEY, JSON.stringify(events), "EX", 300); // 5 mins

  return events;
};