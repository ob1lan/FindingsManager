const mongoose = require("mongoose");
const schema = mongoose.Schema;

const productSchema = schema(
  {
    reference: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["Live", "Retired", "Under Development"],
      default: "Live",
    },
    description: { type: String, default: "" },
    contacts: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("product", productSchema);

module.exports = Product;
