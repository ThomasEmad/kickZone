import React, { useEffect, useState } from "react";
import api from "../api/axiosClient";
export default function Home() {
  const [pitches, setPitches] = useState([]);
  useEffect(() => {
    api
      .get("/pitches/")
      .then((r) => setPitches(r.data))
      .catch(() => setPitches([]));
  }, []);
  return (
    <div>
      <h1>KickZone - Pitches</h1>
      <div className="grid">
        {pitches.length === 0 ? (
          <p>No pitches (or backend not running)</p>
        ) : (
          pitches.map((p) => (
            <div className="card" key={p.id}>
              <h3>{p.name}</h3>
              <p>{p.location}</p>
              <p>{p.price_per_hour} EGP/hr</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
