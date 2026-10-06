import {
    CheckCircle2,
    Info,
    Mail,
    MapPin,
    Pencil,
    Phone,
    ShieldCheck,
    User,
    X
} from "lucide-react";
import { useEffect, useState } from "react";

import {
    getProfile,
    updateProfile
} from "../services/userService";

const Profile = () => {
    const [user, setUser] = useState(null);


    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: ""
    });

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getProfile();

                setUser(data.user);

                setFormData({
                    name: data.user?.name || "",
                    phone: data.user?.phone || "",
                    address: data.user?.address || ""
                });
            } catch (error) {
                console.error(
                    "Failed to load profile:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load profile."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((current) => ({
            ...current,
            [name]: value
        }));

        setError("");
        setSuccess("");
    };

    const handleEdit = () => {
        setFormData({
            name: user?.name || "",
            phone: user?.phone || "",
            address: user?.address || ""
        });

        setError("");
        setSuccess("");
        setEditing(true);
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || "",
            phone: user?.phone || "",
            address: user?.address || ""
        });

        setError("");
        setSuccess("");
        setEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setError("Name is required.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const data = await updateProfile({
                name: formData.name,
                phone: formData.phone,
                address: formData.address
            });

            setUser(data.user);

            setFormData({
                name: data.user?.name || "",
                phone: data.user?.phone || "",
                address: data.user?.address || ""
            });

            setEditing(false);
            setSuccess(
                "Profile updated successfully."
            );
        } catch (error) {
            console.error(
                "Failed to update profile:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to update profile."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f2f2f2] py-8">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-[#e7e7e7] bg-white shadow-sm">
                        <div className="animate-pulse">
                            <div className="h-28 bg-gray-200" />

                            <div className="px-4 pb-6 sm:px-6">
                                <div className="-mt-10 h-20 w-20 rounded-full border-4 border-white bg-gray-300" />

                                <div className="mt-4 h-6 w-40 rounded bg-gray-200" />
                                <div className="mt-2 h-4 w-56 rounded bg-gray-200" />

                                <div className="mt-6 space-y-3">
                                    <div className="h-[72px] rounded-lg bg-gray-100" />
                                    <div className="h-[72px] rounded-lg bg-gray-100" />
                                    <div className="h-[72px] rounded-lg bg-gray-100" />
                                    <div className="h-[72px] rounded-lg bg-gray-100" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !user) {
        return (
            <div className="min-h-screen bg-[#f2f2f2] py-8">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="mx-auto max-w-md rounded-xl border border-[#e7e7e7] bg-white p-8 text-center shadow-sm">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fdecea] text-[#d0021b]">
                            <Info size={28} />
                        </div>

                        <h1 className="mt-4 text-lg font-semibold text-[#1a1a1a]">
                            Unable to load profile
                        </h1>

                        <p className="mt-2 text-sm text-[#4a4a4a]">
                            {error}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f2f2f2] py-6 sm:py-8">
            <div className="mx-auto max-w-7xl px-4">
                <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-[#e7e7e7] bg-white shadow-sm">

                    {/* Banner */}
                    <div className="h-28 bg-gradient-to-r from-[#53b2fe] to-[#065af3] sm:h-32" />

                    <div className="px-4 pb-6 sm:px-6">

                        {/* Header */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div className="-mt-10 flex flex-col gap-3 sm:-mt-12 sm:flex-row sm:items-end sm:gap-4">
                                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#e6f1ff] text-3xl font-bold text-[#008cff] shadow-sm sm:h-24 sm:w-24">
                                    {user?.name?.trim()
                                        ? user.name.trim().charAt(0).toUpperCase()
                                        : <User size={36} aria-hidden="true" />}
                                </div>

                                <div className="min-w-0 sm:pb-1">
                                    <h1 className="truncate text-2xl font-bold text-[#1a1a1a]">
                                        Profile
                                    </h1>

                                    <p className="mt-1 text-sm text-[#4a4a4a]">
                                        Manage your personal information.
                                    </p>
                                </div>
                            </div>

                            {!editing && (
                                <button
                                    type="button"
                                    onClick={handleEdit}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#008cff] bg-white px-4 py-2.5 text-sm font-semibold text-[#008cff] transition hover:bg-[#e6f1ff] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff] focus-visible:ring-offset-2 active:scale-[0.98] sm:mb-1"
                                >
                                    <Pencil size={16} aria-hidden="true" />
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {/* Success */}
                        {success && (
                            <div
                                role="status"
                                className="mt-5 flex items-center gap-2 rounded-lg border border-[#1a7971]/30 bg-[#e6f4f1] px-4 py-3 text-sm text-[#1a7971]"
                            >
                                <CheckCircle2
                                    size={18}
                                    className="shrink-0"
                                    aria-hidden="true"
                                />

                                <span>{success}</span>
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div
                                role="alert"
                                className="mt-5 flex items-start gap-2 rounded-lg border border-[#d0021b]/30 bg-[#fdecea] px-4 py-3 text-sm text-[#d0021b]"
                            >
                                <Info
                                    size={18}
                                    className="mt-0.5 shrink-0"
                                    aria-hidden="true"
                                />

                                <span>{error}</span>
                            </div>
                        )}

                        {editing ? (
                            <form
                                onSubmit={handleSubmit}
                                className="mt-6 space-y-5"
                            >

                                {/* Name */}
                                <div>
                                    <label
                                        htmlFor="profile-name"
                                        className="mb-1.5 block text-sm font-medium text-[#1a1a1a]"
                                    >
                                        Name
                                    </label>

                                    <div className="relative">
                                        <User
                                            size={18}
                                            aria-hidden="true"
                                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9b9b9b]"
                                        />

                                        <input
                                            id="profile-name"
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm text-[#1a1a1a] outline-none transition placeholder:text-[#9b9b9b] focus:ring-2 ${
                                                error && !formData.name.trim()
                                                    ? "border-[#d0021b] focus:border-[#d0021b] focus:ring-[#d0021b]/30"
                                                    : "border-[#e7e7e7] focus:border-[#008cff] focus:ring-[#008cff]/30"
                                            }`}
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="profile-email"
                                        className="mb-1.5 block text-sm font-medium text-[#1a1a1a]"
                                    >
                                        Email
                                    </label>

                                    <div className="relative">
                                        <Mail
                                            size={18}
                                            aria-hidden="true"
                                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9b9b9b]"
                                        />

                                        <input
                                            id="profile-email"
                                            type="email"
                                            value={user?.email || ""}
                                            disabled
                                            className="w-full cursor-not-allowed rounded-lg border border-[#e7e7e7] bg-[#f2f2f2] py-2.5 pl-10 pr-3 text-sm text-[#9b9b9b] outline-none"
                                        />
                                    </div>

                                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#9b9b9b]">
                                        <ShieldCheck
                                            size={14}
                                            className="shrink-0"
                                            aria-hidden="true"
                                        />
                                        Email is linked to your account and cannot be changed here.
                                    </p>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label
                                        htmlFor="profile-phone"
                                        className="mb-1.5 block text-sm font-medium text-[#1a1a1a]"
                                    >
                                        Phone
                                    </label>

                                    <div className="relative">
                                        <Phone
                                            size={18}
                                            aria-hidden="true"
                                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9b9b9b]"
                                        />

                                        <input
                                            id="profile-phone"
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Enter phone number"
                                            className="w-full rounded-lg border border-[#e7e7e7] bg-white py-2.5 pl-10 pr-3 text-sm text-[#1a1a1a] outline-none transition placeholder:text-[#9b9b9b] focus:border-[#008cff] focus:ring-2 focus:ring-[#008cff]/30"
                                        />
                                    </div>
                                </div>

                                {/* Address */}
                                <div>
                                    <label
                                        htmlFor="profile-address"
                                        className="mb-1.5 block text-sm font-medium text-[#1a1a1a]"
                                    >
                                        Address
                                    </label>

                                    <div className="relative">
                                        <MapPin
                                            size={18}
                                            aria-hidden="true"
                                            className="pointer-events-none absolute left-3 top-3 text-[#9b9b9b]"
                                        />

                                        <textarea
                                            id="profile-address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="Enter your address"
                                            rows={3}
                                            className="w-full resize-none rounded-lg border border-[#e7e7e7] bg-white py-2.5 pl-10 pr-3 text-sm text-[#1a1a1a] outline-none transition placeholder:text-[#9b9b9b] focus:border-[#008cff] focus:ring-2 focus:ring-[#008cff]/30"
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col-reverse gap-3 border-t border-[#e7e7e7] pt-5 sm:flex-row sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        disabled={saving}
                                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#008cff] bg-white px-5 py-2.5 text-sm font-semibold text-[#008cff] transition hover:bg-[#e6f1ff] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff] focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <X size={16} aria-hidden="true" />
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#53b2fe] to-[#065af3] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-[#008cff] hover:to-[#065af3] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff] focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {saving
                                            ? "Saving..."
                                            : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="mt-6 grid grid-cols-1 gap-3">

                                {/* Name */}
                                <div className="flex items-center gap-4 rounded-lg border border-[#e7e7e7] bg-white p-4 transition hover:shadow-sm">
                                    <div className="shrink-0 rounded-full bg-[#e6f1ff] p-3 text-[#008cff]">
                                        <User size={20} aria-hidden="true" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs font-medium uppercase tracking-wide text-[#9b9b9b]">
                                            Name
                                        </p>

                                        <p className="mt-0.5 break-words text-sm font-semibold text-[#1a1a1a]">
                                            {user?.name ||
                                                "Not available"}
                                        </p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-center gap-4 rounded-lg border border-[#e7e7e7] bg-white p-4 transition hover:shadow-sm">
                                    <div className="shrink-0 rounded-full bg-[#e6f1ff] p-3 text-[#008cff]">
                                        <Mail size={20} aria-hidden="true" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs font-medium uppercase tracking-wide text-[#9b9b9b]">
                                            Email
                                        </p>

                                        <p className="mt-0.5 break-all text-sm font-semibold text-[#1a1a1a]">
                                            {user?.email ||
                                                "Not available"}
                                        </p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-center gap-4 rounded-lg border border-[#e7e7e7] bg-white p-4 transition hover:shadow-sm">
                                    <div className="shrink-0 rounded-full bg-[#e6f1ff] p-3 text-[#008cff]">
                                        <Phone size={20} aria-hidden="true" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs font-medium uppercase tracking-wide text-[#9b9b9b]">
                                            Phone
                                        </p>

                                        <p className={`mt-0.5 break-words text-sm ${user?.phone ? "font-semibold text-[#1a1a1a]" : "text-[#9b9b9b]"}`}>
                                            {user?.phone ||
                                                "Not provided"}
                                        </p>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="flex items-center gap-4 rounded-lg border border-[#e7e7e7] bg-white p-4 transition hover:shadow-sm">
                                    <div className="shrink-0 rounded-full bg-[#e6f1ff] p-3 text-[#008cff]">
                                        <MapPin size={20} aria-hidden="true" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs font-medium uppercase tracking-wide text-[#9b9b9b]">
                                            Address
                                        </p>

                                        <p className={`mt-0.5 break-words text-sm ${user?.address ? "font-semibold text-[#1a1a1a]" : "text-[#9b9b9b]"}`}>
                                            {user?.address ||
                                                "Not provided"}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );


};

export default Profile;