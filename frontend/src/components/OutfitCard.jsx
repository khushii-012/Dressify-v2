export default function OutfitCard({ outfit, hairOptions, explanation }) {
  if (!outfit) return null

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm relative overflow-hidden animate-up">
      {/* Accent top border */}
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
           style={{ background: 'linear-gradient(90deg, #c9956e, #d4a0b5, #9b87b8)' }} />

      <h3 className="font-serif text-base font-bold text-brown mb-4 pt-1">✨ Today's Complete Look</h3>

      <div className="space-y-2">
        {Object.entries(outfit).map(([cat, det]) => {
          const isW = det.source === 'wardrobe'
          return (
            <div
              key={cat}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 outfit-row-hover
                ${isW ? 'border-sage/40 bg-sage/5' : 'border-gray-100 bg-cream'}`}
            >
              <span className="text-2xl w-8 text-center">{det.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[9px] font-bold text-gold tracking-[1.8px] uppercase">{cat}</div>
                <div className="text-[13px] font-semibold text-brown truncate mt-0.5">{det.item}</div>
                {det.description && (
                  <div className="text-[10px] text-stone mt-0.5">{det.description}</div>
                )}
              </div>
              <span className={`text-[9px] font-bold px-2 py-1 rounded-lg shrink-0
                ${isW
                  ? 'bg-sage/15 text-sage border border-sage/30'
                  : 'bg-gold/10 text-gold border border-gold/30'
                }`}>
                {isW ? '👚 Closet' : '✦ AI'}
              </span>
            </div>
          )
        })}

        {/* Hairstyle */}
        {hairOptions?.[0] && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-cream outfit-row-hover">
            <span className="text-2xl w-8 text-center">{hairOptions[0][0]}</span>
            <div className="flex-1">
              <div className="text-[9px] font-bold text-gold tracking-[1.8px] uppercase">Hairstyle</div>
              <div className="text-[13px] font-semibold text-brown mt-0.5">{hairOptions[0][1]}</div>
              <div className="text-[10px] text-stone">{hairOptions[0][2]}</div>
            </div>
          </div>
        )}
        {hairOptions?.[1] && (
          <p className="text-[10px] text-stone ml-1">
            Alt: <span className="text-gold font-bold">{hairOptions[1][1]}</span> — {hairOptions[1][2]}
          </p>
        )}
      </div>

      {/* Why card */}
      {explanation && (
        <div className="mt-4 rounded-r-xl rounded-br-xl p-4"
             style={{
               background: 'linear-gradient(135deg,rgba(201,149,110,0.06),rgba(212,160,181,0.06))',
               borderLeft: '3px solid #c9956e',
               border: '1px solid rgba(201,149,110,0.2)',
               borderLeftWidth: '3px',
             }}>
          <div className="text-[11px] font-bold text-gold mb-1.5">🎨 Why This Works For You</div>
          <p className="text-[12px] text-brown-muted leading-relaxed">{explanation}</p>
        </div>
      )}
    </div>
  )
}
