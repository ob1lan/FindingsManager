const Finding = require("../database/models/finding.model");
const moment = require("moment");

exports.getFindings = async () => {
  const findings = await Finding.find({}).lean().exec();

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to midnight for comparison

  findings.forEach((finding) => {
    const dueDate = new Date(finding.dueDate);
    dueDate.setHours(0, 0, 0, 0); // Set time to midnight for comparison

    finding.isOverdue = dueDate <= today;
  });

  return findings;
};

exports.createFinding = async (finding) => {
  try {
    const newFinding = new Finding({ ...finding });
    return newFinding.save();
  } catch (e) {
    throw e;
  }
};

exports.findFindingPerId = async (id) => {
  try {
    return await Finding.findById(id).exec();
  } catch (e) {
    throw e;
  }  
};

exports.updateFinding = async (id, updatedData) => {
  try {
    return await Finding.findByIdAndUpdate(id, {...updatedData}, {
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

exports.getCountByProject = () => {
  return Finding.aggregate([
    {
      $group: {
        _id: "$project",
        count: { $sum: 1 },
      },
    },
  ]).exec();
};

exports.getCountByProduct = () => {
  return Finding.aggregate([
    {
      $group: {
        _id: "$product",
        count: { $sum: 1 },
      },
    },
  ]).exec();
};

exports.getCountByOrigin = () => {
  return Finding.aggregate([
    {
      $group: {
        _id: "$origin",
        count: { $sum: 1 },
      },
    },
  ]).exec();
};

exports.getFindingsCreatedByUsername = async (username) => {
  return Finding.find({ createdBy: username });
};

exports.getFindingsAssignedToUsername = async (username) => {
  return Finding.find({ assignee: username });
};

exports.getFindingsCountByDate = async (createdAt) => {
  return await Finding.countDocuments({
    createdAt: createdAt,
  });
};

exports.getFindingsCountByDate = async (days) => {
  const startDate = moment().subtract(days, "days").toDate();
  const endDate = new Date();

  // MongoDB aggregation to group findings by date and count them
  return await Finding.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
};

exports.getOverdueFindings = async () => {
  try {
    const currentDate = new Date();
    const overdueFindings = await Finding.find({
      dueDate: { $lt: currentDate }, // Select findings where dueDate is less than the current date
      status: { $nin: ["Remediated", "Accepted", "Declined"] }, // Exclude findings with these statuses
    }).exec();

    return overdueFindings;
  } catch (error) {
    console.error("Error fetching overdue findings:", error);
    throw error; // Or handle the error as per your application's error handling policy
  }
};

exports.getFindingsByProduct = (productId) => {
  return Finding.find({ product: productId }).exec();
};

exports.getFindingsByProjectId = (projectId) => {
  return Finding.find({ project: projectId }).exec();
};
