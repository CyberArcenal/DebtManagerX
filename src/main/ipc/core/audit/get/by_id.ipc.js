// src/main/ipc/audit/get/by_id.ipc.js
const { AuditLog } = require("../../../../../entities/AuditLog");
const { AppDataSource } = require("../../../../db/data-source");

module.exports = async (params) => {
  const { id } = params;
  const repo = AppDataSource.getRepository(AuditLog);
  const item = await repo.findOne({ where: { id } });
  if (!item) {
    return { status: false, message: `Audit log with id ${id} not found`, data: null };
  }
  return { status: true, message: "Audit log retrieved", data: item };
};