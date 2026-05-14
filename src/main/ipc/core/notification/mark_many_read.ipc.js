// src/main/ipc/notification/mark_many_read.ipc.js
const notificationService = require("../../../../services/Notification");

module.exports = async (params, queryRunner) => {
  const { ids, user = "system" } = params;
  const result = await notificationService.markManyAsRead(ids, user, queryRunner);
  return { status: true, message: "Notifications marked as read", data: result };
};