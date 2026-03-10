import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const sections = [
  {
    id: 1,
    icon: '🤝',
    title: 'Agreement to Terms',
    tag: 'Required',
    content: `By registering as a business on our platform, you confirm that you are authorized to act on behalf of your business entity, are at least 18 years old, and agree to be bound by these Terms. These Terms form a binding legal agreement between your business and us.`,
  },
  {
    id: 2,
    icon: '🏢',
    title: 'Business Account Setup',
    tag: 'Account',
    content: `You must provide accurate business information including legal business name, address, contact details, and relevant licenses or registrations. You are solely responsible for maintaining the accuracy of your business profile. Misrepresentation of your business may result in immediate account termination.`,
  },
  {
    id: 3,
    icon: '🎯',
    title: 'Creating Offers',
    tag: 'Core',
    content: `You may create and publish offers on your business page. All offers must be genuine, accurately described, and legally compliant. You are responsible for honoring any offers published on the platform. Misleading or fraudulent offers are strictly prohibited and may result in account suspension.`,
  },
  {
    id: 4,
    icon: '✏️',
    title: 'Updating Offers',
    tag: 'Core',
    content: `You may update your offers at any time. However, changes must be clearly communicated and must not mislead customers who engaged with a prior version of the offer. Retroactive changes that disadvantage customers who already accepted an offer are not permitted.`,
  },
  {
    id: 5,
    icon: '🗑️',
    title: 'Deleting Offers',
    tag: 'Core',
    content: `You may delete offers that are no longer valid. However, you remain responsible for fulfilling commitments made under any offer prior to its deletion. Deleting an offer does not absolve you of responsibilities to customers who have already accepted or acted upon it.`,
  },
  {
    id: 6,
    icon: '📊',
    title: 'Content Standards',
    tag: 'Policy',
    content: `All content you publish — including offer descriptions, images, and business information — must be accurate, non-deceptive, and compliant with applicable laws. Content must not infringe third-party intellectual property rights, be defamatory, obscene, or violate any regulations in the regions where you operate.`,
  },
  {
    id: 7,
    icon: '💰',
    title: 'Fees & Payments',
    tag: 'Financial',
    content: `Certain features or listing placements may be subject to fees, which will be clearly communicated before purchase. All fees are non-refundable unless otherwise stated. We reserve the right to modify our fee structure with 30 days' notice. Continued use after fee changes constitutes acceptance of the new pricing.`,
  },
  {
    id: 8,
    icon: '🔒',
    title: 'Data & Privacy',
    tag: 'Legal',
    content: `You agree to handle any customer data obtained through the platform in compliance with applicable data protection laws. You must not use customer contact information obtained through the platform for unsolicited marketing outside the platform. Our Privacy Policy governs how we handle your business data.`,
  },
  {
    id: 9,
    icon: '⚠️',
    title: 'Prohibited Activities',
    tag: 'Policy',
    content: `Businesses must not engage in deceptive advertising, manipulate reviews or ratings, offer illegal products or services, use the platform to conduct fraudulent transactions, engage in anti-competitive behavior, or misuse customer data. Violations may result in immediate termination and legal action.`,
  },
  {
    id: 10,
    icon: '🛡️',
    title: 'Indemnification',
    tag: 'Legal',
    content: `You agree to indemnify, defend, and hold harmless our platform, its officers, directors, employees, and agents from any claims, liabilities, damages, or expenses (including legal fees) arising from your use of the platform, your offers, your content, or your violation of these Terms.`,
  },
  {
    id: 11,
    icon: '⚖️',
    title: 'Termination',
    tag: 'Legal',
    content: `We reserve the right to suspend or terminate your business account at any time for violations of these Terms or for any conduct we deem harmful to the platform or its users. You may terminate your account at any time by contacting support. Termination does not relieve you of obligations incurred prior to termination.`,
  },
  {
    id: 12,
    icon: '📬',
    title: 'Contact & Support',
    tag: 'Support',
    content: `For business-related inquiries, disputes, or support, please contact our Business Support team at business@ourplatform.com. We are dedicated to helping your business succeed on our platform and will respond to all inquiries within 2 business days.`,
  },
]

const tagStyles = {
  Required: { bg: '#FEF3C7', text: '#92400E' },
  Account:  { bg: '#DBEAFE', text: '#1E40AF' },
  Core:     { bg: '#DCFCE7', text: '#166534' },
  Policy:   { bg: '#EDE9FE', text: '#5B21B6' },
  Financial:{ bg: '#FEE2E2', text: '#991B1B' },
  Legal:    { bg: '#F3F4F6', text: '#374151' },
  Support:  { bg: '#D1FAE5', text: '#065F46' },
}

const filters = ['All', 'Core', 'Policy', 'Legal', 'Financial']

const Business_Terms_And_Conditions = () => {
  const [openSection, setOpenSection] = useState(null)
  const [accepted, setAccepted] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')

  const toggle = (id) => setOpenSection(openSection === id ? null : id)

  const filtered = activeFilter === 'All' ? sections : sections.filter(s => s.tag === activeFilter)

  return (
    <div className="min-h-screen bg-gray-50 max-w-sm mx-auto font-sans">

      {/* Header */}
      <div
        className="px-5 pt-12 pb-8"
        style={{ background: 'linear-gradient(160deg, #009842 0%, #00875A 100%)' }}
      >
        {/* Back + Logo */}
        <div className="flex items-center justify-between mb-6">
          <Link to={'/business_sign_up'} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <div className="w-9" />
        </div>

        {/* Title block */}
        <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'rgba(255,255,255,0.65)' }}>Legal</p>
        <h1 className="text-2xl font-bold text-white tracking-tight mb-3">Terms & Conditions</h1>
      </div>

      {/* Intro card */}
      <div className="mx-4 mb-4 bg-white rounded-2xl p-4 flex gap-3 items-start" style={{ border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <span className="text-2xl mt-0.5 flex-shrink-0">🏢</span>
        <div>
          <p className="text-sm font-bold text-gray-800 mb-1">Business Partner Agreement</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            These terms govern your ability to create offers, manage your business profile, and interact with clients on our platform.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="px-4  mb-3 overflow-x-auto">
        <div className="flex gap-2 pb-1">
          {filters.map(f => (
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
      <div className="px-4 pb-10 flex flex-col gap-3">
        {filtered.map((section) => {
          const isOpen = openSection === section.id
          const tag = tagStyles[section.tag] || tagStyles.Legal
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

export default Business_Terms_And_Conditions