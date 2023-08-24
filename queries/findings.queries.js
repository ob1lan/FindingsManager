const Finding = require("../database/models/finding.model");

exports.getFindings = () => {
  return Finding.find({}).exec();
};

exports.createFinding = async (finding) => {
  try {
    const newFinding = new Finding({
      reference: finding.reference,
      status: finding.status,
      assignee: finding.assignee,
      origin: finding.origin,
      title: finding.title,
      type: finding.type,
      description: finding.description,
      severity: finding.severity,
      reportedBy: finding.reportedBy,
      cve: finding.cve,
      cvss: finding.cvss,
      createdBy: finding.createdBy,
    });
    return newFinding.save();
  } catch (e) {
    throw e;
  }
};

exports.findFindingPerId = (id) => {
  return Finding.findById(id).exec();
};