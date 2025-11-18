import React from 'react'
import Head from 'next/head'

export default function CookiesPage() {
  return (
    <>
      <Head>
        <title>Cookie Policy — SmartRental</title>
        <meta name="description" content="Cookie Policy for SmartRental — what cookies we use and why." />
      </Head>

      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">Cookie Policy</h1>
          <p className="mt-3 text-primary-100">Last updated: 15 November 2025</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="prose max-w-none">
          <h2>What Are Cookies</h2>
          <p>
            Cookies are small text files stored on your device when you visit websites. They help the site remember your
            preferences and improve your experience.
          </p>

          <h2>How We Use Cookies</h2>
          <ul>
            <li>Essential cookies to enable core site functionality (authentication, form submissions).</li>
            <li>Performance and analytics cookies to understand usage and improve the site.</li>
            <li>Advertising cookies to show relevant content (third-party providers may set these).</li>
          </ul>

          <h2>Managing Cookies</h2>
          <p>
            You can control cookies via your browser settings. Disabling cookies may limit certain features of the site.
          </p>

          <h2>Contact</h2>
          <p>If you have questions about our Cookie Policy, contact us at privacy@smartrental.example.</p>
        </div>
      </div>
    </>
  )
}
