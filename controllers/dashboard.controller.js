const { getCountBySeverity, getCountByStatus } = require("../queries/findings.queries");

exports.getDashboard = async (req, res, next) => {
  try {
    const severityCounts = await getCountBySeverity();
    const statusCounts = await getCountByStatus();
    const sortedStatusData = sortStatusData(statusCounts);
    const sortedData = sortSeverityData(severityCounts);
    res.render("dashboard/dashboard", {
      sortedData,
      sortedStatusData,
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

function sortSeverityData(data) {
  const order = ["Critical", "High", "Medium", "Low", "Info"];
  const sorted = order.map((severity) => {
    const item = data.find((d) => d._id === severity) || { count: 0 };
    return item.count;
  });
  return sorted;
}

function sortStatusData(data) {
  const order = ["In Remediation", "Remediated", "Declined", "Accepted"];
  const sorted = order.map((status) => {
    const item = data.find((d) => d._id === status) || { count: 0 };
    return item.count;
  });
  return sorted;
}