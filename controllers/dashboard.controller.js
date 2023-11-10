const {
  getFindings,
  getCountBySeverity,
  getCountByStatus,
  getCountByProject,
  getCountByOrigin,
  getFindingsCountByDate,
  getOverdueFindings,
} = require("../queries/findings.queries");

exports.getDashboard = async (req, res, next) => {
  try {
    const severityCounts = await getCountBySeverity();
    const statusCounts = await getCountByStatus();
    const sortedStatusData = sortStatusData(statusCounts);
    const sortedData = sortSeverityData(severityCounts);
    const findingsByProject = await getCountByProject();
    const findingsByOrigin = await getCountByOrigin();
    const findingsByDate7 = await getFindingsCountByDate(7);
    const findingsByDate30 = await getFindingsCountByDate(30);
    const allFindings = await getFindings();
    const numberOfFindings = allFindings.length;
    const numberOfOpenFindings = (allFindings.filter((finding) => finding.status === "In Remediation")).length;
    const numberOfClosedFindings = (allFindings.filter((finding) => finding.status != "In Remediation")).length;
    const numberOfFindingsOverdue = (await getOverdueFindings()).length;

    res.render("dashboard/dashboard", {
      sortedData,
      sortedStatusData,
      findingsByProject,
      findingsByOrigin,
      findingsByDate7,
      findingsByDate30,
      numberOfFindings,
      numberOfOpenFindings,
      numberOfClosedFindings,
      numberOfFindingsOverdue,
      isAuthenticated: req.isAuthenticated(),
      is2FAVerified: req.session.is2FAVerified,
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

function sortProjectData(data) {
  const order = ["In Remediation", "Remediated", "Declined", "Accepted"];
  const sorted = order.map((status) => {
    const item = data.find((d) => d._id === status) || { count: 0 };
    return item.count;
  });
  return sorted;
}