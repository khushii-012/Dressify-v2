export default function ScoreRing({ score, confidence, factors = [] }) {
  const color = score >= 80 ? '#c9956e' : score >= 65 ? '#9b87b8' : '#7aaa90'
  const deg   = score * 3.6

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center flex flex-col items-center shadow-sm">
      {/* Ring */}
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mb-3"
        style={{ background: `conic-gradient(${color} ${deg}deg, #f0ebe3 0deg)` }}
      >
        <div className="w-[68px] h-[68px] rounded-full bg-white flex flex-col items-center justify-center">
          <span className="font-serif text-2xl font-black" style={{ color, lineHeight:1 }}>{score}</span>
          <span className="text-[9px] text-stone">/ 100</span>
        </div>
      </div>

      <div className="text-xs font-bold text-brown mb-0.5">{confidence}</div>
      <div className="text-[10px] text-stone mb-3">AI Match Score</div>

      <div className="w-full text-left space-y-0.5">
        {factors.slice(0,3).map((f,i) => (
          <div key={i} className="text-[10px] text-sage">✓ {f}</div>
        ))}
      </div>
    </div>
  )
}
