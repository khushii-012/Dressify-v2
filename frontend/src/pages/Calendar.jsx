import { useState } from 'react'
import { generateOutfit } from '../api'

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const OCCS  = ['College','Office','Party','Date','Casual Outing','Vacation','Gym']

function getWeekDates() {
  const today = new Date()
  const day   = today.getDay() || 7
  const mon   = new Date(today)
  mon.setDate(today.getDate() - day + 1)
  return Array.from({length:7}, (_,i) => {
    const d = new Date(mon); d.setDate(mon.getDate()+i); return d
  })
}

export default function Calendar({ profile }) {
  const [planned, setPlanned] = useState({})
  const [selDate, setSelDate] = useState('')
  const [selOcc,  setSelOcc]  = useState('College')
  const [loading, setLoading] = useState(false)

  const weekDates = getWeekDates()
  const todayStr  = new Date().toISOString().split('T')[0]

  const plan = async () => {
    if (!selDate || !selOcc) return
    setLoading(true)
    try {
      const p = profile || {}
      const result = await generateOutfit({
        gender: p.gender||'Female', age: p.age||20,
        body_type: p.body_type||'All', skin_tone: p.skin_tone||'Wheatish',
        occasion: selOcc, weather: p.weather||'Sunny',
        preferred_fit: p.preferred_fit||'Regular',
        fav_colors: p.fav_colors||['Neutral'], use_wardrobe: false,
      })
      const preview = Object.values(result.outfit).slice(0,3).map(v=>v.item).join(' · ')
      setPlanned(p => ({...p, [selDate]: {occ: selOcc, preview}}))
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Weekly grid */}
      <div className="grid grid-cols-7 gap-3 mb-8">
        {weekDates.map((dt, i) => {
          const key     = dt.toISOString().split('T')[0]
          const isToday = key === todayStr
          const hasFit  = !!planned[key]
          const isSel   = key === selDate
          return (
            <div key={key} onClick={() => setSelDate(key)}
              className={`rounded-2xl p-3 text-center cursor-pointer transition-all min-h-[90px] select-none
                ${isSel ? 'ring-2 ring-gold shadow-md' : ''}
                ${isToday ? 'border-2 border-brown bg-white shadow' : hasFit ? 'bg-white border border-gold/40 shadow-sm' : 'bg-white border border-gray-100 shadow-sm hover:border-gold/30'}`}>
              <div className="text-[9px] font-bold text-stone uppercase tracking-wider">{DAYS[i]}</div>
              <div className="text-base font-bold text-brown my-1">{dt.getDate()}</div>
              {isToday && !hasFit && <div className="text-[9px] text-gold font-semibold">Today</div>}
              {hasFit && (
                <div className="text-[8px] text-gold font-semibold leading-tight mt-0.5">
                  {planned[key].occ}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Plan form */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
        <h3 className="font-serif text-base font-bold text-brown mb-4">📅 Plan an Outfit</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] font-bold text-stone uppercase tracking-wider mb-1 block">Select Date</label>
            <input type="date" value={selDate} onChange={e=>setSelDate(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 bg-cream focus:outline-none focus:border-gold"/>
          </div>
          <div>
            <label className="text-[10px] font-bold text-stone uppercase tracking-wider mb-1 block">Occasion</label>
            <select value={selOcc} onChange={e=>setSelOcc(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 bg-cream focus:outline-none focus:border-gold">
              {OCCS.map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={plan} disabled={loading||!selDate}
              className="w-full py-2.5 bg-brown text-white rounded-xl text-xs font-bold hover:bg-brown-light transition-all disabled:opacity-50 active:scale-95">
              {loading ? 'Generating...' : '📅 Plan Outfit'}
            </button>
          </div>
        </div>
      </div>

      {/* Planned list */}
      {Object.keys(planned).length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="font-serif text-base font-bold text-brown mb-4">Planned Outfits</h3>
          <div className="space-y-2">
            {Object.entries(planned).sort().map(([dt,{occ,preview}]) => (
              <div key={dt} className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
                <span className="text-xs font-bold text-gold min-w-[100px]">{dt}</span>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-brown">{occ}</span>
                  <span className="text-[10px] text-stone ml-2">{preview}</span>
                </div>
                <button onClick={()=>setPlanned(p=>{const n={...p};delete n[dt];return n})}
                  className="text-[10px] text-red-300 hover:text-red-400 shrink-0">✕</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
