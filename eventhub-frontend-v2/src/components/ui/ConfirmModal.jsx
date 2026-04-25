import { useApp } from "../../context/AppContext";

export default function ConfirmModal({ title, message, onConfirm, onClose, danger = true }) {
  const { t } = useApp();
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 400, textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>{danger ? "⚠️" : "❓"}</div>
        <h2 style={{ fontSize: 20, marginBottom: 8 }}>{title || t("dashboard.confirmDelete")}</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: 24, fontSize: 14 }}>
          {message || t("dashboard.deleteWarning")}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="btn btn-ghost" onClick={onClose}>{t("general.cancel")}</button>
          <button className={`btn ${danger ? "btn-danger" : "btn-primary"}`} onClick={() => { onConfirm(); onClose(); }}>
            {t("general.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
