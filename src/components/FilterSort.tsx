import { useState } from 'react'

export type SortKey = 'priceChange.h24' | 'volume.h24' | 'liquidity.usd' | 'fdv' | 'pairCreatedAt'

interface Props {
  onApply: (sort: SortKey, dir: 'asc' | 'desc') => void
  onReset: () => void
}

export function FilterSort({ onApply, onReset }: Props) {
  const [open, setOpen] = useState(false)
  const [sort, setSort] = useState<SortKey>('priceChange.h24')
  const [dir, setDir] = useState<'asc' | 'desc'>('desc')

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-50">
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-border rounded-full text-sm font-semibold hover:border-accent transition-colors shadow-lg"
        >
          ⚙ Filter &amp; Sort
        </button>
        <button
          onClick={() => { onReset(); setOpen(false) }}
          className="px-5 py-2.5 bg-surface border border-border rounded-full text-sm font-semibold hover:border-red-400 text-gray-400 hover:text-red-400 transition-colors shadow-lg"
        >
          Reset
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 flex items-end justify-center pb-20" onClick={() => setOpen(false)}>
          <div className="bg-surface border border-border rounded-xl p-6 w-80 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold mb-4">Sort By</h3>
            <div className="flex flex-col gap-2 mb-4">
              {([
                ['priceChange.h24', '24h Change'],
                ['volume.h24', '24h Volume'],
                ['liquidity.usd', 'Liquidity'],
                ['fdv', 'FDV'],
                ['pairCreatedAt', 'Pair Age'],
              ] as [SortKey, string][]).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" name="sort" checked={sort === key} onChange={() => setSort(key)} className="accent-orange-400" />
                  {label}
                </label>
              ))}
            </div>
            <div className="flex gap-3 mb-4">
              {(['desc', 'asc'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setDir(d)}
                  className={`flex-1 py-1.5 rounded border text-sm transition-colors ${dir === d ? 'border-accent text-accent' : 'border-border text-gray-400'}`}
                >
                  {d === 'desc' ? '↓ Desc' : '↑ Asc'}
                </button>
              ))}
            </div>
            <button
              onClick={() => { onApply(sort, dir); setOpen(false) }}
              className="w-full py-2 bg-accent text-black font-bold rounded hover:opacity-90 transition-opacity"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </>
  )
}
