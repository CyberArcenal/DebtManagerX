// src/main/ipc/notification/export.ipc.js
const notificationService = require("../../../../services/Notification");

module.exports = async (params) => {
  const { format = "json", filters = {}, user = "system" } = params;
  const exportData = await notificationService.exportNotifications(format, filters, user);
  return { status: true, message: "Export completed", data: exportData };
};