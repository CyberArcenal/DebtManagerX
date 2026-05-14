// TopBar.tsx (Debt Management Version - Fixed notification API usage)
import {
  Menu,
  Search,
  User,
  Plus,
  HandCoins,
  DollarSign,
  Bell,
  Calendar,
  AlertTriangle,
  FileText,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import notificationAPI from "../api/core/notification";
import { NotificationDrawer } from "../components/Shared/NotificationDrawer";
import UpdateNotifier from "../components/Shared/UpdateNotifier";

interface RouteInfo {
  path: string;
  name: string;
  category: string;
}

interface TopBarProps {
  toggleSidebar: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread count (notification API returns number directly)
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        // getUnreadCount returns a number (not an object with status/data)
        const count = await notificationAPI.getUnreadCount();
        setUnreadCount(count);
      } catch (error) {
        console.error("Failed to fetch unread count", error);
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  // Define searchable routes for Debt Management
  const allRoutes: RouteInfo[] = useMemo(
    () => [
      // Dashboard
      { path: "/", name: "Dashboard", category: "Main" },
      { path: "/dashboard", name: "Dashboard", category: "Main" },

      // Debtors
      { path: "/debtors/list", name: "Debtor Directory", category: "Debtors" },
      { path: "/debtors/credit-check", name: "Credit Checks", category: "Debtors" },
      { path: "/debtors/group", name: "Debtor Groups", category: "Debtors" },

      // Loans & Debts
      { path: "/loans/active", name: "Active Loans", category: "Loans" },
      { path: "/loans/overdue", name: "Overdue Accounts", category: "Loans" },
      { path: "/loans/closed", name: "Closed Loans", category: "Loans" },
      { path: "/loans/applications", name: "Loan Applications", category: "Loans" },

      // Payments / Collections
      { path: "/payments/schedule", name: "Payment Schedule", category: "Collections" },
      { path: "/payments/transactions", name: "Transaction Log", category: "Collections" },
      { path: "/payments/methods", name: "Payment Methods", category: "Collections" },
      { path: "/payments/reminders", name: "Reminders", category: "Collections" },

      // Reports
      { path: "/reports/aging", name: "Aging Analysis", category: "Reports" },
      { path: "/reports/collection", name: "Collection Report", category: "Reports" },
      { path: "/reports/debtor-stmt", name: "Debtor Statement", category: "Reports" },
      { path: "/reports/expected", name: "Expected Payments", category: "Reports" },

      // System
      { path: "/system/audit", name: "Audit Trail", category: "System" },
      { path: "/notification-logs", name: "Notification Logs", category: "System" },
      { path: "/devices", name: "Device Manager", category: "System" },
      { path: "/system/settings", name: "System Settings", category: "System" },
    ],
    [],
  );

  // Filter routes based on search query
  const filteredRoutes = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return allRoutes.filter(
      (route) =>
        route.name.toLowerCase().includes(query) ||
        route.path.toLowerCase().includes(query.replace(/\s+/g, "-")) ||
        route.category.toLowerCase().includes(query),
    );
  }, [searchQuery, allRoutes]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredRoutes.length > 0) {
      navigate(filteredRoutes[0].path);
      setSearchQuery("");
      setShowSearchResults(false);
    }
  };

  const handleRouteSelect = (path: string) => {
    navigate(path);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const getRouteIcon = (category: string) => {
    switch (category) {
      case "Main":
        return HandCoins;
      case "Debtors":
        return User;
      case "Loans":
        return HandCoins;
      case "Collections":
        return DollarSign;
      case "Reports":
        return FileText;
      case "System":
        return User;
      default:
        return HandCoins;
    }
  };

  // Today's date
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-40 p-1 bg-gradient-to-r from-[var(--sidebar-bg)] to-[#1a1625] border-b border-[var(--sidebar-border)] flex items-center justify-between shadow-lg">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleSidebar}
          aria-label="Toggle menu"
          className="p-2 rounded-lg hover:bg-[var(--topbar-hover)]/20 text-[var(--sidebar-text)] transition-all duration-200"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo / App Name (Mobile) */}
        <div className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary-color)] to-[#b91c1c] flex items-center justify-center shadow-md">
            <HandCoins className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-semibold text-white">Debt Mgr</span>
        </div>

        {/* Date Display (Desktop) */}
        <div className="hidden md:flex items-center gap-3 ml-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--topbar-search-bg)]/50 border border-[var(--topbar-search-border)]">
            <Calendar className="w-4 h-4 text-[var(--sidebar-text)]" />
            <div className="flex flex-col">
              <div className="text-sm font-medium text-[var(--sidebar-text)]">
                {today.toLocaleDateString("en-US", { weekday: "long" })}
              </div>
              <div className="text-xs text-[var(--text-tertiary)]">
                {formattedDate}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Center Section - Search Bar */}
      <div className="flex-1 max-w-2xl mx-4">
        <div className="relative">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-[var(--text-tertiary)]" />
              </div>
              <input
                type="text"
                placeholder="Search debtors, loans, payments, reports..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                onBlur={() =>
                  setTimeout(() => setShowSearchResults(false), 200)
                }
                className="w-full pl-10 pr-4 py-2.5 border border-[var(--topbar-search-border)] rounded-lg bg-[var(--topbar-search-bg)] text-[var(--sidebar-text)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--topbar-hover)] focus:border-transparent text-sm shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <div className="w-5 h-5 rounded-full bg-[var(--text-tertiary)]/20 flex items-center justify-center">
                    <span className="text-[10px] text-[var(--text-tertiary)]">
                      ×
                    </span>
                  </div>
                </button>
              )}
            </div>
          </form>

          {/* Search Results Dropdown */}
          {showSearchResults && filteredRoutes.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-2xl bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] max-h-80 overflow-auto z-50">
              <div className="p-2 border-b border-[var(--sidebar-border)]">
                <div className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider px-2 py-1">
                  Quick Navigation
                </div>
              </div>
              {filteredRoutes.map((route, index) => {
                const RouteIcon = getRouteIcon(route.category);
                const categoryColor =
                  route.category === "Debtors"
                    ? "var(--accent-blue)"
                    : route.category === "Loans"
                      ? "var(--primary-color)"
                      : route.category === "Collections"
                        ? "var(--accent-green)"
                        : route.category === "Reports"
                          ? "var(--accent-purple)"
                          : route.category === "System"
                            ? "var(--accent-amber)"
                            : "var(--primary-color)";

                return (
                  <div
                    key={index}
                    className="px-3 py-2.5 cursor-pointer border-b border-[var(--sidebar-border)] last:border-b-0 hover:bg-[var(--topbar-hover)]/10 transition-colors group"
                    onMouseDown={() => handleRouteSelect(route.path)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform"
                        style={{
                          backgroundColor: categoryColor + "20",
                          color: categoryColor,
                        }}
                      >
                        <RouteIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-[var(--sidebar-text)] truncate text-sm">
                          {route.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--sidebar-border)]/50 text-[var(--text-tertiary)]">
                            {route.category}
                          </span>
                          <span className="text-xs text-[var(--text-tertiary)] truncate">
                            {route.path}
                          </span>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-6 h-6 rounded-full bg-[var(--topbar-hover)]/20 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--topbar-hover)]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* No Results Message */}
          {showSearchResults &&
            searchQuery.trim() &&
            filteredRoutes.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-2xl bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] p-6 z-50">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--sidebar-border)]/30 flex items-center justify-center mx-auto mb-3">
                    <Search className="w-5 h-5 text-[var(--text-tertiary)]" />
                  </div>
                  <div className="text-[var(--sidebar-text)] font-medium mb-1">
                    No results found
                  </div>
                  <div className="text-xs text-[var(--text-tertiary)]">
                    Try searching for debtors, loans, payments, or reports
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Right Section - Actions & Profile */}
      <div className="flex items-center gap-3">
        <UpdateNotifier />
        {/* Notification bell */}
        <button
          onClick={() => setNotificationsOpen(true)}
          className="relative p-2 rounded-lg hover:bg-[var(--topbar-hover)]/20 text-[var(--sidebar-text)] transition-colors duration-200 group"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-[var(--primary-color)] text-white text-xs font-bold rounded-full px-1 border border-[var(--sidebar-bg)]">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* Quick Add / New Debt Button (optional) */}
        <button
          onClick={() => navigate("/loans/applications")}
          className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] text-white text-sm font-medium transition-all duration-200 shadow-md"
        >
          <Plus className="w-4 h-4" />
          New Loan
        </button>
      </div>

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </header>
  );
};

export default TopBar;