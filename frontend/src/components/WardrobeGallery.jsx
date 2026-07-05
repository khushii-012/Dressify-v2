const TYPE_EMOJI = {top:'👕',bottom:'👖',shoes:'👟',accessory:'💍',outerwear:'🧥',dress:'👗',traditional:'🥻'}
const COLOR_HEX  = {Neutral:'#b5aca0',Dark:'#3d3530',Warm:'#d4895a',Cool:'#7a9dbf',Pastel:'#e8b4c8',Earthy:'#8b7355',Pink:'#d4a0b5',Multi:'#c9956e'}
const TYPE_ORDER = ['top','bottom','outerwear','shoes','accessory','dress','traditional']

export default function WardrobeGallery({ wardrobe }) {
  if (!wardrobe?.length) return null

  // Group by type
  const groups = {}
  wardrobe.forEach(item => {
    groups[item.item_type] = groups[item.item_type] || []
    groups[item.item_type].push(item)
  })

  return (
    <div className="mt-6">
      <div className="border-t border-gray-100 pt-5">
        <h3 className="font-serif text-base font-bold text-brown mb-1">Browse My Closet</h3>
        <p className="text-[11px] text-stone mb-4">Your clothes organised by category</p>

        {TYPE_ORDER.map(t => {
          const items = groups[t]
          if (!items?.length) return null
          const em = TYPE_EMOJI[t] || '🏷️'

          return (
            <div key={t} className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold text-brown">{em} {t.charAt(0).toUpperCase()+t.slice(1)}s</span>
                <span className="text-[9px] bg-cream-dark text-stone rounded-full px-2 py-0.5">{items.length}</span>
              </div>

              <div className="gallery-scroll">
                {items.slice(0,10).map(item => {
                  const cf   = item.color_family || 'Neutral'
                  const hexc = COLOR_HEX[cf] || '#b5aca0'
                  const worn = item.times_worn > 0 ? `Worn ${item.times_worn}×` : ''
                  return (
                    <div
                      key={item.item_id}
                      className="flex-shrink-0 w-[80px] bg-white border border-gray-100 rounded-xl p-2.5 text-center card-hover cursor-pointer"
                    >
                      <div className="text-2xl mb-1.5">{em}</div>
                      <div className="text-[10px] font-semibold text-brown leading-tight line-clamp-2">{item.item_name}</div>
                      <div className="flex items-center justify-center gap-1 mt-1.5">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ background: hexc }} />
                        <span className="text-[9px] text-stone">{cf}</span>
                      </div>
                      {worn && <div className="text-[9px] text-sage mt-1">{worn}</div>}
                      {item.is_favourite ? <div className="text-[10px] mt-0.5">❤️</div> : null}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
