import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const sections = [
  {
    id: 1,
    icon: '📥',
    title: 'Information We Collect',
    content: `We collect information you provide directly to us when you register, such as your name, email address, phone number, and profile photo. We also automatically collect certain information when you use the app, including device identifiers, IP address, browser type, operating system, pages viewed, and the dates and times of your visits.`,
  },
  {
    id: 2,
    icon: '🎯',
    title: 'How We Use Your Information',
    content: `We use the information we collect to create and manage your account, provide and personalize your experience, show you relevant posts, categories, and business offers, send you service notifications and updates, respond to your comments and questions, and improve the overall performance of our platform.`,
  },
  {
    id: 3,
    icon: '🔍',
    title: 'Posts & Content You View',
    content: `When you browse posts or categories on the platform, we may record your interactions such as likes, saves, shares, and time spent viewing content. This data helps us tailor your feed and surface content that is most relevant to your interests. You can manage your content preferences in your account settings.`,
  },
  {
    id: 4,
    icon: '🏪',
    title: 'Business Interactions',
    content: `When you interact with businesses on our platform — such as viewing their profiles, saving offers, or initiating contact — we may share limited information (such as your display name) with those businesses to facilitate the interaction. We do not sell your personal data to businesses.`,
  },
  {
    id: 5,
    icon: '🤝',
    title: 'Sharing Your Information',
    content: `We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating the platform, under strict confidentiality agreements. We may also disclose information when required by law or to protect the rights, property, or safety of our platform, users, or others.`,
  },
  {
    id: 6,
    icon: '🍪',
    title: 'Cookies & Tracking',
    content: `We use cookies and similar tracking technologies to enhance your experience, remember your preferences, and analyze usage patterns. You can control cookie settings through your browser. Disabling cookies may affect some features of the platform. We also use analytics tools to understand how users interact with our app.`,
  },
  {
    id: 7,
    icon: '🔐',
    title: 'Data Security',
    content: `We implement industry-standard security measures including encryption, secure servers, and regular security audits to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure. We encourage you to use a strong password and keep your account credentials private.`,
  },
  {
    id: 8,
    icon: '👶',
    title: "Children's Privacy",
    content: `Our platform is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately and we will take steps to delete it.`,
  },
  {
    id: 9,
    icon: '✋',
    title: 'Your Rights & Choices',
    content: `You have the right to access, update, or delete your personal information at any time through your account settings. You may also opt out of promotional communications by following the unsubscribe instructions in those messages. Where applicable, you may have additional rights under local data protection laws such as GDPR.`,
  },
  {
    id: 10,
    icon: '🌍',
    title: 'Data Transfers',
    content: `Your information may be transferred to and processed in countries other than your own. These countries may have data protection laws that differ from those in your country. By using our platform, you consent to the transfer of your information to these countries in accordance with this Privacy Policy.`,
  },
  {
    id: 11,
    icon: '🔄',
    title: 'Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of any significant changes via the app or by email. Your continued use of the platform after changes are posted constitutes your acceptance of the updated policy. We encourage you to review this policy periodically.`,
  },
  {
    id: 12,
    icon: '📬',
    title: 'Contact Us',
    content: `If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact our Privacy team at privacy@ourplatform.com. We will respond to all inquiries within 5 business days.`,
  },
]

const Client_Privacy_Policy = () => {
  const [openSection, setOpenSection] = useState(null)
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
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.2)' }}
          >
            <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="w-9" />
        </div>

        {/* Shield icon */}
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
        className="mx-4 -mt-4 bg-white rounded-2xl shadow-lg p-4 flex gap-3 items-start mb-5"
        style={{ border: '1px solid #e5e7eb' }}
      >
        <span className="text-2xl mt-0.5 flex-shrink-0">🔒</span>
        <p className="text-sm text-gray-500 leading-relaxed">
          Your privacy matters to us. This policy explains how we{' '}
          <span className="font-semibold text-gray-800">collect, use, and protect</span> your personal
          information when you use our platform as a client.
        </p>
      </div>

      {/* Highlight strip */}
      <div
        className="mx-4 mb-5 rounded-2xl p-4 flex items-center gap-4"
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
          <span className="text-lg font-bold" style={{ color: '#009842' }}>✋</span>
          <span className="text-xs text-gray-500 mt-0.5 text-center">Your Rights</span>
        </div>
      </div>

      {/* Accordion sections */}
      <div className="px-4 flex flex-col gap-3 pb-10">
        {sections.map((section) => {
          const isOpen = openSection === section.id
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
                  <span className="text-sm font-bold text-gray-800">{section.title}</span>
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

export default Client_Privacy_Policy