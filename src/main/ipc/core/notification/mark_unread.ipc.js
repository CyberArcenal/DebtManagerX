// src/main/ipc/notification/mark_unread.ipc.js
const notificationService = require("../../../../services/Notification");

module.exports = async (params, queryRunner) => {
  const { id, user = "system" } = params;
  const result = await notificationService.markAsUnread(id, user, queryRunner);
  return { status: true, message: "Notification marked as unread", data: result };
};