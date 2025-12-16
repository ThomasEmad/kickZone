import { useState } from "react";

export default function SkillLevel() {
  const [level, setLevel] = useState(0);

  const levelsText = ["Beginner", "Junior", "Mid", "Senior", "Pro"];

  const submitLevel = async () => {
    await fetch("/api/skill-level", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ skillLevel: level }),
    });
  };

  return (
    <div className="rounded-xl">
      <h2 className="text-black text-xl font-semibold mb-4">Skill Level</h2>

      {/* Dots */}
      <div className=" px-3 flex gap-3 mb-3">
        {[1, 2, 3, 4, 5].map((item) => (
          <button
            key={item}
            onClick={() => setLevel(item)}
            className={`w-5 h-5 rounded-full transition
              ${item <= level ? "bg-[#004D03]" : "bg-gray-600"}
            `}
          />
        ))}
      </div>

      {/* Label */}
      <p className=" px-3 text-black mb-4">
        {level ? levelsText[level - 1] : "Select level"}
      </p>

      {/* Submit */}
    </div>
  );
}
