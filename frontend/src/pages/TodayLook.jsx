import { useState, useEffect } from 'react'
import { generateOutfit, saveOutfit, getWardrobe } from '../api'
import OutfitCard     from '../components/OutfitCard'
import ScoreRing      from '../components/ScoreRing'
import WardrobeGallery from '../components/WardrobeGallery'

export default function TodayLook({ profile }) {
  const [result,      setResult]      = useState(null)
  const [loading,     setLoading]     = useState(false)
  const [saving,      setSaving]      = useState(false)
  const [saved,       setSaved]       = useState(false)
  const [useCloset,   setUseCloset]   = useState(false)
  const [wardrobe,    setWardrobe]    = useState([])
  const [savedId,     setSavedId]     = useState(null)

  useEffect(() => {
    getWardrobe().then(setWardrobe).catch(() => {})
  }, [])

  const generate = async () => {
    if (!profile) return
    setLoading(true); setResult(null)
    try {
      const data = await generateOutfit({
        gender:        profile.gender        || 'Female',
        age:           profile.age           || 20,
        body_type:     profile.body_type     || 'All',
        skin_tone:     profile.skin_tone     || 'Wheatish',
        occasion:      profile.occasion      || 'College',
        weather:       profile.weather       || 'Sunny',
        preferred_fit: profile.preferred_fit || 'Regular',
        fav_colors:    profile.fav_colors    || ['Neutral'],
        use_wardrobe:  useCloset,
      })
      setResult(data)
    } catch(e) {
      console.error(e)
    }
    setLoading(false)
  }

  const handleSave = async () => {
    if (!result) return
    setSaving(true)
    try {
      const r = await saveOutfit({
        occasion:    result.occasion,
        weather:     result.weather,
        items:       Object.fromEntries(Object.entries(result.outfit).map(([k,v]) => [k, v.item])),
        explanation: result.explanation,
        ai_score:    result.ai_score    || 0,
        confidence:  result.confidence  || '',
      })
      setSavedId(r.outfit_id)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch(e) {}
    setSaving(false)
  }

  const p = profile || {}

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.9fr] gap-6">

        {/* LEFT — Controls */}
        <div className="space-y-4">
          {/* Use Closet toggle */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setUseCloset(u => !u)}
                className={`relative w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer
                  ${useCloset ? 'bg-brown' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200
                  ${useCloset ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-xs font-semibold text-brown">Style from my wardrobe</span>
            </label>
            {useCloset && wardrobe.length === 0 && (
              <p className="text-[10px] text-amber-600 mt-2 bg-amber-50 px-3 py-1.5 rounded-lg">
                ⚠️ Wardrobe empty — add items in My Wardrobe first
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={generate}
              disabled={loading}
              className="flex-1 bg-brown text-white rounded-xl py-3 text-sm font-bold
                hover:bg-brown-light active:scale-95 transition-all disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Styling...
                </span>
              ) : '✨ Generate Look'}
            </button>
            <button
              onClick={generate}
              disabled={loading}
              className="px-4 py-3 bg-white border border-gray-200 text-brown rounded-xl text-sm font-semibold
                hover:border-gold hover:text-gold transition-all disabled:opacity-60"
            >
              🔁
            </button>
          </div>

          {/* Context card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="text-[9px] font-bold tracking-[2px] uppercase text-gold mb-3">Your Context</div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: p.occasion || 'College', dark: true },
                { label: p.weather  || 'Sunny',   dark: true },
                { label: p.gender   || 'Female'               },
                { label: p.body_type|| 'All'                  },
                { label: (p.skin_tone||'Wheatish')+' Skin'    },
                { label: (p.preferred_fit||'Regular')+' Fit'  },
              ].map(({label,dark}) => (
                <span key={label}
                  className={`text-[10px] font-semibold rounded-full px-2.5 py-1
                    ${dark
                      ? 'bg-brown text-white'
                      : 'bg-gold/10 text-gold border border-gold/25'
                    }`}
                >
                  {label}
                </span>
              ))}
              {(p.fav_colors||[]).map(c => (
                <span key={c} className="text-[10px] font-semibold rounded-full px-2.5 py-1 bg-gold/10 text-gold border border-gold/25">
                  {c}
                </span>
              ))}
            </div>
            {wardrobe.length > 0 && (
              <p className="text-[10px] text-sage mt-3">🧥 {wardrobe.length} items in your wardrobe</p>
            )}
          </div>

          {/* Score ring — shows after generation */}
          {result && (
            <ScoreRing
              score={result.ai_score || 0}
              confidence={result.confidence || 'Match'}
              factors={result.score_factors || []}
            />
          )}
        </div>

        {/* RIGHT — Outfit */}
        <div>
          {result ? (
            <>
              <OutfitCard
                outfit={result.outfit}
                hairOptions={result.hair_options}
                explanation={result.explanation}
              />

              {/* Action buttons */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-brown text-white hover:bg-brown-light transition-all active:scale-95"
                >
                  {saving ? '...' : saved ? '✓ Saved!' : '❤️ Save Look'}
                </button>
                <button
                  onClick={() => { setResult(null); setSavedId(null) }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-white border border-gray-200 text-brown hover:border-gold hover:text-gold transition-all"
                >
                  🗑️ Clear
                </button>
              </div>
            </>
          ) : (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center">
              <div className="text-6xl mb-4">👗</div>
              <h3 className="font-serif text-xl font-bold text-brown mb-2">Ready to get styled?</h3>
              <p className="text-sm text-stone">Set your profile in the sidebar and click Generate Look</p>
            </div>
          )}
        </div>
      </div>

      {/* Wardrobe Gallery */}
      <WardrobeGallery wardrobe={wardrobe} />
    </div>
  )
}
