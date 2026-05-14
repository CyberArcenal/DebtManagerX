// src/main/ipc/notification/get/unread_count.ipc.js
const notificationService = require("../../../../../services/Notification");

module.exports = async (params) => {
  const { debtId, type, includeDeleted = false } = params;
  const count = await notificationService.getUnreadCount({ debtId, type }, includeDeleted);
  return { status: true, message: "Unread count retrieved", data: { count } };
};