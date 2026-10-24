'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'

type LinkFilter = 'All' | 'Purchaser' | 'Reachable' | 'Unlinked'
type RecordStatus = 'Follow up' | 'Awaiting reply' | 'Completed' | 'Insight only'
type QualityField =
  | 'visitorCount'
  | 'gender'
  | 'ageRange'
  | 'appearance'
  | 'heardFrom'
  | 'shoppingOccasion'
  | 'triedOtherBrands'
  | 'hasBudget'
  | 'budgetRange'
  | 'payerDecision'
  | 'preferences'
  | 'concerns'

type QualityAnswers = Record<QualityField, string>

const emptyQualityAnswers: QualityAnswers = {
  visitorCount: '',
  gender: '',
  ageRange: '',
  appearance: '',
  heardFrom: '',
  shoppingOccasion: '',
  triedOtherBrands: '',
  hasBudget: '',
  budgetRange: '',
  payerDecision: '',
  preferences: '',
  concerns: '',
}

type ServiceRecord = {
  id: string
  visit: string
  initials: string
  purchasers: string[]
  leads: string[]
  summary: string
  intent: string
  owner: string
  time: string
  status: RecordStatus
}

const records: ServiceRecord[] = [
  {
    id: 'SR-1048',
    visit: 'Sophia Lin',
    initials: 'SL',
    purchasers: ['Sophia Lin · C-20931'],
    leads: ['Sophia Lin · WeChat sophia_lin'],
    summary: 'Purchased the ivory Mini Arc bag. Asked about care and matching straps.',
    intent: 'Cross-sell',
    owner: 'Maya',
    time: 'Today, 11:42',
    status: 'Follow up',
  },
  {
    id: 'SR-1047',
    visit: 'Daniel Wu',
    initials: 'DW',
    purchasers: [],
    leads: ['Daniel Wu · WeChat daniel_wu88'],
    summary: 'Interested in the Horizon weekender. Comparing black and olive.',
    intent: 'High intent',
    owner: 'Ethan',
    time: 'Today, 10:18',
    status: 'Awaiting reply',
  },
  {
    id: 'SR-1046',
    visit: 'Anonymous visit',
    initials: 'AV',
    purchasers: [],
    leads: [],
    summary: 'Browsed small leather goods; preferred minimal branding and warm neutrals.',
    intent: 'Insight',
    owner: 'Maya',
    time: 'Yesterday, 16:05',
    status: 'Insight only',
  },
  {
    id: 'SR-1045',
    visit: 'Marcus Chen',
    initials: 'MC',
    purchasers: ['Marcus Chen · C-19874'],
    leads: [],
    summary: 'Collected repaired briefcase. Delighted with finish and turnaround time.',
    intent: 'Aftercare',
    owner: 'Ari',
    time: 'Yesterday, 14:32',
    status: 'Completed',
  },
  {
    id: 'SR-1044',
    visit: 'Ella & Noah · Couple visit',
    initials: 'EN',
    purchasers: ['Noah · C-20886'],
    leads: ['Ella · WeChat ella_zhou'],
    summary: 'Gift purchase for Noah; Ella asked to receive collection updates.',
    intent: 'Gift',
    owner: 'Ethan',
    time: 'May 14, 12:26',
    status: 'Follow up',
  },
]

const recordsZh: ServiceRecord[] = [
  {
    id: 'SR-1048',
    visit: '林思妍',
    initials: '林',
    purchasers: ['林思妍 · C-20931'],
    leads: ['林思妍 · 微信 sophia_lin'],
    summary: '购买了象牙白 Mini Arc 手袋，并咨询了皮具护理和配套肩带。',
    intent: '交叉销售',
    owner: 'Maya',
    time: '今天 11:42',
    status: 'Follow up',
  },
  {
    id: 'SR-1047',
    visit: '吴子轩',
    initials: '吴',
    purchasers: [],
    leads: ['吴子轩 · 微信 daniel_wu88'],
    summary: '对 Horizon 周末包感兴趣，正在比较黑色和橄榄绿色。',
    intent: '高意向',
    owner: 'Ethan',
    time: '今天 10:18',
    status: 'Awaiting reply',
  },
  {
    id: 'SR-1046',
    visit: '匿名到访',
    initials: '访',
    purchasers: [],
    leads: [],
    summary: '浏览了小皮具；偏好低调标识和暖色中性色。',
    intent: '洞察',
    owner: 'Maya',
    time: '昨天 16:05',
    status: 'Insight only',
  },
  {
    id: 'SR-1045',
    visit: '陈明宇',
    initials: '陈',
    purchasers: ['陈明宇 · C-19874'],
    leads: [],
    summary: '取回维修后的公文包，对修复效果和交付速度非常满意。',
    intent: '售后关怀',
    owner: 'Ari',
    time: '昨天 14:32',
    status: 'Completed',
  },
  {
    id: 'SR-1044',
    visit: 'Ella 与 Noah · 伴侣到访',
    initials: 'EN',
    purchasers: ['Noah · C-20886'],
    leads: ['Ella · 微信 ella_zhou'],
    summary: '为 Noah 购买礼物；Ella 希望接收取货进度。',
    intent: '赠礼',
    owner: 'Ethan',
    time: '5月14日 12:26',
    status: 'Follow up',
  },
]

