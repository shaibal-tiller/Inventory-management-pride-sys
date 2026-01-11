import axios from "axios";

// Using relative path to work with the Vite proxy configured in vite.config.ts
export const API_BASE_URL = "/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => {
    const searchParams = new URLSearchParams();
    for (const key in params) {
      const value = params[key];
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, v));
      } else if (value !== undefined) {
        searchParams.append(key, value);
      }
    }
    return searchParams.toString();
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      const authHeader = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
      config.headers.Authorization = authHeader;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
export interface TreeItem {
  id: string;
  name: string;
  type: "location" | "item";
  children?: TreeItem[];
}

export interface LocationOut {
  id: string;
  name: string;
  description?: string;
  totalPrice?: number;
  createdAt: string;
  updatedAt: string;
  parent?: {
    id: string;
    name: string;
  };
}

export interface LoginRequest {
  username: string;
  password: string;
  stayLoggedIn?: boolean;
}

export interface TokenResponse {
  token: string;
  attachmentToken: string;
  expiresAt: string;
}

export interface ItemSummary {
  id: string;
  name: string;
  description: string;
  quantity: number;
  assetId: string;
  purchasePrice: number;
  location?: { id: string; name: string };
  labels: Array<{ id: string; name: string; color: string }>;
  thumbnailId?: string;
  archived: boolean;
  updatedAt: string;
}

export interface PaginationResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface ItemDetail extends ItemSummary {
  manufacturer?: string;
  modelNumber?: string;
  serialNumber?: string;
  purchaseTime?: string;
  warrantyExpires?: string;
  notes?: string;

  imageId?: string;
  attachments?: Array<{
    id: string;
    title: string;
    mimeType: string;
  }>;
}

export const api = {
  // Auth & User
  login: async (data: any) =>
    (
      await apiClient.post("/v1/users/login", new URLSearchParams(data), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
    ).data,
  getSelf: async () => (await apiClient.get("/v1/users/self")).data.item,

  // Items
  getItems: async (params?: any) =>
    (await apiClient.get("/v1/items", { params })).data,
  getItem: async (id: string) => (await apiClient.get(`/v1/items/${id}`)).data,
  createItem: async (data: any) =>
    (await apiClient.post("/v1/items", data)).data,
  deleteItem: async (id: string) => await apiClient.delete(`/v1/items/${id}`),

  // Locations
  getLocationsTree: async (withItems: boolean = false) =>
    (await apiClient.get("/v1/locations/tree", { params: { withItems } })).data,
  getLocation: async (id: string) =>
    (await apiClient.get(`/v1/locations/${id}`)).data,
  createLocation: async (data: {
    name: string;
    description?: string;
    parentId?: string | null;
  }) => (await apiClient.post("/v1/locations", data)).data,
  updateLocation: async (
    id: string,
    data: { name: string; description?: string; parentId?: string | null }
  ) => (await apiClient.put(`/v1/locations/${id}`, data)).data,
  deleteLocation: async (id: string) =>
    await apiClient.delete(`/v1/locations/${id}`),

  // Labels
  getLabels: async () => (await apiClient.get("/v1/labels")).data,

  // Attachments
  uploadAttachment: async (itemId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name);
    return (
      await apiClient.post(`/v1/items/${itemId}/attachments`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data;
  },

  getItemImageUrl: (itemId: string, attachmentId: string) => {
    const token = localStorage.getItem("attachment_token");
    return `${API_BASE_URL}/v1/items/${itemId}/attachments/${attachmentId}?token=${token}`;
  },
};
