"use client";

import { stadiums } from "../../../../app/data/dummyData";
import Link from "next/link";
import { useMemo } from "react";

export default function Card({ filters }) {
  // Filtering logic
  const filteredStadiums = useMemo(() => {
    return stadiums.filter((stadium) => {
      // Filter by governorate (using filtration field)
      if (filters?.governorate && stadium.filtration !== filters.governorate) {
        return false;
      }

      // Filter by city
      if (
        filters?.city &&
        !stadium.city.toLowerCase().includes(filters.city.toLowerCase())
      ) {
        return false;
      }

      // Filter by area
      if (
        filters?.area &&
        !stadium.area.toLowerCase().includes(filters.area.toLowerCase())
      ) {
        return false;
      }

      // Filter by minimum price
      if (
        filters?.minPrice &&
        stadium.hourlyPrice < parseInt(filters.minPrice)
      ) {
        return false;
      }

      return true;
    });
  }, [filters]);

  return (
    <div className="w-full">
      {/* Results count */}
      {filteredStadiums.length > 0 ? (
        <>
          <div className="mb-4 px-4 text-sm text-gray-300">
            Found{" "}
            <span className="font-bold text-[#B0C7B0]">
              {filteredStadiums.length}
            </span>{" "}
            stadium{filteredStadiums.length !== 1 ? "s" : ""}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredStadiums.map((stadium) => (
              <div
                key={stadium.id}
                className="w-full min-w-[230px] md:max-w-[280px] sm:max-w-[200px] bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 p-4 flex flex-col gap-3 hover:scale-105 transform"
              >
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={stadium.img || "/default-stadium.jpg"}
                    alt={stadium.name}
                    className="w-full h-40 object-cover rounded-lg hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <h3 className="text-lg font-bold text-[#004D03]">
                  {stadium.name}
                </h3>

                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <p>{stadium.filtration}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🏙️</span>
                    <p>{stadium.city}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🗺️</span>
                    <p>{stadium.area}</p>
                  </div>
                </div>

                <p className="text-[#004D03] font-bold text-lg border-t border-gray-200 pt-2">
                  💰 ${stadium.hourlyPrice}/hour
                </p>

                <Link
                  href={`/player/stadiums/${stadium.id}`}
                  className="mt-auto"
                >
                  <button className="w-full bg-gradient-to-r from-[#004D03] to-[#006B0F] text-white py-2.5 px-4 rounded-lg hover:from-[#003a02] hover:to-[#004D03] transition-all duration-300 font-bold shadow-md hover:shadow-lg active:scale-95">
                    View Details
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="w-full flex flex-col items-center justify-center py-16 px-4">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-white mb-2">
            No Stadiums Found
          </h3>
          <p className="text-gray-300 text-center max-w-md">
            We couldn't find any stadiums matching your filters. Try adjusting
            your search criteria or reset the filters to see all available
            stadiums.
          </p>
        </div>
      )}
    </div>
  );
}
