import Profile from "@/components/playerHome/profile/profile";
import PersonalInformation from "./Section/PersonalInformation";

export default function ProfilePage() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-6 py-4 px-3">
      <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
        <PersonalInformation />
      </h2>
      <Profile />
    </div>
  );
}
