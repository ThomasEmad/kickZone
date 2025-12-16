import Login from "@/components/login/login";

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#004D03] via-[#006B0F] to-[#003D02] flex items-center justify-center">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#B0C7B0] rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#B0C7B0] rounded-full opacity-10 blur-3xl"></div>
      </div>

      {/* Main container */}
      <div className="relative w-full min-h-screen flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-0">
        {/* Left side - Branding */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center md:text-left">
          <div className="space-y-4 w-full md:max-w-lg">
            {/* Logo/Icon placeholder */}
            <div className="flex justify-center md:justify-start">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#B0C7B0] rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <span className="text-3xl sm:text-4xl">⚽</span>
              </div>
            </div>

            {/* Welcome text */}
            <div className="space-y-2">
              <p className="text-[#B0C7B0] text-sm sm:text-base md:text-lg font-semibold tracking-widest">
                WELCOME TO
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white drop-shadow-lg">
                KICK<span className="text-[#B0C7B0]">ZONE</span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-md leading-relaxed">
              Book your favorite football fields with ease and speed
              <br />
              <span className="text-xs sm:text-sm text-gray-400">
                Find and reserve the perfect pitch in minutes
              </span>
            </p>

            {/* Features - Visible on md and up */}
            <div className="hidden md:grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-[#B0C7B0] border-opacity-20">
              <div className="space-y-2">
                <div className="text-2xl">⚡</div>
                <p className="text-sm text-gray-300">Fast & Secure Booking</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl">📅</div>
                <p className="text-sm text-gray-300">Choose Your Time</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl">💰</div>
                <p className="text-sm text-gray-300">Affordable Prices</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl">📍</div>
                <p className="text-sm text-gray-300">Multiple Venues</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-sm">
            {/* Form container */}
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 border border-white border-opacity-20">
              <Login />
            </div>

            {/* Footer text */}
            <p className="text-center text-gray-300 text-xs sm:text-sm mt-4 sm:mt-6">
              All rights reserved © 2025 KickZone
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
