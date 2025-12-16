"use client";
import { useState } from "react";
import { HiMenu } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

import Link from "next/link";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <div className="md:ml-64">
            {/* ========== Mobile Navbar ========== */}
            <div className="p-4 flex justify-between items-center bg-white shadow-md md:hidden">
                <h2 className="text-xl font-bold text-[#004D03]">KICKZONE</h2>

                <HiMenu
                    size={32}
                    className="cursor-pointer"
                    onClick={() => setOpen(true)}
                />
            </div>


            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-40"
                    style={{ backgroundColor: "rgba(51, 51, 51, 0.5)" }}
                    onClick={() => setOpen(false)}
                ></div>
            )}

            {/* Mobile Side Menu */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-[#3F3F3F] shadow-lg transform 
                ${open ? "translate-x-0" : "-translate-x-full"} 
                transition-transform duration-300 z-50 md:hidden`}
            >
                <div className="p-4 flex justify-between items-center border-b">
                    <h2 className="text-lg font-bold text-[#ffffff]">Menu</h2>
                    <IoClose size={30} className="cursor-pointer text-[#ffffff] hover:text-red-500 transition-colors duration-300" onClick={() => setOpen(false)} />
                </div>

                <ul className="p-4 space-y-4">
                    <Link href="/player/stadiums">
                        <li className="cursor-pointer text-[#ffffff]">Stadiums</li>
                    </Link>
                    <Link href="/player/profile">
                        <li className="cursor-pointer text-[#ffffff]">Profile</li>
                    </Link>
                    <Link href="/player/settings">
                        <li className="cursor-pointer text-[#ffffff]">Settings</li>
                    </Link>
                </ul>
            </div>

            {/* ========== Desktop + Tablet Navbar ========== */}
            <div className="hidden md:flex flex-col w-[256PX] h-screen bg-white shadow-lg p-6 fixed left-0 top-0">
                <h2 className="text-2xl font-bold text-[#004D03] mb-6">KICKZONE</h2>

                <ul className="space-y-6">
                    <Link href="/player/stadiums">
                        <li className="cursor-pointer text-[#004D03]">Stadiums</li>
                    </Link>
                    <Link href="/player/profile">
                        <li className="cursor-pointer text-[#004D03]">Profile</li>
                    </Link>
                    <Link href="/player/settings">
                        <li className="cursor-pointer text-[#004D03]">Settings</li>
                    </Link>
                </ul>
            </div>
        </div>
    );
}
