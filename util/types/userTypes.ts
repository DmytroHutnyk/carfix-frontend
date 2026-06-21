export interface User {
    id: string;
    name: string;
    surname: string;
    phoneCountryCode: string;
    phoneNumber: string;
    email: string;
    role: UserRole;
    dateOfBirth: string | null;
    customerStatus: CustomerStatus;
}

export type CustomerStatus = "ACTIVE" | "SUSPENDED";
export type UserRole = "CUSTOMER" | "OWNER" | "ADMIN" | "EMPLOYEE";