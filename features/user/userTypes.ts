// Shared identity core
//TODO the backend wire does not send `address` yet, so it is intentionally absent here
//TODO infer from zod schema
export interface User {
    id: string;
    name: string;
    surname: string;
    phoneCountryCode: string;
    phoneNumber: string;
    email: string;
    dateOfBirth: string | null;
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
