import * as propertyServices from '@/zustand/services/property-services';
import type { PropertyState, GetPropertiesParams } from '@/types/property';

type SetState = (
  partial: Partial<PropertyState> | ((state: PropertyState) => Partial<PropertyState>)
) => void;

/**
 * Get properties action
 * Fetches properties for the authenticated user
 */
export async function getPropertiesAction(
  params: GetPropertiesParams | undefined,
  set: SetState
): Promise<void> {
  set({ isLoading: true, error: null });

  const response = await propertyServices.getProperties(params);

  set({
    properties: response.properties,
    isLoading: false,
    error: null,
  });
}

/**
 * Get single property action
 * Fetches a single property by ID
 */
export async function getPropertyAction(propertyId: string, set: SetState): Promise<void> {
  set({ isLoading: true, error: null });

  const response = await propertyServices.getProperty(propertyId);

  set({
    selectedProperty: response.property,
    isLoading: false,
    error: null,
  });
}

/**
 * Clear error action
 */
export function clearErrorAction(set: SetState): void {
  set({ error: null });
}

/**
 * Set loading action
 */
export function setLoadingAction(loading: boolean, set: SetState): void {
  set({ isLoading: loading });
}

/**
 * Clear selected property action
 */
export function clearSelectedPropertyAction(set: SetState): void {
  set({ selectedProperty: null });
}
