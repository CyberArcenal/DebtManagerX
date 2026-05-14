// src/main/ipc/borrower/get/statistics.ipc.js
const borrowerService = require("../../../../../services/Borrower");

module.exports = async () => {
  const stats = await borrowerService.getStatistics();
  return { status: true, message: "Statistics retrieved", data: stats };
};