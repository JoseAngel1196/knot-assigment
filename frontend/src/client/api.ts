const API_BASE_URL = "http://0.0.0.0:8000";

export interface User {
  id: string;
  username: string;
}

export interface ContactHistory {
  field_changed: string;
  old_value: string;
  new_value: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userId: string;
  contact_histories?: ContactHistory[];
}

export interface BackendContact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  user_id: string;
  contact_histories?: ContactHistory[];
}

export interface CreateUserRequest {
  username: string;
}

export interface CreateContactRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  user_id: string;
}

export interface UpdateContactRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  user_id?: string;
}

export interface ApiResponse<T> {
  data: T;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Unknown error" }));
      throw new ApiError(
        response.status,
        errorData.message || `HTTP ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(
      `Network error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export const userApi = {
  async createUser(userData: CreateUserRequest): Promise<User> {
    return apiRequest<User>("/users/", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  async getUsers(): Promise<User[]> {
    const response = await apiRequest<ApiResponse<User[]>>("/users/");
    return response.data;
  },
};

export const contactApi = {
  async createContact(contactData: CreateContactRequest): Promise<Contact> {
    const response = await apiRequest<ApiResponse<Contact>>("/contacts/", {
      method: "POST",
      body: JSON.stringify(contactData),
    });
    return response.data;
  },

  async getContacts(): Promise<Contact[]> {
    return apiRequest<Contact[]>("/contacts/");
  },

  async getContactsByUserId(userId: string): Promise<Contact[]> {
    const response = await apiRequest<ApiResponse<BackendContact[]>>(
      `/contacts/user/${userId}`
    );

    return response.data.map((contact) => ({
      id: contact.id,
      firstName: contact.first_name,
      lastName: contact.last_name,
      email: contact.email,
      phoneNumber: contact.phone,
      userId: contact.user_id,
      contact_histories: contact.contact_histories || [],
    }));
  },

  async updateContact(
    id: string,
    contactData: UpdateContactRequest
  ): Promise<Contact> {
    const response = await apiRequest<ApiResponse<Contact>>(`/contacts/${id}`, {
      method: "PUT",
      body: JSON.stringify(contactData),
    });
    return response.data;
  },

  async deleteContact(id: string): Promise<void> {
    return apiRequest<void>(`/contacts/${id}`, {
      method: "DELETE",
    });
  },
};

export default {
  userApi,
  contactApi,
  ApiError,
};
