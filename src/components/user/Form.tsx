"use client";
import { useForm, Controller, get } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SETTINGS } from "@/config/manageSettings";
import masterData from "@/data/Data.json";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addUser, updateUser, User } from "@/redux/userSlice";
import { v4 as uuidv4 } from "uuid";

export default function UserForm({ onClose, editData }: any) {
  const dispatch = useDispatch();
  const [cities, setCities] = useState<string[]>([]);

  const schema = yup.object().shape({
    name: yup
      .string()
      .required("Name is required")
      .min(SETTINGS.name.min)
      .max(SETTINGS.name.max),
    email: yup
      .string()
      .email()
      .required("Email is required")
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
    linkedin: yup.string().url().required("LinkedIn URL is required").matches(
      /^https?:\/\/(www\.)?linkedin\.com\/.*$/,
      "Invalid LinkedIn URL"
    ),
    gender: yup.string().required("Gender is required"),
    address: yup.object().shape({
      line1: yup.string().required("Address Line 1 is required"),
      line2: yup.string(),
      state: yup.string().required("State is required"),
      city: yup.string().required("City is required"),
      pin: yup
        .string()
        .required("PIN is required")
        .matches(/^\d{6}$/, "Invalid PIN"),
    }),
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<User>({
    resolver: yupResolver(schema),
    defaultValues: editData || {
      name: "",
      email: "",
      linkedin: "",
      gender: "",
      address: { line1: "", line2: "", state: "", city: "", pin: "" },
    },
  });

  const selectedState = watch("address.state");

  useEffect(() => {
    const found = masterData.states.find((s) => s.name === selectedState);
    setCities(found ? found.cities : []);
  }, [selectedState]);

  const onSubmit = (data: User) => {
    if (editData) {
      dispatch(updateUser(data));
      reset();
    } else {
      dispatch(addUser({ ...data, id: uuidv4() }));
    reset();
    }
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white shadow-md rounded-xl p-6 space-y-6 max-w-4xl mx-auto border border-gray-100"
    >
      <h2 className="text-lg font-semibold text-gray-800">
        {editData ? "Edit User" : "Add New User"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="Enter full name"
                className={`p-2 w-full border rounded-md outline-none transition-all duration-200 ${
                  errors.name
                    ? "border-red-500 focus:ring-2 focus:ring-red-300"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                }`}
              />
            )}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">
              {get(errors, "name")?.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="Enter email address"
                className={`p-2 w-full border rounded-md outline-none transition-all duration-200 ${
                  errors.email
                    ? "border-red-500 focus:ring-2 focus:ring-red-300"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                }`}
              />
            )}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">
              {get(errors, "email")?.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn URL
          </label>
          <Controller
            name="linkedin"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="https://linkedin.com/in/..."
                className={`p-2 w-full border rounded-md outline-none transition-all duration-200 ${
                  errors.linkedin
                    ? "border-red-500 focus:ring-2 focus:ring-red-300"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                }`}
              />
            )}
          />
          {errors.linkedin && (
            <p className="text-red-500 text-xs mt-1">
              {get(errors, "linkedin")?.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className={`p-2 w-full border rounded-md outline-none transition-all duration-200 ${
                  errors.gender
                    ? "border-red-500 focus:ring-2 focus:ring-red-300"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                }`}
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            )}
          />
          {errors.gender && (
            <p className="text-red-500 text-xs mt-1">
              {get(errors, "gender")?.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-2">Address</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Controller
              name="address.line1"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  placeholder="Address Line 1"
                  className={`p-2 w-full border rounded-md outline-none transition-all duration-200 ${
                    get(errors, "address.line1")
                      ? "border-red-500 focus:ring-2 focus:ring-red-300"
                      : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  }`}
                />
              )}
            />
            <p className="text-red-500 text-xs mt-1">
              {get(errors, "address.line1")?.message}
            </p>
          </div>

          <div>
            <Controller
              name="address.line2"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  placeholder="Address Line 2"
                  className="p-2 w-full border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
          <div>
            <Controller
              name="address.state"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className={`p-2 w-full border rounded-md outline-none transition-all duration-200 ${
                    get(errors, "address.state")
                      ? "border-red-500 focus:ring-2 focus:ring-red-300"
                      : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  }`}
                >
                  <option value="">Select State</option>
                  {masterData.states.map((s) => (
                    <option key={s.name}>{s.name}</option>
                  ))}
                </select>
              )}
            />
            <p className="text-red-500 text-xs mt-1">
              {get(errors, "address.state")?.message}
            </p>
          </div>

          <div>
            <Controller
              name="address.city"
              control={control}
              disabled={!selectedState}
              render={({ field }) => (
                <select
                  {...field}
                  className={`p-2 w-full border rounded-md outline-none transition-all duration-200 ${
                    get(errors, "address.city")
                      ? "border-red-500 focus:ring-2 focus:ring-red-300"
                      : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  }`}
                >
                  <option value="">Select City</option>
                  {cities.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              )}
            />
            <p className="text-red-500 text-xs mt-1">
              {get(errors, "address.city")?.message}
            </p>
          </div>
        </div>

        <div className="mt-4 w-1/2 md:w-1/4">
          <Controller
            name="address.pin"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="PIN"
                className={`p-2 w-full border rounded-md outline-none transition-all duration-200 ${
                  get(errors, "address.pin")
                    ? "border-red-500 focus:ring-2 focus:ring-red-300"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                }`}
              />
            )}
          />
          <p className="text-red-500 text-xs mt-1">
            {get(errors, "address.pin")?.message}
          </p>
        </div>
      </div>

      <div className="pt-3">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-md"
        >
          {editData ? "Update User" : "Add User"}
        </button>
      </div>
    </form>
  );
}
