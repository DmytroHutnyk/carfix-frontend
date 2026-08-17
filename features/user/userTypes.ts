// Shared identity core
//TODO infer from zod schema
export interface Location {
    city: string;
    region: string;
    countryIso: string;
    latitude: number | null;
    longitude: number | null;
}

export interface Address {
    id: number;
    streetName: string;
    buildingNumber: string;
    flatNumber: string | null;
    postalCode: string;
    city: string;
    region: string;
    countryIso: string;
    countryName: string;
    latitude: number | null;
    longitude: number | null;
    googlePlaceId: string | null;
}

export interface User {
    id: string;
    name: string;
    surname: string;
    phoneCountryCode: string;
    phoneNumber: string;
    email: string;
    dateOfBirth: string | null;
    address: Address | null;
    preferredLocation: Location | null;
    emailVerifiedAt: string | null;
}

export type CustomerStatus = "ACTIVE" | "SUSPENDED";
export const ROLE = {
    CUSTOMER: "CUSTOMER",
    OWNER: "OWNER",
    ADMIN: "ADMIN",
    EMPLOYEE: "EMPLOYEE",
} as const;

export type UserRole = (typeof ROLE)[keyof typeof ROLE];

// Specific user types
export interface CustomerAccount {
    role: typeof ROLE.CUSTOMER;
    user: User;
    customerStatus: CustomerStatus;
}

export interface OwnerAccount {
    role: typeof ROLE.OWNER;
    user: User;
    businessName: string;
    vatIn: string;
    regon: string;
}

export type Account = CustomerAccount | OwnerAccount;

export const isCustomer = (account: Account): account is CustomerAccount => account.role === ROLE.CUSTOMER;
export const isOwner = (account: Account): account is OwnerAccount => account.role === ROLE.OWNER;
