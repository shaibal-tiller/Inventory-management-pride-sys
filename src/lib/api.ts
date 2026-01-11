import axios from 'axios';

// Base API URL
export const API_BASE_URL = 'http://4.213.57.100:3100/api';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Types
export interface LoginRequest {
  username: string;
  password: string;
  stayLoggedIn?: boolean;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface TokenResponse {
  token: string;
  attachmentToken: string;
  expiresAt: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  quantity: number;
  assetId: string;
  purchasePrice: number;
  purchaseTime?: string;
  location?: Location;
  labels: Label[];
  imageId?: string;
  thumbnailId?: string;
  archived: boolean;
  insured: boolean;
  createdAt: string;
  updatedAt: string;
  manufacturer?: string;
  modelNumber?: string;
  serialNumber?: string;
  warrantyExpires?: string;
  notes?: string;
}

export interface ItemSummary {
  id: string;
  name: string;
  description: string;
  quantity: number;
  assetId: string;
  purchasePrice: number;
  location?: LocationSummary;
  labels: Label[];
  imageId?: string;
  thumbnailId?: string;
  archived: boolean;
  insured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ItemCreate {
  name: string;
  description?: string;
  quantity?: number;
  locationId?: string;
  labelIds?: string[];
  parentId?: string | null;
}

export interface ItemUpdate extends ItemCreate {
  id: string;
  assetId?: string;
  purchasePrice?: number;
  purchaseTime?: string;
  purchaseFrom?: string;
  manufacturer?: string;
  modelNumber?: string;
  serialNumber?: string;
  insured?: boolean;
  lifetimeWarranty?: boolean;
  warrantyExpires?: string;
  warrantyDetails?: string;
  soldTime?: string;
  soldPrice?: number;
  soldTo?: string;
  soldNotes?: string;
  notes?: string;
  archived?: boolean;
  fields?: ItemField[];
}

export interface ItemField {
  id?: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'time';
  textValue?: string;
  numberValue?: number;
  booleanValue?: boolean;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  parent?: LocationSummary;
  children?: LocationSummary[];
}

export interface LocationSummary {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocationCreate {
  name: string;
  description?: string;
  parentId?: string | null;
}

export interface Label {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface LabelCreate {
  name: string;
  description?: string;
  color?: string;
}

export interface PaginationResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface TreeItem {
  id: string;
  name: string;
  type: 'location' | 'item';
  children?: TreeItem[];
}

// API Functions
export const api = {
  // Auth
  login: async (data: LoginRequest): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/v1/users/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<void> => {
    await apiClient.post('/v1/users/register', data);
  },

  // Items
  getItems: async (params?: {
    q?: string;
    page?: number;
    pageSize?: number;
    labels?: string[];
    locations?: string[];
  }): Promise<PaginationResult<ItemSummary>> => {
    const response = await apiClient.get<PaginationResult<ItemSummary>>('/v1/items', { params });
    return response.data;
  },

  getItem: async (id: string): Promise<Item> => {
    const response = await apiClient.get<Item>(`/v1/items/${id}`);
    return response.data;
  },

  createItem: async (data: ItemCreate): Promise<ItemSummary> => {
    const response = await apiClient.post<ItemSummary>('/v1/items', data);
    return response.data;
  },

  updateItem: async (id: string, data: ItemUpdate): Promise<Item> => {
    const response = await apiClient.put<Item>(`/v1/items/${id}`, data);
    return response.data;
  },

  deleteItem: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/items/${id}`);
  },

  // Locations
  getLocations: async (): Promise<Location[]> => {
    const response = await apiClient.get<Location[]>('/v1/locations');
    return response.data;
  },

  getLocation: async (id: string): Promise<Location> => {
    const response = await apiClient.get<Location>(`/v1/locations/${id}`);
    return response.data;
  },

  getLocationsTree: async (withItems?: boolean): Promise<TreeItem[]> => {
    const response = await apiClient.get<TreeItem[]>('/v1/locations/tree', {
      params: { withItems }
    });
    return response.data;
  },

  createLocation: async (data: LocationCreate): Promise<LocationSummary> => {
    const response = await apiClient.post<LocationSummary>('/v1/locations', data);
    return response.data;
  },

  updateLocation: async (id: string, data: LocationCreate): Promise<Location> => {
    const response = await apiClient.put<Location>(`/v1/locations/${id}`, data);
    return response.data;
  },

  deleteLocation: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/locations/${id}`);
  },

  // Labels
  getLabels: async (): Promise<Label[]> => {
    const response = await apiClient.get<Label[]>('/v1/labels');
    return response.data;
  },

  getLabel: async (id: string): Promise<Label> => {
    const response = await apiClient.get<Label>(`/v1/labels/${id}`);
    return response.data;
  },

  createLabel: async (data: LabelCreate): Promise<Label> => {
    const response = await apiClient.post<Label>('/v1/labels', data);
    return response.data;
  },

  updateLabel: async (id: string, data: LabelCreate): Promise<Label> => {
    const response = await apiClient.put<Label>(`/v1/labels/${id}`, data);
    return response.data;
  },

  deleteLabel: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/labels/${id}`);
  },
};