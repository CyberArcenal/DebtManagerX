// components/DebtDashboard.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HandCoins,
  Users,
  AlertTriangle,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  Plus,
  ArrowUp,
  ArrowDown,
  BarChart3,
  Target,
  Landmark,
  Receipt,
  FileText,
  Activity,
  PieChart,
  Building2,
  UserCheck,
  Percent,
  Wallet,
  Bell,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

interface DebtDashboardData {
  // Overview
  totalOutstanding: number;
  overdueAmount: number;
  collectionRate: number;
  activeDebtors: number;
  // Period metrics
  currentPeriod: {
    collected: number;
    expected: number;
    newDebts: number;
    newDebtors: number;
  };
  // Trends
  collectionTrend: Array<{ date: string; amount: number }>;
  agingBuckets: {
    current: { amount: number; percentage: number };
    days30: { amount: number; percentage: number };
    days60: { amount: number; percentage: number };
    days90plus: { amount: number; percentage: number };
  };
  // Top debtors
  topDebtors: Array<{ id: number; name: string; outstanding: number; daysOverdue: number }>;
  // Recent activities
  recentActivities: Array<{
    id: number;
    action: string;
    entity: string;
    entityId: number;
    user: string;
    timestamp: string;
    details?: string;
  }>;
  // Stats
  stats: {
    totalBorrowers: number;
    totalDebts: number;
    totalPaidDebts: number;
    totalOverdue: number;
    totalPaymentsCollected: number;
    totalPenaltiesCollected: number;
  };
  // Metadata
  metadata: {
    period: string;
    periodStart: string;
    periodEnd: string;
    generatedAt: string;
    formulaVersion: string;
  };
}

const DebtDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DebtDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data – replace with actual API calls to your backend
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      // In a real implementation, you would call your debt API:
      // const data = await debtAPI.getDashboardData();
      // For now, use mock data that matches the structure
      const mockData: DebtDashboardData = {
        totalOutstanding: 125000.00,
        overdueAmount: 32500.00,
        collectionRate: 74.5,
        activeDebtors: 42,
        currentPeriod: {
          collected: 28450.00,
          expected: 42000.00,
          newDebts: 8,
          newDebtors: 5,
        },
        collectionTrend: [
          { date: "2025-05-01", amount: 3200 },
          { date: "2025-05-02", amount: 4100 },
          { date: "2025-05-03", amount: 2800 },
          { date: "2025-05-04", amount: 5300 },
          { date: "2025-05-05", amount: 4700 },
          { date: "2025-05-06", amount: 6200 },
          { date: "2025-05-07", amount: 5150 },
        ],
        agingBuckets: {
          current: { amount: 42500, percentage: 34 },
          days30: { amount: 38000, percentage: 30.4 },
          days60: { amount: 24500, percentage: 19.6 },
          days90plus: { amount: 20000, percentage: 16 },
        },
        topDebtors: [
          { id: 1, name: "Juan Dela Cruz", outstanding: 15500, daysOverdue: 45 },
          { id: 2, name: "Maria Santos", outstanding: 12300, daysOverdue: 0 },
          { id: 3, name: "Pedro Reyes", outstanding: 9800, daysOverdue: 12 },
          { id: 4, name: "Ana Lopez", outstanding: 8700, daysOverdue: 3 },
        ],
        recentActivities: [
          { id: 101, action: "Payment Received", entity: "Debt", entityId: 203, user: "Cashier", timestamp: new Date().toISOString(), details: "₱5,000 from Juan Dela Cruz" },
          { id: 102, action: "New Loan", entity: "Debt", entityId: 204, user: "Admin", timestamp: new Date(Date.now() - 3600000).toISOString(), details: "₱12,000 to Maria Santos" },
          { id: 103, action: "Overdue Notice", entity: "Debt", entityId: 205, user: "System", timestamp: new Date(Date.now() - 7200000).toISOString(), details: "Sent to Pedro Reyes" },
          { id: 104, action: "Collection Rate Updated", entity: "Report", entityId: 0, user: "System", timestamp: new Date(Date.now() - 86400000).toISOString(), details: "Weekly collection rate: 74.5%" },
        ],
        stats: {
          totalBorrowers: 87,
          totalDebts: 124,
          totalPaidDebts: 36,
          totalOverdue: 28,
          totalPaymentsCollected: 284500,
          totalPenaltiesCollected: 12500,
        },
        metadata: {
          period: "month",
          periodStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
          periodEnd: new Date().toISOString(),
          generatedAt: new Date().toISOString(),
          formulaVersion: "2.0",
        },
      };
      setDashboardData(mockData);
    } catch (err: any) {
      setError(err.message);
      console.error("Failed to fetch debt dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Navigation helpers
  const navigateToDebtors = () => navigate("/debtors/list");
  const navigateToActiveLoans = () => navigate("/loans/active");
  const navigateToOverdue = () => navigate("/loans/overdue");
  const navigateToPayments = () => navigate("/payments/transactions");
  const navigateToReports = () => navigate("/reports/collection");
  const navigateToAging = () => navigate("/reports/aging");
  const navigateToTopDebtors = () => navigate("/debtors/list");

  // Quick actions
  const quickActions = [
    { label: "Debtors", path: "/debtors/list", icon: Users, color: "blue" },
    { label: "New Loan", path: "/loans/applications", icon: Plus, color: "green" },
    { label: "Record Payment", path: "/payments/transactions", icon: Wallet, color: "orange" },
    { label: "Reports", path: "/reports/collection", icon: FileText, color: "purple" },
  ];

  if (loading) {
    return (
      <div className="compact-card rounded-lg" style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
        <div className="flex justify-center items-center h-48">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto mb-3" style={{ borderColor: "var(--primary-color)" }}></div>
            <p className="text-sm" style={{ color: "var(--sidebar-text)" }}>Loading debt dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="compact-card rounded-lg" style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
        <div className="text-center p-6" style={{ color: "var(--danger-color)" }}>
          <AlertTriangle className="w-12 h-12 mx-auto mb-3" />
          <p className="text-base font-semibold mb-1">Error Loading Dashboard</p>
          <p className="text-sm mb-3">{error}</p>
          <button onClick={fetchDashboardData} className="btn btn-primary btn-sm rounded-md flex items-center mx-auto">
            <RefreshCw className="icon-sm mr-1" /> Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const {
    totalOutstanding,
    overdueAmount,
    collectionRate,
    activeDebtors,
    currentPeriod,
    agingBuckets,
    topDebtors,
    recentActivities,
    stats,
    metadata,
  } = dashboardData;

  const getTrendColor = (value: number) => (value > 0 ? "var(--accent-green)" : value < 0 ? "var(--accent-red)" : "var(--text-secondary)");
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid": return "var(--accent-green)";
      case "overdue": return "var(--accent-red)";
      case "partial": return "var(--accent-amber)";
      default: return "var(--text-secondary)";
    }
  };

  return (
    <div className="space-y-4 transition-all duration-300 ease-in-out">
      {/* Header */}
      <div className="compact-card rounded-lg" style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
        <div className="flex justify-between items-center p-4">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-1.5" style={{ color: "var(--sidebar-text)" }}>
              <div className="w-1.5 h-5 rounded-full" style={{ backgroundColor: "var(--primary-color)" }}></div>
              Debt Management Dashboard
            </h2>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Overview - {metadata.period} 
              <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full" style={{ background: "var(--card-secondary-bg)", color: "var(--primary-color)" }}>
                {new Date(metadata.periodStart).toLocaleDateString()} - {new Date(metadata.periodEnd).toLocaleDateString()}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleRefresh} disabled={refreshing} className="btn btn-secondary btn-sm rounded-md flex items-center">
              <RefreshCw className={`icon-sm mr-1 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
            <div className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--card-secondary-bg)", color: "var(--text-secondary)" }}>
              <Clock className="inline-block w-2.5 h-2.5 mr-0.5" />
              {new Date(metadata.generatedAt).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action, idx) => {
          const Icon = action.icon;
          const colorMap = { blue: "var(--accent-blue)", green: "var(--accent-green)", orange: "var(--accent-orange)", purple: "var(--accent-purple)" };
          const bgColor = colorMap[action.color as keyof typeof colorMap] || "var(--primary-color)";
          return (
            <Link key={idx} to={action.path} className="compact-card rounded-lg p-4 flex flex-col items-center justify-center transition-transform hover:scale-105 group" style={{ background: bgColor, border: "1px solid transparent" }}>
              <Icon className="icon-lg mb-2 text-white" />
              <span className="text-xs font-medium text-white">{action.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Outstanding */}
        <div className="compact-card rounded-lg p-4 hover:shadow-md group" style={{ background: "var(--card-secondary-bg)", border: "1px solid var(--border-color)" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg" style={{ background: "rgba(220,38,38,0.2)" }}>
              <HandCoins className="icon-lg" style={{ color: "var(--primary-color)" }} />
            </div>
            <div className="text-xs font-medium px-1.5 py-0.5 rounded-full" style={{ background: "var(--status-overdue-bg)", color: "var(--status-overdue)" }}>
              Total
            </div>
          </div>
          <h3 className="text-xl font-bold mb-0.5 cursor-pointer hover:underline" style={{ color: "var(--sidebar-text)" }} onClick={navigateToActiveLoans}>
            {formatCurrency(totalOutstanding)}
          </h3>
          <p className="text-xs" style={{ color: "var(--sidebar-text)" }}>Total Outstanding</p>
          <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border-color)" }}>
            <div className="flex justify-between text-xs">
              <span className="cursor-pointer hover:underline" onClick={navigateToActiveLoans} style={{ color: "var(--primary-color)" }}>
                <Eye className="icon-xs inline mr-1" /> View all
              </span>
            </div>
          </div>
        </div>

        {/* Overdue Amount */}
        <div className="compact-card rounded-lg p-4 hover:shadow-md group" style={{ background: "var(--card-secondary-bg)", border: "1px solid var(--border-color)" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg" style={{ background: "rgba(239,68,68,0.2)" }}>
              <AlertTriangle className="icon-lg" style={{ color: "var(--accent-red)" }} />
            </div>
            <div className="text-xs font-medium px-1.5 py-0.5 rounded-full" style={{ background: "var(--status-overdue-bg)", color: "var(--status-overdue)" }}>
              Overdue
            </div>
          </div>
          <h3 className="text-xl font-bold mb-0.5 cursor-pointer hover:underline" style={{ color: "var(--accent-red)" }} onClick={navigateToOverdue}>
            {formatCurrency(overdueAmount)}
          </h3>
          <p className="text-xs" style={{ color: "var(--sidebar-text)" }}>Overdue Amount</p>
          <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border-color)" }}>
            <div className="flex justify-between text-xs">
              <span className="cursor-pointer hover:underline" onClick={navigateToOverdue} style={{ color: "var(--primary-color)" }}>
                <Eye className="icon-xs inline mr-1" /> View overdue
              </span>
            </div>
          </div>
        </div>

        {/* Collection Rate */}
        <div className="compact-card rounded-lg p-4 hover:shadow-md group" style={{ background: "var(--card-secondary-bg)", border: "1px solid var(--border-color)" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg" style={{ background: "rgba(16,185,129,0.2)" }}>
              <Percent className="icon-lg" style={{ color: "var(--accent-green)" }} />
            </div>
            <div className={`flex items-center text-xs font-medium px-1.5 py-0.5 rounded-full ${collectionRate >= 70 ? "bg-[var(--status-paid-bg)] text-[var(--status-paid)]" : "bg-[var(--status-partial-bg)] text-[var(--status-partial)]"}`}>
              {collectionRate >= 70 ? <ArrowUp className="icon-xs mr-0.5" /> : <ArrowDown className="icon-xs mr-0.5" />}
              {collectionRate}%
            </div>
          </div>
          <h3 className="text-xl font-bold mb-0.5" style={{ color: "var(--sidebar-text)" }}>{collectionRate}%</h3>
          <p className="text-xs" style={{ color: "var(--sidebar-text)" }}>Collection Rate</p>
          <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border-color)" }}>
            <div className="text-xs">Target: 85%</div>
          </div>
        </div>

        {/* Active Debtors */}
        <div className="compact-card rounded-lg p-4 hover:shadow-md group" style={{ background: "var(--card-secondary-bg)", border: "1px solid var(--border-color)" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg" style={{ background: "rgba(59,130,246,0.2)" }}>
              <Users className="icon-lg" style={{ color: "var(--accent-blue)" }} />
            </div>
            <div className="text-xs font-medium px-1.5 py-0.5 rounded-full" style={{ background: "var(--accent-blue-light)", color: "var(--accent-blue)" }}>
              Active
            </div>
          </div>
          <h3 className="text-xl font-bold mb-0.5 cursor-pointer hover:underline" style={{ color: "var(--sidebar-text)" }} onClick={navigateToDebtors}>
            {activeDebtors}
          </h3>
          <p className="text-xs" style={{ color: "var(--sidebar-text)" }}>Active Debtors</p>
          <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border-color)" }}>
            <div className="text-xs">Total borrowers: {stats.totalBorrowers}</div>
          </div>
        </div>
      </div>

      {/* Current Period Performance */}
      {currentPeriod && (
        <div className="compact-card rounded-lg hover:shadow-md" style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold flex items-center gap-1.5" style={{ color: "var(--sidebar-text)" }}>
                <Calendar className="icon-sm" /> Current Period
                <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: "var(--primary-light)", color: "var(--primary-color)" }}>
                  {new Date(metadata.periodStart).toLocaleDateString()} - {new Date(metadata.periodEnd).toLocaleDateString()}
                </span>
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="text-center p-3 rounded-lg hover:bg-[var(--card-hover-bg)] cursor-pointer" style={{ background: "var(--card-secondary-bg)" }} onClick={navigateToPayments}>
                <Wallet className="w-6 h-6 mx-auto mb-2" style={{ color: "var(--accent-green)" }} />
                <div className="text-lg font-bold" style={{ color: "var(--sidebar-text)" }}>{formatCurrency(currentPeriod.collected)}</div>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>Collected</div>
              </div>
              <div className="text-center p-3 rounded-lg hover:bg-[var(--card-hover-bg)] cursor-pointer" style={{ background: "var(--card-secondary-bg)" }} onClick={navigateToActiveLoans}>
                <Target className="w-6 h-6 mx-auto mb-2" style={{ color: "var(--accent-amber)" }} />
                <div className="text-lg font-bold" style={{ color: "var(--sidebar-text)" }}>{formatCurrency(currentPeriod.expected)}</div>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>Expected</div>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ background: "var(--card-secondary-bg)" }}>
                <Plus className="w-6 h-6 mx-auto mb-2" style={{ color: "var(--accent-blue)" }} />
                <div className="text-lg font-bold" style={{ color: "var(--sidebar-text)" }}>{currentPeriod.newDebts}</div>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>New Loans</div>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ background: "var(--card-secondary-bg)" }}>
                <UserCheck className="w-6 h-6 mx-auto mb-2" style={{ color: "var(--accent-purple)" }} />
                <div className="text-lg font-bold" style={{ color: "var(--sidebar-text)" }}>{currentPeriod.newDebtors}</div>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>New Debtors</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Aging Analysis & Top Debtors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Aging Buckets */}
        <div className="compact-card rounded-lg p-4 hover:shadow-md" style={{ background: "var(--card-secondary-bg)", border: "1px solid var(--border-color)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-1.5 cursor-pointer hover:underline" style={{ color: "var(--sidebar-text)" }} onClick={navigateToAging}>
              <PieChart className="icon-sm" /> Aging Analysis
            </h3>
          </div>
          <div className="space-y-2">
            {Object.entries(agingBuckets).map(([key, bucket]) => {
              let label = "";
              if (key === "current") label = "Current (<30d)";
              else if (key === "days30") label = "30-60 days";
              else if (key === "days60") label = "60-90 days";
              else label = "90+ days";
              let color = "var(--accent-green)";
              if (key === "days30") color = "var(--accent-amber)";
              if (key === "days60") color = "var(--accent-orange)";
              if (key === "days90plus") color = "var(--accent-red)";
              return (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></div>
                    <span className="text-xs" style={{ color: "var(--sidebar-text)" }}>{label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium" style={{ color: "var(--sidebar-text)" }}>{formatCurrency(bucket.amount)}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: "var(--card-bg)", color: "var(--text-secondary)" }}>{bucket.percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Debtors */}
        <div className="compact-card rounded-lg p-4 hover:shadow-md" style={{ background: "var(--card-secondary-bg)", border: "1px solid var(--border-color)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-1.5 cursor-pointer hover:underline" style={{ color: "var(--sidebar-text)" }} onClick={navigateToTopDebtors}>
              <Users className="icon-sm" /> Top Debtors
            </h3>
            <div onClick={navigateToTopDebtors} className="text-xs hover:underline cursor-pointer" style={{ color: "var(--primary-color)" }}>View all <ChevronRight className="w-3 h-3 inline" /></div>
          </div>
          <div className="space-y-3">
            {topDebtors.map((debtor) => (
              <div key={debtor.id} className="flex justify-between items-center p-2 rounded-md hover:bg-[var(--card-hover-bg)] cursor-pointer" onClick={() => navigate(`/debtors/view/${debtor.id}`)}>
                <div>
                  <div className="font-medium text-sm" style={{ color: "var(--sidebar-text)" }}>{debtor.name}</div>
                  <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{debtor.daysOverdue > 0 ? `${debtor.daysOverdue} days overdue` : "Current"}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold" style={{ color: debtor.daysOverdue > 0 ? "var(--accent-red)" : "var(--sidebar-text)" }}>{formatCurrency(debtor.outstanding)}</div>
                  <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>outstanding</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="compact-card rounded-lg p-3 text-center" style={{ background: "var(--card-secondary-bg)", border: "1px solid var(--border-color)" }}>
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>Total Debts</div>
          <div className="text-lg font-bold" style={{ color: "var(--sidebar-text)" }}>{stats.totalDebts}</div>
        </div>
        <div className="compact-card rounded-lg p-3 text-center" style={{ background: "var(--card-secondary-bg)", border: "1px solid var(--border-color)" }}>
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>Paid Debts</div>
          <div className="text-lg font-bold" style={{ color: "var(--accent-green)" }}>{stats.totalPaidDebts}</div>
        </div>
        <div className="compact-card rounded-lg p-3 text-center" style={{ background: "var(--card-secondary-bg)", border: "1px solid var(--border-color)" }}>
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>Overdue Count</div>
          <div className="text-lg font-bold" style={{ color: "var(--accent-red)" }}>{stats.totalOverdue}</div>
        </div>
        <div className="compact-card rounded-lg p-3 text-center" style={{ background: "var(--card-secondary-bg)", border: "1px solid var(--border-color)" }}>
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>Penalties Collected</div>
          <div className="text-lg font-bold" style={{ color: "var(--accent-amber)" }}>{formatCurrency(stats.totalPenaltiesCollected)}</div>
        </div>
      </div>

      {/* Recent Activities & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Recent Activities */}
        <div className="compact-card rounded-lg p-4" style={{ background: "var(--card-secondary-bg)", border: "1px solid var(--border-color)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-1.5" style={{ color: "var(--sidebar-text)" }}><Activity className="icon-sm" /> Recent Activities</h3>
            <div onClick={() => navigate("/system/audit")} className="text-xs hover:underline cursor-pointer" style={{ color: "var(--primary-color)" }}>View all <ChevronRight className="w-3 h-3 inline" /></div>
          </div>
          <div className="space-y-3">
            {recentActivities.slice(0, 4).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-[var(--card-hover-bg)] cursor-pointer" onClick={() => navigate(`/audit-logs/view/${activity.id}`)}>
                <div className="relative mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: activity.action.includes("Payment") ? "var(--accent-green)" : activity.action.includes("Overdue") ? "var(--accent-red)" : "var(--primary-color)" }}></div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium" style={{ color: "var(--sidebar-text)" }}>{activity.action}</p>
                    <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>{new Date(activity.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs" style={{ color: "var(--sidebar-text)" }}>{activity.details}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>by {activity.user}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Business Insights */}
        <div className="compact-card rounded-lg p-4" style={{ background: "var(--card-secondary-bg)", border: "1px solid var(--border-color)" }}>
          <h3 className="font-semibold flex items-center gap-1.5 mb-4" style={{ color: "var(--sidebar-text)" }}><Target className="icon-sm" /> Key Insights</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 rounded-md hover:bg-[var(--card-hover-bg)]">
              <span className="text-xs flex items-center gap-1.5" style={{ color: "var(--sidebar-text)" }}><Wallet className="icon-xs" /> Avg. Collection per Debtor</span>
              <span className="text-xs font-medium" style={{ color: "var(--accent-blue)" }}>{formatCurrency(stats.totalPaymentsCollected / activeDebtors)}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-md hover:bg-[var(--card-hover-bg)]">
              <span className="text-xs flex items-center gap-1.5" style={{ color: "var(--sidebar-text)" }}><Percent className="icon-xs" /> Overdue Ratio</span>
              <span className="text-xs font-medium" style={{ color: "var(--accent-red)" }}>{((overdueAmount / totalOutstanding) * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-md hover:bg-[var(--card-hover-bg)]">
              <span className="text-xs flex items-center gap-1.5" style={{ color: "var(--sidebar-text)" }}><TrendingUp className="icon-xs" /> Collection Trend</span>
              <span className="text-xs font-medium" style={{ color: collectionRate > 70 ? "var(--accent-green)" : "var(--accent-amber)" }}>{collectionRate > 70 ? "Healthy" : "Needs attention"}</span>
            </div>
          </div>
          <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border-color)" }}>
            <div className="text-xs text-center" style={{ color: "var(--text-tertiary)" }}>
              Generated: {new Date(metadata.generatedAt).toLocaleString()} | v{metadata.formulaVersion}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebtDashboard;