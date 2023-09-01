const mongoose = require("mongoose");
const env = require(`../environment/${process.env.NODE_ENV}`);

exports.clientPromise = mongoose
  .connect(env.dbUrl)
  .catch((err) => console.log(err));



// const clientPromise = mongoose.connect(process.env.DATABASE_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// module.exports = { clientPromise };
