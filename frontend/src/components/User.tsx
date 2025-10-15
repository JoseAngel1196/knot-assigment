"use client";
import React, { useState, useEffect } from "react";
import { userApi, ApiError, type User } from "../client/api";

interface UserProps {
  onUserSelect: (user: User) => void;
}

export default function User({ onUserSelect }: UserProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [newUsername, setNewUsername] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const fetchedUsers = await userApi.getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error instanceof ApiError) {
        alert(`Error fetching users: ${error.message}`);
      } else {
        alert("Failed to fetch users. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (newUsername.trim() === "") {
      alert("Please enter a username");
      return;
    }

    const duplicateUser = users.find(
      (user) => user.username.toLowerCase() === newUsername.trim().toLowerCase()
    );

    if (duplicateUser) {
      alert(
        `Username "${newUsername.trim()}" already exists. Please choose a different username.`
      );
      return;
    }

    try {
      const newUser = await userApi.createUser({
        username: newUsername.trim(),
      });

      setUsers([...users, newUser]);
      setNewUsername("");
      alert("User created successfully!");
    } catch (error) {
      console.error("Error creating user:", error);

      if (error instanceof ApiError) {
        alert(`Error creating user: ${error.message}`);
      } else {
        alert("Failed to create user. Please check your connection.");
      }
    }
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    onUserSelect(user);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Users</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          Create a user
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
            Create user
          </button>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-700">Select a user</h3>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="px-3 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading users...</div>
          </div>
        ) : users.length === 0 ? (
          <p className="text-gray-500 italic">No users found</p>
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
