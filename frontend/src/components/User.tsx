"use client";
import React, { useState } from "react";

interface User {
  id: string;
  username: string;
}

interface UserProps {
  onUserSelect: (user: User) => void;
}

export default function User({ onUserSelect }: UserProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [newUsername, setNewUsername] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleCreateUser = () => {};

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    onUserSelect(user);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">User Management</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          Create New User
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Enter username"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleCreateUser}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Create User
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          Select User
        </h3>
        {users.length === 0 ? (
          <p className="text-gray-500 italic">No users created yet</p>
        ) : (
          <div className="grid gap-2">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className={`px-4 py-3 text-left rounded-md border transition-colors ${
                  selectedUser?.id === user.id
                    ? "bg-blue-100 border-blue-500 text-blue-700"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
                }`}
              >
                <div className="font-medium">{user.username}</div>
                <div className="text-sm text-gray-500">ID: {user.id}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedUser && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-700 font-medium">
            Selected User: {selectedUser.username}
          </p>
        </div>
      )}
    </div>
  );
}
