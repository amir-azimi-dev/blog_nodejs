module.exports = () => {
    const RedisStore = require("connect-redis").default;
    const { createClient } = require("redis");

    // Initialize client.
    let redisClient = createClient();
    redisClient.connect().catch();

    // Initialize store.
    let redisStore = new RedisStore({
        client: redisClient,
        prefix: "myApp:",
    });

    return redisStore;
}