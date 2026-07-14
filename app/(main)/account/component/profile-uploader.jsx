"use client";

import { updateProfilePicture } from "@/app/actions/account";
import Image from "next/image";
import { useState, useTransition } from "react";
import { toast } from "sonner"; // OR import toast from "react-hot-toast";

export default function ProfileImageUploader({ user }) {
  const [previewUrl, setPreviewUrl] = useState(
    user?.profilePicture || "https://i.pravatar.cc",
  );
  const [isPending, startTransition] = useTransition();

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 1. Preview locally
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    // 2. Convert to Base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64String = reader.result;

      // 3. Trigger Server Action inside Transition
      startTransition(async () => {
        try {
          const result = await updateProfilePicture(user.email, base64String);

          if (result.success) {
            // ✅ Success Toast
            toast.success("Profile picture updated successfully!");
          } else {
            // ❌ Error Toast from Server Error
            toast.error(result.error || "Failed to update profile picture.");
          }
        } catch (error) {
          // ❌ Error Toast from Network/Unexpected Error
          toast.error("An unexpected error occurred. Please try again.");
        }
      });
    };
  };

  return (
    <div className="profile-pic text-center mb-5">
      <input
        id="pro-img"
        name="profile-image"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isPending}
      />
      <div>
        <div
          className={`relative size-28 mx-auto ${isPending ? "opacity-50" : ""}`}
        >
          <Image
            src={previewUrl}
            className="rounded-full shadow dark:shadow-gray-800 ring-4 ring-slate-50 dark:ring-slate-800 object-cover"
            id="profile-banner"
            alt={`${user?.firstName} ${user?.lastName}`}
            width={112}
            height={112}
            priority
          />
          <label
            className="absolute inset-0 cursor-pointer flex items-center justify-center rounded-full hover:bg-black/40 transition-all group"
            htmlFor="pro-img"
          >
            <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity font-medium">
              {isPending ? "Uploading..." : "Change Photo"}
            </span>
          </label>
        </div>
        <div className="mt-4">
          <h5 className="text-lg font-semibold">{`${user?.firstName} ${user?.lastName}`}</h5>
          <p className="text-slate-400">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}
