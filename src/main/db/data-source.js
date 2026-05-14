// src/main/db/data-source.js
//@ts-check
const fs = require("fs");
const path = require("path");
const { DataSource } = require("typeorm");
const { getDatabaseConfig } = require("./database");

// Import Entity constants
const LicenseCache = require("../../entities/LicenseCache");
const { SystemSetting } = require("../../entities/systemSettings");

const NotificationLog = require("../../entities/NotificationLog");
const Notification = require("../../entities/Notification");
const Borrower = require("../../entities/Borrower");
const Debt = require("../../entities/Debt");
const LoanAgreement = require("../../entities/LoanAgreement");
const PaymentTransaction = require("../../entities/PaymentTransaction");
const PenaltyTransaction = require("../../entities/PenaltyTransaction");
const { AuditLog } = require("../../entities/AuditLog");

const config = getDatabaseConfig();

const entities = [
  AuditLog,
  Borrower,
  Debt,
  LoanAgreement,
  PaymentTransaction,
  PenaltyTransaction,
  LicenseCache,
  SystemSetting,
  NotificationLog,
  Notification,
];

const dataSourceOptions = {
  ...config,
  entities,
  migrations: Array.isArray(config.migrations)
    ? config.migrations
    : [config.migrations],
};

// @ts-ignore
const AppDataSource = new DataSource(dataSourceOptions);

module.exports = { AppDataSource };
