import { useState, useEffect } from 'react'
import { getAnalytics } from '../api'

const COLOR_HEX = {Neutral:'#b5aca0',Dark:'#3d3530',Warm:'#d4895a',Cool:'#7a9dbf',Pastel:'#e8b4c8',Earthy:'#8b7355',Pink:'#d4a0b5',Multi:'#c9956e'}
const TYPE_EMOJI= {top:'👕',bottom:'👖',shoes:'👟',accessory:'💍',outerwear:'🧥',dress:'👗',traditional:'🥻'}

function BarRow({ label, count, max, color = 'linear-gradient(90deg,#c9956e,#d4a0b5)', icon }) {
  const pct = max > 0 ? Math.round(count / max * 100) : 0
  return (
    <div className="mb-3">
      <div className="flex justify-between text-[11px] mb-1.5">
        <span className="font-medium text-brown-muted">{icon} {label}</span>
        <span className="font-bold text-gold">{count}</span>
      </div>
      <div className="h-2 bg-cream-dark rounded-full overflow-hidden">
        <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

export default function Analytics() {
  const [data, setData] = useState(null)

  useEffect(() => { getAnalytics().then(setData).catch(() => {}) }, [])

  if (!data) return <div className="text-center py-20 text-stone text-sm">Loading analytics...</div>
  if (data.total === 0) return (
    <div className="text-center py-20">
      <div className="text-5xl mb-3">📊</div>
      <p className="text-sm font-semibold text-brown">Add clothes to see analytics!</p>
    </div>
  )

  const byType  = data.by_type    || {}
  const byColor = data.color_analysis?.distribution || {}
  const missing = data.missing    || []
  const maxType = Math.max(...Object.values(byType), 1)
  const maxColor= Math.max(...Object.values(byColor), 1)

  const stats = [
    { n: data.total,                    l: 'Total Items'  },
    { n: Object.keys(byType).length,    l: 'Categories'   },
    { n: data.most_worn?.filter(i=>i.times_worn>0).length||0, l: 'Worn Items' },
    { n: data.never_worn?.length||0,    l: 'Never Worn'   },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({n,l}) => (
          <div key={l} className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm card-hover">
            <div className="font-serif text-3xl font-black text-gold">{n}</div>
            <div className="text-[10px] font-bold text-stone uppercase tracking-wider mt-1">{l}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* By Type */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-serif text-sm font-bold text-brown mb-4">Items by Category</h3>
          {Object.entries(byType).sort((a,b)=>b[1]-a[1]).map(([t,cnt]) => (
            <BarRow key={t} label={t.charAt(0).toUpperCase()+t.slice(1)+'s'} count={cnt} max={maxType} icon={TYPE_EMOJI[t]||'🏷️'} />
          ))}
        </div>

        {/* By Color */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-serif text-sm font-bold text-brown mb-4">Colour Distribution</h3>
          {Object.entries(byColor).sort((a,b)=>b[1]-a[1]).map(([cf,cnt]) => (
            <BarRow key={cf} label={cf} count={cnt} max={maxColor} color={COLOR_HEX[cf]||'#c9956e'}
              icon={<span className="inline-block w-2 h-2 rounded-full align-middle mr-1" style={{background:COLOR_HEX[cf]||'#888'}} />}
            />
          ))}
          {data.color_analysis?.missing_colors?.length > 0 && (
            <p className="text-[10px] text-stone mt-3">Missing: {data.color_analysis.missing_colors.join(', ')}</p>
          )}
        </div>

        {/* Missing Items */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-serif text-sm font-bold text-brown mb-4">🔍 Missing Items</h3>
          {missing.length === 0 ? (
            <p className="text-sm text-sage">Wardrobe looks complete! ✓</p>
          ) : missing.map((m,i) => (
            <div key={i} className="mb-3 p-3 rounded-xl" style={{background:'rgba(201,112,112,0.07)',border:'1px solid rgba(201,112,112,0.2)'}}>
              <div className="text-[9px] font-bold uppercase tracking-widest text-red-400 mb-1">{m.type}</div>
              <div className="text-xs font-bold text-brown">+ {m.suggestion}</div>
              <div className="text-[10px] text-stone mt-0.5">{m.reason}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Most / Never worn */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-serif text-sm font-bold text-brown mb-4">🔥 Most Worn</h3>
          {(data.most_worn||[]).filter(i=>i.times_worn>0).map((item,i) => (
            <div key={i} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-xs text-brown-muted">{item.item_name}</span>
              <span className="text-xs font-bold text-gold">{item.times_worn}×</span>
            </div>
          ))}
          {!(data.most_worn||[]).some(i=>i.times_worn>0) && (
            <p className="text-xs text-stone">No wear data yet. Mark outfits as worn!</p>
          )}
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-serif text-sm font-bold text-brown mb-4">😴 Never Worn</h3>
          {(data.never_worn||[]).slice(0,5).map((item,i) => (
            <div key={i} className="py-2 border-b border-gray-50 last:border-0 text-xs text-brown-muted">
              {TYPE_EMOJI[item.item_type]||'🏷️'} {item.item_name}
            </div>
          ))}
          {(data.never_worn||[]).length === 0 && (
            <p className="text-xs text-sage">You've worn everything! ✓</p>
          )}
        </div>
      </div>
    </div>
  )
}
