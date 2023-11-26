const mongoose = require("mongoose");
const schema = mongoose.Schema;

const findingSchema = schema(
  {
    reference: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["In Remediation", "Remediated", "Accepted", "Declined"],
      default: "In Remediation",
    },
    assignee: { type: String, default: "" },
    origin: {
      type: String,
      enum: ["WAPT", "BBP", "NVA"],
      default: "WAPT",
    },
    title: { type: String, required: true, default: "" },
    type: { type: String, default: "" },
    description: { type: String, required: true, default: "" },
    severity: {
      type: String,
      required: true,
      enum: ["Critical", "High", "Medium", "Low", "Info"],
      default: "Info",
    },
    reportedBy: { type: String, default: "" },
    cve: { type: String, default: "None" },
    cvss: { type: String, default: "" },
    createdBy: { type: String, required: true, default: "" },
    project: { type: String, default: "None" },
    dueDate: { type: Date },
    fixedDate: { type: Date },
    attachment: { type: String, default: "" },
  },
  {
    timestamps: true, // This will automatically add `createdAt` and `updatedAt` fields
  }
);

findingSchema.pre("save", function (next) {
  // Only set dueDate if it's a new document and dueDate isn't already set
  if (this.isNew && !this.dueDate) {
    const daysToAdd = {
      Critical: 3,
      High: 14,
      Medium: 90,
      Low: 270,
    };

    const days = daysToAdd[this.severity];
    if (days) {
      this.dueDate = new Date(
        this.createdAt.getTime() + days * 24 * 60 * 60 * 1000
      );
    }
  }
  next();
});

const Finding = mongoose.model("finding", findingSchema);

module.exports = Finding;
