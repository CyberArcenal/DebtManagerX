// src/main/ipc/notification/create.ipc.js
const notificationService = require("../../../../services/Notification");

module.exports = async (params, queryRunner) => {
  const { data, user = "system" } = params;
  const result = await notificationService.create(data, user, queryRunner);
  return { status: true, message: "Notification created", data: result };
};