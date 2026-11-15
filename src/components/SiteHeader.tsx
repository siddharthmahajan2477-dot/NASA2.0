import { useState } from 'react'
import { ArrowUpRight, BookOpen, Menu, Orbit, Settings2, X } from 'lucide-react'
import { useAppStore, type Screen } from '../app/store'
import ScreenLink from './ui/ScreenLink'

const links: { screen: Screen; label: string; name?: string }[] = [
  { screen: 'welcome', label: 'Home' }, { screen: 'missions', label: 'Missions' },
  { screen: 'journeys', label: 'Journeys', name: 'Mission Journeys' },
  { screen: 'chronosphere', label: 'Chronosphere' }, { screen: 'archive', label: 'Archive', name: 'Space Memory Archive' },
  { screen: 'explorer', label: 'Progress', name: 'Explorer Progress' },
]
export default function SiteHeader() {
  const [open, setOpen] = useState(false)
  const screen = useAppStore(s => s.screen), navigate = useAppStore(s => s.navigate)
  return <header className="site-header">
    <ScreenLink screen="welcome" className="wordmark" aria-label="Echoes of Exploration home"><Orbit size={29} strokeWidth={1.5} /><span>ECHOES<span className="wordmark-secondary">OF EXPLORATION</span></span></ScreenLink>
    <nav id="primary-navigation" aria-label="Connected exploration" className={`pill-navigation ${open ? 'is-open' : ''}`}>
      {links.map(link => <ScreenLink key={link.screen} screen={link.screen} aria-label={link.name} aria-current={screen === link.screen ? 'page' : undefined} onClick={() => setOpen(false)}>{link.label}</ScreenLink>)}
    </nav>
    <div className="header-controls">
      <button className="icon-button" aria-label="Settings" title="Settings" onClick={() => navigate('settings')}><Settings2 size={19} /></button>
      <button className="icon-button" aria-label="Scientific Sources & Credits" title="Scientific Sources & Credits" onClick={() => navigate('sources')}><BookOpen size={19} /></button>
      <ScreenLink screen="explorer" className="explorer-avatar" aria-label="Open my explorer profile" title="Explorer profile"><img src="/assets/previews/astronaut.webp" alt="" /><ArrowUpRight size={12} /></ScreenLink>
      <button className="icon-button mobile-menu" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
    </div>
  </header>
}
