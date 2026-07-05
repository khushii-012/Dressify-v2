import { useState, useEffect } from 'react'
import Sidebar    from './components/Sidebar'
import Header     from './components/Header'
import TodayLook  from './pages/TodayLook'
import Wardrobe   from './pages/Wardrobe'
import Analytics  from './pages/Analytics'
import Calendar   from './pages/Calendar'
import Saved      from './pages/Saved'
import Wishlist   from './pages/Wishlist'
import Trends     from './pages/Trends'
import { getUser } from './api'

const PAGES = { today:TodayLook, wardrobe:Wardrobe, analytics:Analytics, calendar:Calendar, saved:Saved, wishlist:Wishlist, trends:Trends }

export default function App() {
  const [page,    setPage]    = useState('today')
  const [profile, setProfile] = useState(null)

  useEffect(() => { getUser().then(setProfile).catch(()=>{}) }, [])

  const Page = PAGES[page] || TodayLook

  return (
    <div className="flex h-screen bg-cream overflow-hidden">
      <Sidebar page={page} setPage={setPage} profile={profile} setProfile={setProfile}/>
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header page={page}/>
        <main className="flex-1 overflow-y-auto p-6">
          <Page profile={profile}/>
        </main>
      </div>
    </div>
  )
}
