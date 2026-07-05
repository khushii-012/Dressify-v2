import { useState } from 'react'

const TRENDS = [
  {season:'Summer 2026',title:'Linen Everything',sub:'Breathable, elegant, effortless',items:['Linen Shirt','Linen Co-ord','Linen Trousers','Linen Shorts'],color:'#d4895a'},
  {season:'Summer 2026',title:'Earth Tones',sub:'Warm, grounded, nature-inspired',items:['Rust Crop Top','Camel Trousers','Terracotta Dress','Olive Jacket'],color:'#8b7355'},
  {season:'Summer 2026',title:'Co-ord Sets',sub:'Matching sets are the new power move',items:['Sage Green Set','White Linen Set','Brown Knit Set','Beige Set'],color:'#7a9dbf'},
  {season:'Summer 2026',title:'Minimal Silver',sub:'Less is more — clean and simple',items:['Thin Gold Chain','Silver Cuff','Minimal Watch','Hoop Earrings'],color:'#9b87b8'},
  {season:'Summer 2026',title:'Wide-Leg Denim',sub:'The 90s are back',items:['Baggy Blue Jeans','Wide-Leg White','Mom Jeans','Barrel Leg'],color:'#7aaa90'},
  {season:'Summer 2026',title:'Sporty Luxe',sub:'Gym-to-street looks',items:['Crop Sports Bra','Track Pants','Windbreaker','Chunky Sneakers'],color:'#c97070'},
]

export default function Trends() {
  const [advice,  setAdvice]  = useState('')
  const [loading, setLoading] = useState(false)

  const getAdvice = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL||'http://localhost:8000'}/api/trends/advice`)
      const d   = await res.json()
      setAdvice(d.advice || '')
    } catch {
      setAdvice('Linen and earth tones dominate Summer 2026. Try a sage green co-ord set or camel wide-leg trousers to stay on trend. Minimalist silver jewellery pairs beautifully with neutral tones.')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {TRENDS.map(t => (
          <div key={t.title} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
            style={{borderLeftColor:t.color, borderLeftWidth:'4px'}}>
            <div className="text-[9px] font-bold uppercase tracking-[2px] mb-2" style={{color:t.color}}>{t.season}</div>
            <div className="font-serif text-base font-bold text-brown mb-1">{t.title}</div>
            <div className="text-[11px] text-stone mb-3">{t.sub}</div>
            <div className="flex flex-wrap gap-1.5">
              {t.items.map(item => (
                <span key={item} className="text-[10px] font-semibold bg-cream text-brown-muted rounded-full px-2.5 py-1">{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-base font-bold text-brown">✨ AI Style Advice</h3>
          <button onClick={getAdvice} disabled={loading}
            className="px-5 py-2.5 bg-brown text-white rounded-xl text-xs font-bold hover:bg-brown-light transition-all disabled:opacity-50 active:scale-95">
            {loading ? 'Asking AI...' : '🧠 Get Trend Advice'}
          </button>
        </div>
        {advice ? (
          <div className="p-4 rounded-xl" style={{background:'linear-gradient(135deg,rgba(201,149,110,0.06),rgba(212,160,181,0.06))',borderLeft:'3px solid #c9956e',border:'1px solid rgba(201,149,110,0.2)',borderLeftWidth:'3px'}}>
            <p className="text-sm text-brown-muted leading-relaxed">{advice}</p>
          </div>
        ) : (
          <p className="text-xs text-stone">Click the button to get personalised Summer 2026 style tips based on your wardrobe!</p>
        )}
      </div>
    </div>
  )
}
