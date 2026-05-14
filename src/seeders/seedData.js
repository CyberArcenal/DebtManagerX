// src/seeders/seedDebtManagerX.js
// DebtManagerX Database Seeder
// Run with: npm run seed:debt -- [options]
// Or: node src/seeders/seedDebtManagerX.js

const { DataSource } = require("typeorm");
const path = require("path");

// Entity imports
const { AuditLog } = require("../entities/AuditLog");
const Borrower = require("../entities/Borrower");
const Debt = require("../entities/Debt");
const LoanAgreement = require("../entities/LoanAgreement");
const Notification = require("../entities/Notification");
const NotificationLog = require("../entities/NotificationLog");
const PaymentTransaction = require("../entities/PaymentTransaction");
const PenaltyTransaction = require("../entities/PenaltyTransaction");

// ========== CONFIGURATION ==========
const DEFAULT_CONFIG = {
  borrowerCount: 25,
  debtCount: 60,
  paymentCount: 120,
  penaltyCount: 30,
  loanAgreementCount: 45,
  notificationCount: 80,
  notificationLogCount: 100,
  auditLogCount: 150,
  clearOnly: false,
  skipBorrowers: false,
  skipDebts: false,
  skipPayments: false,
  skipPenalties: false,
  skipLoanAgreements: false,
  skipNotifications: false,
  skipNotificationLogs: false,
  skipAuditLogs: false,
};

// ========== RANDOM HELPERS ==========
const random = {
  int: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
  float: (min, max, decimals = 2) =>
    +(Math.random() * (max - min) + min).toFixed(decimals),
  date: (start, end) =>
    new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())),
  pastDate: () => random.date(new Date(2023, 0, 1), new Date()),
  futureDate: () => random.date(new Date(), new Date(2026, 11, 31)),
  element: (arr) => arr[Math.floor(Math.random() * arr.length)],
  boolean: (probability = 0.5) => Math.random() < probability,
  
  name: () => {
    const first = [
      "John", "Jane", "Michael", "Sarah", "David", "Maria", "James", "Patricia",
      "Robert", "Jennifer", "William", "Elizabeth", "Joseph", "Linda", "Thomas",
      "Susan", "Charles", "Jessica", "Christopher", "Karen", "Daniel", "Nancy",
      "Matthew", "Lisa", "Anthony", "Betty", "Mark", "Sandra", "Donald", "Ashley"
    ];
    const last = [
      "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
      "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
      "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
      "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson"
    ];
    return `${random.element(first)} ${random.element(last)}`;
  },
  
  email: (name) => {
    const cleanName = name.toLowerCase().replace(/\s/g, ".");
    return `${cleanName}${random.int(1, 99)}@example.com`;
  },
  
  phone: () => `+63${random.int(900000000, 999999999)}`,
  
  address: () => {
    const streets = ["Main St", "Oak Ave", "Maple Dr", "Cedar Ln", "Pine Rd", "Elm Blvd"];
    return `${random.int(100, 9999)} ${random.element(streets)}, ${random.element(["Manila", "Cebu", "Davao", "Makati", "Quezon City"])}`;
  },
  
  status: () => random.element(["active", "paid", "overdue", "defaulted"]),
  
  paymentMethod: () => random.element(["cash", "bank_transfer", "check", "gcash", "paymaya"]),
  
  notificationType: () => random.element(["error", "info", "reminder", "overdue", "payment_confirmation"]),
  
  logStatus: () => random.element(["queued", "sent", "failed", "resend"]),
  
  auditAction: () => random.element(["CREATE", "UPDATE", "DELETE", "VIEW", "LOGIN", "LOGOUT", "EXPORT"]),
  
  auditEntity: () => random.element(["Borrower", "Debt", "PaymentTransaction", "PenaltyTransaction", "LoanAgreement", "Notification", "User"]),
};

