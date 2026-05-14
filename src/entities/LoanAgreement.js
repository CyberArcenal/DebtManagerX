const { EntitySchema } = require("typeorm");

const LoanAgreement = new EntitySchema({
  name: "LoanAgreement",
  tableName: "loan_agreements",
  columns: {
    id: { type: Number, primary: true, generated: true },
    agreementDate: { type: Date, nullable: true },
    lenderName: { type: String, nullable: true },
    termsText: { type: "text", nullable: true },
    filePath: { type: String, nullable: true },
    deletedAt: { type: Date, nullable: true },
  },
  relations: {
    debt: {
      target: "Debt",
      type: "many-to-one",
      joinColumn: true,
      inverseSide: "agreements",
      onDelete: "CASCADE",
    },
  },
});

module.exports = LoanAgreement;