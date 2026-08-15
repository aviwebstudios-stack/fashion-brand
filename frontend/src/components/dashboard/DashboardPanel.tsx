import { useState } from "react";
import { usePanelStore } from "../../store/panelStore";
import AccountView from "./AccountView";
import MeasurementsForm from "./MeasurementsForm";

type View = "account" | "measurements";

export default function DashboardPanel() {
  const isOpen = usePanelStore((s) => s.isDashboardOpen);
  const closeDashboard = usePanelStore((s) => s.closeDashboard);
  const [view, setView] = useState<View>("account");

  const handleClose = () => {
    closeDashboard();
    setTimeout(() => setView("account"), 300);
  };

  return (
    <div
      className={`fixed inset-0 z-[90] transition-opacity duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

      <div
        className={`absolute right-0 top-0 h-full w-full overflow-y-auto bg-brand-bg shadow-xl transition-transform duration-300 sm:w-[40%] sm:min-w-[420px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {view === "account" ? (
          <AccountView onOpenMeasurements={() => setView("measurements")} onClose={handleClose} />
        ) : (
          <MeasurementsForm onBack={() => setView("account")} />
        )}
      </div>
    </div>
  );
}