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

exports.updateFinding = async (id, updatedData) => {
  try {
    return await Finding.findByIdAndUpdate(id, updatedData, {
      new: true,
    }).exec();
  } catch (e) {
    throw e;
  }
};

exports.deleteFinding = async (id) => {
  try {
    return await Finding.findByIdAndDelete(id).exec();
  } catch (e) {
    throw e;
  }
};