import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiInstagram, FiFacebook, FiTwitter, FiLinkedin, FiGithub } from "react-icons/fi";
import { useSelector } from "react-redux";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import backgroundimg from "../assets/background-dark.jpg";
import userimg from "../assets/userprofile.png";
import AllUserProfile from "./AllUserProfile";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../components/ui/carousel";
import { useNavigate } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";


const AllUser = () => {
    const navigate = useNavigate();
    const plugin = useRef(
        Autoplay({
            delay: 4000,
            stopOnInteraction: false,
        })
    );
    const { user } = useSelector((state) => state.auth);
    const [input, setInput] = useState({
        firstName: "",
        lastName: "",
        email: "",
        bio: "",
        instagram: "",
        linkedin: "",
        github: "",
        facebook: "",
        file: null,
    });
    useEffect(() => {
        if (user) {
            setInput({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                bio: user.bio || "",
                instagram: user.instagram || "",
                linkedin: user.linkedin || "",
                github: user.github || "",
                facebook: user.facebook || "",
                file: null,
            });
        }
    }, [user]);

    const socials = [
        {
            icon: FiInstagram,
            url: user?.instagram,
        },
        {
            icon: FiLinkedin,
            url: user?.linkedin,
        },
        {
            icon: FiGithub,
            url: user?.github,
        },
        {
            icon: FiFacebook,
            url: user?.facebook,
        },
    ];

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleUserClick = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };
    const getUsers = async () => {
        try {
            const { data } = await axios.get(
                `${API_BASE_URL}/api/v1/user/all-users`,
                {
                    withCredentials: true,
                }
            );

            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <div
            style={{
                backgroundImage:
                    "url(" + backgroundimg + ")",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
            className="min-h-screen pt-20 pb-24 md:pb-0 md:pt-0 py-10"
        >
            <div className="w-full md:max-w-6xl mx-auto py-10 px-4 ">

                <h2 className="text-4xl md:text-5xl  font-bold text-gray-100 dark:text-gray-100 text-center py-10">
                    Our Author's
                    <hr className="w-1/2 md:w-1/3 border-t-4 border-gray-600 mx-auto mt-4" />
                </h2>

                <Carousel
                    plugins={[plugin.current]}
                    opts={{ align: "start", loop: true }}
                    className="w-full overflow-hidden"
                >
                    <CarouselContent className="-ml-2">

                        {users.map((user) => (
                            <CarouselItem
                                key={user._id}
                                className="basis-full sm:basis-1/2 md:basis-1/3 pl-2"
                            >
                                <div
                                    onClick={() => handleUserClick(user)}
                                    className="flex flex-col items-center gap-2 p-4 
          bg-white dark:bg-gray-900 rounded-xl shadow 
          hover:shadow-lg transition cursor-pointer"
                                >
                                    <img
                                        src={user?.profilePic || userimg}
                                        alt={user?.firstName || "User"}
                                        className="w-[180px] h-[180px] md:w-[220px] md:h-[220px] rounded-full object-cover border"
                                        onError={(e) => (e.target.src = userimg)}
                                    />

                                    <p className="text-sm font-semibold text-center capitalize">
                                        {user.firstName} {user.lastName}
                                    </p>
                                </div>
                            </CarouselItem>
                        ))}

                    </CarouselContent>

                    <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />

                    {/* RIGHT BUTTON */}
                    <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
                </Carousel>
                <h2
                    className="flex justify-center items-center mt-6 text-sm cursor-pointer underline text-white"
                    onClick={() => navigate("/AllUserProfile")}
                >
                    View All User Profile 
                </h2>
            </div>

            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex shadow-2xl items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-5xl rounded-3xl px-4 py-6 md:px-10 md:py-10 mx-4 relative">

                        {/* Close Button */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-600 dark:text-gray-200 text-2xl font-bold"
                        >
                            &times;
                        </button>

                        {/* Profile UI */}
                        <div className="flex flex-col md:flex-row gap-10">
                            {/* LEFT */}
                            <div className="w-full md:w-1/3 flex flex-col items-center text-center">
                                <div className="relative">
                                    <img
                                        src={selectedUser.profilePic || userimg}
                                        alt="profile"
                                        className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-gray-200 dark:border-slate-600 object-cover"
                                        onError={(e) => (e.target.src = userimg)}
                                    />
                                    <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-800" />
                                </div>
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-4 capitalize">
                                    {selectedUser.firstName} {selectedUser.lastName}
                                </h2>
                                <p className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mt-1">
                                    <a href={`mailto:${selectedUser.email}`} className="hover:underline">
                                        {selectedUser.email}
                                    </a>
                                </p>
                                <div className="flex gap-4 mt-5">
                                    {socials.map(
                                        (item, i) =>
                                            item.url && (
                                                <a
                                                    key={i}
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 flex items-center justify-center 
                rounded-full 
                bg-gray-100 dark:bg-slate-700 
                text-gray-600 dark:text-gray-300
                hover:bg-black hover:text-white 
                dark:hover:bg-white dark:hover:text-black 
                transition"
                                                >
                                                    <item.icon />
                                                </a>
                                            )
                                    )}
                                </div>
                            </div>

                            {/* RIGHT */}
                            <div className="w-full md:w-2/3 text-center md:text-left">
                                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white capitalize">
                                    {selectedUser.firstName} {selectedUser.lastName || "User"} !
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed capitalize">
                                    {selectedUser.bio || "Please add your bio."}
                                </p>

                                {/* STATS */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                                    <div className="bg-gray-100 dark:bg-slate-700 rounded-xl p-5 text-center">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedUser.totalViews || 0}</h3>
                                        <p className="text-gray-500 dark:text-gray-300 text-sm">Total Views</p>
                                    </div>
                                    <div className="bg-gray-100 dark:bg-slate-700 rounded-xl p-5 text-center">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedUser.totalBlogs || 0}</h3>
                                        <p className="text-gray-500 dark:text-gray-300 text-sm">Total Blogs</p>
                                    </div>
                                    <div className="bg-gray-100 dark:bg-slate-700 rounded-xl p-5 text-center">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedUser.comments || 0}</h3>
                                        <p className="text-gray-500 dark:text-gray-300 text-sm">Comments</p>
                                    </div>
                                    <div className="bg-gray-100 dark:bg-slate-700 rounded-xl p-5 text-center">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedUser.likes || 0}</h3>
                                        <p className="text-gray-500 dark:text-gray-300 text-sm">Likes</p>
                                    </div>
                                </div>
                                {/* SOCIAL ICONS */}

                            </div>


                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default AllUser;