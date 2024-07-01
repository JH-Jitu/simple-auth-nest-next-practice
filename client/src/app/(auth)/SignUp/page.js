"use client";
import { resizeImage } from "@/components/ResizeImage/ResizeImage";
import { AlertToast } from "@/components/Toast/AlertToast";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaRegEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { GoogleLoginButton } from "react-social-login-buttons";

const SignUp = () => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [permissions, setPermissions] = useState([]);

  const permissionOptions = ["creating", "editing", "deleting", "viewing"];

  // Handle skills changes
  const handlePermissionsChange = (selectedSkills) => {
    setPermissions(selectedSkills);
  };

  const onSubmit = async (data) => {
    try {
      // Validation
      if (!data.name) {
        setError("name", { type: "manual", message: "Name is required" });
      }
      if (!data.username) {
        setError("username", {
          type: "manual",
          message: "Username is required",
        });
      }
      if (!data.email) {
        setError("email", { type: "manual", message: "Email is required" });
      }
      if (
        !data.password ||
        data.password.length < 8 ||
        /[A-Z]/.test(data.password) !== true //for my auto save
      ) {
        setError("password", {
          type: "manual",
          message:
            "Password must be 8 characters and contain at least 1 uppercase letter",
        });
      }
      if (!data.phone) {
        setError("phone", {
          type: "manual",
          message: "Phone number is required",
        });
      }
      // Image
      if (!data.photo) {
        setError("photo", {
          type: "manual",
          message: "Please upload an image",
        });
        return;
      }

      const allowedImageTypes = ["image/jpeg", "image/png"];
      if (
        previewImage[0]?.type &&
        !allowedImageTypes.includes(previewImage[0].type)
      ) {
        setError("photo", {
          type: "manual",
          message: "Invalid photo format. Please use JPEG or PNG.",
        });
        return;
      }

      if (previewImage[0]?.size && previewImage[0].size > 1024 * 1024) {
        setError("photo", {
          type: "manual",
          message: "Photo size must be less than 1 MB.",
        });
        return;
      }
      if (!data.role) {
        setError("role", { type: "manual", message: "Role is required" });
      }

      if (!permissions || permissions.length === 0) {
        console.log("ekhane error");
        setError("permissions", {
          type: "manual",
          message: "At least one permission is required",
        });
      }

      console.log("this is length of error", errors);
      if (Object.keys(errors).length > 0) {
        return;
      }
      const payload = {
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
        phone: data.phone,
        photo: previewImage,
        role: data.role,
        permissions: permissions,
      };

      console.log("Form data:", payload);

      // Send data to API
      const response = await axios.post(
        "http://localhost:3334/user/create-user",
        payload
      );

      console.log("API Response:", response);
      AlertToast("success");

      // Convert photo to base64
      // let photoBase64 = "";
      // if (data.photo) {
      //   const reader = new FileReader();
      //   photoBase64 = await new Promise((resolve) => {
      //     reader.onloadend = () => resolve(reader.result.split(",")[1]);
      //     reader.readAsDataURL(data.photo);
      //   });
      // }
      // data.photo = previewImage;
      // formData.append('photo', data.photo);
      // Prepare the payload

      // Clear form or redirect user after successful submission
      // reset();  // If using react-hook-form's reset function
      // router.push('/dashboard');  // If using Next.js router for redirection
    } catch (error) {
      console.error("API Error:", error.response || error);
      AlertToast(error);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      // Validation
      const allowedImageTypes = ["image/jpeg", "image/png"];
      if (!allowedImageTypes.includes(file.type)) {
        setError("photo", {
          type: "manual",
          message: "Invalid photo format. Please use JPEG or PNG.",
        });
        setPreviewImage(null);
        return;
      }

      if (file.size > 1024 * 1024) {
        setError("photo", {
          type: "manual",
          message: "Photo size must be less than 1 MB.",
        });
        setPreviewImage(null);
        return;
      }

      const reader = new FileReader();

      reader.onloadend = async () => {
        try {
          const resizedBase64 = await resizeImage(reader.result, 100, 100);
          setPreviewImage(resizedBase64);
          setError("photo", null); // Clear any previous errors
        } catch (error) {
          console.error("Error while resizing image:", error);
          setPreviewImage(null);
          setError("photo", {
            type: "manual",
            message: "Error processing image.",
          });
        }
      };

      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
      setError("photo", {
        type: "manual",
        message: "Please select a photo.",
      });
    }
  };

  const handleSelectChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    handlePermissionsChange(selectedOptions);
  };

  const signIn = async () => {
    let timer = null;
    const newWindow = window.open(
      `http://localhost:3334/auth/google/callback`,
      "_blank",
      "width=500,height=600"
    );

    if (newWindow) {
      timer = setInterval(() => {
        if (newWindow.closed) {
          console.log("authenticated");
          // fetchAuthUser();
          if (timer) clearInterval(timer);
        }
      }, 500);
    }
  };

  console.log({ selectedPermissions: permissions });
  return (
    <div className="bg-opacity-100 bg-gradient-to-r from-blue-900 via-blue-500 to-blue-100">
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0"></div>
        {/* <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div> */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-blue-100"></div>
        <div className="bg-white bg-opacity-60 p-8 rounded-xl backdrop-blur-md w-full relative z-10  max-w-3xl animate-expand">
          <h2 className="text-2xl font-bold text-[#03032e] mb-6">Sign Up</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-10">
              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-[#03032e] mb-1"
                  htmlFor="name"
                >
                  Name
                </label>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full px-3 py-2 bg-white bg-opacity-20 border border-gray-300 rounded-md text-[#03032e] placeholder-gray-400"
                      placeholder="Enter your name"
                    />
                  )}
                />
                {errors.name && (
                  <span className="text-red-400 text-xs">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-[#03032e] mb-1"
                  htmlFor="username"
                >
                  Username
                </label>
                <Controller
                  name="username"
                  control={control}
                  rules={{ required: "Username is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full px-3 py-2 bg-white bg-opacity-20 border border-gray-300 rounded-md text-[#03032e] placeholder-gray-400"
                      placeholder="Enter your username"
                    />
                  )}
                />
                {errors.username && (
                  <span className="text-red-400 text-xs">
                    {errors.username.message}
                  </span>
                )}
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-[#03032e] mb-1"
                  htmlFor="email"
                >
                  Email
                </label>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="email"
                      className="w-full px-3 py-2 bg-white bg-opacity-20 border border-gray-300 rounded-md text-[#03032e] placeholder-gray-400"
                      placeholder="Enter your email"
                    />
                  )}
                />
                {errors.email && (
                  <span className="text-red-400 text-xs">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-[#03032e] mb-1"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: "Password is required",
                      // minLength: {
                      //   value: 8,
                      //   message: "Password must be at least 8 characters",
                      // },
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        className="w-full px-3 py-2 bg-white bg-opacity-20 border border-gray-300 rounded-md text-[#03032e] placeholder-gray-400"
                        placeholder="Enter your password"
                      />
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaRegEye />}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-red-400 text-xs">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-[#03032e] mb-1"
                  htmlFor="phone"
                >
                  Phone
                </label>
                <Controller
                  name="phone"
                  control={control}
                  rules={{
                    required: "Phone number is required",
                    pattern: {
                      value: /^\d{11}$/,
                      message: "Phone number must be 11 digits",
                    },
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="tel"
                      className="w-full px-3 py-2 bg-white bg-opacity-20 border border-gray-300 rounded-md text-[#03032e] placeholder-gray-400"
                      placeholder="Enter your phone number"
                    />
                  )}
                />
                {errors.phone && (
                  <span className="text-red-400 text-xs">
                    {errors.phone.message}
                  </span>
                )}
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-[#03032e] mb-1"
                  htmlFor="photo"
                >
                  Photo
                </label>
                <Controller
                  name="photo"
                  control={control}
                  defaultValue="" // Add this line
                  render={({ field: { onChange, value, ...field } }) => (
                    <input
                      {...field}
                      type="file"
                      onChange={(e) => {
                        onChange(e.target.files[0]);
                        handlePhotoChange(e);
                      }}
                      accept="image/*"
                      className="w-full px-3 py-2 bg-white bg-opacity-20 border border-gray-300 rounded-md text-[#03032e]"
                    />
                  )}
                />
                {previewImage && (
                  <div className="mt-2">
                    <Image
                      src={previewImage}
                      alt="Preview"
                      width={100}
                      height={100}
                      className="rounded-md"
                    />
                  </div>
                )}
                {errors.photo && (
                  <span className="text-red-400 text-xs">
                    {errors.photo.message}
                  </span>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-[#03032e] mb-1">
                  Role
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <Controller
                      name="role"
                      control={control}
                      rules={{ required: "Role is required" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="radio"
                          value="user"
                          className="form-radio text-blue-600"
                        />
                      )}
                    />
                    <span className="ml-2 text-[#03032e]">User</span>
                  </label>
                  <label className="inline-flex items-center">
                    <Controller
                      name="role"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="radio"
                          value="admin"
                          className="form-radio text-blue-600"
                        />
                      )}
                    />
                    <span className="ml-2 text-[#03032e]">Admin</span>
                  </label>
                </div>
                {errors.role && (
                  <span className="text-red-400 text-xs">
                    {errors.role.message}
                  </span>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-[#03032e] mb-1">
                  Permissions
                </label>
                <Controller
                  // multiple
                  name="permissions"
                  // value={permissions}
                  control={control}
                  // rules={{ required: "At least one permission is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      multiple
                      onChange={handleSelectChange}
                      name="permissions"
                      required
                      value={permissions}
                      className="w-full px-3 py-2 bg-white bg-opacity-20 border border-gray-300 rounded-md text-[#03032e]"
                    >
                      {permissionOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.permissions && (
                  <span className="text-red-400 text-xs">
                    {errors.permissions.message}
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 mb-4"
            >
              Sign Up
            </button>

            <button className="flex items-center justify-center w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300">
              <FaGoogle className="mr-2" />
              Sign Up with Google
            </button>

            <GoogleLoginButton
              onClick={signIn}
              className="flex items-center justify-center"
            >
              <p className="text-xs">Sign in with google</p>
            </GoogleLoginButton>
          </form>

          <p className="mt-4 text-center text-[#03032e]">
            Already have an account?
            <Link href="/" className="text-blue-400 hover:underline ml-1">
              SIGN IN
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
