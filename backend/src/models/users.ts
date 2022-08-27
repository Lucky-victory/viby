import { Entity, Schema, Repository } from "redis-om";

import { client } from "../db";

export interface UsersEntity {
  username: string;
  user_id: string;
  fullname: string;
  email: string;
  password: string;
  status: string;
  profile_picture: string;
  cover_picture: string;
  bio: string;
  friends: string[];
  created_at: string;
}

export class UsersEntity extends Entity {
  async update({
    email,
    fullname,
    cover_picture,
    profile_picture,
    username,
    bio,
  }: Partial<UsersEntity>) {
    this.email = email || this.email;
    this.bio = bio || this.bio;
    this.username = username || this.username;
    this.fullname = fullname || this.fullname;
    this.cover_picture = cover_picture || this.cover_picture;
    this.profile_picture = profile_picture || this.profile_picture;
  }
  async updateCredentials({ password }: Partial<UsersEntity>) {
    this.password = password || this.password;
  }
  isFriend(userId: string) {
    return this.friends.indexOf(userId) !== -1;
  }
}

const UsersSchema = new Schema(UsersEntity, {
  user_id: { type: "string" },
  username: { type: "text", sortable: true },
  fullname: { type: "text", sortable: true },
  email: { type: "string" },
  password: { type: "string", sortable: false },
  profile_picture: { type: "string" },
  cover_picture: { type: "string" },
  created_at: { type: "date", sortable: true },
  bio: { type: "text" },
  status: { type: "string" },
  friends: { type: "string[]" },
});

export const UsersRepo: Promise<Repository<UsersEntity>> = (async () => {
  const repo = await (await client).fetchRepository(UsersSchema);

  await repo.createIndex();
  return repo;
})();
