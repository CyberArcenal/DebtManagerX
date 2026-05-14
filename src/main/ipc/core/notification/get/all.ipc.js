// src/main/ipc/notification/get/all.ipc.js
//@ts-check

const notificationService = require("../../../../../services/Notification");

module.exports = async (params) => {
  const {
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    includeDeleted,
    debtId,
    type,
    isRead,
    scheduledForFrom,
    scheduledForTo,
    createdAtFrom,
    createdAtTo,
  } = params;
  const options = {
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    includeDeleted,
    debtId,
    type,
    isRead,
    scheduledForFrom,
    scheduledForTo,
    createdAtFrom,
    createdAtTo,
  };
  const notifications = await notificationService.findAll(options);
  return { status: true, message: "Notifications retrieved", data: notifications };
};