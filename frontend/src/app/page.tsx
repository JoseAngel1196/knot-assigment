"use client";
import React, { useState } from "react";
import UserManager from "../components/user";
import ContactsManager from "../components/contacts";

interface User {
  id: string;
  username: string;
}

export default function Home() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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
            <UserManager onUserSelect={setSelectedUser} />
          </div>

          <div>
            <ContactsManager selectedUser={selectedUser} />
          </div>
        </div>
      </div>
    </div>
  );
}
