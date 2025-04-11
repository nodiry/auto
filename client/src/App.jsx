import React from "react";
import { Button } from "@radix-ui/themes";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold text-blue-600">Dream Auto</h1>
        <nav className="space-x-4">
          <a href="/auth/login" className="text-sm hover:underline">
            Login
          </a>
          <a href="/auth/signup" className="text-sm hover:underline">
            Sign Up
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-4">Buy & Sell Cars Effortlessly</h2>
          <p className="text-lg text-gray-600 mb-6">
            CarHive connects dealers and buyers in a fast, simple, and secure platform.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-full shadow hover:bg-blue-700">
              Browse Cars
            </button>
            <button className="bg-gray-200 text-gray-900 px-6 py-2 rounded-full shadow hover:bg-gray-300">
              List Your Car
            </button>
          </div>
        </div>
      </main>

      {/* Features */}
      <section className="px-6 py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <h3 className="text-xl font-semibold mb-2">Verified Dealers</h3>
            <p className="text-gray-600">Work only with trusted car sellers and buyers.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
            <p className="text-gray-600">Safe and reliable payment options built-in.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Real-Time Listings</h3>
            <p className="text-gray-600">See the newest cars available, updated live.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-4">
        © {new Date().getFullYear()} CarHive. All rights reserved.
      </footer>
    </div>
  );
}