// ========== SEEDER CLASS ==========
class DebtManagerXSeeder {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.dataSource = null;
    this.queryRunner = null;
    this.borrowers = [];
    this.debts = [];
  }

  async init() {
    console.log("⏳ Initializing database connection...");
    // Use the existing data source configuration from your project
    const { AppDataSource } = require("../main/db/data-source");
    this.dataSource = await AppDataSource.initialize();
    this.queryRunner = this.dataSource.createQueryRunner();
    console.log("✅ Database connected");
  }

  async destroy() {
    if (this.queryRunner) await this.queryRunner.release();
    if (this.dataSource) await this.dataSource.destroy();
    console.log("🔒 Connection closed");
  }

  async clearData() {
    console.log("🧹 Clearing old debt management data...");
    await this.queryRunner.query("PRAGMA foreign_keys = OFF;");
    try {
      await this.queryRunner.clearTable("audit_logs");
      await this.queryRunner.clearTable("notification_logs");
      await this.queryRunner.clearTable("notifications");
      await this.queryRunner.clearTable("penalty_transactions");
      await this.queryRunner.clearTable("payment_transactions");
      await this.queryRunner.clearTable("loan_agreements");
      await this.queryRunner.clearTable("debts");
      await this.queryRunner.clearTable("borrowers");
    } catch (error) {
      console.warn("Some tables may not exist yet:", error.message);
    } finally {
      await this.queryRunner.query("PRAGMA foreign_keys = ON;");
    }
    console.log("✅ All debt management tables cleared");
  }

  async seedBorrowers() {
    console.log(`👥 Seeding ${this.config.borrowerCount} borrowers...`);
    const borrowers = [];
    for (let i = 0; i < this.config.borrowerCount; i++) {
      const name = random.name();
      borrowers.push({
        name: name,
        contact: random.boolean(0.9) ? random.phone() : null,
        email: random.email(name),
        address: random.boolean(0.7) ? random.address() : null,
        notes: random.boolean(0.3) ? `Initial contact via ${random.element(["phone", "email", "referral"])}` : null,
        deletedAt: random.boolean(0.05) ? random.pastDate() : null,
      });
    }
    const repo = this.dataSource.getRepository(Borrower);
    const saved = await repo.save(borrowers);
    console.log(`✅ ${saved.length} borrowers saved`);
    return saved;
  }

  async seedDebts(borrowers) {
    console.log(`💰 Seeding ${this.config.debtCount} debts...`);
    const debts = [];
    const statuses = ["active", "paid", "overdue", "defaulted"];
    
    for (let i = 0; i < this.config.debtCount; i++) {
      const borrower = random.element(borrowers);
      const totalAmount = random.float(1000, 500000);
      let paidAmount = random.float(0, totalAmount);
      const remainingAmount = totalAmount - paidAmount;
      
      // Determine realistic status based on due date and payment
      const dueDate = random.futureDate();
      let status = random.element(statuses);
      
      // Override status if fully paid
      if (remainingAmount <= 0.01) {
        status = "paid";
        paidAmount = totalAmount;
      } else if (status === "paid" && remainingAmount > 0.01) {
        status = "active";
      }
      
      debts.push({
        name: `${borrower.name} - ${random.element(["Personal Loan", "Business Loan", "Emergency Fund", "Education Loan", "Medical Bill"])}`,
        totalAmount: totalAmount,
        paidAmount: paidAmount,
        remainingAmount: remainingAmount,
        dueDate: dueDate,
        status: status,
        interestRate: random.boolean(0.8) ? random.float(0, 15) : null,
        penaltyRate: random.boolean(0.6) ? random.float(1, 5) : null,
        borrower: { id: borrower.id },
      });
    }
    
    const repo = this.dataSource.getRepository(Debt);
    const saved = await repo.save(debts);
    console.log(`✅ ${saved.length} debts saved`);
    return saved;
  }

  async seedPayments(debts) {
    console.log(`💵 Seeding ${this.config.paymentCount} payment transactions...`);
    const payments = [];
    const repo = this.dataSource.getRepository(PaymentTransaction);
    
    // Track paid amounts per debt to ensure we don't exceed total
    const debtPaidSoFar = new Map();
    debts.forEach(debt => {
      debtPaidSoFar.set(debt.id, parseFloat(debt.paidAmount) || 0);
    });
    
    // First, create payments that match existing paid amounts
    for (const debt of debts) {
      let remainingToPay = parseFloat(debt.paidAmount) || 0;
      let paymentCount = random.int(1, Math.min(5, remainingToPay > 0 ? 3 : 1));
      
      if (remainingToPay === 0) {
        paymentCount = 0;
      }
      
      for (let i = 0; i < paymentCount && remainingToPay > 0.01; i++) {
        let amount;
        if (i === paymentCount - 1) {
          amount = remainingToPay;
        } else {
          amount = random.float(100, remainingToPay * 0.7);
          if (amount > remainingToPay) amount = remainingToPay;
        }
        remainingToPay -= amount;
        
        payments.push({
          amount: amount,
          paymentDate: random.date(new Date(debt.createdAt || new Date(2023, 0, 1)), new Date()),
          reference: `PAY-${random.int(10000, 99999)}`,
          notes: random.boolean(0.3) ? random.element(["Partial payment", "Full settlement", "Advance payment", "Online transfer"]) : null,
          deletedAt: null,
          debt: { id: debt.id },
        });
      }
    }
    
    // Add extra random payments (for debts with remaining balance)
    const extraPaymentsNeeded = this.config.paymentCount - payments.length;
    for (let i = 0; i < extraPaymentsNeeded; i++) {
      const debt = random.element(debts);
      const currentPaid = debtPaidSoFar.get(debt.id) || 0;
      const totalAmount = parseFloat(debt.totalAmount);
      const maxAdditional = totalAmount - currentPaid;
      
      if (maxAdditional > 10) {
        const amount = random.float(50, Math.min(maxAdditional, 50000));
        payments.push({
          amount: amount,
          paymentDate: random.pastDate(),
          reference: `PAY-${random.int(10000, 99999)}`,
          notes: random.boolean(0.3) ? "Additional payment" : null,
          deletedAt: null,
          debt: { id: debt.id },
        });
        debtPaidSoFar.set(debt.id, currentPaid + amount);
        
        // Update debt's paidAmount and remainingAmount
        await repo.manager
          .createQueryBuilder()
          .update(Debt)
          .set({ 
            paidAmount: currentPaid + amount,
            remainingAmount: totalAmount - (currentPaid + amount)
          })
          .where("id = :id", { id: debt.id })
          .execute();
      }
    }
    
    const saved = await repo.save(payments);
    console.log(`✅ ${saved.length} payment transactions saved`);
    return saved;
  }

  async seedPenalties(debts) {
    console.log(`⚠️ Seeding ${this.config.penaltyCount} penalty transactions...`);
    const penalties = [];
    const repo = this.dataSource.getRepository(PenaltyTransaction);
    
    const reasons = [
      "Late payment", "Missed payment deadline", "Overdue interest", 
      "Administrative fee", "Collection fee", "Legal notice fee"
    ];
    
    for (let i = 0; i < this.config.penaltyCount; i++) {
      const debt = random.element(debts);
      const amount = random.float(100, Math.max(500, parseFloat(debt.totalAmount) * 0.05));
      
      penalties.push({
        amount: amount,
        penaltyDate: random.date(new Date(debt.createdAt || new Date(2023, 0, 1)), new Date()),
        reason: random.element(reasons),
        debt: { id: debt.id },
      });
    }
    
    const saved = await repo.save(penalties);
    console.log(`✅ ${saved.length} penalty transactions saved`);
    return saved;
  }

  async seedLoanAgreements(debts) {
    console.log(`📄 Seeding ${this.config.loanAgreementCount} loan agreements...`);
    const agreements = [];
    const repo = this.dataSource.getRepository(LoanAgreement);
    
    for (let i = 0; i < this.config.loanAgreementCount && i < debts.length; i++) {
      const debt = debts[i % debts.length];
      agreements.push({
        agreementDate: random.date(new Date(debt.createdAt || new Date(2023, 0, 1)), debt.dueDate),
        lenderName: random.element([
          "ABC Lending Corp", "FastCash Loans", "MoneyTree Finance", 
          "SecureLoan Inc", "Capital One Bank", "MetroBank", 
          "UnionBank", "BPI Family Savings"
        ]),
        termsText: `This loan agreement is for ${debt.name}. Interest rate: ${debt.interestRate || 0}% per annum. Due date: ${debt.dueDate.toLocaleDateString()}.`,
        filePath: random.boolean(0.7) ? `/documents/agreement_${debt.id}.pdf` : null,
        deletedAt: random.boolean(0.05) ? random.pastDate() : null,
        debt: { id: debt.id },
      });
    }
    
    const saved = await repo.save(agreements);
    console.log(`✅ ${saved.length} loan agreements saved`);
    return saved;
  }

  async seedNotifications(debts) {
    console.log(`🔔 Seeding ${this.config.notificationCount} notifications...`);
    const notifications = [];
    const repo = this.dataSource.getRepository(Notification);
    
    const titles = {
      reminder: ["Payment Reminder", "Upcoming Due Date", "Friendly Reminder"],
      overdue: ["Overdue Payment Alert", "Payment Past Due", "Urgent: Payment Overdue"],
      payment_confirmation: ["Payment Received", "Payment Confirmation", "Thank You for Your Payment"],
      info: ["Account Update", "Interest Rate Change", "Statement Available"],
      error: ["Payment Failed", "Processing Error", "Action Required"]
    };
    
    for (let i = 0; i < this.config.notificationCount; i++) {
      const debt = random.element(debts);
      const type = random.notificationType();
      const title = random.element(titles[type] || titles.info);
      let message = "";
      
      switch (type) {
        case "reminder":
          message = `Your payment of ${random.float(500, 5000)} is due on ${debt.dueDate.toLocaleDateString()}. Remaining balance: ${debt.remainingAmount}`;
          break;
        case "overdue":
          message = `Your payment is now overdue. Please settle ${debt.remainingAmount} immediately to avoid additional penalties.`;
          break;
        case "payment_confirmation":
          message = `We have received your payment of ${random.float(500, 10000)}. Thank you!`;
          break;
        default:
          message = `This is a ${type} notification regarding your loan ${debt.name}.`;
      }
      
      notifications.push({
        title: title,
        message: message,
        type: type,
        isRead: random.boolean(0.3),
        scheduledFor: random.boolean(0.4) ? random.futureDate() : null,
        deletedAt: random.boolean(0.05) ? random.pastDate() : null,
        debt: { id: debt.id },
      });
    }
    
    const saved = await repo.save(notifications);
    console.log(`✅ ${saved.length} notifications saved`);
    return saved;
  }

  async seedNotificationLogs(borrowers) {
    console.log(`📧 Seeding ${this.config.notificationLogCount} notification logs...`);
    const logs = [];
    const repo = this.dataSource.getRepository(NotificationLog);
    
    for (let i = 0; i < this.config.notificationLogCount; i++) {
      const borrower = random.element(borrowers);
      const status = random.logStatus();
      const sentAt = status === "sent" ? random.pastDate() : null;
      const lastErrorAt = status === "failed" ? random.pastDate() : null;
      
      logs.push({
        recipient_email: borrower.email,
        subject: random.element(["Payment Reminder", "Loan Statement", "Overdue Notice", "Payment Confirmation"]),
        payload: JSON.stringify({
          borrowerId: borrower.id,
          templateId: random.int(1, 5),
          metadata: { source: "automated" }
        }),
        status: status,
        error_message: status === "failed" ? random.element(["SMTP timeout", "Invalid email", "Rate limit exceeded"]) : null,
        retry_count: status === "failed" ? random.int(1, 3) : 0,
        resend_count: status === "resend" ? random.int(1, 2) : 0,
        sent_at: sentAt,
        last_error_at: lastErrorAt,
      });
    }
    
    const saved = await repo.save(logs);
    console.log(`✅ ${saved.length} notification logs saved`);
    return saved;
  }

  async seedAuditLogs(borrowers, debts) {
    console.log(`📝 Seeding ${this.config.auditLogCount} audit logs...`);
    const logs = [];
    const repo = this.dataSource.getRepository(AuditLog);
    const users = ["admin", "loan_officer", "collector", "manager", "system"];
    
    for (let i = 0; i < this.config.auditLogCount; i++) {
      const action = random.auditAction();
      const entity = random.auditEntity();
      let entityId = null;
      
      if (entity === "Borrower" && borrowers.length) {
        entityId = random.element(borrowers).id;
      } else if ((entity === "Debt" || entity === "PaymentTransaction" || entity === "PenaltyTransaction") && debts.length) {
        entityId = random.element(debts).id;
      } else {
        entityId = random.int(1, 500);
      }
      
      logs.push({
        action: action,
        entity: entity,
        entityId: entityId,
        oldData: random.boolean(0.2) ? { previousValue: `old_${random.int(100, 999)}` } : null,
        newData: random.boolean(0.3) ? { newValue: `new_${random.int(100, 999)}` } : null,
        timestamp: random.pastDate(),
        user: random.element(users),
      });
    }
    
    const saved = await repo.save(logs);
    console.log(`✅ ${saved.length} audit logs saved`);
    return saved;
  }

  async run() {
    try {
      await this.init();
      await this.queryRunner.startTransaction();

      if (this.config.clearOnly) {
        await this.clearData();
        console.log("🧹 Clear only mode – no seeding performed.");
        await this.queryRunner.commitTransaction();
        return;
      }

      await this.clearData();

      // Seed in order (respecting foreign keys)
      if (!this.config.skipBorrowers) {
        this.borrowers = await this.seedBorrowers();
      } else {
        this.borrowers = await this.dataSource.getRepository(Borrower).find();
      }

      if (!this.config.skipDebts && this.borrowers.length) {
        this.debts = await this.seedDebts(this.borrowers);
      } else {
        this.debts = await this.dataSource.getRepository(Debt).find();
      }

      if (!this.config.skipPayments && this.debts.length) {
        await this.seedPayments(this.debts);
      }

      if (!this.config.skipPenalties && this.debts.length) {
        await this.seedPenalties(this.debts);
      }

      if (!this.config.skipLoanAgreements && this.debts.length) {
        await this.seedLoanAgreements(this.debts);
      }

      if (!this.config.skipNotifications && this.debts.length) {
        await this.seedNotifications(this.debts);
      }

      if (!this.config.skipNotificationLogs && this.borrowers.length) {
        await this.seedNotificationLogs(this.borrowers);
      }

      if (!this.config.skipAuditLogs && (this.borrowers.length || this.debts.length)) {
        await this.seedAuditLogs(this.borrowers, this.debts);
      }

      await this.queryRunner.commitTransaction();

      console.log("\n🎉 DEBTMANAGERX SEED COMPLETED SUCCESSFULLY!");
      console.log(`   Borrowers: ${this.config.borrowerCount}`);
      console.log(`   Debts: ${this.config.debtCount}`);
      console.log(`   Payments: ${this.config.paymentCount}`);
      console.log(`   Penalties: ${this.config.penaltyCount}`);
      console.log(`   Loan Agreements: ${this.config.loanAgreementCount}`);
      console.log(`   Notifications: ${this.config.notificationCount}`);
      console.log(`   Notification Logs: ${this.config.notificationLogCount}`);
      console.log(`   Audit Logs: ${this.config.auditLogCount}`);
    } catch (error) {
      console.error("\n❌ Seeding failed – rolling back...", error);
      if (this.queryRunner) await this.queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await this.destroy();
    }
  }
}

