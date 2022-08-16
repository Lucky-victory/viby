import { createClient } from "redis";
import config from "../config";

const redis = createClient({
  url: config.redis_db_url,
});

(async () => {
  await redis.connect();
})();
redis.on("error", (err) => {
  console.log(err);
});

export { redis };
