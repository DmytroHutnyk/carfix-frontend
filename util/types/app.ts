export interface User {
    id: string;
    name: string;
    surname: string;
    phoneCountryCode: string;
    phoneNumber: string;
    email: string;
    role: string;
    dateOfBirth: string | null;
    customerStatus: string;
}