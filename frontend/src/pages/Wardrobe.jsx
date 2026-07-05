import { useState, useEffect } from 'react'
import { getWardrobe, addWardrobeItem, deleteWardrobeItem, clearWardrobe, favWardrobeItem } from '../api'

const TYPE_EMOJI = {top:'👕',bottom:'👖',shoes:'👟',accessory:'💍',outerwear:'🧥',dress:'👗',traditional:'🥻'}
const COLOR_HEX  = {Neutral:'#b5aca0',Dark:'#3d3530',Warm:'#d4895a',Cool:'#7a9dbf',Pastel:'#e8b4c8',Earthy:'#8b7355',Pink:'#d4a0b5',Multi:'#c9956e'}

const TYPES   = ['top','bottom','outerwear','shoes','accessory','dress','traditional']
const C_FAMS  = ['Neutral','Dark','Warm','Cool','Pastel','Earthy','Pink','Multi']

export default function Wardrobe() {
  const [wardrobe, setWardrobe] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [typeF,    setTypeF]    = useState('All')
  const [favOnly,  setFavOnly]  = useState(false)
  const [form, setForm] = useState({
    item_type:'top', item_name:'', color:'', color_family:'Neutral', notes:''
  })
  const [adding, setAdding] = useState(false)

  const load = () => getWardrobe().then(setWardrobe).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleAdd = async () => {
    if (!form.item_name.trim()) return
    setAdding(true)
    await addWardrobeItem(form)
    setForm(f => ({ ...f, item_name:'', color:'', notes:'' }))
    await load()
    setAdding(false)
  }

  const handleDelete = async (id) => {
    await deleteWardrobeItem(id)
    setWardrobe(w => w.filter(x => x.item_id !== id))
  }

  const handleFav = async (id) => {
    await favWardrobeItem(id)
    setWardrobe(w => w.map(x => x.item_id === id ? { ...x, is_favourite: x.is_favourite ? 0 : 1 } : x))
  }

  let shown = wardrobe
  if (typeF !== 'All') shown = shown.filter(w => w.item_type === typeF)
  if (favOnly)         shown = shown.filter(w => w.is_favourite)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">

        {/* Add Form */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm h-fit">
          <h3 className="font-serif text-base font-bold text-brown mb-4">➕ Add Item</h3>

          {[
            ['Category', 'item_type', TYPES, 'select'],
            ['Item Name', 'item_name', null, 'text', 'e.g. White Oversized Tee'],
            ['Color',     'color',     null, 'text', 'e.g. White'],
            ['Color Family','color_family', C_FAMS, 'select'],
            ['Notes',     'notes',     null, 'text', 'Brand, tags...'],
          ].map(([label, key, opts, type, placeholder]) => (
            <div key={key} className="mb-3">
              <label className="text-[10px] font-bold text-stone uppercase tracking-wider mb-1 block">{label}</label>
              {type === 'select' ? (
                <select
                  value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 bg-cream focus:outline-none focus:border-gold"
                >
                  {opts.map(o => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  onKeyDown={e => e.key === 'Enter' && handleAdd()}
                  className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 bg-cream focus:outline-none focus:border-gold"
                />
              )}
            </div>
          ))}

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAdd}
              disabled={adding || !form.item_name.trim()}
              className="flex-1 py-2.5 bg-brown text-white rounded-xl text-xs font-bold hover:bg-brown-light transition-all disabled:opacity-50 active:scale-95"
            >
              {adding ? '...' : '➕ Add'}
            </button>
            <button
              onClick={() => { clearWardrobe(); setWardrobe([]) }}
              className="px-4 py-2.5 bg-white border border-gray-200 text-brown-muted rounded-xl text-xs font-semibold hover:border-red-300 hover:text-red-400 transition-all"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Grid */}
        <div>
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4 items-center">
            {['All', ...TYPES].map(t => (
              <button
                key={t}
                onClick={() => setTypeF(t)}
                className={`text-[10px] font-semibold px-3 py-1.5 rounded-full border transition-all
                  ${typeF === t
                    ? 'bg-brown text-white border-brown'
                    : 'bg-white text-stone border-gray-200 hover:border-gold hover:text-gold'
                  }`}
              >
                {TYPE_EMOJI[t] || '🔍'} {t}
              </button>
            ))}
            <label className="flex items-center gap-1.5 ml-auto cursor-pointer">
              <input type="checkbox" checked={favOnly} onChange={e => setFavOnly(e.target.checked)} className="accent-gold" />
              <span className="text-[10px] font-semibold text-stone">❤️ Favs only</span>
            </label>
          </div>

          <p className="text-[10px] text-stone mb-4">{shown.length} items</p>

          {loading ? (
            <div className="text-center py-16 text-stone text-sm">Loading...</div>
          ) : shown.length === 0 ? (
            <div className="text-center py-16 text-stone">
              <div className="text-5xl mb-3">👗</div>
              <p className="text-sm font-semibold">No items yet</p>
              <p className="text-xs mt-1">Add clothes using the form on the left!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {shown.map(item => {
                const em   = TYPE_EMOJI[item.item_type] || '🏷️'
                const cf   = item.color_family || 'Neutral'
                const hexc = COLOR_HEX[cf] || '#b5aca0'
                const worn = item.times_worn > 0 ? `Worn ${item.times_worn}×` : 'Never worn'
                return (
                  <div
                    key={item.item_id}
                    className={`bg-white border rounded-2xl p-3 text-center relative group card-hover
                      ${item.is_favourite ? 'border-blush' : 'border-gray-100'}`}
                  >
                    {/* Fav button */}
                    <button
                      onClick={() => handleFav(item.item_id)}
                      className="absolute top-2 right-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {item.is_favourite ? '❤️' : '🤍'}
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(item.item_id)}
                      className="absolute top-2 left-2 w-4 h-4 bg-red-400 text-white rounded-full text-[9px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold"
                    >
                      ✕
                    </button>

                    <div className="text-[9px] font-bold text-gold tracking-widest uppercase bg-gold/10 rounded-md px-1.5 py-0.5 mb-2 inline-block">
                      {item.item_type}
                    </div>
                    <div className="text-3xl mb-2">{em}</div>
                    <div className="text-[11px] font-bold text-brown leading-tight">{item.item_name}</div>
                    <div className="flex items-center justify-center gap-1 mt-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: hexc }} />
                      <span className="text-[9px] text-stone">{item.color || cf}</span>
                    </div>
                    <div className="text-[9px] text-sage mt-1">{worn}</div>
                    {item.notes && <div className="text-[9px] text-stone/60 mt-0.5 truncate">{item.notes}</div>}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
