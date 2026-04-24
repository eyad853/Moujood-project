import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'


const Client_Terms_And_Conditions = () => {
  const [openSection, setOpenSection] = useState(null)
  const [accepted, setAccepted] = useState(false)
  const navigate = useNavigate()
  const {t}=useTranslation("client_Terms_And_Conditions")

  const toggle = (id) => setOpenSection(openSection === id ? null : id)

  const sections = [
  {
    id: 1,
    icon: '📋',
    title: t("1.title"),
    content: t("1.content"),
  },
  {
    id: 2,
    icon: '👤',
    title: t("2.title"),
    content: t("2.content"),
  },
  {
    id: 3,
    icon: '📰',
    title: t("3.title"),
    content: t("3.content"),  },
  {
    id: 4,
    icon: '🗂️',
    title: t("4.title"),
    content: t("4.content"),  },
  {
    id: 5,
    icon: '🏪',
    title: t("5.title"),
    content: t("5.content"),  },
  {
    id: 6,
    icon: '🔒',
    title: t("6.title"),
    content: t("6.content"),  },
  {
    id: 7,
    icon: '🚫',
    title: t("7.title"),
    content: t("7.content"),  },
  {
    id: 8,
    icon: '⚖️',
    title: t("8.title"),
    content: t("8.content"),  },
  {
    id: 9,
    icon: '✏️',
    title: t("9.title"),
    content: t("9.content"),  },
  {
    id: 10,
    icon: '📬',
    title: t("10.title"),
    content: t("10.content"),  },
]

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
          className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="w-9" />
        </div>

        {/* Title block */}
        <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'rgba(255,255,255,0.65)' }}>Legal</p>
        <h1 className="text-2xl font-bold text-white tracking-tight mb-3">Terms & Conditions</h1>
      </div>

      {/* Intro card — overlaps header */}
      <div className="mx-4 -mt-4 bg-white rounded-2xl shadow-lg p-4 flex gap-3 items-start mb-5" style={{ border: '1px solid #e5e7eb' }}>
        <span className="text-2xl mt-0.5 flex-shrink-0">👋</span>
        <p className="text-sm text-gray-500 leading-relaxed">
          Welcome! These terms govern your use of our platform as a{' '}
          <span className="font-semibold text-gray-800">client</span>. Please read carefully before continuing.
        </p>
      </div>

      {/* Accordion sections */}
      <div className="px-4 pb-10 flex flex-col gap-3">
        {sections.map((section) => {
          const isOpen = openSection === section.id
          return (
            <div
              key={section.id}
              className="bg-white rounded-2xl overflow-hidden transition-all duration-200"
              style={{
                border: isOpen ? '1.5px solid #009842' : '1.5px solid #f3f4f6',
                boxShadow: isOpen ? '0 4px 16px rgba(0,152,66,0.1)' : '0 1px 3px rgba(0,0,0,0.05)',
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
                  <span className="text-sm font-bold text-gray-800">{section.title}</span>
                </div>
                <span
                  className="text-gray-400 flex-shrink-0 transition-transform duration-200"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block' }}
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

export default Client_Terms_And_Conditions