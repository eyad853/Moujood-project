import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const sections = [
  {
    id: 1,
    icon: '📥',
    title: 'Information We Collect',
    tag: 'Data',
    content: `We collect information you provide when registering your business, including your business name, legal entity type, registration number, address, contact email, phone number, and payment details. We also collect information about how you use the platform, such as offer creation activity, response rates, and feature usage patterns.`,
  },
  {
    id: 2,
    icon: '🎯',
    title: 'How We Use Your Information',
    tag: 'Usage',
    content: `We use your business information to create and manage your business account, publish and display your offers to clients, process payments and billing, send you platform updates and business insights, verify your business identity, and improve the tools and features available to business partners.`,
  },
  {
    id: 3,
    icon: '🎁',
    title: 'Offers & Business Activity',
    tag: 'Core',
    content: `When you create, update, or delete offers, we store a record of these activities to ensure platform integrity, resolve disputes, and provide you with analytics on offer performance. Deleted offers are removed from public view but may be retained in our systems for a limited period for legal and compliance purposes.`,
  },
  {
    id: 4,
    icon: '👥',
    title: 'Client Data Access',
    tag: 'Core',
    content: `When clients interact with your offers or business profile, we may share limited client information (such as display name or interaction type) with you to facilitate the business relationship. You must handle any client data you receive in compliance with applicable data protection laws and must not use it for purposes outside the platform interaction.`,
  },
  {
    id: 5,
    icon: '🤝',
    title: 'Sharing Your Information',
    tag: 'Sharing',
    content: `We do not sell your business information to third parties. We may share your information with payment processors, cloud hosting providers, and analytics partners under strict confidentiality agreements. Your business profile and published offers are visible to clients and the general public as part of the platform's core functionality.`,
  },
  {
    id: 6,
    icon: '💳',
    title: 'Payment & Financial Data',
    tag: 'Financial',
    content: `Payment information you provide is processed by our certified third-party payment processors. We do not store full card details on our servers. We retain records of transactions for accounting, tax compliance, and dispute resolution purposes. You are responsible for maintaining accurate billing information in your account.`,
  },
  {
    id: 7,
    icon: '📊',
    title: 'Analytics & Performance Data',
    tag: 'Data',
    content: `We provide you with analytics about your offers and business profile performance, such as views, saves, and client interactions. This data is aggregated and used to help you optimize your presence on the platform. We also use aggregated, anonymized data to improve platform features and report on overall platform trends.`,
  },
  {
    id: 8,
    icon: '🔐',
    title: 'Data Security',
    tag: 'Security',
    content: `We implement industry-standard security measures including TLS encryption, access controls, and regular security audits to protect your business data. You are responsible for maintaining the security of your account credentials and for any activity that occurs under your business account. Notify us immediately of any suspected unauthorized access.`,
  },
  {
    id: 9,
    icon: '⏳',
    title: 'Data Retention',
    tag: 'Legal',
    content: `We retain your business data for as long as your account is active or as needed to provide our services. Upon account termination, we may retain certain data for up to 7 years as required by law for tax, legal, and compliance purposes. You may request deletion of non-required data by contacting our support team.`,
  },
  {
    id: 10,
    icon: '✋',
    title: 'Your Rights',
    tag: 'Legal',
    content: `As a business partner, you have the right to access, correct, or request deletion of your business data. You may export your data at any time from your account settings. Where applicable under local laws such as GDPR, you may have additional rights including data portability and the right to object to certain processing activities.`,
  },
  {
    id: 11,
    icon: '🔄',
    title: 'Changes to This Policy',
    tag: 'Policy',
    content: `We may update this Privacy Policy periodically. Significant changes will be communicated via the app or email with at least 14 days' notice before they take effect. Your continued use of the platform after changes take effect constitutes your acceptance of the updated policy.`,
  },
  {
    id: 12,
    icon: '📬',
    title: 'Contact Us',
    tag: 'Support',
    content: `For privacy-related inquiries, data access requests, or concerns about how we handle your business data, please contact our Privacy team at privacy@ourplatform.com. We are committed to responding to all business privacy inquiries within 3 business days.`,
  },
]

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

const Business_Privacy_Policy = () => {
  const [openSection, setOpenSection] = useState(null)
  const [activeFilter, setActiveFilter] = useState('All')
  const navigate = useNavigate()

  const toggle = (id) => setOpenSection(openSection === id ? null : id)

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

        <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Legal
        </p>
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