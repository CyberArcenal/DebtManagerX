const { EntitySchema } = require("typeorm");

const PaymentTransaction = new EntitySchema({
  name: "PaymentTransaction",
  tableName: "payment_transactions",
  columns: {
    id: { type: Number, primary: true, generated: true },
    amount: { type: "decimal", precision: 12, scale: 2 },
    paymentDate: { type: Date },
    reference: { type: String, nullable: true },
    notes: { type: String, nullable: true },
    deletedAt: { type: Date, nullable: true },
    recordedAt: { type: Date, createDate: true },
  },
  relations: {
    debt: {
      target: "Debt",
      type: "many-to-one",
      joinColumn: true,
      inverseSide: "payments",
      onDelete: "CASCADE",
    },
  },
});

module.exports = PaymentTransaction;