// ========== COMMAND LINE HANDLER ==========
function parseArgs() {
  const args = process.argv.slice(2);
  const config = { ...DEFAULT_CONFIG };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--clear-only":
        config.clearOnly = true;
        break;
      case "--borrowers":
        config.skipBorrowers = false;
        config.borrowerCount = parseInt(args[++i]) || DEFAULT_CONFIG.borrowerCount;
        break;
      case "--debts":
        config.skipDebts = false;
        config.debtCount = parseInt(args[++i]) || DEFAULT_CONFIG.debtCount;
        break;
      case "--payments":
        config.skipPayments = false;
        config.paymentCount = parseInt(args[++i]) || DEFAULT_CONFIG.paymentCount;
        break;
      case "--penalties":
        config.skipPenalties = false;
        config.penaltyCount = parseInt(args[++i]) || DEFAULT_CONFIG.penaltyCount;
        break;
      case "--agreements":
        config.skipLoanAgreements = false;
        config.loanAgreementCount = parseInt(args[++i]) || DEFAULT_CONFIG.loanAgreementCount;
        break;
      case "--notifications":
        config.skipNotifications = false;
        config.notificationCount = parseInt(args[++i]) || DEFAULT_CONFIG.notificationCount;
        break;
      case "--logs":
        config.skipNotificationLogs = false;
        config.notificationLogCount = parseInt(args[++i]) || DEFAULT_CONFIG.notificationLogCount;
        break;
      case "--audit":
        config.skipAuditLogs = false;
        config.auditLogCount = parseInt(args[++i]) || DEFAULT_CONFIG.auditLogCount;
        break;
      case "--skip-borrowers":
        config.skipBorrowers = true;
        break;
      case "--skip-debts":
        config.skipDebts = true;
        break;
      case "--skip-payments":
        config.skipPayments = true;
        break;
      case "--skip-penalties":
        config.skipPenalties = true;
        break;
      case "--skip-agreements":
        config.skipLoanAgreements = true;
        break;
      case "--skip-notifications":
        config.skipNotifications = true;
        break;
      case "--skip-logs":
        config.skipNotificationLogs = true;
        break;
      case "--skip-audit":
        config.skipAuditLogs = true;
        break;
      case "--help":
        console.log(`
DebtManagerX Database Seeder

Usage: node src/seeders/seedDebtManagerX.js [options]

Options:
  --clear-only              Clear all data without seeding
  --borrowers <n>           Number of borrowers (default: 25)
  --debts <n>               Number of debts (default: 60)
  --payments <n>            Number of payment transactions (default: 120)
  --penalties <n>           Number of penalty transactions (default: 30)
  --agreements <n>          Number of loan agreements (default: 45)
  --notifications <n>       Number of notifications (default: 80)
  --logs <n>                Number of notification logs (default: 100)
  --audit <n>               Number of audit logs (default: 150)

Skip options:
  --skip-borrowers          Skip seeding borrowers
  --skip-debts              Skip seeding debts
  --skip-payments           Skip seeding payments
  --skip-penalties          Skip seeding penalties
  --skip-agreements         Skip seeding loan agreements
  --skip-notifications      Skip seeding notifications
  --skip-logs               Skip seeding notification logs
  --skip-audit              Skip seeding audit logs

Examples:
  node src/seeders/seedDebtManagerX.js --borrowers 50 --debts 100
  node src/seeders/seedDebtManagerX.js --clear-only
  node src/seeders/seedDebtManagerX.js --skip-notifications --logs 50
`);
        process.exit(0);
    }
  }
  return config;
}

// Run if called directly
if (require.main === module) {
  const config = parseArgs();
  const seeder = new DebtManagerXSeeder(config);
  seeder.run().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}

module.exports = { DebtManagerXSeeder, DEFAULT_CONFIG };