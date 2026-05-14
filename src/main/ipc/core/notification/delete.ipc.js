// src/main/ipc/notification/delete.ipc.js
const notificationService = require("../../../../services/Notification");

module.exports = async (params, queryRunner) => {
  const { id, user = "system" } = params;
  const result = await notificationService.delete(id, user, queryRunner);
  return { status: true, message: "Notification soft deleted", data: result };
};