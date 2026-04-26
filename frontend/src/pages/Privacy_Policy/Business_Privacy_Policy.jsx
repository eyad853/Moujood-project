import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Business_Privacy_Policy = () => {
  const [openSection, setOpenSection] = useState(null)
  const [activeFilter, setActiveFilter] = useState('All')
  const navigate = useNavigate()
  const {t}=useTranslation("business_Privacy_Policy")
  

  const toggle = (id) => setOpenSection(openSection === id ? null : id)

  const tagStyles = {
  Data:     { bg: '#DBEAFE', text: '#1E40AF' },
  Usage:    { bg: '#EDE9FE', text: '#5B21B6' },
  Core:     { bg: '#DCFCE7', text: '#166534' },
  Sharing:  { bg: '#FEF3C7', text: '#92400E' },
  Financial:{ bg: '#FEE2E2', text: '#991B1B' },
  Security: { bg: '#D1FAE5', text: '#065F46' },
  Legal:    { bg: '#F3F4F6', text: '#374151' },
  Policy:   { bg: '#EDE9FE', text: '#5B21B6' },
  Support:  { bg: '#ECFDF5', text: '#047857' },
}

const filters = ['All', 'Core', 'Data', 'Legal', 'Financial', 'Security']

    const sections = [
  {
    id: 1,
    icon: '📥',
    tag: t("1.tag"),
    title: t("1.title"),
    content: t("1.content"),  },
  {
    id: 2,
    icon: '🎯',
    tag: t("2.tag"),
    title: t("2.title"),
    content: t("2.content"),  },
  {
    id: 3,
    icon: '🎁',
    tag: t("3.tag"),
    title: t("3.title"),
    content: t("3.content"),  },
  {
    id: 4,
    icon: '👥',
    tag: t("4.tag"),
    title: t("4.title"),
    content: t("4.content"),  },
  {
    id: 5,
    icon: '🤝',
    tag: t("5.tag"),
    title: t("5.title"),
    content: t("5.content"),  },
  {
    id: 6,
    icon: '💳',
    tag: t("6.tag"),
    title: t("6.title"),
    content: t("6.content"),  },
  {
    id: 7,
    icon: '📊',
    tag: t("7.tag"),
    title: t("7.title"),
    content: t("7.content"),  },
  {
    id: 8,
    icon: '🔐',
    tag: t("8.tag"),
    title: t("8.title"),
    content: t("8.content"),  },
  {
    id: 9,
    icon: '⏳',
    tag: t("9.tag"),
    title: t("9.title"),
    content: t("9.content"),  },
  {
    id: 10,
    icon: '✋',
    tag: t("10.tag"),
    title: t("10.title"),
    content: t("10.content"),  },
  {
    id: 11,
    icon: '🔄',
    tag: t("11.tag"),
    title: t("11.title"),
    content: t("11.content"),  },
  {
    id: 12,
    icon: '📬',
    tag: t("12.tag"),
    title: t("12.title"),
    content: t("12.content"),  },
]

  const filtered =
    activeFilter === 'All' ? sections : sections.filter((s) => s.tag === activeFilter)

  return (
    <div className="min-h-screen bg-gray-50 max-w-sm mx-auto font-sans">

      {/* Header */}
      <div
        className="px-5 pt-12 pb-8"
        style={{ background: 'linear-gradient(160deg, #009842 0%, #00875A 100%)' }}
      >
        {/* Back + Logo */}
        <div className="flex items-center justify-between mb-6">
          <div 
            onClick={()=>{
              navigate(-1)
            }}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.2)' }}
          >
            <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="w-9" />
        </div>

        {/* Icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4"
          style={{ background: 'rgba(255,255,255,0.2)' }}
        >
          🛡️
        </div>

        <h1 className="text-2xl font-bold text-white tracking-tight mb-3">Privacy Policy</h1>
      </div>

      {/* Intro card */}
      <div
        className="mx-4 mb-4 bg-white rounded-2xl p-4 flex gap-3 items-start"
        style={{ border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
      >
        <span className="text-2xl mt-0.5 flex-shrink-0">🏢</span>
        <div>
          <p className="text-sm font-bold text-gray-800 mb-1">Business Data Commitment</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            This policy explains how we collect, use, and protect your business data, including offer activity and client interactions on our platform.
          </p>
        </div>
      </div>

      {/* Highlight strip */}
      <div
        className="mx-4 mb-4 rounded-2xl p-4 flex items-center gap-4"
        style={{ background: 'linear-gradient(135deg, #e6f4ec, #d1fae5)' }}
      >
        <div className="flex flex-col items-center flex-1">
          <span className="text-lg font-bold" style={{ color: '#009842' }}>✗</span>
          <span className="text-xs text-gray-500 mt-0.5 text-center">Never Sold</span>
        </div>
        <div className="w-px h-8 bg-green-200" />
        <div className="flex flex-col items-center flex-1">
          <span className="text-lg font-bold" style={{ color: '#009842' }}>🔐</span>
          <span className="text-xs text-gray-500 mt-0.5 text-center">Encrypted</span>
        </div>
        <div className="w-px h-8 bg-green-200" />
        <div className="flex flex-col items-center flex-1">
          <span className="text-lg font-bold" style={{ color: '#009842' }}>⚖️</span>
          <span className="text-xs text-gray-500 mt-0.5 text-center">Compliant</span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="px-4 mb-3 overflow-x-auto">
        <div className="flex gap-2 pb-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="text-xs font-semibold px-4 py-2 rounded-full whitespace-nowrap border transition-all duration-150"
              style={
                activeFilter === f
                  ? { background: '#009842', color: 'white', borderColor: '#009842' }
                  : { background: 'white', color: '#6b7280', borderColor: '#e5e7eb' }
              }
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion sections */}
      <div className="px-4 flex flex-col gap-3 pb-10">
        {filtered.map((section) => {
          const isOpen = openSection === section.id
          const tag = tagStyles[section.tag] || tagStyles.Legal
          return (
            <div
              key={section.id}
              className="bg-white rounded-2xl overflow-hidden transition-all duration-200"
              style={{
                border: isOpen ? '1.5px solid #009842' : '1.5px solid #f3f4f6',
                boxShadow: isOpen
                  ? '0 4px 16px rgba(0,152,66,0.1)'
                  : '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <button
                className="w-full flex items-center justify-between px-4 py-4 text-left bg-transparent"
                onClick={() => toggle(section.id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: isOpen ? '#e6f4ec' : '#f9fafb' }}
                  >
                    {section.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 mb-1">{section.title}</p>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: tag.bg, color: tag.text }}
                    >
                      {section.tag}
                    </span>
                  </div>
                </div>
                <span
                  className="text-gray-400 flex-shrink-0 transition-transform duration-200"
                  style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    display: 'inline-block',
                  }}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>

              {isOpen && (
                <div className="px-4 pb-4">
                  <div
                    className="h-px mb-3 rounded-full"
                    style={{ background: 'linear-gradient(to right, #009842, transparent)' }}
                  />
                  <p className="text-sm text-gray-500 leading-relaxed">{section.content}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Business_Privacy_Policy