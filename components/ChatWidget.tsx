'use client';

import { useState, useEffect, useRef } from 'react';

const faqs: Record<string, string> = {
  deadline: 'Submission deadline is August 30, 2026 (23:59 KST). Results announced online September 6, 2026.',
  submit: 'You need exactly 3 slides + a 30-second video. Download the Official Guidebook for step-by-step instructions!',
  slide: 'Slide 1 = The Problem · Slide 2 = Your AI Solution · Slide 3 = Impact & Vision',
  video: 'Max 30 seconds, any format, any language. Smartphone recording is completely fine!',
  eligible: 'Grades 7-12 and university students worldwide. Individual or team (up to 5 members).',
  code: 'No coding required! You need a great AI idea and the ability to explain it in 3 slides and 30 seconds.',
  award: 'Grand Prix, Gold, Silver, Bronze. All participants get digital certificates + AI social media content.',
  fee: 'Participation fee details are sent to your email after registration.',
  result: 'Results are announced online on September 6, 2026. Online announcement only.',
  about: 'AI-JAM US was founded in 2015 by Mr. Rayn Koo. Now in its 11th year with 10,000+ participants from 72+ countries, based in Mountain View, CA.',
  winner: 'Download the full 2025 Award List PDF from the Winners page. For 2024 and earlier: Team@aijam.org',
  guide: 'Click "Download Official Guidebook" button. Registered participants get it automatically by email.',
};

const toasts = [
  '🇻🇳 New registration from Vietnam!',
  '🇮🇩 Indonesian student joined 2026!',
  '🇲🇾 Malaysian school downloaded Guidebook',
  '🇰🇷 Korean team registered!',
  '🌍 New participant just signed up!',
];

interface Message {
  text: string;
  from: 'bot' | 'user';
}

export function showToastExternal(msg: string) {
  window.dispatchEvent(new CustomEvent('show-toast', { detail: msg }));
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: '👋 Hi! Ask me anything about AI-JAM US 2026!', from: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [toast, setToast] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastIndexRef = useRef(0);
  const msgsRef = useRef<HTMLDivElement>(null);

  function showToast(msg?: string) {
    const text = msg || toasts[toastIndexRef.current % toasts.length];
    toastIndexRef.current++;
    setToast(text);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 4200);
  }

  useEffect(() => {
    const handler = (e: Event) => showToast((e as CustomEvent).detail);
    window.addEventListener('show-toast', handler);
    return () => window.removeEventListener('show-toast', handler);
  }, []);

  useEffect(() => {
    const initial = setTimeout(() => {
      showToast();
      const interval = setInterval(() => {
        if (!toastVisible) showToast();
      }, 10000);
      return () => clearInterval(interval);
    }, 8000);
    return () => clearTimeout(initial);
  }, []);

  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [messages]);

  function sendChat() {
    const msg = input.trim();
    if (!msg) return;
    setMessages(prev => [...prev, { text: msg, from: 'user' }]);
    setInput('');
    setTimeout(() => {
      const ml = msg.toLowerCase();
      let ans = 'Please email Team@aijam.org for detailed information. We reply within 24 hours. 😊';
      for (const [k, v] of Object.entries(faqs)) {
        if (ml.includes(k)) { ans = v; break; }
      }
      setMessages(prev => [...prev, { text: ans, from: 'bot' }]);
    }, 800);
  }

  return (
    <>
      <button className="cfab" onClick={() => setOpen(o => !o)}>💬</button>

      <div className={`cwin${open ? ' open' : ''}`}>
        <div className="chdr">
          <div>
            <div className="cht">AI-JAM US Support</div>
            <div className="chs">● Instant answers</div>
          </div>
          <button className="cx" onClick={() => setOpen(false)}>✕</button>
        </div>
        <div className="cmsgs" ref={msgsRef}>
          {messages.map((m, i) => (
            <div key={i} className={`cm ${m.from}`}>{m.text}</div>
          ))}
        </div>
        <div className="cir">
          <input
            type="text"
            className="cin"
            placeholder="Ask a question..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendChat(); }}
          />
          <button className="csnd" onClick={sendChat}>➤</button>
        </div>
      </div>

      <div className={`toast${toastVisible ? ' show' : ''}`}>
        <div className="tdot"></div>
        <span>{toast}</span>
      </div>
    </>
  );
}
