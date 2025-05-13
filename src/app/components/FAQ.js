'use client'
import { useState } from 'react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const faqs = [
    {
      question: 'What is the Edu Assist?',
      answer:
        'The Edu Assist is an initiative offering 1000+ free online courses in cutting-edge technologies, with over 5 million learners worldwide.',
    },
    {
      question: 'How can I enroll in a course?',
      answer:
        'Just visit the course page and click on the "Enroll Now" button. Sign up if you don’t already have an account.',
    },
    {
      question: 'Are the courses free?',
      answer:
        'Yes, most are free! Some advanced courses may require payment, but you can filter to see only the free ones.',
    },
    {
      question: 'Can I get a certificate after completing a course?',
      answer:
        'Many courses offer certificates—some are free, others may charge a small fee.',
    },
    {
      question: 'Do I need any prior experience to start a course?',
      answer:
        'Not at all! Most courses are beginner-friendly, but you can filter by level if needed.',
    },
    {
      question: 'Can I access the courses on mobile?',
      answer:
        'Yes! Our platform works great on phones and tablets, so you can learn anytime, anywhere.',
    },
  ]

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-orange-500">Frequently Asked Questions</h2>
          <p className="text-gray-600 mt-2">Here’s everything you need to know about our platform.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className={`w-full text-left px-5 py-4 bg-white flex justify-between items-center hover:bg-orange-50 transition duration-300 ${
                  openIndex === index ? 'bg-orange-100' : ''
                }`}
              >
                <span className="text-lg font-medium text-gray-800">{faq.question}</span>
                <svg
                  className={`w-5 h-5 transform transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180 text-orange-500' : 'rotate-0 text-gray-500'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Answer Body */}
              <div
                className={`transition-all px-5 text-gray-600 text-base overflow-hidden duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-screen py-4' : 'max-h-0 py-0'
                }`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