const statusStyles: Record<RecordStatus, string> = {
  'Follow up': 'text-violet-700 bg-violet-50',
  'Awaiting reply': 'text-amber-700 bg-amber-50',
  Completed: 'text-emerald-700 bg-emerald-50',
  'Insight only': 'text-slate-600 bg-slate-100',
}

function Icon({
  children,
  className = 'size-5',
  viewBox = '0 0 24 24',
}: {
  children: ReactNode
  className?: string
  viewBox?: string
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox={viewBox}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

function BrandMark() {
  return (
    <div className="grid size-9 grid-cols-2 gap-0.5 rounded-xl bg-[#15171c] p-2" aria-hidden="true">
      <span className="rounded-sm bg-white" />
      <span className="rounded-sm bg-violet-400" />
      <span className="rounded-sm bg-violet-400" />
      <span className="rounded-sm bg-white" />
    </div>
  )
}

export default function HomePage() {
  const [language, setLanguage] = useState<'zh' | 'en'>('zh')
  const [panelOpen, setPanelOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [linkFilter, setLinkFilter] = useState<LinkFilter>('All')
  const [recording, setRecording] = useState(false)
  const [transcribed, setTranscribed] = useState(false)
  const [saved, setSaved] = useState(false)
  const [purchaserLinked, setPurchaserLinked] = useState(false)
  const [leadLinked, setLeadLinked] = useState(false)
  const [quality, setQuality] = useState<QualityAnswers>(emptyQualityAnswers)

  const tr = (zh: string, en: string) => (language === 'zh' ? zh : en)
  const filterLabel = (filter: LinkFilter) =>
    language === 'zh'
      ? { All: '全部记录', Purchaser: '已关联购买记录', Reachable: '已关联潜客', Unlinked: '未关联' }[filter]
      : { All: 'All records', Purchaser: 'Linked purchaser', Reachable: 'Linked lead', Unlinked: 'Unlinked' }[filter]
  const statusLabel = (status: RecordStatus) =>
    language === 'zh'
      ? {
          'Follow up': '待跟进',
          'Awaiting reply': '等待回复',
          Completed: '已完成',
          'Insight only': '仅作洞察',
        }[status]
      : status

  const updateQuality = (field: QualityField, value: string) => {
    setQuality((current) => ({ ...current, [field]: value }))
  }

  const requiredQualityFields: Array<{ field: QualityField; label: string }> = [
    { field: 'visitorCount', label: tr('到访人数', 'Visitor count') },
    { field: 'gender', label: tr('性别构成', 'Gender') },
    { field: 'ageRange', label: tr('年龄段', 'Age range') },
    { field: 'appearance', label: tr('外观与穿着', 'Appearance') },
  ]

  if (purchaserLinked) {
    requiredQualityFields.push(
      { field: 'heardFrom', label: tr('从何得知 DR', 'How they heard about DR') },
      { field: 'shoppingOccasion', label: tr('购买场景', 'Shopping occasion') },
      { field: 'triedOtherBrands', label: tr('是否对比其他品牌', 'Whether they tried other brands') },
    )
  }

  if (leadLinked) {
    requiredQualityFields.push({ field: 'hasBudget', label: tr('是否有预算', 'Whether they have a budget') })
    if (!requiredQualityFields.some(({ field }) => field === 'shoppingOccasion')) {
      requiredQualityFields.push({ field: 'shoppingOccasion', label: tr('购买场景', 'Shopping occasion') })
    }
  }

  const missingQualityFields = requiredQualityFields.filter(({ field }) => !quality[field])
  const qualityPassed = missingQualityFields.length === 0

  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en'
  }, [language])

  const filteredRecords = useMemo(
    () =>
      (language === 'zh' ? recordsZh : records).filter((record) => {
        const matchesLink =
          linkFilter === 'All' ||
          (linkFilter === 'Purchaser' && record.purchasers.length > 0) ||
          (linkFilter === 'Reachable' && record.leads.length > 0) ||
          (linkFilter === 'Unlinked' && record.purchasers.length === 0 && record.leads.length === 0)
        const search = query.trim().toLowerCase()
        const matchesSearch =
          !search ||
          `${record.visit} ${record.purchasers.join(' ')} ${record.leads.join(' ')} ${record.summary} ${record.id}`
            .toLowerCase()
            .includes(search)
        return matchesLink && matchesSearch
      }),
    [language, query, linkFilter],
  )

  const openPanel = () => {
    setSaved(false)
    setTranscribed(false)
    setPurchaserLinked(false)
    setLeadLinked(false)
    setQuality(emptyQualityAnswers)
    setPanelOpen(true)
  }

  const closePanel = () => {
    setRecording(false)
    setPanelOpen(false)
  }

  const handleRecording = () => {
    if (recording) {
      setRecording(false)
      setTranscribed(true)
      setPurchaserLinked(true)
      setLeadLinked(true)
      setQuality({
        visitorCount: '2',
        gender: 'mixed',
        ageRange: '25-34',
        appearance: 'smart-casual',
        heardFrom: 'social',
        shoppingOccasion: 'gift',
        triedOtherBrands: 'yes',
        hasBudget: 'yes',
        budgetRange: '30000-50000',
        payerDecision: 'split',
        preferences: 'rings',
        concerns: 'brand-comparison',
      })
    } else {
      setTranscribed(false)
      setRecording(true)
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f6f8] text-[#18191d]">
      <header className="sticky top-0 z-20 border-b border-black/[0.07] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1600px] items-center gap-8 px-6 lg:px-10">
          <div className="flex items-center gap-3">
            <BrandMark />
            <div>
              <p className="text-[15px] font-bold tracking-[-0.02em]">{tr('广州正佳店', 'Guangzhou Grandview Store')}</p>
              <p className="text-[11px] font-medium text-slate-400">{tr('陈玉婷', 'Chen Yuting')}</p>
            </div>
          </div>

          <nav className="ml-6 hidden h-full items-center gap-7 text-sm font-semibold text-slate-400 md:flex">
            <button className="h-full border-b-2 border-violet-600 text-[#18191d]">{tr('服务记录', 'Service records')}</button>
            <button className="h-full border-b-2 border-transparent transition hover:text-slate-700">{tr('顾客', 'Customers')}</button>
            <button className="h-full border-b-2 border-transparent transition hover:text-slate-700">{tr('洞察', 'Insights')}</button>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <div className="flex rounded-lg bg-slate-100 p-1 text-[11px] font-bold">
              <button
                onClick={() => setLanguage('zh')}
                className={`rounded-md px-2.5 py-1.5 transition ${language === 'zh' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
              >
                中文
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`rounded-md px-2.5 py-1.5 transition ${language === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
              >
                EN
              </button>
            </div>
            <button
              aria-label={tr('通知', 'Notifications')}
              className="grid size-10 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50"
            >
              <Icon>
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                <path d="M10 21h4" />
              </Icon>
            </button>
            <div className="grid size-10 place-items-center rounded-full bg-[#e9ddff] text-xs font-bold text-violet-700">
              ML
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-6 py-8 lg:px-10 lg:py-10">
        <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-400">
              <span>{tr('销售', 'Sales')}</span>
              <span>/</span>
              <span className="text-slate-600">{tr('服务记录', 'Service records')}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-[-0.035em] sm:text-[38px]">{tr('见证每一份美好。', 'Witness every beautiful moment.')}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {tr('每次互动都是一条独立记录，可按实际情况关联购买记录、可联系潜客，或同时关联两者。', 'Each interaction is its own record. Link it to a purchaser, a reachable lead, both, or neither.')}
            </p>
          </div>
          <button
            onClick={openPanel}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(124,58,237,0.2)] transition hover:bg-violet-700 active:scale-[0.98]"
          >
            <Icon className="size-4">
              <path d="M12 5v14M5 12h14" />
            </Icon>
            {tr('添加服务记录', 'Add service record')}
          </button>
        </section>

        <section className="mb-5 grid gap-3 sm:grid-cols-3">
          <button
            onClick={() => setLinkFilter(linkFilter === 'Purchaser' ? 'All' : 'Purchaser')}
            className={`group flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
              linkFilter === 'Purchaser'
                ? 'border-emerald-300 bg-emerald-50/60'
                : 'border-black/[0.06] bg-white hover:border-emerald-200'
            }`}
          >
            <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <Icon>
                <path d="M6 7h12l-1 13H7L6 7Z" />
                <path d="M9 9V6a3 3 0 0 1 6 0v3" />
              </Icon>
            </span>
            <span>
              <span className="block text-xl font-bold tracking-tight">3</span>
              <span className="text-xs font-medium text-slate-500">{tr('已关联购买记录', 'Linked purchaser records')}</span>
            </span>
          </button>
          <button
            onClick={() => setLinkFilter(linkFilter === 'Reachable' ? 'All' : 'Reachable')}
            className={`group flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
              linkFilter === 'Reachable'
                ? 'border-amber-300 bg-amber-50/60'
                : 'border-black/[0.06] bg-white hover:border-amber-200'
            }`}
          >
            <span className="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-600">
              <Icon>
                <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
                <path d="M8 10h8M8 14h5" />
              </Icon>
            </span>
            <span>
              <span className="block text-xl font-bold tracking-tight">3</span>
              <span className="text-xs font-medium text-slate-500">{tr('已关联可联系潜客', 'Linked reachable leads')}</span>
            </span>
          </button>
          <button
            onClick={() => setLinkFilter(linkFilter === 'Unlinked' ? 'All' : 'Unlinked')}
            className={`group flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
              linkFilter === 'Unlinked'
                ? 'border-slate-300 bg-slate-100/80'
                : 'border-black/[0.06] bg-white hover:border-slate-300'
            }`}
          >
            <span className="grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-500">
              <Icon>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M19 8v6M22 11h-6" />
              </Icon>
            </span>
            <span>
              <span className="block text-xl font-bold tracking-tight">1</span>
              <span className="text-xs font-medium text-slate-500">{tr('未关联的服务记录', 'Unlinked service records')}</span>
            </span>
          </button>
        </section>

        <section className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 md:flex-row md:items-center">
            <div className="relative max-w-md flex-1">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                <Icon className="size-[18px]">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </Icon>
              </span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={tr('搜索服务记录、关联人员、备注或编号…', 'Search record, linked person, note or ID...')}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {(['All', 'Purchaser', 'Reachable', 'Unlinked'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setLinkFilter(filter)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    linkFilter === filter ? 'bg-[#18191d] text-white' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {filterLabel(filter)}
                </button>
              ))}
              <span className="mx-1 hidden h-5 w-px bg-slate-200 sm:block" />
              <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                <Icon className="size-4">
                  <path d="M4 6h16M7 12h10M10 18h4" />
                </Icon>
                {tr('更多筛选', 'More filters')}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-[200vw] min-w-[200vw] table-fixed text-left md:w-full md:min-w-[1120px]">
              <colgroup>
                <col className="w-1/6 md:w-[220px]" />
                <col className="w-1/6 md:w-[220px]" />
                <col className="w-1/6 md:w-[220px]" />
                <col className="w-1/6 md:w-[300px]" />
                <col className="w-1/6 md:w-[80px]" />
                <col className="w-1/6 md:w-[80px]" />
              </colgroup>
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  <th className="overflow-hidden px-2 py-3.5 md:px-5"><span className="block truncate">{tr('姓名', 'Name')}</span></th>
                  <th className="overflow-hidden px-2 py-3.5 md:px-4"><span className="block truncate">{tr('关联购买记录', 'Linked purchaser')}</span></th>
                  <th className="overflow-hidden px-2 py-3.5 md:px-4"><span className="block truncate">{tr('关联可联系潜客', 'Linked reachable lead')}</span></th>
                  <th className="overflow-hidden px-2 py-3.5 md:px-4"><span className="block truncate">{tr('服务摘要', 'Service summary')}</span></th>
                  <th className="overflow-hidden px-2 py-3.5 md:px-4"><span className="block truncate">{tr('意向', 'Intent')}</span></th>
                  <th className="overflow-hidden px-2 py-3.5 md:px-4"><span className="block truncate">{tr('跟进', 'Follow-up')}</span></th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="group border-b border-slate-100 last:border-0 hover:bg-violet-50/30">
                    <td className="overflow-hidden px-2 py-4 md:px-5">
                      <div className="flex items-center gap-3">
                        <span
                          className="grid size-7 shrink-0 place-items-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-700 md:size-9 md:text-[11px]"
                        >
                          {record.initials}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-800" title={record.visit}>{record.visit}</p>
                          <p className="mt-0.5 truncate text-[11px] text-slate-400" title={record.time}>{record.time}</p>
                        </div>
                      </div>
                    </td>
                    <td className="overflow-hidden px-2 py-4 md:px-4">
                      {record.purchasers.length > 0 ? (
                        <div className="space-y-1.5">
                          {record.purchasers.map((purchaser) => (
                            <div key={purchaser} className="flex max-w-full items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/10" title={purchaser}>
                              <Icon className="size-3.5 shrink-0">
                                <path d="M6 7h12l-1 13H7L6 7Z" />
                                <path d="M9 9V6a3 3 0 0 1 6 0v3" />
                              </Icon>
                              <span className="truncate">{purchaser}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-300">—</span>
                      )}
                    </td>
                    <td className="overflow-hidden px-2 py-4 md:px-4">
                      {record.leads.length > 0 ? (
                        <div className="space-y-1.5">
                          {record.leads.map((lead) => (
                            <div key={lead} className="flex max-w-full items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[10px] font-bold text-amber-700 ring-1 ring-inset ring-amber-600/10" title={lead}>
                              <Icon className="size-3.5 shrink-0">
                                <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
                              </Icon>
                              <span className="truncate">{lead}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-300">—</span>
                      )}
                    </td>
                    <td className="overflow-hidden px-2 py-4 md:px-4">
                      <p className="truncate text-[13px] leading-5 text-slate-600" title={record.summary}>{record.summary}</p>
                    </td>
                    <td className="overflow-hidden px-2 py-4 text-xs font-semibold text-slate-600 md:px-4"><p className="truncate" title={record.intent}>{record.intent}</p></td>
                    <td className="overflow-hidden px-2 py-4 md:px-4">
                      <span className={`block max-w-full truncate rounded-lg px-2.5 py-1.5 text-[10px] font-bold ${statusStyles[record.status]}`} title={statusLabel(record.status)}>
                        {statusLabel(record.status)}
                      </span>
                      <p className="mt-1.5 truncate text-[10px] font-medium text-slate-400" title={record.owner}>{record.owner}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="grid place-items-center px-6 py-16 text-center">
              <div className="mb-3 grid size-11 place-items-center rounded-full bg-slate-100 text-slate-400">
                <Icon>
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </Icon>
              </div>
              <p className="text-sm font-bold">{tr('没有匹配的记录', 'No matching records')}</p>
              <p className="mt-1 text-xs text-slate-400">{tr('请尝试其他关键词或清除当前筛选。', 'Try another search or clear the current filter.')}</p>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3.5 text-xs text-slate-400">
            <span>{tr(`显示 24 条记录中的 ${filteredRecords.length} 条`, `Showing ${filteredRecords.length} of 24 records`)}</span>
            <div className="flex gap-1">
              <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-500 hover:bg-slate-50">{tr('上一页', 'Previous')}</button>
              <button className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50">{tr('下一页', 'Next')}</button>
            </div>
          </div>
        </section>
      </main>

      {panelOpen && (
        <div className="fixed inset-0 z-40 flex justify-end bg-slate-950/30 backdrop-blur-[2px]" onMouseDown={closePanel}>
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="record-panel-title"
            className="flex h-full w-full max-w-[600px] animate-[slideIn_.24s_ease-out] flex-col bg-white shadow-[-20px_0_60px_rgba(15,23,42,0.14)]"
            onMouseDown={(event) => event.stopPropagation()}
          >
            {saved ? (
              <div className="grid flex-1 place-items-center p-10 text-center">
                <div>
                  <div className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                    <Icon className="size-8">
                      <path d="m5 12 4 4L19 6" />
                    </Icon>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">{tr('服务记录已就绪', 'Service record ready')}</h2>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">
                    {tr('记录已添加至预览表，跟进任务已进入队列。', 'The record has been added to the preview table and the follow-up is queued.')}
                  </p>
                  <button
                    onClick={closePanel}
                    className="mt-7 h-11 rounded-xl bg-[#18191d] px-6 text-sm font-bold text-white hover:bg-black"
                  >
                    {tr('返回记录列表', 'Back to records')}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-violet-600">{tr('新互动', 'New interaction')}</p>
                    <h2 id="record-panel-title" className="mt-1 text-xl font-bold tracking-tight">
                      {tr('添加服务记录', 'Add service record')}
                    </h2>
                  </div>
                  <button
                    onClick={closePanel}
                    aria-label={tr('关闭面板', 'Close panel')}
                    className="grid size-9 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <Icon>
                      <path d="M18 6 6 18M6 6l12 12" />
                    </Icon>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6">
                  <div className="mb-6 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 p-4 text-white">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={handleRecording}
                        className={`grid size-12 shrink-0 place-items-center rounded-full transition ${
                          recording ? 'animate-pulse bg-red-500' : 'bg-white text-violet-600 hover:scale-105'
                        }`}
                        aria-label={recording ? tr('停止录音', 'Stop recording') : tr('开始语音备忘', 'Start voice memo')}
                      >
                        {recording ? (
                          <span className="size-3 rounded-sm bg-white" />
                        ) : (
                          <Icon className="size-6">
                            <rect x="9" y="2" width="6" height="12" rx="3" />
                            <path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8" />
                          </Icon>
                        )}
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold">
                          {recording
                            ? tr('正在聆听…轻触结束', 'Listening… tap to finish')
                            : transcribed
                              ? tr('语音备忘已转写', 'Voice memo transcribed')
                              : tr('用说的，比打字更快', 'Talk instead of typing')}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-violet-100">
                          {recording
                            ? tr('00:08  ·  自然讲述本次到访即可', '00:08  ·  Speak naturally about the visit')
                            : transcribed
                              ? tr('我们已生成下方字段，保存前请检查。', 'We drafted the fields below. Review before saving.')
                              : tr('AI 将识别关联人员，并整理意向、备注和跟进信息。', 'AI will identify linked people and structure intent, notes, and follow-up.')}
                        </p>
                      </div>
                      {!recording && !transcribed && (
                        <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold">AI</span>
                      )}
                    </div>
                    {recording && (
                      <div className="mt-4 flex h-5 items-center justify-center gap-1" aria-hidden="true">
                        {[8, 15, 10, 19, 12, 17, 7, 14, 18, 9, 13, 6, 16, 10, 18, 8, 14, 11].map((height, index) => (
                          <span
                            key={index}
                            className="w-1 animate-pulse rounded-full bg-white/80"
                            style={{ height: `${height}px`, animationDelay: `${index * 45}ms` }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <section>
                    <div className="mb-3 flex items-end justify-between gap-4">
                      <div>
                        <h3 className="text-xs font-bold text-slate-700">{tr('关联人员', 'Link people')}</h3>
                        <p className="mt-1 text-[11px] leading-5 text-slate-400">
                          {tr('两类关联彼此独立，也可以都留空。', 'Each link is independent, and both can be left empty.')}
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                        {tr('选填', 'Optional')}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
                        <div className="mb-3 flex items-center gap-2 text-emerald-800">
                          <span className="grid size-7 place-items-center rounded-lg bg-emerald-100">
                            <Icon className="size-4">
                              <path d="M6 7h12l-1 13H7L6 7Z" />
                              <path d="M9 9V6a3 3 0 0 1 6 0v3" />
                            </Icon>
                          </span>
                          <div>
                            <p className="text-xs font-bold">{tr('购买记录', 'Purchaser record')}</p>
                            <p className="text-[10px] text-emerald-700/70">{tr('关联已下单的顾客', 'Link the person who placed an order')}</p>
                          </div>
                        </div>
                        {purchaserLinked ? (
                          <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-white px-3 py-2.5">
                            <div>
                              <p className="text-xs font-bold text-slate-700">{tr('Noah · 顾客 C-20886', 'Noah · Customer C-20886')}</p>
                              <p className="mt-0.5 text-[10px] text-slate-400">{tr('本次订单购买人', 'Purchaser for this visit')}</p>
                            </div>
                            <button onClick={() => setPurchaserLinked(false)} aria-label={tr('移除购买记录关联', 'Remove purchaser link')} className="grid size-7 place-items-center rounded-full text-slate-400 hover:bg-slate-100">
                              <Icon className="size-4"><path d="M18 6 6 18M6 6l12 12" /></Icon>
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                                <Icon className="size-4"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></Icon>
                              </span>
                              <input placeholder={tr('搜索订单号、顾客编号或姓名', 'Search order, customer ID or name')} className="h-10 w-full rounded-lg border border-emerald-200 bg-white pl-9 pr-3 text-xs outline-none placeholder:text-slate-400 focus:border-emerald-400" />
                            </div>
                            <button onClick={() => setPurchaserLinked(true)} className="rounded-lg bg-emerald-600 px-3 text-xs font-bold text-white hover:bg-emerald-700">{tr('关联', 'Link')}</button>
                          </div>
                        )}
                      </div>

                      <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4">
                        <div className="mb-3 flex items-center gap-2 text-amber-800">
                          <span className="grid size-7 place-items-center rounded-lg bg-amber-100">
                            <Icon className="size-4">
                              <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
                            </Icon>
                          </span>
                          <div>
                            <p className="text-xs font-bold">{tr('可联系潜客记录', 'Reachable lead record')}</p>
                            <p className="text-[10px] text-amber-700/70">{tr('关联留下联系方式的人', 'Link the person who shared contact details')}</p>
                          </div>
                        </div>
                        {leadLinked ? (
                          <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-white px-3 py-2.5">
                            <div>
                              <p className="text-xs font-bold text-slate-700">{tr('Ella · 微信 ella_zhou', 'Ella · WeChat ella_zhou')}</p>
                              <p className="mt-0.5 text-[10px] text-slate-400">{tr('同行者 · 可联系', 'Companion · Reachable')}</p>
                            </div>
                            <button onClick={() => setLeadLinked(false)} aria-label={tr('移除潜客关联', 'Remove lead link')} className="grid size-7 place-items-center rounded-full text-slate-400 hover:bg-slate-100">
                              <Icon className="size-4"><path d="M18 6 6 18M6 6l12 12" /></Icon>
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                                <Icon className="size-4"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></Icon>
                              </span>
                              <input placeholder={tr('搜索姓名、电话或微信', 'Search name, phone or WeChat')} className="h-10 w-full rounded-lg border border-amber-200 bg-white pl-9 pr-3 text-xs outline-none placeholder:text-slate-400 focus:border-amber-400" />
                            </div>
                            <button onClick={() => setLeadLinked(true)} className="rounded-lg bg-amber-500 px-3 text-xs font-bold text-white hover:bg-amber-600">{tr('关联', 'Link')}</button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-[10px] leading-4 text-slate-500">
                      <Icon className="mt-0.5 size-3.5 shrink-0">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 8v4M12 16h.01" />
                      </Icon>
                      <span>{tr('例如：丈夫可以关联购买记录，妻子可以关联可联系潜客记录；同一人也可以同时关联两类记录。', 'For example, a husband can be the linked purchaser and his wife the linked lead; the same person can also be linked to both.')}</span>
                    </div>
                  </section>

                  <section className="mt-7 border-t border-slate-100 pt-6">
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-800">{tr('服务质量检查', 'Service quality check')}</h3>
                          <span className="rounded-full bg-red-50 px-2 py-0.5 text-[9px] font-bold text-red-600">{tr('提交门槛', 'Required to submit')}</span>
                        </div>
                        <p className="mt-1 text-[11px] leading-5 text-slate-400">
                          {tr('必填项会根据已关联的记录自动调整。', 'Required fields adjust automatically based on linked records.')}
                        </p>
                      </div>
                      <div className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-bold ${qualityPassed ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                        <span className={`size-1.5 rounded-full ${qualityPassed ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {qualityPassed
                          ? tr('检查通过', 'Passed')
                          : tr(`还缺 ${missingQualityFields.length} 项`, `${missingQualityFields.length} missing`)}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-800">1. {tr('用户基本信息', 'Visitor basics')}</p>
                          <p className="mt-1 text-[10px] text-slate-400">{tr('所有服务记录均为必填', 'Required for every service record')}</p>
                        </div>
                        <span className="text-[10px] font-bold text-red-500">4 {tr('项必填', 'required')}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="text-[11px] font-bold text-slate-600">
                          {tr('到访人数', 'Visitor count')} <span className="text-red-500">*</span>
                          <select value={quality.visitorCount} onChange={(event) => updateQuality('visitorCount', event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal outline-none focus:border-violet-300">
                            <option value="">{tr('请选择', 'Select')}</option>
                            <option value="1">1 {tr('人', 'person')}</option>
                            <option value="2">2 {tr('人', 'people')}</option>
                            <option value="3">3 {tr('人', 'people')}</option>
                            <option value="4+">4+ {tr('人', 'people')}</option>
                          </select>
                        </label>
                        <label className="text-[11px] font-bold text-slate-600">
                          {tr('性别构成', 'Gender')} <span className="text-red-500">*</span>
                          <select value={quality.gender} onChange={(event) => updateQuality('gender', event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal outline-none focus:border-violet-300">
                            <option value="">{tr('请选择', 'Select')}</option>
                            <option value="female">{tr('女性', 'Female')}</option>
                            <option value="male">{tr('男性', 'Male')}</option>
                            <option value="mixed">{tr('多人 / 混合', 'Group / mixed')}</option>
                            <option value="unspecified">{tr('不便判断', 'Not specified')}</option>
                          </select>
                        </label>
                        <label className="text-[11px] font-bold text-slate-600">
                          {tr('年龄段', 'Age range')} <span className="text-red-500">*</span>
                          <select value={quality.ageRange} onChange={(event) => updateQuality('ageRange', event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal outline-none focus:border-violet-300">
                            <option value="">{tr('请选择', 'Select')}</option>
                            <option value="18-24">18–24</option>
                            <option value="25-34">25–34</option>
                            <option value="35-44">35–44</option>
                            <option value="45+">45+</option>
                            <option value="mixed">{tr('多人 / 不同年龄段', 'Group / mixed ages')}</option>
                          </select>
                        </label>
                        <label className="text-[11px] font-bold text-slate-600">
                          {tr('外观与穿着', 'Appearance')} <span className="text-red-500">*</span>
                          <input value={quality.appearance} onChange={(event) => updateQuality('appearance', event.target.value)} placeholder={tr('例：商务休闲、佩戴珠宝', 'e.g. smart casual, wearing jewelry')} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none placeholder:text-slate-400 focus:border-violet-300" />
                        </label>
                      </div>
                      <label className="mt-3 block text-[11px] font-bold text-slate-600">
                        {tr('谁买单 / 谁决策', 'Who pays / who decides')} <span className="font-normal text-slate-400">({tr('建议填写', 'recommended')})</span>
                        <input value={quality.payerDecision} onChange={(event) => updateQuality('payerDecision', event.target.value)} placeholder={tr('例：丈夫买单，双方共同决策', 'e.g. husband pays, both decide')} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none placeholder:text-slate-400 focus:border-violet-300" />
                      </label>
                    </div>

                    {(purchaserLinked || leadLinked) && (
                      <div className="mt-3 rounded-2xl border border-violet-200 bg-violet-50/30 p-4">
                        <div className="mb-4">
                          <p className="text-xs font-bold text-slate-800">2. {tr('为何而来', 'Why they came')}</p>
                          <p className="mt-1 text-[10px] text-slate-400">
                            {purchaserLinked && leadLinked
                              ? tr('已关联购买记录和可联系潜客，需满足两类质量标准。', 'Both record types are linked, so both quality standards apply.')
                              : purchaserLinked
                                ? tr('已关联购买记录，以下三项为必填。', 'Purchaser linked: all three fields are required.')
                                : tr('已关联可联系潜客，购买场景为必填。', 'Reachable lead linked: shopping occasion is required.')}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {purchaserLinked && (
                            <label className="text-[11px] font-bold text-slate-600">
                              {tr('从何得知 DR', 'How they heard about DR')} <span className="text-red-500">*</span>
                              <select value={quality.heardFrom} onChange={(event) => updateQuality('heardFrom', event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-violet-200 bg-white px-3 text-xs font-normal outline-none focus:border-violet-400">
                                <option value="">{tr('请选择', 'Select')}</option>
                                <option value="social">{tr('社交媒体', 'Social media')}</option>
                                <option value="friend">{tr('朋友推荐', 'Friend referral')}</option>
                                <option value="store">{tr('商场 / 路过门店', 'Mall / passing store')}</option>
                                <option value="search">{tr('搜索 / 官网', 'Search / website')}</option>
                                <option value="other">{tr('其他', 'Other')}</option>
                              </select>
                            </label>
                          )}
                          <label className="text-[11px] font-bold text-slate-600">
                            {tr('需求 / 购买场景', 'Shopping occasion')} <span className="text-red-500">*</span>
                            <select value={quality.shoppingOccasion} onChange={(event) => updateQuality('shoppingOccasion', event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-violet-200 bg-white px-3 text-xs font-normal outline-none focus:border-violet-400">
                              <option value="">{tr('请选择', 'Select')}</option>
                              <option value="wedding">{tr('婚礼 / 求婚', 'Wedding / proposal')}</option>
                              <option value="anniversary">{tr('纪念日', 'Anniversary')}</option>
                              <option value="gift">{tr('送礼', 'Gift')}</option>
                              <option value="self">{tr('自用 / 犒赏自己', 'Personal purchase')}</option>
                              <option value="browsing">{tr('日常了解', 'General browsing')}</option>
                            </select>
                          </label>
                          {purchaserLinked && (
                            <label className="text-[11px] font-bold text-slate-600">
                              {tr('是否对比 / 试过其他品牌', 'Tried other brands')} <span className="text-red-500">*</span>
                              <select value={quality.triedOtherBrands} onChange={(event) => updateQuality('triedOtherBrands', event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-violet-200 bg-white px-3 text-xs font-normal outline-none focus:border-violet-400">
                                <option value="">{tr('请选择', 'Select')}</option>
                                <option value="yes">{tr('是', 'Yes')}</option>
                                <option value="no">{tr('否', 'No')}</option>
                                <option value="unknown">{tr('未确认', 'Not confirmed')}</option>
                              </select>
                            </label>
                          )}
                          {leadLinked && (
                            <label className="text-[11px] font-bold text-slate-600">
                              {tr('是否有预算', 'Has a budget')} <span className="text-red-500">*</span>
                              <select value={quality.hasBudget} onChange={(event) => updateQuality('hasBudget', event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-violet-200 bg-white px-3 text-xs font-normal outline-none focus:border-violet-400">
                                <option value="">{tr('请选择', 'Select')}</option>
                                <option value="yes">{tr('是', 'Yes')}</option>
                                <option value="no">{tr('否', 'No')}</option>
                                <option value="unknown">{tr('未确认', 'Not confirmed')}</option>
                              </select>
                            </label>
                          )}
                          {leadLinked && quality.hasBudget === 'yes' && (
                            <label className="text-[11px] font-bold text-slate-600">
                              {tr('预算范围', 'Budget range')} <span className="font-normal text-slate-400">({tr('选填', 'optional')})</span>
                              <input value={quality.budgetRange} onChange={(event) => updateQuality('budgetRange', event.target.value)} placeholder={tr('例：¥30,000–50,000', 'e.g. ¥30,000–50,000')} className="mt-1.5 h-10 w-full rounded-lg border border-violet-200 bg-white px-3 text-xs font-normal outline-none placeholder:text-slate-400 focus:border-violet-400" />
                            </label>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-3 rounded-2xl border border-slate-200 p-4">
                      <p className="text-xs font-bold text-slate-800">3–4. {tr('喜欢什么与顾虑', 'Preferences and concerns')}</p>
                      <p className="mt-1 text-[10px] text-slate-400">{tr('记录品类、款式、试戴、预算及未购原因。', 'Capture category, styles tried, budget, comparisons, and reasons for not purchasing.')}</p>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <label className="text-[11px] font-bold text-slate-600">
                          {tr('喜欢 / 试戴了什么', 'Liked / tried on')}
                          <input value={quality.preferences} onChange={(event) => updateQuality('preferences', event.target.value)} placeholder={tr('品类、款式、试戴型号', 'Category, style, item tried')} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none placeholder:text-slate-400 focus:border-violet-300" />
                        </label>
                        <label className="text-[11px] font-bold text-slate-600">
                          {tr('顾虑 / 未购原因', 'Concern / why not purchased')}
                          <input value={quality.concerns} onChange={(event) => updateQuality('concerns', event.target.value)} placeholder={tr('品牌对比、款式、价格等', 'Brand comparison, style, price, etc.')} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none placeholder:text-slate-400 focus:border-violet-300" />
                        </label>
                      </div>
                    </div>
                  </section>

                  <div className="mt-6 space-y-5">
                    <div>
                      <label className="mb-2 block text-xs font-bold text-slate-700">{tr('本次互动发生了什么？', 'What happened?')}</label>
                      <textarea
                        key={transcribed ? 'transcribed' : 'empty'}
                        defaultValue={
                          transcribed
                            ? tr(
                                '购买了象牙白 Mini Arc 手袋，并询问皮具护理和配套肩带。将在上海停留至周五。',
                                'Purchased the ivory Mini Arc bag. Asked about leather care and matching straps. Visiting Shanghai until Friday.',
                              )
                            : ''
                        }
                        rows={4}
                        placeholder={tr('讨论的产品、偏好、顾虑、同行人员…', 'Products discussed, preferences, objections, companions...')}
                        className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-2 block text-xs font-bold text-slate-700">{tr('顾客意向', 'Customer intent')}</label>
                        <select className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-violet-300">
                          <option>{transcribed ? tr('交叉销售', 'Cross-sell') : tr('选择意向', 'Select intent')}</option>
                          <option>{tr('高意向', 'High intent')}</option>
                          <option>{tr('产品探索', 'Product discovery')}</option>
                          <option>{tr('售后关怀', 'Aftercare')}</option>
                          <option>{tr('赠礼', 'Gift')}</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-bold text-slate-700">{tr('跟进时间', 'Follow-up')}</label>
                        <select className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-violet-300">
                          <option>
                            {transcribed ? tr('明天', 'Tomorrow') : tr('选择时间', 'Select timing')}
                          </option>
                          <option>{tr('无需跟进', 'No follow-up')}</option>
                          <option>{tr('今天', 'Today')}</option>
                          <option>{tr('三天后', 'In 3 days')}</option>
                          <option>{tr('下周', 'Next week')}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold text-slate-700">{tr('跟进备注', 'Follow-up note')}</label>
                      <input
                        defaultValue={transcribed ? tr('周五前发送肩带选项和护理指南。', 'Send strap options and care guide before Friday.') : ''}
                        placeholder={tr('下一步需要做什么？', 'What should happen next?')}
                        className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 bg-white px-6 py-4">
                  {!qualityPassed && (
                    <div className="mb-3 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-[10px] leading-4 text-red-700">
                      <Icon className="mt-0.5 size-3.5 shrink-0">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 8v4M12 16h.01" />
                      </Icon>
                      <span>
                        <strong>{tr('暂不能提交：', 'Cannot submit yet: ')}</strong>
                        {tr('请补充', 'Add')} {missingQualityFields.map(({ label }) => label).join(tr('、', ', '))}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-4">
                    <button onClick={closePanel} className="px-3 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800">
                      {tr('取消', 'Cancel')}
                    </button>
                    <div className="flex items-center gap-3">
                      <span className="hidden text-[11px] text-slate-400 sm:block">{tr('草稿会自动保存', 'Draft saves automatically')}</span>
                      <button
                        onClick={() => qualityPassed && setSaved(true)}
                        disabled={!qualityPassed}
                        className={`h-11 rounded-xl px-5 text-sm font-bold text-white transition ${
                          qualityPassed
                            ? 'bg-[#18191d] hover:bg-black active:scale-[0.98]'
                            : 'cursor-not-allowed bg-slate-300'
                        }`}
                      >
                        {qualityPassed ? tr('提交服务记录', 'Submit service record') : tr('完成质量检查后提交', 'Complete quality check')}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  )
}
