const PAGE_META = {
  today:     { title: "Today's Look",  sub: 'AI picks your perfect outfit for today' },
  wardrobe:  { title: 'My Wardrobe',   sub: 'Your personal closet — add clothes for AI styling' },
  analytics: { title: 'Analytics',     sub: 'Smart insights into your wardrobe' },
  calendar:  { title: 'Outfit Planner',sub: 'Plan outfits for the week — no repeats' },
  saved:     { title: 'Saved Looks',   sub: 'Your favourite outfits — rate and track' },
  wishlist:  { title: 'Wishlist',      sub: 'Save items you want to buy' },
  trends:    { title: 'Fashion Trends',sub: "What's trending — Summer 2026 edition" },
}

const PILLS = ['✨ AI Scoring', '🧥 Smart Wardrobe', '🎨 Color Analysis', '📊 Analytics', '📅 Planner']

export default function Header({ page }) {
  const meta = PAGE_META[page] || PAGE_META.today
  return (
    <header className="bg-brown flex-shrink-0 px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="font-serif text-xl font-black text-gold tracking-tight">{meta.title}</h1>
        <p className="text-[11px] text-white/40 tracking-widest uppercase mt-0.5">{meta.sub}</p>
      </div>
      <div className="hidden lg:flex gap-2">
        {PILLS.map(p => (
          <span key={p} className="text-[10px] text-white/60 bg-white/8 border border-white/10 rounded-full px-3 py-1">
            {p}
          </span>
        ))}
      </div>
    </header>
  )
}
