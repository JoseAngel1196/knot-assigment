"use client";
import React, { useState } from "react";
import User from "../components/User";
import Contact from "../components/Contacts";

interface IUser {
  id: string;
  username: string;
}

export default function Home() {
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 text-center">
            Contacts Application
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <User onUserSelect={setSelectedUser} />
          </div>

          <div>
            <Contact selectedUser={selectedUser} />
          </div>
        </div>
      </div>
    </div>
  );
}
