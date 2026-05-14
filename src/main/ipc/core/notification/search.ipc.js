// src/main/ipc/notification/search.ipc.js
const notificationService = require("../../../../services/Notification");

module.exports = async (params) => {
  const { searchTerm, page, limit, type, isRead, debtId } = params;
  const options = {
    search: searchTerm,
    page,
    limit,
    type,
    isRead,
    debtId,
  };
  const notifications = await notificationService.findAll(options);
  return { status: true, message: "Search completed", data: notifications };
};