import Link from 'next/link'
import { Prospect, STATUS_COLORS } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { useLang } from './LangContext'

export default function ProspectCard({ prospect }: { prospect: Prospect }) {
  const { t } = useLang()

  return (
    <Link href={`/prospect/${prospect.id}`}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 active:bg-gray-50 transition-colors">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 truncate">{prospect.name}</h3>
            {prospect.owner && <p className="text-sm text-gray-500 truncate">{prospect.owner}</p>}
            {prospect.city && <p className="text-xs text-gray-400 mt-0.5">{prospect.city}</p>}
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${STATUS_COLORS[prospect.status]}`}>
            {t.status[prospect.status]}
          </span>
        </div>

        <div className="flex items-center gap-3 mt-3">
          {prospect.google_rating !== null && (
            <span className="flex items-center gap-1 text-xs text-gray-600">
              <span className="text-yellow-400">★</span>
              {prospect.google_rating.toFixed(1)}
              {prospect.google_reviews !== null && (
                <span className="text-gray-400">({prospect.google_reviews})</span>
              )}
            </span>
          )}
          {prospect.visit_date && (
            <span className="text-xs text-gray-400">
              {formatDate(prospect.visit_date)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
