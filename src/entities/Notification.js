const { EntitySchema } = require("typeorm");

const Notification = new EntitySchema({
  name: "Notification",
  tableName: "notifications",
  columns: {
    id: { type: Number, primary: true, generated: true },
    title: { type: String },
    message: { type: "text" },
    type: { type: String, default: "reminder", enum: ["error", "info", "reminder", "overdue", "payment_confirmation"] },
    isRead: { type: Boolean, default: false },
    scheduledFor: { type: Date, nullable: true },
    deletedAt: { type: Date, nullable: true },
    createdAt: { type: Date, createDate: true },
  },
  relations: {
    debt: {
      target: "Debt",
      type: "many-to-one",
      joinColumn: { name: "debtId" },
      inverseSide: "notifications",
      nullable: true,
      onDelete: "SET NULL",
    },
  },
});

module.exports = Notification;