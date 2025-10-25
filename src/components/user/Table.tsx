"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { deleteUser } from "@/redux/userSlice";
import { useState } from "react";
import UserForm from "./Form";
import { SETTINGS } from "@/config/manageSettings";

export default function UserTable() {
  const { users } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  return (
      <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-semibold text-gray-800">{showForm? 'Add User': 'User List'}</h2>

        <button
          onClick={() => {
            if (showForm) {
              setEditData(null);
              setShowForm(false);
            } else {
              setEditData(null);
              setShowForm(true);
            }
          }}
          className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 cursor-pointer ${
            showForm
              ? "bg-gray-500 hover:bg-gray-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {showForm ? "Close" : "Add User"}
        </button>
      </div>

      {showForm ? (
        <UserForm editData={editData} onClose={() => setShowForm(false)} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">LinkedIn</th>
                <th className="py-3 px-4 text-left">Gender</th>
                <th className="py-3 px-4 text-left">Address</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-8 text-gray-400 text-base"
                  >
                    No user list found
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <>
                    <tr className="hover:bg-gray-50 transition" key={u.id}>
                      <td className="py-3 px-4 font-medium text-gray-800">
                        {u.name}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{u.email}</td>
                      <td className="py-3 px-4">
                        <a
                          href={u.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {u.linkedin}
                        </a>
                      </td>
                      <td className="py-3 px-4 capitalize">{u.gender}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() =>
                            setExpanded(expanded === u.id ? null : u.id!)
                          }
                          className="text-sm text-indigo-600 hover:underline cursor-pointer"
                        >
                          {expanded === u.id ? "Hide" : "View"}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center space-x-2">
                        {SETTINGS.editable && (
                          <button
                            onClick={() => {
                              setEditData(u);
                              setShowForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 font-medium hover:underline cursor-pointer"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(u.id!)}
                          className="text-red-500 hover:text-red-700 font-medium hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>

                    {expanded === u.id && (
                      <tr className="bg-gray-50">
                        <td colSpan={6} className="py-3 px-4 text-gray-600">
                          <div className="ml-2">
                            {u.address.line1}, {u.address.line2}, {u.address.city},{" "}
                            {u.address.state} - {u.address.pin}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
