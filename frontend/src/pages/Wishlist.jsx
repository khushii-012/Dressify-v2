import { useState } from 'react'

const TYPE_EMOJI = {top:'👕',bottom:'👖',shoes:'👟',accessory:'💍',outerwear:'🧥',dress:'👗'}

export default function Wishlist() {
  const [items, setItems] = useState([])
  const [form,  setForm]  = useState({name:'',brand:'',price:'',link:'',item_type:'shoes'})

  const add = () => {
    if (!form.name.trim()) return
    setItems(i => [...i, {...form, id:Date.now(), added:new Date().toISOString().slice(0,10)}])
    setForm(f => ({...f, name:'', brand:'', price:'', link:''}))
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm h-fit">
          <h3 className="font-serif text-base font-bold text-brown mb-4">+ Add Item</h3>
          {[['Item Name','name','e.g. Nike Air Force 1'],['Brand','brand','e.g. Nike'],['Price','price','e.g. ₹6,500'],['Link','link','https://...']].map(([lbl,key,ph])=>(
            <div key={key} className="mb-3">
              <label className="text-[10px] font-bold text-stone uppercase tracking-wider mb-1 block">{lbl}</label>
              <input value={form[key]} placeholder={ph} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}
                onKeyDown={e=>e.key==='Enter'&&add()}
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

        <div>
          {items.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🛍️</div>
              <p className="font-serif text-lg font-bold text-brown">Wishlist is empty</p>
              <p className="text-sm text-stone mt-2">Start adding items you want to buy!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex gap-4 items-center hover:shadow-md transition-all">
                  <div className="text-3xl">{TYPE_EMOJI[item.item_type]||'🛍️'}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-brown">{item.name}</div>
                    <div className="text-[10px] text-stone">{item.brand} {item.brand&&'·'} Added {item.added}</div>
                    {item.price && <div className="text-sm font-bold text-gold mt-1">{item.price}</div>}
                    {item.link && <a href={item.link} target="_blank" rel="noreferrer" className="text-[10px] text-gold hover:underline mt-0.5 block">View Product →</a>}
                  </div>
                  <button onClick={()=>setItems(i=>i.filter(x=>x.id!==item.id))}
                    className="w-7 h-7 bg-red-50 text-red-400 rounded-full text-xs flex items-center justify-center hover:bg-red-100 transition-colors font-bold shrink-0">✕</button>
                </div>
              ))}
              <button onClick={()=>setItems([])}
                className="w-full py-2.5 bg-white border border-gray-200 text-stone rounded-xl text-xs font-semibold hover:border-red-300 hover:text-red-400 transition-all">
                🗑️ Clear All
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
