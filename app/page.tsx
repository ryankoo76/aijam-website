'use client';

import { useState } from 'react';
import Nav from '@/components/Nav';
import PageHome from '@/components/PageHome';
import PageAbout from '@/components/PageAbout';
import PageAsia from '@/components/PageAsia';
import PageWinners from '@/components/PageWinners';
import PageRegister from '@/components/PageRegister';
import Footer from '@/components/Footer';
import ChatWidget, { showToastExternal } from '@/components/ChatWidget';

type Page = 'home' | 'about' | 'asia' | 'winners' | 'register';

export default function Home() {
  const [activePage, setActivePage] = useState<Page>('home');

  function switchPage(page: string) {
    setActivePage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function dlGuide() {
    showToastExternal('📘 Guidebook PDF coming soon!');
    alert(
      'Official Guidebook 2026\n\nThe PDF Guidebook will be available at:\nwww.aijam-us.com/guidebook-2026.pdf\n\nRegistered participants receive it automatically by email.\nContact: Team@aijam.org'
    );
  }

  return (
    <>
      <Nav activePage={activePage} onSwitch={switchPage} />

      <div style={{ display: activePage === 'home' ? 'block' : 'none' }}>
        <PageHome onSwitch={switchPage} onDlGuide={dlGuide} />
      </div>
      <div style={{ display: activePage === 'about' ? 'block' : 'none' }}>
        <PageAbout />
      </div>
      <div style={{ display: activePage === 'asia' ? 'block' : 'none' }}>
        <PageAsia />
      </div>
      <div style={{ display: activePage === 'winners' ? 'block' : 'none' }}>
        <PageWinners onSwitch={switchPage} />
      </div>
      <div style={{ display: activePage === 'register' ? 'block' : 'none' }}>
        <PageRegister onDlGuide={dlGuide} />
      </div>

      <Footer onSwitch={switchPage} />
      <ChatWidget />
    </>
  );
}
