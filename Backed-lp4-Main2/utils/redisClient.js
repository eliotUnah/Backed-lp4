const redis = require("redis");

const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
  password: process.env.REDIS_PASSWORD,
});

redisClient.on("connect", () => {
  console.log("✅ Conectado a Redis Cloud");
});

redisClient.on("error", (err) => {
  console.error("❌ Error con Redis:", err);
});

redisClient.connect();

module.exports = redisClient;
