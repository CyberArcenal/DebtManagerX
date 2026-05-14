// src/main/ipc/notification/bulk_update.ipc.js
const notificationService = require("../../../../services/Notification");

module.exports = async (params, queryRunner) => {
  const { updatesArray, user = "system" } = params;
  const result = await notificationService.bulkUpdate(updatesArray, user, queryRunner);
  return { status: true, message: "Bulk update completed", data: result };
};