import { useState, useEffect } from 'react'
import { getHistory, rateOutfit, favOutfit } from '../api'

export default function Saved() {
  const [history, setHistory] = useState([])
  const [favOnly, setFavOnly] = useState(false)
  const [occF,    setOccF]    = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => { getHistory().then(setHistory).finally(()=>setLoading(false)).catch(()=>setLoading(false)) }, [])

  const occasions = ['All', ...new Set(history.map(h=>h.occasion))]
  let shown = history
  if (favOnly)      shown = shown.filter(h=>h.is_favourite)
  if (occF!=='All') shown = shown.filter(h=>h.occasion===occF)

  const handleRate = async (id, r) => {
    await rateOutfit(id, r)
    setHistory(h => h.map(x => x.outfit_id===id ? {...x, rating:r} : x))
  }
  const handleFav = async (id) => {
    await favOutfit(id)
    setHistory(h => h.map(x => x.outfit_id===id ? {...x, is_favourite: x.is_favourite?0:1} : x))
  }

  if (loading) return <div className="text-center py-20 text-stone text-sm">Loading...</div>

  if (history.length === 0) return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">❤️</div>
      <p className="font-serif text-lg font-bold text-brown">No saved looks yet</p>
      <p className="text-sm text-stone mt-2">Generate and save your first outfit!</p>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-5 items-center">
        {occasions.map(o => (
          <button key={o} onClick={() => setOccF(o)}
            className={`text-[10px] font-semibold px-3 py-1.5 rounded-full border transition-all
              ${occF===o ? 'bg-brown text-white border-brown' : 'bg-white text-stone border-gray-200 hover:border-gold hover:text-gold'}`}>
            {o}
          </button>
        ))}
        <label className="flex items-center gap-1.5 ml-auto cursor-pointer">
          <input type="checkbox" checked={favOnly} onChange={e=>setFavOnly(e.target.checked)} className="accent-gold"/>
          <span className="text-[10px] font-semibold text-stone">❤️ Favs only</span>
        </label>
      </div>
      <p className="text-[10px] text-stone mb-4">{shown.length} outfits</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shown.map(h => {
          const items = h.items || {}
          const itemsStr = Object.entries(items).map(([k,v])=>`${k}: ${v}`).join('\n')
          return (
            <div key={h.outfit_id}
              className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden
                ${h.is_favourite ? 'border-gold/40' : 'border-gray-100'}`}>
              {h.is_favourite && (
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{background:'linear-gradient(90deg,#c9956e,#d4a0b5)'}}/>
              )}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-xs font-bold text-brown">
                    {h.is_favourite ? '❤️ ' : ''}{h.occasion}
                  </div>
                  <div className="text-[10px] text-stone mt-0.5">{h.weather} · {h.created_at?.slice(0,10)}</div>
                </div>
                {h.ai_score > 0 && (
                  <span className="text-[9px] font-bold text-gold bg-gold/10 border border-gold/25 px-2 py-0.5 rounded-lg shrink-0">
                    ✨ {h.ai_score}%
                  </span>
                )}
              </div>
              <p className="text-[10px] text-brown-muted leading-[1.9] mb-3 whitespace-pre-line">{itemsStr}</p>
              <div className="flex gap-1 mb-3">
                {[1,2,3,4,5].map(s => (
                  <button key={s} onClick={() => handleRate(h.outfit_id, s)}
                    className={`text-base transition-all hover:scale-125 ${s<=(h.rating||0)?'opacity-100':'opacity-25'}`}>⭐</button>
                ))}
              </div>
              <button onClick={() => handleFav(h.outfit_id)}
                className="text-[10px] font-semibold text-stone hover:text-gold transition-colors">
                {h.is_favourite ? '💔 Unfavourite' : '❤️ Favourite'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
