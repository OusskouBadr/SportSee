import "./Footer.css";

export function Footer() {
  return (
    <footer className="app-footer">
      <div className="app-footer-content">
        <span className="app-footer-copyright">
          &copy; SportSee Tous droits réservés
        </span>

        <div className="app-footer-right">
          <div className="app-footer-links">
            <span>Conditions générales</span>
            <span>Contact</span>
          </div>

          <img
            src="/icons/sportsee-mark.svg"
            alt=""
            aria-hidden="true"
            className="app-footer-logo"
          />
        </div>
      </div>
    </footer>
  );
}