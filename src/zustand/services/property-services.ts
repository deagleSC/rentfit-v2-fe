import { apiCall } from '@/lib/api-client';
import { api } from '@/configs/api';
import { handleError } from '@/lib/handle-error';
import type { PropertiesResponse, PropertyResponse, GetPropertiesParams } from '@/types/property';

/**
 * Property service functions
 * Handles all API calls related to properties
 */

/**
 * Get all properties for the authenticated user
 */
export async function getProperties(params?: GetPropertiesParams): Promise<PropertiesResponse> {
  try {
    const response = await apiCall<PropertiesResponse>({
      method: 'GET',
      url: api.properties.list(params),
    });

    return response.data;
  } catch (error: unknown) {
    handleError(error, 'Failed to fetch properties. Please try again.');
    throw error;
  }
}

/**
 * Get a single property by ID
 */
export async function getProperty(propertyId: string): Promise<PropertyResponse> {
  try {
    const response = await apiCall<PropertyResponse>({
      method: 'GET',
      url: api.properties.get(propertyId),
    });

    return response.data;
  } catch (error: unknown) {
    handleError(error, 'Failed to fetch property. Please try again.');
    throw error;
  }
}
