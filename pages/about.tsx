import React from 'react'
import Head from 'next/head'

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us — SmartRental</title>
        <meta name="description" content="About SmartRental — our mission and team." />
      </Head>

      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">About SmartRental</h1>
          <p className="mt-3 text-primary-100">Helping renters and landlords make smarter decisions with AI.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="prose max-w-none">
          <h2>Our Mission</h2>
          <p>
            SmartRental's mission is to simplify the rental experience by combining a modern marketplace with AI-driven
            insights. We deliver reliable price predictions, fraud detection, and tools to help both renters and property
            owners transact with confidence.
          </p>

          <h2>What We Build</h2>
          <p>
            We build simple, reliable tools: property listings, secure messaging, automated rent predictions, and fraud
            detection signals to flag suspicious or low-quality listings.
          </p>

          <h2>Team</h2>
          <p>
            SmartRental was founded by a small team of engineers and data scientists passionate about real estate and privacy.
            We're continuously improving the product and welcome feedback from the community.
          </p>

          <h2>Contact</h2>
          <p>
            For partnership or press inquiries, email <a href="mailto:hello@smartrental.example">hello@smartrental.example</a>.
          </p>
        </div>
      </div>
    </>
  )
}
