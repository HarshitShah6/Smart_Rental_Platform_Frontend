import React from 'react'
import Head from 'next/head'

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Terms of Service — SmartRental</title>
        <meta name="description" content="Terms of Service for SmartRental." />
      </Head>

      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">Terms of Service</h1>
          <p className="mt-3 text-primary-100">Last updated: 15 November 2025</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="prose max-w-none">
          <h2>Acceptance of Terms</h2>
          <p>
            By accessing or using SmartRental, you agree to be bound by these Terms of Service and all applicable laws and
            regulations. If you do not agree, you must not use our services.
          </p>

          <h2>Use of the Service</h2>
          <p>
            SmartRental provides a platform to list, discover, and enquire about rental properties. You are responsible for
            the accuracy of any information you submit, and you must not post illegal, fraudulent, or infringing content.
          </p>

          <h2>User Accounts</h2>
          <p>
            You may need to create an account to access certain features. Keep your account credentials secure. We may
            suspend or terminate accounts that violate these Terms.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            All content and code provided on the platform are protected by copyright and other intellectual property laws. You
            may not reproduce or distribute our content without permission.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, SmartRental will not be liable for indirect, incidental, special, or
            consequential damages arising from your use of the service.
          </p>

          <h2>Governing Law</h2>
          <p>These Terms are governed by the laws of the jurisdiction in which SmartRental operates.</p>

          <h2>Contact</h2>
          <p>If you have questions about these Terms, contact us at legal@smartrental.example.</p>
        </div>
      </div>
    </>
  )
}
