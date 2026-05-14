const { EntitySchema } = require("typeorm");

const Borrower = new EntitySchema({
  name: "Borrower",
  tableName: "borrowers",
  columns: {
    id: { type: Number, primary: true, generated: true },
    name: { type: String },
    contact: { type: String, nullable: true },
    email: { type: String, nullable: true },
    address: { type: String, nullable: true },
    notes: { type: "text", nullable: true },
    deletedAt: { type: Date, nullable: true },
    createdAt: { type: Date, createDate: true },
    updatedAt: { type: Date, updateDate: true },
  },
  relations: {
    debts: {
      target: "Debt",
      type: "one-to-many",
      inverseSide: "borrower",
    },
  },
});

module.exports = Borrower;