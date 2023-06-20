export default {
  mongoUrl:
    process.env.MONGO_URL || "mongodb://db2User:db2Pass@localhost:27017/db2",
  port: process.env.PORT || 5050,
};
