import { useState } from 'react'
import { updateUser } from '../api'

const NAV = [
  { key:'today',     icon:'✨', label:"Today's Look"  },
  { key:'wardrobe',  icon:'👚', label:'My Wardrobe'   },
  { key:'analytics', icon:'📊', label:'Analytics'     },
  { key:'calendar',  icon:'📅', label:'Calendar'      },
  { key:'saved',     icon:'❤️', label:'Saved Looks'   },
  { key:'wishlist',  icon:'🛍️', label:'Wishlist'      },
  { key:'trends',    icon:'🔥', label:'Trends'        },
]

const OCCASIONS = ['College','Office','Interview','Wedding','Party','Date','Casual Outing','Gym','Airport Look','Vacation','Festival','Traditional Function']
const WEATHERS  = ['Sunny','Rainy','Winter','Humid','Windy']
const FITS      = ['Regular','Oversized','Slim']
const BODY_TYPES= ['All','Hourglass','Pear','Apple','Rectangle','Inverted Triangle']
const SKIN_TONES= ['All','Fair','Wheatish','Medium','Dark']
const COLORS    = ['Neutral','Dark','Warm','Cool','Pastel','Earthy','Pink','Multi']

export default function Sidebar({ page, setPage, profile, setProfile }) {
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  // Local form state (synced from profile)
  const [form, setForm] = useState({
    name:'User', gender:'Female', age:20, body_type:'All',
    skin_tone:'Wheatish', preferred_fit:'Regular',
    fav_colors:['Neutral','Warm'],
    occasion:'College', weather:'Sunny',
  })

  // Sync form from profile when loaded
  useState(() => {
    if (profile) setForm(f => ({
      ...f,
      name: profile.name || 'User',
      gender: profile.gender || 'Female',
      age: profile.age || 20,
      body_type: profile.body_type || 'All',
      skin_tone: profile.skin_tone || 'Wheatish',
      preferred_fit: profile.preferred_fit || 'Regular',
      fav_colors: profile.fav_colors || ['Neutral','Warm'],
    }))
  }, [profile])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const toggleColor = (c) => {
    setForm(f => ({
      ...f,
      fav_colors: f.fav_colors.includes(c)
        ? f.fav_colors.filter(x => x !== c)
        : [...f.fav_colors, c]
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    await updateUser(form)
    setProfile(p => ({ ...p, ...form }))
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-full overflow-hidden flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="font-serif text-xl font-black text-brown tracking-tight">👗 DressiFy AI</div>
        <div className="text-[10px] text-stone tracking-[3px] uppercase mt-0.5">Fashion Stylist</div>
      </div>

      {/* Nav */}
      <nav className="p-2 flex-shrink-0">
        {NAV.map(n => (
          <button
            key={n.key}
            onClick={() => setPage(n.key)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-semibold mb-0.5 transition-all duration-150
              ${page === n.key
                ? 'bg-brown text-white'
                : 'text-brown-muted hover:bg-cream hover:text-brown'
              }`}
          >
            <span className="text-sm">{n.icon}</span>
            {n.label}
          </button>
        ))}
      </nav>

      {/* Profile & Settings — scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-3 border-t border-gray-100">
        <div className="text-[10px] font-bold tracking-[2px] uppercase text-gold mb-3">Style Profile</div>

        <label className="text-[10px] text-stone font-semibold uppercase tracking-wider mb-1 block">Name</label>
        <input
          value={form.name}
          onChange={e => set('name', e.target.value)}
          className="w-full text-xs border border-gray-200 rounded-lg px-3 py-1.5 mb-3 bg-cream focus:outline-none focus:border-gold"
        />

        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            ['Gender',   'gender',   ['Female','Male','Other']],
            ['Body',     'body_type', BODY_TYPES],
            ['Skin Tone','skin_tone', SKIN_TONES],
            ['Fit',      'preferred_fit', FITS],
            ['Occasion', 'occasion', OCCASIONS],
            ['Weather',  'weather',  WEATHERS],
          ].map(([label, key, opts]) => (
            <div key={key}>
              <label className="text-[9px] text-stone font-semibold uppercase tracking-wider mb-0.5 block">{label}</label>
              <select
                value={form[key]}
                onChange={e => set(key, e.target.value)}
                className="w-full text-[10px] border border-gray-200 rounded-lg px-2 py-1 bg-cream focus:outline-none focus:border-gold"
              >
                {opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>

        <label className="text-[9px] text-stone font-semibold uppercase tracking-wider mb-1.5 block">Age: {form.age}</label>
        <input
          type="range" min="13" max="60" value={form.age}
          onChange={e => set('age', +e.target.value)}
          className="w-full mb-3 accent-gold"
        />

        <label className="text-[9px] text-stone font-semibold uppercase tracking-wider mb-1.5 block">Fav Colors</label>
        <div className="flex flex-wrap gap-1 mb-4">
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => toggleColor(c)}
              className={`text-[9px] font-semibold rounded-full px-2 py-0.5 border transition-all
                ${form.fav_colors.includes(c)
                  ? 'bg-gold text-white border-gold'
                  : 'bg-cream text-stone border-gray-200 hover:border-gold'
                }`}
            >
              {c}
            </button>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-2 rounded-xl text-xs font-bold transition-all
            bg-brown text-white hover:bg-brown-light active:scale-95"
        >
          {saving ? '...' : saved ? '✓ Saved!' : '💾 Save Profile'}
        </button>
      </div>
    </aside>
  )
}
