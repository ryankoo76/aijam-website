'use client';

type Page = 'home' | 'about' | 'asia' | 'winners' | 'register';

interface NavProps {
  activePage: Page;
  onSwitch: (page: Page) => void;
}

export default function Nav({ activePage, onSwitch }: NavProps) {
  return (
    <nav>
      <div className="nav-top">
        <div>
          <div className="logo">AI·JAM US</div>
          <div className="logo-s">11TH INTERNATIONAL AI CHALLENGE · SINCE 2015</div>
        </div>
        <button className="nav-reg" onClick={() => onSwitch('register')}>Register 2026 →</button>
      </div>
      <div className="nav-tabs">
        <button className={`ntab${activePage === 'home' ? ' active' : ''}`} onClick={() => onSwitch('home')}>🏠 Home</button>
        <button className={`ntab${activePage === 'about' ? ' active' : ''}`} onClick={() => onSwitch('about')}>About AI-JAM US</button>
        <button className={`ntab${activePage === 'asia' ? ' active' : ''}`} onClick={() => onSwitch('asia')}>AI-JAM ASIA Edition</button>
        <button className={`ntab${activePage === 'winners' ? ' active' : ''}`} onClick={() => onSwitch('winners')}>Winner 2025</button>
        <button className={`ntab${activePage === 'register' ? ' active' : ''}`} onClick={() => onSwitch('register')}>Register 2026</button>
      </div>
    </nav>
  );
}
