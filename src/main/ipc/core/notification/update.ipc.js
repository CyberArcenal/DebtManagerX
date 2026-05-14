// src/main/ipc/notification/update.ipc.js
const notificationService = require("../../../../services/Notification");

module.exports = async (params, queryRunner) => {
  const { id, data, user = "system" } = params;
  const result = await notificationService.update(id, data, user, queryRunner);
  return { status: true, message: "Notification updated", data: result };
};