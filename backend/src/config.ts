import dotenv from "dotenv";
dotenv.config();
const { REDIS_DB_URL, JWT_SECRET, JWT_EXPIRATION = "1h" } = process.env;

const config = {
  redis_db_url: REDIS_DB_URL,
  jwt_secret: JWT_SECRET,
  jwt_expiration: JWT_EXPIRATION,
};
export default config;
