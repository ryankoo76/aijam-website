'use client';

import { useState } from 'react';

export default function PageRegister() {
  const [fn, setFn] = useState('');
  const [ln, setLn] = useState('');
  const [em, setEm] = useState('');
  const [co, setCo] = useState('');
  const [pt, setPt] = useState('');
  const [sc, setSc] = useState('');
  const [ch1, setCh1] = useState(false);
  const [ch2, setCh2] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [btnText, setBtnText] = useState('🚀 COMPLETE REGISTRATION');
  const [btnStyle, setBtnStyle] = useState({});

  function submitForm() {
    if (!fn || !em || !co || !pt || !sc) {
      alert('Please fill in all required fields (*)');
      return;
    }
    setSubmitted(true);
    setBtnText('✅ Registered!');
    setBtnStyle({ background: 'var(--green)' });
  }

  return (
    <div id="page-register" className="page active">
      <div className="pw">
        <div className="content-hero">
          <div className="eye">REGISTER FOR 2026</div>
          <h2 className="pg-h2">READY TO COMPETE?</h2>
          <p className="pg-sub">11th AI-JAM US · Submission Deadline: August 30, 2026 · Results Online: September 6, 2026</p>
        </div>

        <div className="reg-grid">
          <div>
            <div className="guide-box">
              <div className="gb-top"><div className="gb-icon">📘</div><div className="gb-t">AI-JAM US 2026 Official Guidebook</div></div>
              <div className="gb-desc">Everything you need to submit a winning entry:</div>
              <ul className="gb-list">
                <li>How to write each of the 3 slides</li>
                <li>30-second video tips and script template</li>
                <li>Judging criteria explained</li>
                <li>Submission checklist</li>
                <li>Key dates and FAQ</li>
              </ul>
              <a className="btn-dl" href="/AIJAM_Guidebook_2026.pdf" download="AIJAM_Guidebook_2026.pdf" target="_blank" rel="noopener noreferrer">📥 Download Official Guidebook (PDF)</a>
            </div>

            <div className="wyg">
              <div className="wyg-l">ALL PARTICIPANTS RECEIVE</div>
              <div className="wyg-i"><span style={{color:'var(--green)'}}>✓</span> Digital certificate of participation</div>
              <div className="wyg-i"><span style={{color:'var(--green)'}}>✓</span> AI-enhanced poster of your project</div>
              <div className="wyg-i"><span style={{color:'var(--green)'}}>✓</span> Social media content package (TikTok, Instagram, LinkedIn)</div>
              <div className="wyg-i"><span style={{color:'var(--green)'}}>✓</span> Access to AI-JAM US global community</div>
              <div className="wyg-i"><span style={{color:'var(--amber)'}}>★</span> Grand Prix / Gold / Silver / Bronze awards for top entries</div>
            </div>

            <div style={{background:'var(--dark)',border:'1px solid var(--border)',padding:'1.2rem',marginTop:'1rem'}}>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:'.72rem',color:'var(--gray)',letterSpacing:'.1em',marginBottom:'.8rem'}}>📅 KEY DATES</div>
              <div style={{display:'flex',flexDirection:'column',gap:'.5rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'1rem',padding:'.4rem 0',borderBottom:'1px solid var(--border)'}}><span style={{color:'var(--green)'}}>Registration</span><span style={{color:'var(--gray)'}}>Now Open</span></div>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'1rem',padding:'.4rem 0',borderBottom:'1px solid var(--border)'}}><span style={{color:'var(--amber)'}}>Shadow Season</span><span style={{color:'var(--gray)'}}>Jan–Jun 2026</span></div>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'1rem',padding:'.4rem 0',borderBottom:'1px solid var(--border)'}}><span style={{color:'var(--red)',fontWeight:700}}>⚠ Submission Deadline</span><span style={{color:'var(--red)',fontWeight:700}}>Aug 30, 2026</span></div>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'1rem',padding:'.4rem 0'}}><span style={{color:'var(--blue2)'}}>Results Online</span><span style={{color:'var(--gray)'}}>Sep 6, 2026</span></div>
              </div>
            </div>
          </div>

          <div className="form-box">
            <div className="fh">REGISTER NOW</div>
            <div className="fs">11th International AI Invention Challenge · Deadline: August 30, 2026 · Results: September 6, 2026<br />Participation fee details will be sent to your email after registration.</div>
            <div className="fr">
              <div><label className="fl">First Name *</label><input type="text" className="fi" placeholder="Sarah" value={fn} onChange={e => setFn(e.target.value)} /></div>
              <div><label className="fl">Last Name *</label><input type="text" className="fi" placeholder="Kim" value={ln} onChange={e => setLn(e.target.value)} /></div>
            </div>
            <div className="fg"><label className="fl">Email Address *</label><input type="email" className="fi" placeholder="sarah@school.edu" value={em} onChange={e => setEm(e.target.value)} /></div>
            <div className="fr">
              <div>
                <label className="fl">Country *</label>
                <select className="fi" value={co} onChange={e => setCo(e.target.value)}>
                  <option value="">Select Country</option>
                  <option>Vietnam</option><option>Indonesia</option><option>Malaysia</option>
                  <option>Korea</option><option>United States</option><option>Japan</option>
                  <option>Philippines</option><option>Thailand</option><option>Singapore</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="fl">I am a *</label>
                <select className="fi" value={pt} onChange={e => setPt(e.target.value)}>
                  <option value="">Select</option>
                  <option>Student — Individual</option>
                  <option>Student Team (2–5 members)</option>
                  <option>Teacher / School</option>
                </select>
              </div>
            </div>
            <div className="fg"><label className="fl">School / University *</label><input type="text" className="fi" placeholder="Your school name" value={sc} onChange={e => setSc(e.target.value)} /></div>
            <div className="fck"><input type="checkbox" id="ch1" checked={ch1} onChange={e => setCh1(e.target.checked)} /><label htmlFor="ch1">I am a teacher — please send the Class Pack (90-min lesson plan + CPD credit)</label></div>
            <div className="fck"><input type="checkbox" id="ch2" checked={ch2} onChange={e => setCh2(e.target.checked)} /><label htmlFor="ch2">I agree to the Terms and Conditions. Submission deadline is August 30, 2026.</label></div>
            <button className="btn-sub" style={btnStyle} onClick={submitForm}>{btnText}</button>
            {submitted && (
              <div className="suc">
                <h4>✅ Registration Complete!</h4>
                <p>Confirmation email sent with participation details and Guidebook link.<br />Welcome to AI-JAM US 2026!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
