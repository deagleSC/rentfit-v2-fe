/**
 * Test file for convert-keys utility functions
 * This file can be used to manually verify the conversion functions work correctly
 */

import { convertKeysToCamelCase, convertKeysToSnakeCase } from '../convert-keys';

// Example test cases (can be run manually or with a test runner)

// Test 1: Simple object conversion
const backendUser = {
  _id: '123',
  name: 'John Doe',
  email: 'john@example.com',
  created_at: '2024-01-01',
  landlord_profile: {
    verification_status: 'pending',
    upi_id: '1234567890',
  },
};

const frontendUser = convertKeysToCamelCase(backendUser);
console.log('Backend to Frontend:', frontendUser);
// Expected: { id: '123', name: 'John Doe', email: 'john@example.com', createdAt: '2024-01-01', landlordProfile: { verificationStatus: 'pending', upiId: '1234567890' } }

// Test 2: Array conversion
const backendUsers = [
  { _id: '1', name: 'User 1', created_at: '2024-01-01' },
  { _id: '2', name: 'User 2', created_at: '2024-01-02' },
];

const frontendUsers = convertKeysToCamelCase(backendUsers);
console.log('Array conversion:', frontendUsers);

// Test 3: Reverse conversion (camelCase to snake_case)
const frontendPayload = {
  id: '123',
  name: 'John Doe',
  landlordProfile: {
    verificationStatus: 'verified',
    upiId: '1234567890',
  },
};

const backendPayload = convertKeysToSnakeCase(frontendPayload);
console.log('Frontend to Backend:', backendPayload);
// Expected: { _id: '123', name: 'John Doe', landlord_profile: { verification_status: 'verified', upi_id: '1234567890' } }

// Test 4: Nested objects
const nestedBackend = {
  _id: '123',
  user: {
    _id: '456',
    profile: {
      created_at: '2024-01-01',
      updated_at: '2024-01-02',
    },
  },
};

const nestedFrontend = convertKeysToCamelCase(nestedBackend);
console.log('Nested conversion:', nestedFrontend);

export {};
