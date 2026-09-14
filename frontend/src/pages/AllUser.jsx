import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Autoplay from "embla-carousel-autoplay";

import userimg from "../assets/userprofile.png";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../components/ui/carousel";

import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";
import { getProfileImage } from "../utils/profileImage";
import UserProfileModal from "../components/UserProfileModal";
import { Users, ArrowRight, PenSquare } from "lucide-react";

const AllUser = () => {
    const navigate = useNavigate();

    const plugin = useRef(
        Autoplay({
            delay: 6000,
            stopOnInteraction: false,
        })
    );

    const { user } = useSelector((state) => state.auth);

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    // ✅ FIXED API CALL
    const getUsers = async () => {
        try {
            const { data } = await axios.get(
                `${API_BASE_URL}/api/v1/user/all-users`,
                { withCredentials: true }
            );

            if (data?.success) {
                setUsers(data.users || []);
            }
        } catch (error) {
            console.log("GET USERS ERROR:", error);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <div className="relative min-h-[250px] md:min-h-screen py-6 md:py-10 overflow-hidden bg-gray-50 dark:bg-slate-950 transition-colors duration-300">

            {/* =====================================================
                BACKGROUND GLOW — same theme as About/Contact/Footer
            ===================================================== */}

            {/* Orange glow — top-left */}
            <div className="pointer-events-none absolute top-[-100px] left-[-100px] w-[450px] h-[450px] bg-[oklch(0.71_0.2_46.45)] opacity-[0.1] dark:opacity-[0.08] rounded-full blur-3xl animate-blob" />

            {/* Orange lighter — bottom-right */}
            <div className="pointer-events-none absolute bottom-[-100px] right-[-100px] w-[450px] h-[450px] bg-[oklch(0.8_0.15_60)] opacity-[0.1] dark:opacity-[0.07] rounded-full blur-3xl animate-blob animation-delay-2000" />

            {/* Subtle gray — center */}
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gray-400 dark:bg-gray-600 opacity-[0.08] dark:opacity-[0.06] rounded-full blur-3xl animate-blob animation-delay-4000" />

            {/* Grid Overlay */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.05] dark:opacity-[0.06]"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, currentColor 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                }}
            />

            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}
            <div className="relative z-10 w-full md:max-w-6xl mx-auto py-0 md:py-10 px-4">

                {/* SECTION HEADER */}
                <div className="text-center mb-10 md:mb-14">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[oklch(0.6_0.2_46.45)] bg-[oklch(0.71_0.2_46.45)]/10 px-3 py-1 rounded-full">
                        <PenSquare className="w-3.5 h-3.5" />
                        Meet the writers
                    </span>
                    <h2 className="mt-4 text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
                        Our{" "}
                        <span className="bg-gradient-to-r from-[oklch(0.71_0.2_46.45)] to-[oklch(0.8_0.15_60)] bg-clip-text text-transparent">
                            Authors
                        </span>
                    </h2>
                    <p className="mt-2 text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                        The voices behind the stories you love to read.
                    </p>
                </div>

                {/* CAROUSEL */}
                <Carousel
                    plugins={[plugin.current]}
                    opts={{ align: "start", loop: true }}
                    className="w-full overflow-hidden"
                >
                    <CarouselContent className="-ml-3 md:-ml-4">
                        {users.map((u) => (
                            <CarouselItem
                                key={u._id}
                                className="basis-full sm:basis-1/2 md:basis-1/3 pl-3 md:pl-4"
                            >
                                <div
                                    onClick={() => handleUserClick(u)}
                                    className="group relative flex flex-col items-center gap-3 p-6 md:p-8
                                    rounded-2xl border border-gray-100 dark:border-gray-800
                                    bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm
                                    shadow-sm hover:shadow-xl hover:-translate-y-1
                                    transition-all duration-300 cursor-pointer overflow-hidden"
                                >
                                    {/* subtle gradient wash on hover */}
                                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-b from-[oklch(0.71_0.2_46.45)]/[0.06] to-transparent" />

                                    <div className="relative">
                                        <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[oklch(0.71_0.2_46.45)] to-[oklch(0.8_0.15_60)] opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />
                                        <img
                                            src={getProfileImage(u?.profilePic)}
                                            alt={u?.firstName}
                                            loading="eager"
                                            fetchPriority="high"
                                            className="relative w-[140px] h-[140px] md:w-[180px] md:h-[180px] rounded-full object-cover border-4 border-white dark:border-gray-900 shadow-md group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => (e.target.src = userimg)}
                                        />
                                    </div>

                                    <div className="relative text-center">
                                        <p className="text-sm md:text-base font-semibold capitalize text-gray-900 dark:text-gray-100">
                                            {u.firstName} {u.lastName}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                            Author
                                        </p>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <CarouselPrevious className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800" />
                    <CarouselNext className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800" />
                </Carousel>

                {/* VIEW ALL */}
                <div className="flex justify-center mt-8 md:mt-10">
                    <button
                        onClick={() => navigate("/AllUserProfile")}
                        className="group inline-flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100 px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm hover:border-[oklch(0.71_0.2_46.45)]/50 hover:text-[oklch(0.6_0.2_46.45)] transition-all duration-300"
                    >
                        <Users className="w-4 h-4" />
                        View All User Profiles
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </div>

            {/* ✅ MODAL */}
            <UserProfileModal
                isOpen={isModalOpen}
                user={selectedUser}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default AllUser;