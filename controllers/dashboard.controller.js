const {
  getFindings,
  getCountBySeverity,
  getCountByStatus,
  getCountByProject,
  getCountByOrigin,
  getFindingsCountByDate,
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
    const countFindingsMetOrOverdue = async () => {
      try {
        const findings = await getFindings();
        const currentDate = new Date();
        const findgindsOverdue = findings.filter(
          (finding) => finding.dueDate <= currentDate
        );
        const numberOfFindingsOverdue = findgindsOverdue.length;
        return numberOfFindingsOverdue;
      } catch (error) {
        console.error("Error fetching or processing findings:", error);
      }
    };
    const numberOfFindingsOverdue = await countFindingsMetOrOverdue();

    const countAllFindings = async () => {
      try {
        const findings = await getFindings();
        const numberOfFindings = findings.length;
        return numberOfFindings;
      } catch (error) {
        console.error("Error fetching or processing findings:", error);
      }
    };
    const numberOfFindings = await countAllFindings();

    const countAllOpenFindings = async () => {
      try {
        const findings = await getFindings();
         const findgindsOpen = findings.filter(
           (finding) => finding.status === "In Remediation"
         );
        const numberOfOpenFindings = findgindsOpen.length;
        return numberOfOpenFindings;
      } catch (error) {
        console.error("Error fetching or processing findings:", error);
      }
    };
    const numberOfOpenFindings = await countAllOpenFindings();

    const countAllClosedFindings = async () => {
      try {
        const findings = await getFindings();
        const findgindsClosed = findings.filter(
          (finding) => finding.status != "In Remediation"
        );
        const numberOfClosedFindings = findgindsClosed.length;
        return numberOfClosedFindings;
      } catch (error) {
        console.error("Error fetching or processing findings:", error);
      }
    };
    const numberOfClosedFindings = await countAllClosedFindings();

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