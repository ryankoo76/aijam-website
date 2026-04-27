'use client';

import { useEffect, useState } from 'react';

interface PageHomeProps {
  onSwitch: (page: string) => void;
}

export default function PageHome({ onSwitch }: PageHomeProps) {
  const [countdown, setCountdown] = useState({ d: '--', h: '--', m: '--', s: '--' });

  useEffect(() => {
    function tick() {
      const target = new Date('2026-08-30T23:59:59+09:00');
      const now = new Date();
      const diff = Math.max(0, target.getTime() - now.getTime());
      setCountdown({
        d: String(Math.floor(diff / 86400000)).padStart(2, '0'),
        h: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'),
        m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
        s: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div id="page-home" className="page active">
      <div className="hero-wrap">
        <div className="gbg"></div>
        <div className="glow"></div>
        <div className="hero-in">
          <div className="h-eye"><span className="ldot"></span>AI-JAM US 2026 · 11TH EVENT · REGISTRATIONS OPEN</div>
          <h1 className="hero-h1">3 SLIDES.<br /><span className="bl">30 SECONDS.</span><br />GLOBAL STAGE.</h1>
          <p className="hero-tag">The international AI invention challenge since 2015.<br /><strong>Submit your AI idea. Compete with 25+ countries. Get recognized worldwide.</strong></p>
          <div className="dl-bar">🔴&nbsp;<span>Submission Deadline: <strong>August 30, 2026</strong>&nbsp;·&nbsp;Results Online: <strong>September 6, 2026</strong></span></div>
          <div className="cd-row">
            <div className="cdb"><div className="cdn">{countdown.d}</div><div className="cdl">DAYS</div></div>
            <div className="cdsep">:</div>
            <div className="cdb"><div className="cdn">{countdown.h}</div><div className="cdl">HRS</div></div>
            <div className="cdsep">:</div>
            <div className="cdb"><div className="cdn">{countdown.m}</div><div className="cdl">MIN</div></div>
            <div className="cdsep">:</div>
            <div className="cdb"><div className="cdn">{countdown.s}</div><div className="cdl">SEC</div></div>
          </div>
          <div className="hero-btns">
            <button className="btn-main" onClick={() => onSwitch('register')}>🚀 Register for 2026</button>
            <a className="btn-sec" href="/AIJAM_Guidebook_2026.pdf" download="AIJAM_Guidebook_2026.pdf" target="_blank" rel="noopener noreferrer">📥 Download Official Guidebook (PDF)</a>
            <button className="btn-sec" onClick={() => onSwitch('winners')}>🏆 See 2025 Winners</button>
          </div>
          <div className="hero-stats">
            <div className="hs"><div className="hsn">10,000+</div><div className="hsl">PAST PARTICIPANTS</div></div>
            <div className="hdiv"></div>
            <div className="hs"><div className="hsn">72+</div><div className="hsl">COUNTRIES</div></div>
            <div className="hdiv"></div>
            <div className="hs"><div className="hsn">1,000+</div><div className="hsl">PROJECTS SUBMITTED</div></div>
            <div className="hdiv"></div>
            <div className="hs"><div className="hsn">11th</div><div className="hsl">YEAR 2026</div></div>
          </div>
        </div>
      </div>

      <div className="how-strip">
        <div className="hs-card">
          <div className="hs-icon">📝</div>
          <div className="hs-step">STEP 01</div>
          <div className="hs-t">Register</div>
          <div className="hs-d">Sign up and download the Official Guidebook. Choose any AI project topic addressing a real-world problem.</div>
          <div className="hs-tag">OPEN NOW</div>
        </div>
        <div className="hs-card">
          <div className="hs-icon">🎬</div>
          <div className="hs-step">STEP 02</div>
          <div className="hs-t">Create & Submit</div>
          <div className="hs-d">Prepare <strong style={{color:'var(--white)'}}>3 slides</strong> + a <strong style={{color:'var(--white)'}}>30-second video</strong> and upload by <strong style={{color:'var(--red)'}}>August 30, 2026.</strong></div>
          <div className="hs-tag">DEADLINE: AUG 30</div>
        </div>
        <div className="hs-card">
          <div className="hs-icon">🌐</div>
          <div className="hs-step">STEP 03</div>
          <div className="hs-t">Results Online</div>
          <div className="hs-d">Winners announced online on <strong style={{color:'var(--green)'}}>September 6, 2026.</strong> All participants receive digital certificates and AI-enhanced social media content.</div>
          <div className="hs-tag">RESULTS: SEP 6</div>
        </div>
      </div>

      <div className="date-strip">
        <div className="ds-item"><div className="ds-l">REGISTRATION</div><div className="ds-d" style={{color:'var(--green)'}}>NOW OPEN</div><div className="ds-n">Participation details sent by email</div></div>
        <div className="ds-item"><div className="ds-l">SUBMISSION DEADLINE</div><div className="ds-d" style={{color:'var(--red)'}}>AUG 30, 2026</div><div className="ds-n">23:59 KST · 100% Online</div></div>
        <div className="ds-item"><div className="ds-l">RESULTS ANNOUNCED</div><div className="ds-d" style={{color:'var(--amber)'}}>SEP 6, 2026</div><div className="ds-n">Online announcement only</div></div>
      </div>

      {/* WHY AI-JAM US */}
      <div style={{padding:'5rem 5vw',background:'var(--black)'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'3rem'}}>
            <div className="eye">WHY AI-JAM US</div>
            <h2 className="pg-h2">A COMPETITION THAT<br />CHANGES EVERYTHING.</h2>
            <p className="pg-sub">Since 2015, AI-JAM US has inspired more than 10,000 participants from 72+ countries to transform their ideas into globally recognized innovations.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1px',background:'var(--border)'}}>
            {[
              {icon:'🌍',title:'Truly Global Stage',color:'var(--blue2)',desc:'Compete alongside students from Vietnam, Indonesia, Malaysia, Korea, Japan, the US, and 60+ more countries. Your idea reaches a worldwide audience of experts, educators, and industry leaders.'},
              {icon:'🤖',title:'AI Enhances Your Work',color:'var(--cyan)',desc:"Our platform uses AI to transform your 3-slide submission into stunning visual posters and social media content — TikTok reels, Instagram posts, and LinkedIn formats — automatically generated for every participant."},
              {icon:'📜',title:'Real Credentials',color:'var(--green)',desc:'Every participant receives internationally recognized digital certificates and badges for their portfolio. Award winners gain credentials that open doors to university admissions, internships, and global research opportunities.'},
              {icon:'⚡',title:'Simple But Powerful Format',color:'var(--amber)',desc:'3 slides and 30 seconds. This unique constraint forces participants to distill their ideas to their most powerful essence — a communication skill valued in every field and industry worldwide.'},
              {icon:'🏫',title:'School Recognition',color:'var(--red)',desc:'Schools earn a Certificate of Appreciation. Teachers receive CPD credit. Student achievements contribute to PAJSK, SNBP/Jalur Prestasi, and other national academic recognition frameworks across participating countries.'},
              {icon:'🤝',title:'Silicon Valley Partnership',color:'#9B59B6',desc:'Organized in partnership with Hacker Dojo in Mountain View, California — the heart of Silicon Valley. Founded in 2015 by Mr. Rayn Koo, AI-JAM US connects your innovation directly to the global tech ecosystem.'},
            ].map((item) => (
              <div key={item.title} style={{background:'var(--dark)',padding:'2rem',borderTop:`3px solid ${item.color}`}}>
                <div style={{fontSize:'2.2rem',marginBottom:'.8rem'}}>{item.icon}</div>
                <div style={{fontSize:'1rem',fontWeight:700,marginBottom:'.6rem'}}>{item.title}</div>
                <div style={{fontSize:'1rem',color:'var(--gray)',lineHeight:1.8}}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WHAT TO SUBMIT */}
      <div style={{padding:'5rem 5vw',background:'var(--dark)'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'3rem'}}>
            <div className="eye">WHAT TO SUBMIT</div>
            <h2 className="pg-h2">EXACTLY 3 SLIDES.<br />EXACTLY 30 SECONDS.</h2>
            <p className="pg-sub">Our unique format challenges you to communicate your AI innovation with precision and clarity. Here is exactly what each slide must contain.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem',marginBottom:'2rem'}}>
            <div style={{background:'var(--dark2)',border:'1px solid rgba(59,130,246,.18)',padding:'1.8rem',textAlign:'center'}}>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:'.72rem',color:'var(--blue2)',letterSpacing:'.15em',marginBottom:'.6rem'}}>SLIDE 1 OF 3</div>
              <div style={{fontSize:'2.5rem',marginBottom:'.5rem'}}>💡</div>
              <div style={{fontSize:'1.05rem',fontWeight:700,marginBottom:'.8rem'}}>The Problem</div>
              <ul style={{listStyle:'none',textAlign:'left',display:'flex',flexDirection:'column',gap:'.4rem'}}>
                {['What problem are you solving?','Who is affected?','Why does this problem matter?','Include 1 key statistic','Make it visual — use images'].map(i => (
                  <li key={i} style={{fontSize:'.95rem',color:'var(--lgray)',display:'flex',gap:'.5rem'}}><span style={{color:'var(--blue2)'}}>·</span>{i}</li>
                ))}
              </ul>
            </div>
            <div style={{background:'var(--dark2)',border:'1px solid rgba(245,158,11,.25)',padding:'1.8rem',textAlign:'center'}}>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:'.72rem',color:'var(--amber)',letterSpacing:'.15em',marginBottom:'.6rem'}}>SLIDE 2 OF 3</div>
              <div style={{fontSize:'2.5rem',marginBottom:'.5rem'}}>🤖</div>
              <div style={{fontSize:'1.05rem',fontWeight:700,marginBottom:'.8rem'}}>Your AI Solution</div>
              <ul style={{listStyle:'none',textAlign:'left',display:'flex',flexDirection:'column',gap:'.4rem'}}>
                {['How does your AI solution work?','What AI technology are you using?','Simple diagram or flow','Show prototype if available','No coding required!'].map(i => (
                  <li key={i} style={{fontSize:'.95rem',color:'var(--lgray)',display:'flex',gap:'.5rem'}}><span style={{color:'var(--amber)'}}>·</span>{i}</li>
                ))}
              </ul>
            </div>
            <div style={{background:'var(--dark2)',border:'1px solid rgba(16,185,129,.25)',padding:'1.8rem',textAlign:'center'}}>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:'.72rem',color:'var(--green)',letterSpacing:'.15em',marginBottom:'.6rem'}}>SLIDE 3 OF 3</div>
              <div style={{fontSize:'2.5rem',marginBottom:'.5rem'}}>📊</div>
              <div style={{fontSize:'1.05rem',fontWeight:700,marginBottom:'.8rem'}}>Impact & Vision</div>
              <ul style={{listStyle:'none',textAlign:'left',display:'flex',flexDirection:'column',gap:'.4rem'}}>
                {['How many people will this help?','Quantify impact with numbers','Is it feasible? What are costs?','Next step to make it real','Your vision for the future'].map(i => (
                  <li key={i} style={{fontSize:'.95rem',color:'var(--lgray)',display:'flex',gap:'.5rem'}}><span style={{color:'var(--green)'}}>·</span>{i}</li>
                ))}
              </ul>
            </div>
          </div>
          <div style={{background:'rgba(245,158,11,.05)',border:'1px solid rgba(245,158,11,.18)',padding:'1.5rem',display:'flex',gap:'1.2rem',alignItems:'flex-start'}}>
            <div style={{fontSize:'2rem',flexShrink:0}}>🎥</div>
            <div>
              <div style={{fontSize:'1rem',fontWeight:700,marginBottom:'.5rem'}}>30-Second Video Presentation</div>
              <div style={{fontSize:'1rem',color:'var(--gray)',lineHeight:1.8}}>Record yourself presenting your project in <strong style={{color:'var(--white)'}}>exactly 30 seconds or less</strong>. Speak clearly. Introduce yourself, describe the problem, explain your AI solution, and state the impact. Any language accepted — English captions recommended. Smartphone video is perfectly acceptable.</div>
              <div style={{display:'flex',gap:'.5rem',flexWrap:'wrap',marginTop:'.7rem'}}>
                {['MAX 30 SECONDS','ANY LANGUAGE','MP4 / MOV','SMARTPHONE OK'].map(tag => (
                  <span key={tag} style={{fontSize:'.75rem',padding:'.2rem .6rem',background:'rgba(245,158,11,.08)',color:'var(--amber)',border:'1px solid rgba(245,158,11,.2)',fontFamily:"'Space Mono',monospace"}}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SHADOW SEASON */}
      <div style={{padding:'5rem 5vw',background:'var(--black)'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'3rem'}}>
            <div className="eye">SHADOW SEASON 2026</div>
            <h2 className="pg-h2">PRACTICE BEFORE<br />THE FINALS.</h2>
            <p className="pg-sub">Monthly mini-challenges from January to June. Build skills, earn digital badges, and prepare for the August 30 deadline.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'2rem'}}>
            <div style={{background:'var(--dark)',border:'1px solid rgba(245,158,11,.3)',padding:'1.4rem',position:'relative'}}>
              <div style={{position:'absolute',top:'.8rem',right:'.8rem',fontSize:'.7rem',padding:'.15rem .45rem',background:'rgba(16,185,129,.08)',color:'var(--green)',border:'1px solid rgba(16,185,129,.2)',fontFamily:"'Space Mono',monospace"}}>OPEN NOW</div>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:'.72rem',color:'var(--amber)',letterSpacing:'.12em',marginBottom:'.5rem'}}>JAN 2026</div>
              <div style={{fontSize:'1rem',fontWeight:700,marginBottom:'.4rem'}}>Visual Impact Challenge</div>
              <div style={{fontSize:'.92rem',color:'var(--gray)',lineHeight:1.8}}>Create a single slide that communicates your AI concept instantly to a stranger.</div>
            </div>
            {[
              {month:'FEB 2026',title:'30-Second Pitch',desc:'Record a 30-second verbal explanation — the core skill for the final competition.'},
              {month:'MAR 2026',title:'Data Visualization',desc:"Present your project's impact through compelling statistics and numbers."},
              {month:'JUN 2026',title:'Full Mock Submission',desc:'Complete 3-slide + 30-second practice with expert feedback before Aug 30.'},
            ].map(item => (
              <div key={item.month} style={{background:'var(--dark)',border:'1px solid var(--border)',padding:'1.4rem'}}>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:'.72rem',color:'var(--amber)',letterSpacing:'.12em',marginBottom:'.5rem'}}>{item.month}</div>
                <div style={{fontSize:'1rem',fontWeight:700,marginBottom:'.4rem'}}>{item.title}</div>
                <div style={{fontSize:'.92rem',color:'var(--gray)',lineHeight:1.8}}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* COUNTRY BENEFITS */}
      <div style={{padding:'5rem 5vw',background:'var(--dark)'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'3rem'}}>
            <div className="eye">COUNTRY BENEFITS</div>
            <h2 className="pg-h2">MADE FOR YOUR COUNTRY.</h2>
            <p className="pg-sub">AI-JAM US is recognized across Asia and beyond. Here's what participation means for students in key countries.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'1rem'}}>
            {[
              {flag:'🇻🇳 Vietnam',color:'var(--blue2)',title:'From Local to Global Stage',desc:'Create shareable content with professional images and videos for social media. Enhance academic presentations with research-ready materials. Connect with global mentors and industry experts. International certificate recognized by Vietnamese universities.'},
              {flag:'🇮🇩 Indonesia',color:'var(--red)',title:'SNBP / Jalur Prestasi Points',desc:'Earn qualifying points for SNBP/Jalur Prestasi university admission tracks. Globally recognized certificate with Ministry of Education validation. Connect with Indonesian mentors at global tech companies. 5 Indonesian teams received recognition in 2025.'},
              {flag:'🇲🇾 Malaysia',color:'var(--green)',title:'PAJSK-Ready Portfolio',desc:"Government recognition through Malaysia's PAJSK framework. Register entire classes with teachers earning CPD credit (5 hours). Multilingual submission support. Strong alignment with Malaysian STEM/STEAM curriculum."},
              {flag:'🇰🇷 Korea & All Countries',color:'var(--amber)',title:'Global Recognition',desc:'Direct connection with PAIAX and AXGO certification system. 100% online — no travel required. International digital certificate valid globally. Connect with 1,000+ innovators worldwide. AI-enhanced social media package included for all.'},
            ].map(item => (
              <div key={item.flag} style={{background:'var(--dark2)',border:'1px solid var(--border)',padding:'1.6rem',borderLeft:`3px solid ${item.color}`}}>
                <div style={{fontSize:'1.2rem',marginBottom:'.5rem'}}>{item.flag}</div>
                <div style={{fontSize:'1rem',fontWeight:700,marginBottom:'.5rem'}}>{item.title}</div>
                <div style={{fontSize:'1rem',color:'var(--gray)',lineHeight:1.8}}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AWARDS */}
      <div style={{padding:'5rem 5vw',background:'var(--black)'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'3rem'}}>
            <div className="eye">AWARDS & RECOGNITION</div>
            <h2 className="pg-h2">WHAT WINNERS RECEIVE.</h2>
            <p className="pg-sub">Every participant is recognized. Award winners receive global credentials that open doors to new opportunities.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1px',background:'var(--border)',marginBottom:'1.5rem'}}>
            {[
              {icon:'🏆',color:'var(--amber)',label:'Grand Prix',desc:'The highest honor. One winner selected globally from all submissions.'},
              {icon:'🥇',color:'#FFD700',label:'Gold Award',desc:'Top tier recognition. Multiple winners across categories and countries.'},
              {icon:'🥈',color:'#C0C0C0',label:'Silver Award',desc:'Excellent innovation recognized at the international level.'},
              {icon:'🥉',color:'#CD7F32',label:'Bronze Award',desc:'Outstanding entry deserving of global recognition.'},
            ].map(award => (
              <div key={award.label} style={{background:'var(--dark)',padding:'1.6rem',textAlign:'center',borderTop:`3px solid ${award.color}`}}>
                <div style={{fontSize:'2.2rem',marginBottom:'.5rem'}}>{award.icon}</div>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.3rem',letterSpacing:'.04em',color:award.color,marginBottom:'.4rem'}}>{award.label}</div>
                <div style={{fontSize:'.92rem',color:'var(--gray)',lineHeight:1.75}}>{award.desc}</div>
              </div>
            ))}
          </div>
          <div style={{background:'rgba(37,99,235,.05)',border:'1px solid rgba(59,130,246,.15)',padding:'1.4rem',fontSize:'1rem',color:'var(--gray)',lineHeight:1.8}}>
            🎁 <strong style={{color:'var(--white)'}}>All participants receive:</strong> Digital certificate of participation · AI-enhanced project poster · Social media content package (TikTok, Instagram, LinkedIn formats) · Access to the AI-JAM US global community of 10,000+ innovators
          </div>
        </div>
      </div>

      {/* 2025 SNAPSHOT */}
      <div style={{padding:'5rem 5vw',background:'var(--dark)'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'3rem'}}>
            <div className="eye">2025 COMPETITION SNAPSHOT</div>
            <h2 className="pg-h2">2025 WAS ONLY<br />THE BEGINNING.</h2>
            <p className="pg-sub">753 submissions. 17 countries. 4 continents. Here is what made the 10th anniversary event extraordinary.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1px',background:'var(--border)',marginBottom:'1.5rem'}}>
            <div style={{background:'var(--dark2)',padding:'1.5rem',display:'flex',gap:'.9rem'}}>
              <div style={{fontSize:'1.8rem',flexShrink:0,marginTop:'2px'}}>🏆</div>
              <div>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:'.72rem',color:'var(--amber)',letterSpacing:'.1em',marginBottom:'.25rem'}}>GRAND PRIX · 2025</div>
                <div style={{fontSize:'1rem',fontWeight:700,marginBottom:'.22rem'}}>AI-Powered Drone Medical Delivery</div>
                <div style={{fontSize:'.88rem',color:'var(--blue2)',marginBottom:'.25rem',fontFamily:"'Space Mono',monospace"}}>Team MedAir</div>
                <div style={{fontSize:'.9rem',color:'var(--gray)',lineHeight:1.75}}>Drone-based medical supply delivery for remote communities using AI route optimization.</div>
                <div style={{fontSize:'.82rem',color:'var(--lgray)',marginTop:'.3rem'}}>🇻🇳 Vietnam</div>
              </div>
            </div>
            <div style={{background:'var(--dark2)',padding:'1.5rem',display:'flex',gap:'.9rem'}}>
              <div style={{fontSize:'1.8rem',flexShrink:0,marginTop:'2px'}}>🥇</div>
              <div>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:'.72rem',color:'#FFD700',letterSpacing:'.1em',marginBottom:'.25rem'}}>GOLD AWARD · 2025</div>
                <div style={{fontSize:'1rem',fontWeight:700,marginBottom:'.22rem'}}>Wildfire Early Detection System</div>
                <div style={{fontSize:'.88rem',color:'var(--blue2)',marginBottom:'.25rem',fontFamily:"'Space Mono',monospace"}}>Team EcoSense</div>
                <div style={{fontSize:'.9rem',color:'var(--gray)',lineHeight:1.75}}>Smart AI sensor network reducing wildfire response time by 73%.</div>
                <div style={{fontSize:'.82rem',color:'var(--lgray)',marginTop:'.3rem'}}>🇮🇩 Indonesia</div>
              </div>
            </div>
          </div>
          <div style={{textAlign:'center',marginTop:'1.5rem'}}>
            <button className="btn-sec" onClick={() => onSwitch('winners')}>View All 2025 Winners →</button>
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div style={{padding:'5rem 5vw',background:'var(--black)'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'3rem'}}>
            <div className="eye">VOICES OF PARTICIPANTS</div>
            <h2 className="pg-h2">IN THEIR OWN WORDS.</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem'}}>
            {[
              {icon:'👩',quote:'"AI made it so easy to submit. I was worried about creating a professional presentation, but the platform transformed my simple slides into something amazing."',name:'Sarah Kim',role:'GOLD AWARD WINNER · 2025'},
              {icon:'👨',quote:'"This certificate became my first international portfolio. It opened doors to internships and research opportunities I never would have accessed otherwise."',name:'Marcus Johnson',role:'SPECIAL RECOGNITION · 2025'},
              {icon:'👥',quote:'"The 3-slide format was challenging but incredibly valuable. It forced us to distill our complex project into its essential elements — a skill we use constantly."',name:'Team Innovate',role:'BRONZE AWARD · 2025'},
            ].map(t => (
              <div key={t.name} style={{background:'var(--dark)',border:'1px solid var(--border)',padding:'1.5rem'}}>
                <div style={{fontSize:'1.6rem',marginBottom:'.6rem'}}>{t.icon}</div>
                <div style={{fontSize:'1rem',color:'var(--lgray)',lineHeight:1.8,fontStyle:'italic',marginBottom:'.8rem'}}>{t.quote}</div>
                <div style={{fontSize:'.95rem',fontWeight:700}}>{t.name}</div>
                <div style={{fontSize:'.78rem',color:'var(--amber)',fontFamily:"'Space Mono',monospace"}}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOR TEACHERS */}
      <div style={{padding:'5rem 5vw',background:'var(--dark)'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'3rem',alignItems:'center'}}>
            <div>
              <div className="eye">FOR TEACHERS & SCHOOLS</div>
              <h2 className="pg-h2" style={{textAlign:'left',fontSize:'clamp(1.8rem,3vw,2.5rem)'}}>BRING AI-JAM US<br />TO YOUR CLASS.</h2>
              <p style={{fontSize:'1rem',color:'var(--gray)',lineHeight:1.8,marginBottom:'1.5rem'}}>Transform your classroom into an AI innovation hub. 50+ schools used our Class Pack in 2025, with 92% reporting high student engagement.</p>
              <div style={{display:'flex',flexDirection:'column',gap:'.8rem'}}>
                {[
                  {icon:'📋',title:'90-Minute Lesson Plan',desc:'Step-by-step guide aligned with STEM/STEAM curricula for grades 7–12.'},
                  {icon:'🏅',title:'5 Hours CPD Credit',desc:'Earn recognized Continuing Professional Development credit for your school.'},
                  {icon:'👥',title:'Class Bulk Registration',desc:'Register your entire class with streamlined portal and group rates.'},
                ].map(item => (
                  <div key={item.title} style={{background:'var(--dark2)',border:'1px solid var(--border)',padding:'1rem',display:'flex',gap:'.8rem'}}>
                    <div style={{fontSize:'1.3rem',flexShrink:0}}>{item.icon}</div>
                    <div>
                      <div style={{fontSize:'1rem',fontWeight:600,marginBottom:'.2rem'}}>{item.title}</div>
                      <div style={{fontSize:'.92rem',color:'var(--gray)'}}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:'var(--black)',border:'1px solid rgba(59,130,246,.18)',padding:'2rem',position:'relative'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:'3px',background:'linear-gradient(90deg,var(--blue),var(--cyan))'}}></div>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:'.72rem',color:'var(--blue2)',letterSpacing:'.15em',marginBottom:'.7rem'}}>THE CLASS PACK INCLUDES</div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.6rem',letterSpacing:'.04em',marginBottom:'.7rem'}}>GET THE CLASS PACK</div>
              <div style={{display:'flex',flexDirection:'column',gap:'.4rem',marginBottom:'1.2rem'}}>
                {['Printable lesson plan (PDF)','Student submission guide','Bulk registration portal','CPD certificate upon completion','Certificate of Appreciation for school','Example winning submissions from 2025'].map(item => (
                  <div key={item} style={{fontSize:'1rem',color:'var(--lgray)',display:'flex',gap:'.5rem',alignItems:'center'}}><span style={{color:'var(--green)'}}>✓</span>{item}</div>
                ))}
              </div>
              <button className="btn-main" style={{width:'100%'}} onClick={() => onSwitch('register')}>Request Class Pack →</button>
              <p style={{fontSize:'.82rem',color:'var(--gray)',marginTop:'.7rem',textAlign:'center'}}>Check the teacher box when registering</p>
            </div>
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div style={{padding:'7rem 5vw',background:'var(--dark2)',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 60% 50% at 50% 50%,rgba(37,99,235,.07) 0%,transparent 70%)',pointerEvents:'none'}}></div>
        <div style={{position:'relative',zIndex:1,maxWidth:'700px',margin:'0 auto'}}>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:'.78rem',color:'var(--blue2)',letterSpacing:'.22em',marginBottom:'1rem'}}>AI-JAM US 2026 · 11TH EVENT</div>
          <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(2.2rem,4.5vw,4rem)',letterSpacing:'.04em',lineHeight:1,marginBottom:'1rem'}}>2025 WAS ONLY<br /><span style={{background:'linear-gradient(135deg,var(--blue2),var(--cyan))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>THE BEGINNING.</span></h2>
          <p style={{fontSize:'1rem',color:'var(--gray)',marginBottom:'1.5rem',lineHeight:1.8}}>In 2026, the stage belongs to you. 3 slides. 30 seconds. Global recognition. Join hundreds of visionary students from around the world.</p>
          <div style={{display:'inline-flex',alignItems:'center',gap:'.6rem',background:'rgba(239,68,68,.07)',border:'1px solid rgba(239,68,68,.18)',padding:'.65rem 1.3rem',marginBottom:'1.8rem',fontSize:'1rem'}}>🔴&nbsp;<span>Final Deadline: <strong style={{color:'var(--red)'}}>August 30, 2026</strong> · Results: <strong style={{color:'var(--green)'}}>September 6, 2026</strong></span></div>
          <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
            <button className="btn-main" onClick={() => onSwitch('register')}>🚀 Register Now</button>
            <a className="btn-sec" href="/AIJAM_Guidebook_2026.pdf" download="AIJAM_Guidebook_2026.pdf" target="_blank" rel="noopener noreferrer">📥 Download Official Guidebook (PDF)</a>
          </div>
          <p style={{marginTop:'1.2rem',fontSize:'.82rem',color:'rgba(148,163,184,.4)'}}>📍 855 Maude Avenue, Mountain View, CA · ✉ Team@aijam.org</p>
        </div>
      </div>
    </div>
  );
}
