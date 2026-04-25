import '../../css/Error404.css'
import { useNavigate } from "react-router-dom";


export default function NotFound() {
  const navigate = useNavigate();

  const handleBack = (e) => {
    e.preventDefault();
    // -1 indique à React Router de reculer d'une page dans l'historique
    // navigate(-1); 
    // Si la longueur de l'historique est supérieure à 1, on peut reculer
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Sinon, on le renvoie à l'accueil pour ne pas le laisser bloqué
      navigate("/", { replace: true });
    }
  };

  return (

    <div className="error-container">
        <span className="error-icon">🔍</span>
        <h1 className="error-title">404 – Page introuvable</h1>
    </div>

    // <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
    //   <span style={{ fontSize: 64 }}>🔍</span>
    //   <h1 style={{ fontFamily: "var(--font-display)" }}>404 – Page introuvable</h1>
    //   <button onClick={handleBack} className="btn btn-primary"> ← Retour arrière (mettre dans transalte aussi)</button>
    // </div>

  );
}