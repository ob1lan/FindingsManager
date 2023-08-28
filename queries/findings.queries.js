const Finding = require("../database/models/finding.model");

exports.getFindings = () => {
  return Finding.find({}).exec();
};

exports.createFinding = async (finding) => {
  try {
    const newFinding = new Finding(finding);
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

exports.getSeverityData = async () => {
  try {
    const findings = await Finding.find().exec();
    const severityCounts = findings.reduce((acc, finding) => {
      acc[finding.severity] = (acc[finding.severity] || 0) + 1;
      return acc;
    }, {});
    return severityCounts;
  } catch (error) {
    throw error;
  }
};

exports.getCountBySeverity = async () => {
  return await Finding.aggregate([
    {
      $group: {
        _id: "$severity",
        count: { $sum: 1 },
      },
    },
  ]);
};

exports.getCountByStatus = () => {
  return Finding.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]).exec();
};

exports.getFindingsByProjectReference = (projectReference) => {
  return Finding.find({ project: projectReference }).exec();
};
