// ═══ SAVED LOOKS ═══
import { useState, useEffect } from 'react'
import { getHistory, rateOutfit, favOutfit } from '../api'

export function Saved() {
  const [history, setHistory] = useState([])
  const [favOnly, setFavOnly] = useState(false)
  const [occF,    setOccF]    = useState('All')

  useEffect(() => { getHistory().then(setHistory).catch(()=>{}) }, [])

  const occasions = [...new Set(history.map(h=>h.occasion))]
  let shown = history
  if (favOnly)       shown = shown.filter(h=>h.is_favourite)
  if (occF!=='All')  shown = shown.filter(h=>h.occasion===occF)

  const handleRate = async (id, r) => {
    await rateOutfit(id, r)
    setHistory(h => h.map(x => x.outfit_id===id ? {...x, rating:r} : x))
  }
  const handleFav = async (id) => {
    await favOutfit(id)
    setHistory(h => h.map(x => x.outfit_id===id ? {...x, is_favourite: x.is_favourite?0:1} : x))
  }

  if (history.length === 0) return (
    <div className="text-center py-20">
      <div className="text-5xl mb-3">❤️</div>
      <p className="text-sm font-semibold text-brown">No saved looks yet</p>
      <p className="text-xs text-stone mt-1">Generate and save your first outfit!</p>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5 items-center">
        {['All',...occasions].map(o=>(
          <button key={o} onClick={()=>setOccF(o)}
            className={`text-[10px] font-semibold px-3 py-1.5 rounded-full border transition-all
              ${occF===o?'bg-brown text-white border-brown':'bg-white text-stone border-gray-200 hover:border-gold'}`}>
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
          const itemsStr = Object.entries(items).map(([k,v])=>`${k}: ${v}`).join(' · ')
          return (
            <div key={h.outfit_id}
              className={`bg-white border rounded-2xl p-4 shadow-sm transition-all hover:shadow-md
                ${h.is_favourite?'border-gold/40':'border-gray-100'}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-xs font-bold text-brown">
                    {h.is_favourite?'❤️ ':''}{h.occasion} · {h.weather}
                  </div>
                  <div className="text-[10px] text-stone mt-0.5">{h.created_at?.slice(0,10)}</div>
                </div>
                {h.ai_score>0 && (
                  <span className="text-[9px] font-bold text-gold bg-gold/10 border border-gold/25 px-2 py-0.5 rounded-lg">
                    ✨ {h.ai_score}%
                  </span>
                )}
              </div>
              <p className="text-[10px] text-brown-muted leading-relaxed mb-3">{itemsStr}</p>
              {/* Stars */}
              <div className="flex gap-1 mb-3">
                {[1,2,3,4,5].map(s=>(
                  <button key={s} onClick={()=>handleRate(h.outfit_id,s)}
                    className={`text-sm transition-transform hover:scale-125 ${s<=(h.rating||0)?'opacity-100':'opacity-30'}`}>
                    ⭐
                  </button>
                ))}
              </div>
              <button onClick={()=>handleFav(h.outfit_id)}
                className="text-[10px] font-semibold text-stone hover:text-gold transition-colors">
                {h.is_favourite?'💔 Unfavourite':'❤️ Favourite'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ═══ WISHLIST ═══
const TYPE_EMOJI={top:'👕',bottom:'👖',shoes:'👟',accessory:'💍',outerwear:'🧥',dress:'👗'}

export function Wishlist() {
  const [items, setItems] = useState([])
  const [form,  setForm]  = useState({name:'',brand:'',price:'',link:'',item_type:'shoes'})

  const add = () => {
    if (!form.name.trim()) return
    setItems(i=>[...i,{...form,id:Date.now(),added:new Date().toISOString().slice(0,10)}])
    setForm(f=>({...f,name:'',brand:'',price:'',link:''}))
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* Form */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm h-fit">
          <h3 className="font-serif text-base font-bold text-brown mb-4">+ Add Item</h3>
          {[
            ['Item Name','name','text','e.g. Nike Air Force 1'],
            ['Brand','brand','text','e.g. Nike'],
            ['Price','price','text','e.g. ₹6,500'],
            ['Link','link','text','https://...'],
          ].map(([lbl,key,type,ph])=>(
            <div key={key} className="mb-3">
              <label className="text-[10px] font-bold text-stone uppercase tracking-wider mb-1 block">{lbl}</label>
              <input type={type} value={form[key]} placeholder={ph}
                onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}
                className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 bg-cream focus:outline-none focus:border-gold"/>
            </div>
          ))}
          <div className="mb-4">
            <label className="text-[10px] font-bold text-stone uppercase tracking-wider mb-1 block">Category</label>
            <select value={form.item_type} onChange={e=>setForm(f=>({...f,item_type:e.target.value}))}
              className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 bg-cream focus:outline-none focus:border-gold">
              {Object.keys(TYPE_EMOJI).map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <button onClick={add} disabled={!form.name.trim()}
            className="w-full py-2.5 bg-brown text-white rounded-xl text-xs font-bold hover:bg-brown-light transition-all disabled:opacity-50 active:scale-95">
            ➕ Add to Wishlist
          </button>
        </div>

        {/* List */}
        <div>
          {items.length===0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-3">🛍️</div>
              <p className="text-sm font-semibold text-brown">Wishlist is empty</p>
              <p className="text-xs text-stone mt-1">Start adding items you want to buy!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map(item=>(
                <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex gap-4 items-center hover:shadow-md transition-all">
                  <div className="text-3xl">{TYPE_EMOJI[item.item_type]||'🛍️'}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-brown">{item.name}</div>
                    <div className="text-[10px] text-stone">{item.brand} · Added {item.added}</div>
                    {item.price && <div className="text-sm font-bold text-gold mt-1">{item.price}</div>}
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noreferrer"
                        className="text-[10px] text-gold hover:underline mt-0.5 block">
                        View Product →
                      </a>
                    )}
                  </div>
                  <button onClick={()=>setItems(i=>i.filter(x=>x.id!==item.id))}
                    className="w-6 h-6 bg-red-50 text-red-400 rounded-full text-xs flex items-center justify-center hover:bg-red-100 transition-colors font-bold shrink-0">
                    ✕
                  </button>
                </div>
              ))}
              <button onClick={()=>setItems([])}
                className="w-full py-2.5 bg-white border border-gray-200 text-stone rounded-xl text-xs font-semibold hover:border-red-300 hover:text-red-400 transition-all mt-2">
                🗑️ Clear Wishlist
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ═══ TRENDS ═══
const TRENDS = [
  {season:'Summer 2026',title:'Linen Everything',sub:'Breathable, elegant, effortless',items:['Linen Shirt','Linen Co-ord','Linen Trousers','Linen Shorts'],color:'#d4895a'},
  {season:'Summer 2026',title:'Earth Tones',sub:'Warm, grounded, nature-inspired',items:['Rust Crop Top','Camel Trousers','Terracotta Dress','Olive Jacket'],color:'#8b7355'},
  {season:'Summer 2026',title:'Co-ord Sets',sub:'Matching sets are the new power move',items:['Sage Green Set','White Linen Set','Brown Knit Set','Beige Set'],color:'#7a9dbf'},
  {season:'Summer 2026',title:'Minimal Silver',sub:'Less is more — clean and simple',items:['Thin Gold Chain','Silver Cuff','Minimal Watch','Hoop Earrings'],color:'#9b87b8'},
  {season:'Summer 2026',title:'Wide-Leg Denim',sub:'The 90s are back and thriving',items:['Baggy Blue Jeans','Wide-Leg White','Mom Jeans','Barrel Leg'],color:'#7aaa90'},
  {season:'Summer 2026',title:'Sporty Luxe',sub:'Gym-to-street transition looks',items:['Crop Sports Bra','Track Pants','Windbreaker','Chunky Sneakers'],color:'#c97070'},
]

export function Trends() {
  const [advice, setAdvice]   = useState('')
  const [loading, setLoading] = useState(false)

  const getAdvice = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL||'http://localhost:8000'}/api/trends/advice`)
      const d   = await res.json()
      setAdvice(d.advice || '')
    } catch {
      setAdvice('Linen and earth tones dominate Summer 2026. Try a sage green co-ord or camel wide-leg trousers. Minimalist silver jewellery pairs perfectly with neutrals.')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {TRENDS.map(t=>(
          <div key={t.title}
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
            style={{borderLeftColor:t.color,borderLeftWidth:'4px'}}>
            <div className="text-[9px] font-bold uppercase tracking-[2px] mb-2" style={{color:t.color}}>{t.season}</div>
            <div className="font-serif text-base font-bold text-brown mb-1">{t.title}</div>
            <div className="text-[11px] text-stone mb-3">{t.sub}</div>
            <div className="flex flex-wrap gap-1.5">
              {t.items.map(item=>(
                <span key={item} className="text-[10px] font-semibold bg-cream text-brown-muted rounded-full px-2.5 py-1">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* AI Advice */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-base font-bold text-brown">✨ AI Style Advice</h3>
          <button onClick={getAdvice} disabled={loading}
            className="px-5 py-2.5 bg-brown text-white rounded-xl text-xs font-bold hover:bg-brown-light transition-all disabled:opacity-50 active:scale-95">
            {loading?'Asking AI...':'🧠 Get Trend Advice'}
          </button>
        </div>
        {advice ? (
          <div className="p-4 rounded-xl" style={{background:'linear-gradient(135deg,rgba(201,149,110,0.06),rgba(212,160,181,0.06))',borderLeft:'3px solid #c9956e',border:'1px solid rgba(201,149,110,0.2)',borderLeftWidth:'3px'}}>
            <p className="text-sm text-brown-muted leading-relaxed">{advice}</p>
          </div>
        ) : (
          <p className="text-xs text-stone">Click the button to get personalised Summer 2026 style tips!</p>
        )}
      </div>
    </div>
  )
}
