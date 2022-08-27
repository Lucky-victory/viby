import { Client } from "redis-om";
import config from "../config";

export const client = (async () =>
  await new Client().open(config.redis_db_url))();
