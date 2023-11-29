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
      enum: ["WAPT", "MAPT", "NVA", "BBP"],
      default: "WAPT",
    },
    description: { type: String, default: "" },
    scope: { type: String, default: "" },
    environment: {
      type: String,
      required: true,
      enum: [
        "Live",
        "Preprod",
        "UAT",
        "Dev",
        "Staging",
      ],
      default: "Live",
    },
    startDate: { type: Date },
    endDate: { type: Date },
    conductedBy: { type: String, default: "Internal" },
    createdBy: { type: String, required: true },
    members: { type: [String], default: [] },
    closedDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("project", projectSchema);

module.exports = Project;
