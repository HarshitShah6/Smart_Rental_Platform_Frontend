import React from 'react'
import Head from 'next/head'

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy — SmartRental</title>
        <meta name="description" content="Privacy Policy for SmartRental — how we collect, use and protect your data." />
      </Head>

      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
          <p className="mt-3 text-primary-100">Last updated: 15 November 2025</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="prose max-w-none">
          <h2>Introduction</h2>
          <p>
            SmartRental (“we”, “us”, or “our”) operates this website and services to help users find and list rental properties. We
            respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you use our services.
          </p>

          <h2>Information We Collect</h2>
          <p>We collect information directly from you, automatically through your use of our services, and from third parties.</p>
          <ul>
            <li>Personal details (name, email, phone) when you create an account or list a property.</li>
            <li>Property details and images you upload to our platform.</li>
            <li>Usage data, device and log information, and cookies.</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use collected information to:</p>
          <ul>
            <li>Provide, maintain, and improve our services.</li>
            <li>Process property listings and provide AI-powered rent predictions.</li>
            <li>Communicate with you about your account and transactions.</li>
            <li>Detect and prevent fraud and abuse.</li>
          </ul>

          <h2>Sharing Your Information</h2>
          <p>
            We may share information with service providers (hosting, analytics, payment), law enforcement when required, and
            other users as needed to display property listings. We do not sell personal data to third parties.
          </p>

          <h2>Cookies and Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to operate the site, remember your preferences, and analyze usage.
            See our Cookie Policy for more details.
          </p>

          <h2>Your Rights</h2>
          <p>
            Depending on your jurisdiction, you may have rights to access, correct, delete, or port your personal data. To
            exercise these rights, contact us at privacy@smartrental.example.
          </p>

          <h2>Contact</h2>
          <p>If you have questions about this Privacy Policy, contact us at privacy@smartrental.example.</p>
        </div>
      </div>
    </>
  )
}
