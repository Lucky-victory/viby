import {
  IMessageStatus,
  IMessageType,
} from "./../interfaces/message.interface";
import { UsersRepo } from "./users";
import { Entity, Schema, Repository, Client } from "redis-om";

import { redis } from "../db";

export interface MessagesEntity {
  user_id: string;
  content: string;
  attachments: string[];
  type: IMessageType;
  message_id: string;
  room_id: string;
  channel_id: string;
  status: IMessageStatus;
  created_at: string;
}

export class MessagesEntity extends Entity {
  async getMessageOwner() {
    return await (await UsersRepo)
      .search()
      .where("user_id")
      .equal(this.user_id)
      .returnFirst();
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

export const MessagesRepo: Promise<Repository<MessagesEntity>> = (async () => {
  const clientOM = await new Client().use(redis);
  const repo = clientOM.fetchRepository(MessagesSchema);
  await repo.createIndex();
  return repo;
})();
