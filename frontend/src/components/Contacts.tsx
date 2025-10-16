"use client";
import React, { useState, useEffect } from "react";
import { parsePhoneNumber, useMask } from "react-phone-hooks";
import { contactApi, ApiError } from "../client/api";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userId: string;
}

interface User {
  id: string;
  username: string;
}

interface ContactsProps {
  selectedUser: User | null;
}

export default function Contacts({ selectedUser }: ContactsProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const phoneMaskProps = useMask("+1 (...) ... ....");

  useEffect(() => {
    if (selectedUser) {
      fetchContactsForUser(selectedUser.id);
    } else {
      setContacts([]);
    }
  }, [selectedUser]);

  const fetchContactsForUser = async (userId: string) => {
    try {
      setLoading(true);
      const userContacts = await contactApi.getContactsByUserId(userId);

      const mappedContacts = userContacts.map((contact: any) => ({
        id: contact.id,
        firstName: contact.firstName || contact.first_name || "",
        lastName: contact.lastName || contact.last_name || "",
        email: contact.email || "",
        phoneNumber: contact.phoneNumber || contact.phone || "",
        userId: contact.userId || contact.user_id || "",
      }));

      setContacts(mappedContacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      if (error instanceof ApiError) {
        alert(`Error fetching contacts: ${error.message}`);
      } else {
        alert("Failed to fetch contacts. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const userContacts = contacts;

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    });
    setEditingContact(null);
    setEditingContactId(null);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string) => {
    try {
      const parsed = parsePhoneNumber(phone);
      return parsed && parsed.countryCode === 1 && parsed.phoneNumber;
    } catch (error) {
      return false;
    }
  };

  const validateForm = () => {
    const { firstName, lastName, email, phoneNumber } = formData;

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phoneNumber.trim()
    ) {
      alert("All fields are mandatory");
      return false;
    }

    if (!validateEmail(email)) {
      alert("Please enter a valid email address");
      return false;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      alert("Please enter a valid US phone number");
      return false;
    }

    // Check for duplicate email
    const duplicateEmail = contacts.find(
      (contact) =>
        contact.email.toLowerCase() === email.trim().toLowerCase() &&
        (!editingContact || contact.id !== editingContact.id)
    );

    if (duplicateEmail) {
      alert(`A contact with email "${email.trim()}" already exists.`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser) {
      alert("Please select a user first");
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      if (editingContactId) {
        await contactApi.updateContact(editingContactId, {
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phoneNumber.trim(),
          user_id: selectedUser.id,
        });

        alert("Contact updated successfully!");
        await fetchContactsForUser(selectedUser.id);
      } else {
        await contactApi.createContact({
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phoneNumber.trim(),
          user_id: selectedUser.id,
        });

        alert("Contact created successfully!");
        await fetchContactsForUser(selectedUser.id);
      }
    } catch (error) {
      console.error("Error saving contact:", error);

      if (error instanceof ApiError) {
        alert(`Error saving contact: ${error.message}`);
      } else {
        alert("Failed to save contact. Please check your connection.");
      }
    }

    resetForm();
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setEditingContactId(contact.id);
    setFormData({
      firstName: contact.firstName || (contact as any).first_name || "",
      lastName: contact.lastName || (contact as any).last_name || "",
      email: contact.email || "",
      phoneNumber: contact.phoneNumber || (contact as any).phone || "",
    });
  };

  const handleDelete = (contactId: string) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      // TODO...
    }
  };

  if (!selectedUser) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Contacts</h2>
        <p className="text-gray-500 italic">
          Please select a user first to manage their contacts.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Contacts for {selectedUser.username}
      </h2>

      <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          {editingContactId ? "Edit Contact" : "Add New Contact"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="First Name *"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
          />
          <input
            type="text"
            placeholder="Last Name *"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="email"
            placeholder="Email *"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
          />
          <input
            type="tel"
            placeholder="Phone Number * (e.g., +1 (555) 123 4567)"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
            {...phoneMaskProps}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {editingContactId ? "Update Contact" : "Add Contact"}
          </button>
          {editingContactId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Contacts ({userContacts.length})
          </h3>
          {selectedUser && (
            <button
              onClick={() => fetchContactsForUser(selectedUser.id)}
              disabled={loading}
              className="px-3 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading contacts...</div>
          </div>
        ) : userContacts.length === 0 ? (
          <p className="text-gray-500 italic">
            No contacts found for this user.
          </p>
        ) : (
          <div className="grid gap-4">
            {userContacts.map((contact) => (
              <div
                key={contact.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800">
                      {contact.firstName} {contact.lastName}
                    </h4>
                    <p className="text-gray-600">{contact.email}</p>
                    <p className="text-gray-600">{contact.phoneNumber}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(contact)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
