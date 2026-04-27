interface PageWinnersProps {
  onSwitch: (page: string) => void;
}

export default function PageWinners({ onSwitch }: PageWinnersProps) {
  return (
    <div id="page-winners" className="page active">
      <div className="pw">
        <div className="content-hero">
          <div className="eye">WINNER ANNOUNCEMENT 2025 · 10TH EVENT</div>
          <h2 className="pg-h2">AIJAM-US 2025<br />WINNERS ANNOUNCED!</h2>
          <p className="pg-sub">&quot;This year, innovators from around the world showcased the power of combining AI and creativity. AIJAM-US 2025 stands as a milestone celebrating their challenges and achievements.&quot;</p>
        </div>

        <div className="img-grid-2" style={{marginBottom:'1.5rem',maxWidth:'500px',marginLeft:'auto',marginRight:'auto'}}>
          <img className="gi" src="https://cdn.gamma.app/jeat3ncrixcj8f5/e5ea19a59e5f4973b7da431d1f5439bc/original/5MB-saeroun-rogo.png" alt="AI-JAM 10th Logo" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <img className="gi" src="https://cdn.gamma.app/jeat3ncrixcj8f5/e7ebed78c62a4db7ac60bc9a8d144d31/original/saeroun-medal-imiji-2.png" alt="Medal" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>

        <p className="body-text" style={{textAlign:'center',fontSize:'1rem'}}>Marking our <strong>10th anniversary</strong>, we introduce a bold new logo that reflects the spirit of AI-JAM US.</p>
        <p className="body-text" style={{textAlign:'center'}}>In 2025, <strong>753 teams</strong> stepped onto the global stage, showcasing bold visions and groundbreaking ideas. In 2026, it&apos;s your turn to inspire the world.</p>

        <div className="stat-row">
          <div className="stat-block"><div className="sb-n">17</div><div className="sb-l">Countries</div><div className="sb-d">Spanning 4 continents with diverse cultural perspectives</div></div>
          <div className="stat-block"><div className="sb-n">1,020</div><div className="sb-l">Participants</div><div className="sb-d">Brilliant minds collaborating across borders</div></div>
          <div className="stat-block"><div className="sb-n">753</div><div className="sb-l">Submissions</div><div className="sb-d">Incredible projects showing global passion for AI creativity</div></div>
        </div>
        <div className="stat-row" style={{marginTop:'1px'}}>
          <div className="stat-block"><div className="sb-n">527</div><div className="sb-l">Awards Given</div><div className="sb-d">Recognizing excellence across multiple categories</div></div>
          <div className="stat-block" style={{gridColumn:'span 2'}}><div style={{fontSize:'.92rem',color:'var(--gray)',lineHeight:1.8,paddingTop:'.5rem'}}>Grand Prix, Gold, Silver, and Bronze Awards recognizing outstanding achievement across multiple categories. Each award represents exceptional innovation, presentation skills, and potential real-world impact.<br /><br />All participants receive digital certificates and badges that can be shared across professional networks.</div></div>
        </div>

        <div className="div-line"></div>
        <div className="sec-title">Best 4 Winners Showcase</div>
        <p className="body-text">The judges&apos; choice of the most inspiring projects. Selected from a competitive field of 753 submissions.</p>

        <div className="w-grid">
          <div className="wc"><div className="wmed">🏆</div><div><div className="wa gp">GRAND PRIX · 2025</div><div className="wt">AI-Powered Drone Medical Delivery</div><div className="wn">Team MedAir</div><div className="wd">Drone-based medical supply delivery for remote communities using AI route optimization and real-time demand prediction.</div><div className="wflag">🇻🇳 Vietnam</div></div></div>
          <div className="wc"><div className="wmed">🥇</div><div><div className="wa gld">GOLD AWARD · 2025</div><div className="wt">Wildfire Early Detection System</div><div className="wn">Team EcoSense</div><div className="wd">Smart AI sensor network for early wildfire detection, reducing response time by 73% in pilot tests.</div><div className="wflag">🇮🇩 Indonesia</div></div></div>
          <div className="wc"><div className="wmed">🥇</div><div><div className="wa gld">GOLD AWARD · 2025</div><div className="wt">AR Platform for STEM Education</div><div className="wn">Team LearnAR</div><div className="wd">Augmented reality making complex STEM concepts visual and interactive for K-12 students globally.</div><div className="wflag">🇲🇾 Malaysia</div></div></div>
          <div className="wc"><div className="wmed">🥈</div><div><div className="wa slv">SILVER AWARD · 2025</div><div className="wt">AI Mental Health Companion</div><div className="wn">Team MindBridge</div><div className="wd">24/7 accessible AI counseling support reducing barriers to mental health care for university students.</div><div className="wflag">🇰🇷 Korea</div></div></div>
        </div>

        <div className="pdf-bar">
          <span className="pdf-note">Full award list with all 527 winners available as PDF</span>
          <a className="btn-pdf" href="https://cdn.gamma.app/jeat3ncrixcj8f5/1b77915278a547ef96f2d03cf28fb0a2/original/AWARD-LIST_-AI-JAM-_US-2025.pdf" target="_blank" rel="noopener noreferrer">📥 Download Full 2025 Award List (PDF)</a>
        </div>

        <div className="div-line"></div>
        <div className="sec-title">Awards & Honors 2025</div>
        <div className="img-grid-2" style={{marginBottom:'1.5rem',maxWidth:'500px'}}>
          <img className="gi" src="https://cdn.gamma.app/jeat3ncrixcj8f5/f5093e80af4142faa690a7507b8427bd/original/saeroun-medal-imiji-2.png" alt="Awards" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <img className="gi" src="https://cdn.gamma.app/jeat3ncrixcj8f5/c5f1d031f8b2440cbf74024433927c09/original/certificate.png" alt="Certificate" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>

        <div className="div-line"></div>
        <div className="sec-title">AI Highlights Gallery</div>
        <p className="body-text">See how AI reimagined participants&apos; projects: drones, environment, healthcare... transformed into inspiring visuals.</p>
        <div className="img-grid-4" style={{marginBottom:'.6rem'}}>
          {[
            'https://cdn.gamma.app/jeat3ncrixcj8f5/43c00c6e241d403cbd06c872435e3dfb/original/Screenshot-2025-09-01-at-8.54.44-PM.png',
            'https://cdn.gamma.app/jeat3ncrixcj8f5/431084eba6d94328be3364554a40fcc5/original/gemini-2.5-flash-image-preview-nano-banana-_dubeonjae_imijie_issneun_poseuteoreul_ceosbeonjjae.png',
            'https://cdn.gamma.app/jeat3ncrixcj8f5/420f99db3db941079fb4a4531e56e901/original/Screenshot-2025-09-01-at-8.54.54-PM.png',
            'https://cdn.gamma.app/jeat3ncrixcj8f5/58598d13a44b4924b9bea44814fb91f4/original/Screenshot-2025-09-01-at-9.04.53-PM.png',
          ].map((src, i) => (
            <img key={i} className="gi-sq" src={src} alt="AI Visual" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          ))}
        </div>
        <div className="img-grid-4">
          {[
            'https://cdn.gamma.app/jeat3ncrixcj8f5/8c7bfa4ef743443e9f4364a310f1acef/original/Screenshot-2025-09-01-at-9.05.52-PM.png',
            'https://cdn.gamma.app/jeat3ncrixcj8f5/dfef3870093b4721bf63096724aa549a/original/Screenshot-2025-09-01-at-9.06.03-PM.png',
            'https://cdn.gamma.app/jeat3ncrixcj8f5/f24dc8713aa74864815e5b04374a8a3e/original/Screenshot-2025-09-01-at-9.10.10-PM.png',
            'https://cdn.gamma.app/jeat3ncrixcj8f5/50296fd3834343f0925683f53ee9b7d3/original/Screenshot-2025-09-01-at-9.13.59-PM.png',
          ].map((src, i) => (
            <img key={i} className="gi-sq" src={src} alt="AI Visual" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          ))}
        </div>

        <div className="div-line"></div>
        <div className="sec-title">What Judges Look For</div>
        <div className="card-grid-2">
          <div className="card"><div className="card-eye">CRITERION 01</div><div className="card-t">Clarity</div><div className="card-d">Presentations that communicated complex ideas simply and directly. Winning teams articulated their concept, implementation, and impact without unnecessary jargon.</div></div>
          <div className="card"><div className="card-eye">CRITERION 02</div><div className="card-t">Novelty</div><div className="card-d">Standout projects approached problems from unexpected angles or combined existing technologies in innovative ways. Judges rewarded creative thinking.</div></div>
          <div className="card"><div className="card-eye">CRITERION 03</div><div className="card-t">Impact</div><div className="card-d">Projects with clear, measurable real-world benefits scored highly. The most successful teams quantified their potential impact with specific metrics.</div></div>
          <div className="card"><div className="card-eye">CRITERION 04</div><div className="card-t">Feasibility</div><div className="card-d">Judges favored projects with realistic implementation plans and awareness of constraints. Winning teams demonstrated practical consideration.</div></div>
        </div>
        <div style={{background:'rgba(37,99,235,.05)',border:'1px solid rgba(59,130,246,.18)',padding:'1.2rem',marginTop:'1rem'}}>
          <strong style={{color:'var(--amber)'}}>💡 Tip for 2026 participants:</strong><br />
          <span style={{fontSize:'1rem',color:'var(--lgray)'}}>Show your Impact with numbers! Quantify how many people your solution helps, the percentage improvement over existing solutions, or the potential cost savings. Specific metrics make your impact instantly clear to judges.</span>
        </div>

        <div className="div-line"></div>
        <div className="sec-title">Voices of Participants</div>
        <div className="test-grid">
          <div className="tc"><div className="ti">👩</div><div className="tq">&quot;AI made it so easy to submit. I was worried about creating a professional presentation, but the platform transformed my simple slides into something amazing.&quot;</div><div className="tn">Sarah Kim</div><div className="ta">GOLD AWARD WINNER · 2025</div></div>
          <div className="tc"><div className="ti">👨</div><div className="tq">&quot;This certificate became my first international portfolio. It opened doors to internships and research opportunities I never would have accessed otherwise.&quot;</div><div className="tn">Marcus Johnson</div><div className="ta">SPECIAL RECOGNITION · 2025</div></div>
          <div className="tc"><div className="ti">👥</div><div className="tq">&quot;The 3-slide format was challenging but incredibly valuable. It forced us to distill our complex project into its essential elements. That skill has been invaluable.&quot;</div><div className="tn">Team Innovate</div><div className="ta">BRONZE AWARD · 2025</div></div>
        </div>

        <div className="div-line"></div>
        <div style={{textAlign:'center',padding:'1.5rem',background:'var(--dark)',border:'1px solid var(--border)'}}>
          <p style={{fontSize:'1rem',color:'var(--gray)',marginBottom:'1rem'}}>2024 and previous year award lists available upon request</p>
          <a href="mailto:Team@aijam.org" style={{color:'var(--blue2)',fontSize:'1rem'}}>Team@aijam.org</a>
          <div style={{marginTop:'1.2rem'}}>
            <button className="btn-main" onClick={() => onSwitch('register')}>🚀 Register for 2026 →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
