"use client";

import { useState } from "react";
import Card from "../../../components/playerHome/profile/stadiums/stadiumsCard";

export default function Stadiums() {
  const [filters, setFilters] = useState({
    governorate: "",
    city: "",
    area: "",
    minPrice: "",
  });

  return (
    <>
      <div className="w-full min-h-screen bg-gradient-to-b from-[#004D03] via-[#006B0F] to-[#003D02] flex flex-col items-center gap-6 py-8 px-3">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-0 w-96 h-96 bg-[#B0C7B0] rounded-full opacity-5 blur-3xl"></div>
          <div className="absolute bottom-20 left-0 w-96 h-96 bg-[#B0C7B0] rounded-full opacity-5 blur-3xl"></div>
        </div>

        <div className="relative w-full max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg">
              Find Your Perfect <span className="text-[#B0C7B0]">Pitch</span>
            </h2>
            <p className="text-gray-300 text-sm md:text-base">
              Browse and book the best football stadiums in your area
            </p>
          </div>

          {/* Stadium Filtration */}

          {/* Results Info */}
          <div className="flex justify-between items-center px-4">
            <h3 className="text-lg md:text-xl font-bold text-white">
              📋 Available Stadiums
            </h3>
            <span className="text-sm text-gray-300">
              {filters.governorate ||
              filters.city ||
              filters.area ||
              filters.minPrice
                ? "Filtered Results"
                : "Showing All Stadiums"}
            </span>
          </div>

          {/* Stadiums Grid */}
          <div className="w-full">
            <Card filters={filters} />
          </div>
        </div>
      </div>
    </>
  );
}
