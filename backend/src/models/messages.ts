import { Entity, Schema, Repository, Client } from "redis-om";

import { redis } from "../db";

export interface MessagesEntity {
  user_id: string;
  content: string;
  attachments: string[];
  type: string;
  message_id: string;
  room_id: string;
  channel_id: string;
  status: string;
  created_at: string;
}

export class MessagesEntity extends Entity {
  get messageOwner() {
    return this.user_id;
  }
}

const MessagesSchema = new Schema(MessagesEntity, {
  user_id: { type: "string" },
  content: { type: "text", sortable: true },
  attachments: { type: "string[]" },
  type: { type: "string" },
  message_id: { type: "string" },
  room_id: { type: "string" },
  channel_id: { type: "string" },
  status: { type: "string" },
  created_at: { type: "date", sortable: true },
});

export const MessagesRepo:Promise<Repository<MessagesEntity>> = (async () => {
  const clientOM = await new Client().use(redis);
  return clientOM.fetchRepository(MessagesSchema);
})();
