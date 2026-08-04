import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../api/userApi";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();


  const [editing, setEditing] = useState(false);

  const [firstName, setFirstName] = useState(user?.firstName ?? "");

  const [lastName, setLastName] = useState(user?.lastName ?? "");

  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? "");

  async function handleSave() {
    const updated = await updateProfile({
      firstName,

      lastName,

      phoneNumber,
    });

    updateUser(updated);

    setEditing(false);
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold flex items-center gap-3">
        👤 My Profile
      </h1>

      <div className="bg-white rounded-2xl shadow-md border p-8">
        <div className="grid grid-cols-2 gap-y-6 gap-x-12">
          <div>
            <p className="text-sm text-gray-500">First Name</p>
            {editing ? (
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full"
              />
            ) : (
              <span>{user?.firstName}</span>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500">Last Name</p>
            {editing ? (
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full"
              />
            ) : (
              <span>{user?.lastName}</span>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg font-semibold">{user?.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Phone Number</p>
            {editing ? (
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full"
              />
            ) : (
              <span>{user?.phoneNumber}</span>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="text-lg font-semibold">{user?.role}</p>
          </div>
        </div>

        {editing ? (
          <div className="flex gap-3">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>

            <button
              className="bg-primary text-white px-4 py-2 rounded-lg"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        ) : (
          <button
            className="bg-primary text-white px-4 py-2 rounded-lg"
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}
