"use client";
import { useForm } from "react-hook-form";
// import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "@/lib/store";
import { login, LoginCredentials } from "@/lib/features/auth/authSlice";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/lib/hooks";
import Cookies from "js-cookie";
import { LoginResponseDetails } from "@/interfaces/loginInterface";
import { useRouter } from "next/navigation";
import { fetchUserProfile } from "@/lib/features/user/userSlice";

// Define Form Data Type
interface SignInFormData {
  email: string;
  password: string;
}

interface Response  {
  error:string,
  payload : LoginResponseDetails,
}

export default function SignInForm() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<SignInFormData>({
    mode: "onChange"
  });

  // Handle form submission
  const onSubmit = async (data: LoginCredentials) => {
  const toastId = toast.loading("Please wait..."); // create toast first

  try {
    const response: Response = await dispatch(login(data) as never);

    // ✅ Success case
    if (response.payload?.data?.access_token) {
      Cookies.set("access_token", response.payload.data.access_token, { expires: 7 });
      Cookies.set("refresh_token", response.payload.data.refresh_token);
      toast.success("Login Successful!", { id: toastId });

      await dispatch(fetchUserProfile()); // fetch user profile after login
      router.push("/");
      reset();
    } 
    // ✅ API returned error (handled in payload)
    else {
      toast.error(response?.payload?.message ?? "Invalid email or password", { id: toastId });
    }
  } 
  // ✅ Network or unexpected error
  catch (error: unknown) { // ✅ Use 'unknown' instead of 'any'
    console.log("error", error);

    // Narrow down to AxiosError safely
    let message = "Something went wrong!";
    if (typeof error === "object" && error !== null) {
      const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
      message = axiosError?.response?.data?.message || axiosError?.message || message;
    }

    toast.error(message, { id: toastId });
  }
};


  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>

          {/* Form Start */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-6">
              
              {/* Email Field */}
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="info@gmail.com"
                  {...register("email", {
                    required: "*Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "*Invalid email format",
                    },
                  })}
                  error={!!errors.email}
                  // onChange={() => trigger("email")}
                />
                {errors.email && (
                  <p className="text-error-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password", {
                      required: "*Password is required",
                      // minLength: {
                      //   value: 6,
                      //   message: "Password must be at least 6 characters",
                      // },
                    })}
                    error={!!errors.password}
                    // onChange={() => trigger("password")}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-error-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="flex items-center justify-end">
                <Link
                  href="/reset-password"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <div>
                <Button className="w-full" size="sm" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </div>
          </form>
          {/* Form End */}

        </div>
      </div>
    </div>
  );
}



















// "use client";
// import Checkbox from "@/components/form/input/Checkbox";
// import Input from "@/components/form/input/InputField";
// import Label from "@/components/form/Label";
// import Button from "@/components/ui/button/Button";
// import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
// import Link from "next/link";
// import React, { useState } from "react";

// export default function SignInForm() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [isChecked, setIsChecked] = useState(false);
//   return (
//     <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      
//       <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
//         <div>
//           <div className="mb-5 sm:mb-8">
//             <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
//               Sign In
//             </h1>
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               Enter your email and password to sign in!
//             </p>
//           </div>
//           <div>
            
//             <form>
//               <div className="space-y-6">
//                 <div>
//                   <Label>
//                     Email <span className="text-error-500">*</span>{" "}
//                   </Label>
//                   <Input placeholder="info@gmail.com" type="email" />
//                 </div>
//                 <div>
//                   <Label>
//                     Password <span className="text-error-500">*</span>{" "}
//                   </Label>
//                   <div className="relative">
//                     <Input
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Enter your password"
//                     />
//                     <span
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
//                     >
//                       {showPassword ? (
//                         <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
//                       ) : (
//                         <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
//                       )}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex items-center justify-end">
                  
//                   <Link
//                     href="/reset-password"
//                     className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
//                   >
//                     Forgot password?
//                   </Link>
//                 </div>
//                 <div>
//                   <Button className="w-full" size="sm">
//                     Sign in
//                   </Button>
//                 </div>
//               </div>
//             </form>

            
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
