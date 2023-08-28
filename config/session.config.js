const app = require("../app");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { clientPromise } = require("../database");

app.use(
  session({
    secret: "MySuperSecret",
    resave: false,
    rolling: true,
    saveUninitialized: false,
    cookie: {
      sameSite: "lax",
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 1, // 1 day
    },
    store: MongoStore.create({
      clientPromise: clientPromise.then((m) => m.connection.getClient()),
      ttl: 60 * 60 * 24 * 1, // 1 day
    }),
  })
);