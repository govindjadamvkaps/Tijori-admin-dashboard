// components/profile/UserMetaCard.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Image from "next/image";
import { useAppSelector } from "@/lib/hooks";
import { useUpdateProfile } from "@/lib/react-query/hooks/useUser";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateProfileSchema } from "@/lib/validations/profile.validation";
import { UpdateProfilePayload } from "@/interfaces/user.interface";

interface ProfileFormData {
  fullName: string; 
  email: string;  
  phone: {
    country_code: string;
    number: string;
  };
  jobTitle?: string;  
  userLanguage: "en" | "ar";
  avatar?: FileList;
}


export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const user = useAppSelector((state) => state.user.user);
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ProfileFormData>({
    resolver: yupResolver(updateProfileSchema as any),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: {
        country_code: user?.phone?.country_code || "+965",
        number: user?.phone?.number || "",
      },
      jobTitle: user?.jobTitle || "",
      userLanguage: user?.userLanguage || "en",
    },
  });

  const avatarFile = watch("avatar");

  useEffect(() => {
    if (avatarFile && avatarFile[0]) {
      const file = avatarFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [avatarFile]);

  const onSubmit = (data: ProfileFormData) => {
    if (!user?._id) return;

    const payload: UpdateProfilePayload = {
      fullName: data.fullName,
      phone: data.phone,
      jobTitle: data.jobTitle,
      userLanguage: data.userLanguage,
    };

    if (data.avatar && data.avatar[0]) {
      payload.avatar = data.avatar[0];
    }

    updateProfile(
      { userId: user._id, data: payload },
      {
        onSuccess: () => {
          closeModal();
          setAvatarPreview(null);
        },
      }
    );
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <Image
                width={80}
                height={80}
                src={user?.avatar || "/images/user/owner.jpg"}
                alt="user"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {user?.fullName || "User Name"}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.role.name || "Team Manager"}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
            Edit
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              {/* Avatar Upload */}
              <div className="mb-6">
                <Label>Profile Picture</Label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                    <Image
                      width={80}
                      height={80}
                      src={avatarPreview || user?.avatar || "/images/user/owner.jpg"}
                      alt="avatar preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      {...register("avatar")}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-800 dark:file:text-gray-300"
                    />
                    {errors.avatar && (
                      <p className="mt-1 text-xs text-red-500">{errors.avatar.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input type="text" {...register("fullName")} error={!!errors.fullName} />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Email Address</Label>
                    <Input type="email" {...register("email")} disabled className="bg-gray-100 dark:bg-gray-800" />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>
                      Country Code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="+965"
                      {...register("phone.country_code")}
                      error={!!errors.phone?.country_code}
                    />
                    {errors.phone?.country_code && (
                      <p className="mt-1 text-xs text-red-500">{errors.phone.country_code.message}</p>
                    )}
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="234567890"
                      {...register("phone.number")}
                      error={!!errors.phone?.number}
                    />
                    {errors.phone?.number && (
                      <p className="mt-1 text-xs text-red-500">{errors.phone.number.message}</p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <Label>Job Title</Label>
                    <Input type="text" {...register("jobTitle")} error={!!errors.jobTitle} />
                    {errors.jobTitle && (
                      <p className="mt-1 text-xs text-red-500">{errors.jobTitle.message}</p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <Label>
                      Language <span className="text-red-500">*</span>
                    </Label>
                    <select
                      {...register("userLanguage")}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    >
                      <option value="en">English</option>
                      <option value="ar">Arabic</option>
                    </select>
                    {errors.userLanguage && (
                      <p className="mt-1 text-xs text-red-500">{errors.userLanguage.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal} type="button" disabled={isPending}>
                Close
              </Button>
              <Button size="sm" type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
