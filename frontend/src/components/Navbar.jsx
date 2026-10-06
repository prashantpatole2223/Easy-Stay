import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
    Building2,
    CalendarDays,
    ChevronDown,
    Home as HomeIcon,
    Hotel,
    LayoutDashboard,
    LogIn,
    LogOut,
    Menu,
    User,
    UserPlus,
    X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, isAuthenticated, loading, logout } = useAuth();


    const navigate = useNavigate();

    const [hotelMenuOpen, setHotelMenuOpen] = useState(false);
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const hotelMenuRef = useRef(null);
    const accountMenuRef = useRef(null);

    const role = user?.role?.toLowerCase();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                hotelMenuRef.current &&
                !hotelMenuRef.current.contains(event.target)
            ) {
                setHotelMenuOpen(false);
            }

            if (
                accountMenuRef.current &&
                !accountMenuRef.current.contains(event.target)
            ) {
                setAccountMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        setAccountMenuOpen(false);
        setMobileMenuOpen(false);

        await logout();

        navigate("/");
    };

    const closeMenus = () => {
        setHotelMenuOpen(false);
        setAccountMenuOpen(false);
        setMobileMenuOpen(false);
    };

    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-1.5 border-b-2 py-5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff] ${isActive
            ? "border-[#008cff] font-semibold text-[#008cff]"
            : "border-transparent font-medium text-[#4a4a4a] hover:text-[#008cff]"
        }`;

    const triggerClass =
        "flex items-center gap-1.5 rounded-lg py-2 text-sm font-medium text-[#4a4a4a] transition hover:text-[#008cff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff]";

    const dropdownPanelClass =
        "absolute right-0 z-50 mt-3 w-56 overflow-hidden rounded-xl border border-[#e7e7e7] bg-white py-2 shadow-lg";

    const dropdownItemClass =
        "flex items-center gap-3 px-4 py-3 text-sm text-[#1a1a1a] transition hover:bg-[#e6f1fd] hover:text-[#008cff] focus-visible:bg-[#e6f1fd] focus-visible:outline-none";

    const dropdownLogoutClass =
        "flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-[#d0021b] transition hover:bg-[#fdecea] focus-visible:bg-[#fdecea] focus-visible:outline-none";

    const mobileLinkClass =
        "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[#1a1a1a] transition hover:bg-[#e6f1fd] hover:text-[#008cff] focus-visible:bg-[#e6f1fd] focus-visible:outline-none";

    const mobileLogoutClass =
        "flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-[#d0021b] transition hover:bg-[#fdecea] focus-visible:bg-[#fdecea] focus-visible:outline-none";

    const logoClass =
        "flex items-center gap-2 rounded-lg text-xl font-bold text-[#1a1a1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff]";

    const logoBadge = (
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#53b2fe] to-[#065af3] text-white">
            <Hotel size={18} aria-hidden="true" />
        </span>
    );

    const userInitial = (user?.name || "A").trim().charAt(0).toUpperCase();

    const accountButtonContent = (
        <>
            <span
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6f1fd] text-sm font-semibold text-[#008cff]"
            >
                {userInitial}
            </span>

            <span className="max-w-32 truncate">
                {user?.name || "Account"}
            </span>

            <ChevronDown
                size={16}
                aria-hidden="true"
                className={`transition-transform ${accountMenuOpen
                        ? "rotate-180"
                        : ""
                    }`}
            />
        </>
    );

    if (loading) {
        return (
            <nav className="border-b border-[#e7e7e7] bg-white">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                    <Link
                        to="/"
                        className={logoClass}
                    >
                        {logoBadge}
                        EasyStay
                    </Link>
                </div>
            </nav>
        );
    }

    return (
        <nav className="sticky top-0 z-50 border-b border-[#e7e7e7] bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4">
                <div className="flex h-16 items-center justify-between">

                    {/* LOGO */}

                    <Link
                        to="/"
                        onClick={closeMenus}
                        className={logoClass}
                    >
                        {logoBadge}
                        EasyStay
                    </Link>

                    {/* DESKTOP NAVIGATION */}

                    <div className="hidden items-center gap-6 md:flex">

                        {/* =========================
                        LOGGED OUT
                    ========================= */}

                        {!isAuthenticated && (
                            <>
                                <NavLink
                                    to="/"
                                    className={navLinkClass}
                                >
                                    <HomeIcon size={17} aria-hidden="true" />
                                    Home
                                </NavLink>

                                <div
                                    ref={hotelMenuRef}
                                    className="relative"
                                >
                                    <button
                                        type="button"
                                        aria-haspopup="menu"
                                        aria-expanded={hotelMenuOpen}
                                        onClick={() =>
                                            setHotelMenuOpen(
                                                (previous) => !previous
                                            )
                                        }
                                        className={triggerClass}
                                    >
                                        <Building2 size={17} aria-hidden="true" />

                                        Register Your Hotel

                                        <ChevronDown
                                            size={16}
                                            aria-hidden="true"
                                            className={`transition-transform ${hotelMenuOpen
                                                    ? "rotate-180"
                                                    : ""
                                                }`}
                                        />
                                    </button>

                                    {hotelMenuOpen && (
                                        <div className={dropdownPanelClass}>
                                            <Link
                                                to="/signup/owner"
                                                onClick={closeMenus}
                                                className={dropdownItemClass}
                                            >
                                                <UserPlus size={17} aria-hidden="true" />
                                                Register as Owner
                                            </Link>

                                            <Link
                                                to="/login?role=owner"
                                                onClick={closeMenus}
                                                className={dropdownItemClass}
                                            >
                                                <LogIn size={17} aria-hidden="true" />
                                                Owner Login
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                <NavLink
                                    to="/login"
                                    className={navLinkClass}
                                >
                                    <LogIn size={17} aria-hidden="true" />
                                    Login
                                </NavLink>

                                <NavLink
                                    to="/signup/customer"
                                    className="rounded-lg bg-gradient-to-r from-[#53b2fe] to-[#065af3] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-[#008cff] hover:to-[#0548c9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff] focus-visible:ring-offset-2 active:scale-[0.98]"
                                >
                                    Sign Up
                                </NavLink>
                            </>
                        )}

                        {/* =========================
                        CUSTOMER
                    ========================= */}

                        {isAuthenticated && role === "customer" && (
                            <>
                                <NavLink
                                    to="/"
                                    className={navLinkClass}
                                >
                                    <HomeIcon size={17} aria-hidden="true" />
                                    Home
                                </NavLink>

                                <div
                                    ref={accountMenuRef}
                                    className="relative"
                                >
                                    <button
                                        type="button"
                                        aria-haspopup="menu"
                                        aria-expanded={accountMenuOpen}
                                        onClick={() =>
                                            setAccountMenuOpen(
                                                (previous) => !previous
                                            )
                                        }
                                        className={`${triggerClass} gap-2`}
                                    >
                                        {accountButtonContent}
                                    </button>

                                    {accountMenuOpen && (
                                        <div className={dropdownPanelClass}>
                                            <Link
                                                to="/profile"
                                                onClick={closeMenus}
                                                className={dropdownItemClass}
                                            >
                                                <User size={17} aria-hidden="true" />
                                                Profile
                                            </Link>

                                            <Link
                                                to="/my-bookings"
                                                onClick={closeMenus}
                                                className={dropdownItemClass}
                                            >
                                                <CalendarDays size={17} aria-hidden="true" />
                                                My Bookings
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                className={dropdownLogoutClass}
                                            >
                                                <LogOut size={17} aria-hidden="true" />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* =========================
                        OWNER
                    ========================= */}

                        {isAuthenticated && role === "owner" && (
                            <>
                                <NavLink
                                    to="/owner/dashboard"
                                    className={navLinkClass}
                                >
                                    <LayoutDashboard size={17} aria-hidden="true" />
                                    Dashboard
                                </NavLink>

                                <NavLink
                                    to="/owner/my-hotels"
                                    className={navLinkClass}
                                >
                                    <Building2 size={17} aria-hidden="true" />
                                    My Hotels
                                </NavLink>

                                <div
                                    ref={accountMenuRef}
                                    className="relative"
                                >
                                    <button
                                        type="button"
                                        aria-haspopup="menu"
                                        aria-expanded={accountMenuOpen}
                                        onClick={() =>
                                            setAccountMenuOpen(
                                                (previous) => !previous
                                            )
                                        }
                                        className={`${triggerClass} gap-2`}
                                    >
                                        {accountButtonContent}
                                    </button>

                                    {accountMenuOpen && (
                                        <div className={dropdownPanelClass}>
                                            <Link
                                                to="/profile"
                                                onClick={closeMenus}
                                                className={dropdownItemClass}
                                            >
                                                <User size={17} aria-hidden="true" />
                                                Profile
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                className={dropdownLogoutClass}
                                            >
                                                <LogOut size={17} aria-hidden="true" />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* MOBILE MENU BUTTON */}

                    <button
                        type="button"
                        aria-label={
                            mobileMenuOpen
                                ? "Close menu"
                                : "Open menu"
                        }
                        aria-expanded={mobileMenuOpen}
                        onClick={() =>
                            setMobileMenuOpen(
                                (previous) => !previous
                            )
                        }
                        className="rounded-lg p-2 text-[#4a4a4a] transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff] md:hidden"
                    >
                        {mobileMenuOpen ? (
                            <X size={24} />
                        ) : (
                            <Menu size={24} />
                        )}
                    </button>
                </div>
            </div>

            {/* MOBILE NAVIGATION */}

            {mobileMenuOpen && (
                <div className="absolute left-0 right-0 top-full max-h-screen overflow-y-auto border-t border-[#e7e7e7] bg-white shadow-lg md:hidden">
                    <div className="mx-auto max-w-7xl px-4 py-3">
                        <div className="flex flex-col gap-1">

                            {/* LOGGED OUT */}

                            {!isAuthenticated && (
                                <>
                                    <Link
                                        to="/"
                                        onClick={closeMenus}
                                        className={mobileLinkClass}
                                    >
                                        <HomeIcon size={18} aria-hidden="true" />
                                        Home
                                    </Link>

                                    <Link
                                        to="/signup/owner"
                                        onClick={closeMenus}
                                        className={mobileLinkClass}
                                    >
                                        <Building2 size={18} aria-hidden="true" />
                                        Register Your Hotel
                                    </Link>

                                    <Link
                                        to="/login?role=owner"
                                        onClick={closeMenus}
                                        className={mobileLinkClass}
                                    >
                                        <LogIn size={18} aria-hidden="true" />
                                        Owner Login
                                    </Link>

                                    <Link
                                        to="/login"
                                        onClick={closeMenus}
                                        className={mobileLinkClass}
                                    >
                                        <LogIn size={18} aria-hidden="true" />
                                        Login
                                    </Link>

                                    <Link
                                        to="/signup/customer"
                                        onClick={closeMenus}
                                        className="mt-2 rounded-lg bg-gradient-to-r from-[#53b2fe] to-[#065af3] px-3 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:from-[#008cff] hover:to-[#0548c9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff] focus-visible:ring-offset-2"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}

                            {/* CUSTOMER */}

                            {isAuthenticated &&
                                role === "customer" && (
                                    <>
                                        <Link
                                            to="/"
                                            onClick={closeMenus}
                                            className={mobileLinkClass}
                                        >
                                            <HomeIcon size={18} aria-hidden="true" />
                                            Home
                                        </Link>

                                        <Link
                                            to="/profile"
                                            onClick={closeMenus}
                                            className={mobileLinkClass}
                                        >
                                            <User size={18} aria-hidden="true" />
                                            Profile
                                        </Link>

                                        <Link
                                            to="/my-bookings"
                                            onClick={closeMenus}
                                            className={mobileLinkClass}
                                        >
                                            <CalendarDays size={18} aria-hidden="true" />
                                            My Bookings
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className={mobileLogoutClass}
                                        >
                                            <LogOut size={18} aria-hidden="true" />
                                            Logout
                                        </button>
                                    </>
                                )}

                            {/* OWNER */}

                            {isAuthenticated &&
                                role === "owner" && (
                                    <>
                                        <Link
                                            to="/owner/dashboard"
                                            onClick={closeMenus}
                                            className={mobileLinkClass}
                                        >
                                            <LayoutDashboard size={18} aria-hidden="true" />
                                            Dashboard
                                        </Link>

                                        <Link
                                            to="/owner/my-hotels"
                                            onClick={closeMenus}
                                            className={mobileLinkClass}
                                        >
                                            <Building2 size={18} aria-hidden="true" />
                                            My Hotels
                                        </Link>

                                        <Link
                                            to="/profile"
                                            onClick={closeMenus}
                                            className={mobileLinkClass}
                                        >
                                            <User size={18} aria-hidden="true" />
                                            Profile
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className={mobileLogoutClass}
                                        >
                                            <LogOut size={18} aria-hidden="true" />
                                            Logout
                                        </button>
                                    </>
                                )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );


};

export default Navbar;