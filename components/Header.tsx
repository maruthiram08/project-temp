"use client"

import Link from "next/link"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/assets/Icons/zennitylog.png"
              alt="Zennity"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-xl font-semibold text-gray-900">Zennity</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="/spend-offers" className="text-sm text-gray-600 hover:text-gray-900">
              Spend Offers
            </Link>
            <Link href="/new-card-offers" className="text-sm text-gray-600 hover:text-gray-900">
              New Card Offers
            </Link>
            <Link href="/stacking-hacks" className="text-sm text-gray-600 hover:text-gray-900">
              Stacking Hacks
            </Link>
            <Link href="/hotel-airline-deals" className="text-sm text-gray-600 hover:text-gray-900">
              Hotel/Airline Deals
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <span className="text-sm text-gray-600 hidden sm:inline">
                  Hi, {session.user.name}
                </span>
                {session.user.isAdmin && (
                  <Link
                    href="/admin"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-5 py-2.5 rounded-lg transition-all"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden sm:inline"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-5 py-2.5 rounded-lg transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
