// src/main/ipc/debt/get/statistics.ipc.js
const debtService = require("../../../../../services/Debt");

module.exports = async () => {
  const stats = await debtService.getStatistics();
  return { status: true, message: "Statistics retrieved", data: stats };
};