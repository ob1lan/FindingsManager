const mongoose = require("mongoose");
const schema = mongoose.Schema;

const projectSchema = schema(
  {
    reference: { type: String, required: true, unique: true },
    status: {
      type: String,
      required: true,
      enum: [
        "Open",
        "Closed",
        "Planned",
        "Cancelled",
        "On hold",
        "In progress",
        "Completed",
      ],
      default: "Open",
    },
    title: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["WAPT", "NVA", "BBP"],
      default: "WAPT",
    },
    description: { type: String, default: "" },
    conductedBy: { type: String, default: "Internal" },
    createdBy: { type: String, required: true },
    totalFindings: { type: Number, default: 0 },
    closedDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("project", projectSchema);

module.exports = Project;
