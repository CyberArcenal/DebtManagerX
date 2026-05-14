// src/main/ipc/notification/mark_read.ipc.js
const notificationService = require("../../../../services/Notification");

module.exports = async (params, queryRunner) => {
  const { id, user = "system" } = params;
  const result = await notificationService.markAsRead(id, user, queryRunner);
  return { status: true, message: "Notification marked as read", data: result };
};