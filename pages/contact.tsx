import React from 'react'
import Head from 'next/head'

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact — SmartRental</title>
        <meta name="description" content="Contact SmartRental — support and general inquiries." />
      </Head>

      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">Contact Us</h1>
          <p className="mt-3 text-primary-100">We'd love to hear from you — reach out with questions or feedback.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="prose max-w-none">
          <h2>Support</h2>
          <p>
            For help with listings, accounts, or technical issues, email our support team at{' '}
            <a href="mailto:support@smartrental.example">support@smartrental.example</a>. We aim to respond within 48 hours.
          </p>

          <h2>Business Inquiries</h2>
          <p>
            For partnerships or developer integrations, contact <a href="mailto:partnerships@smartrental.example">partnerships@smartrental.example</a>.
          </p>

          <h2>Mailing Address</h2>
          <p>SmartRental — 123 Startup Lane, Bangalore, India</p>
        </div>
      </div>
    </>
  )
}
