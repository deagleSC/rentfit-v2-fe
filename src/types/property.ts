/**
 * Property types matching backend model (converted from snake_case to camelCase)
 */

export type BHKType = '1RK' | '1BHK' | '2BHK' | '3BHK' | '4BHK+';
export type PropertyType =
  | 'apartment'
  | 'house'
  | 'villa'
  | 'studio'
  | 'penthouse'
  | 'commercial'
  | 'other';
export type FurnishingStatus = 'fully_furnished' | 'semi_furnished' | 'unfurnished';
export type PropertyStatus = 'vacant' | 'occupied' | 'maintenance';
export type MaintenanceFrequency = 'monthly' | 'quarterly' | 'yearly';
export type MediaType = 'image' | 'video';

export interface PropertyAddress {
  societyName?: string;
  street: string;
  locality?: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  mapLink?: string;
}

export interface PropertySpecs {
  bhk: BHKType;
  propertyType: PropertyType;
  bathrooms: number;
  balconies: number;
  furnishingStatus: FurnishingStatus;
  sizeSqFt: number;
  floorNumber?: number;
  totalFloors?: number;
  propertyAgeYears?: number;
}

export interface PropertyMedia {
  url: string;
  type: MediaType;
  caption?: string;
  uploadedAt: string | Date;
}

export interface MaintenanceDetails {
  amount: number;
  frequency: MaintenanceFrequency;
  includedInRent: boolean;
  description?: string;
}

export interface Property {
  id: string; // Converted from _id
  owner: string; // User ID
  title: string;
  address: PropertyAddress;
  specs: PropertySpecs;
  amenities: string[];
  media: PropertyMedia[];
  expectedRent: number;
  expectedDeposit: number;
  description?: string;
  maintenanceDetails?: MaintenanceDetails;
  status: PropertyStatus;
  availableFrom?: string | Date;
  currentAgreement?: string; // Agreement ID
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface PropertiesResponse {
  properties: Property[];
}

export interface PropertyResponse {
  property: Property;
}

export interface GetPropertiesParams {
  status?: PropertyStatus;
  city?: string;
  bhk?: BHKType;
}

// Property store state and actions
export interface PropertyState {
  properties: Property[];
  selectedProperty: Property | null;
  isLoading: boolean;
  error: string | null;
}

export interface PropertyActions {
  getProperties: (params?: GetPropertiesParams) => Promise<void>;
  getProperty: (propertyId: string) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  clearSelectedProperty: () => void;
}
