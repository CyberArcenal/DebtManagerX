// src/main/ipc/notification/restore.ipc.js
const notificationService = require("../../../../services/Notification");

module.exports = async (params, queryRunner) => {
  const { id, user = "system" } = params;
  const result = await notificationService.restore(id, user, queryRunner);
  return { status: true, message: "Notification restored", data: result };
};