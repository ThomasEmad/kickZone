import Navbar from "../../components/playerHome/navbar";

export default function PlayerLayout({ children }) {
  return (
    <>
      <div className=" md:flex">
        <Navbar />

        <div className="flex-1 p-4 bg-[#004D03] min-h-screen">
          {children}
        </div>
      </div>
    </>
  );
}