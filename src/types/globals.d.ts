// src/types/globals.d.ts or types/globals.d.ts

export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: 'admin' | 'user'; // Defines the exact shape of your metadata
    };
  }
}