const mongoose = require("mongoose");
const schema = mongoose.Schema;

const findingSchema = schema(
  {
    reference: { type: String, required: true, unique: true },
    status: { type: String, default: "In Remediation" },
    assignee: { type: String, default: "" },
    origin: { type: String, default: "" },
    title: { type: String, required: true, default: "" },
    type: { type: String, default: "" },
    description: { type: String, required: true, default: "" },
    severity: { type: String, required: true, default: "" },
    reportedBy: { type: String, default: "" },
    cve: { type: String, default: "None" },
    cvss: { type: String, default: "" },
    createdBy: { type: String, required: true, default: "" },
  },
  {
    timestamps: true, // This will automatically add `createdAt` and `updatedAt` fields
  }
);

const Finding = mongoose.model("finding", findingSchema);

module.exports = Finding;
