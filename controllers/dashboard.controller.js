const {
  getSeverityData,
  getCountBySeverity,
} = require("../queries/findings.queries");

exports.getDashboard = async (req, res, next) => {
  try {
    const severityCounts = await getCountBySeverity();
    const sortedData = sortSeverityData(severityCounts);
    res.render("dashboard/dashboard", {
      sortedData,
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
