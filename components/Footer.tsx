interface FooterProps {
  onSwitch: (page: string) => void;
}

export default function Footer({ onSwitch }: FooterProps) {
  return (
    <footer>
      <div className="fi2">
        <div>
          <div className="fb">AI·JAM US</div>
          <div className="finfo">
            11th International AI Invention Challenge · Since 2015<br />
            📍 855 Maude Avenue, Mountain View, CA · ✉ <a href="mailto:Team@aijam.org">Team@aijam.org</a>
          </div>
        </div>
        <div className="flinks">
          <a href="#" onClick={e => { e.preventDefault(); onSwitch('home'); }}>Home</a>
          <a href="#" onClick={e => { e.preventDefault(); onSwitch('about'); }}>About</a>
          <a href="#" onClick={e => { e.preventDefault(); onSwitch('asia'); }}>Asia Edition</a>
          <a href="#" onClick={e => { e.preventDefault(); onSwitch('winners'); }}>2025 Winners</a>
          <a href="#" onClick={e => { e.preventDefault(); onSwitch('register'); }}>Register</a>
          <a href="https://paiax.org" target="_blank" rel="noopener noreferrer">PAIAX</a>
        </div>
      </div>
      <div className="fcopy">©2016–2026 AI-JAM US · 11th International AI Invention Challenge · Operated by PAIAX · All Rights Reserved.</div>
    </footer>
  );
}
