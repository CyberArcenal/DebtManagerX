// src/main/ipc/notification/get/by_id.ipc.js
const notificationService = require("../../../../../services/Notification");

module.exports = async (params) => {
  const { id, includeDeleted = false } = params;
  const notification = await notificationService.findById(id, includeDeleted);
  return { status: true, message: "Notification retrieved", data: notification };
};