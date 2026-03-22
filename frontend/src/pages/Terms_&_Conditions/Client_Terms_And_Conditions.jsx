import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const sections = [
  {
    id: 1,
    icon: '📋',
    title: 'Acceptance of Terms',
    content: `By accessing or using our platform as a client, you confirm that you are at least 18 years old, have read and understood these Terms, and agree to be bound by them. If you do not agree, please discontinue use of the app immediately.`,
  },
  {
    id: 2,
    icon: '👤',
    title: 'Client Account',
    content: `You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate, current, and complete information during registration. You must notify us immediately of any unauthorized use of your account. We reserve the right to suspend accounts that violate our policies.`,
  },
  {
    id: 3,
    icon: '📰',
    title: 'Posts & Content',
    content: `As a client, you may view, interact with, and share posts published on the platform. You agree not to reproduce, distribute, or exploit any content without proper authorization. Any content you submit must be respectful, accurate, and free from offensive or illegal material. We reserve the right to remove any content at our discretion.`,
  },
  {
    id: 4,
    icon: '🗂️',
    title: 'Categories & Discovery',
    content: `Our platform organizes content into categories to help you discover relevant posts and businesses. Category listings are curated and may change over time. We do not guarantee that all categories will be available at all times or in all regions.`,
  },
  {
    id: 5,
    icon: '🏪',
    title: 'Business Interactions',
    content: `When interacting with businesses listed on our platform, you acknowledge that transactions and communications are solely between you and the respective business. We are not a party to any such interactions and are not liable for any disputes, damages, or losses arising from them.`,
  },
  {
    id: 6,
    icon: '🔒',
    title: 'Privacy & Data',
    content: `We collect and process your personal data in accordance with our Privacy Policy. By using the app, you consent to such processing. We implement industry-standard security measures to protect your data, but we cannot guarantee absolute security of information transmitted over the internet.`,
  },
  {
    id: 7,
    icon: '🚫',
    title: 'Prohibited Conduct',
    content: `You agree not to use the platform for any unlawful purpose, harass or harm other users or businesses, attempt to gain unauthorized access to any part of the platform, use automated tools to scrape or interact with the platform, or interfere with the platform's normal operation.`,
  },
  {
    id: 8,
    icon: '⚖️',
    title: 'Limitation of Liability',
    content: `To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform. Our total liability to you shall not exceed the amount you have paid us in the past 12 months, if any.`,
  },
  {
    id: 9,
    icon: '✏️',
    title: 'Changes to Terms',
    content: `We reserve the right to modify these Terms at any time. We will notify you of significant changes via the app or email. Your continued use of the platform after such changes constitutes your acceptance of the new Terms. It is your responsibility to review these Terms periodically.`,
  },
  {
    id: 10,
    icon: '📬',
    title: 'Contact Us',
    content: `If you have questions or concerns about these Terms, please contact our support team at support@ourplatform.com. We are committed to resolving any issues promptly and fairly.`,
  },
]

const Client_Terms_And_Conditions = () => {
  const [openSection, setOpenSection] = useState(null)
  const [accepted, setAccepted] = useState(false)
  const navigate = useNavigate()

  const toggle = (id) => setOpenSection(openSection === id ? null : id)

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