// src/main/ipc/notification/permanent_delete.ipc.js
const notificationService = require("../../../../services/Notification");

module.exports = async (params, queryRunner) => {
  const { id, user = "system" } = params;
  await notificationService.permanentlyDelete(id, user, queryRunner);
  return { status: true, message: "Notification permanently deleted", data: null };
};