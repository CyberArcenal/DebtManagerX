// src/main/ipc/notification/get/statistics.ipc.js
const notificationService = require("../../../../../services/Notification");

module.exports = async () => {
  const stats = await notificationService.getStatistics();
  return { status: true, message: "Statistics retrieved", data: stats };
};