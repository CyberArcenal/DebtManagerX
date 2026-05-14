// src/main/ipc/notification/bulk_create.ipc.js
//@ts-check

const notificationService = require("../../../../services/Notification");

module.exports = async (params, queryRunner) => {
  const { notificationsArray, user = "system" } = params;
  const result = await notificationService.bulkCreate(notificationsArray, user, queryRunner);
  return { status: true, message: "Bulk create completed", data: result };
};