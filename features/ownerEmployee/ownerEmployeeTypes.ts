import {z} from "zod";

export interface EmployeeAddress {
    street: string;
    apartment: string;
    region: string;
    country: string;
    postalCode: string;
}

export interface OwnerEmployee {
    id: string;
    name: string;
    surname: string;
    phone: string;
    email: string;
    salary: number;
    roles: string[];
    address: EmployeeAddress;
    status?: string;
}

export interface OwnerEmployeeRequest {
    name: string;
    surname: string;
    phone: string;
    email: string;
    salary: number;
    roles: string[];
    address: EmployeeAddress;
}

export const PHONE_PREFIX = "+48";

export const employeeAddressSchema = z.object({
    street: z.string().trim().max(100, "Street cannot exceed 100 characters"),
    apartment: z.string().trim().max(20, "Apartment cannot exceed 20 characters"),
    region: z.string().trim().max(100, "Region cannot exceed 100 characters"),
    country: z.string().trim().max(100, "Country cannot exceed 100 characters"),
    postalCode: z.string().trim().max(20, "Postal code cannot exceed 20 characters"),
});

export const employeeFormSchema = z.object({
    name: z.string().trim().min(1, "Name is required").max(50, "Name cannot exceed 50 characters"),
    surname: z.string().trim().min(1, "Surname is required").max(50, "Surname cannot exceed 50 characters"),
    phone: z.string().trim().min(1, "Phone is required").max(15, "Phone cannot exceed 15 digits"),
    email: z.string().trim().email("Enter a valid email"),
    salary: z.number({message: "Salary is required"}).min(0, "Salary must be positive"),
    roles: z.array(z.string()).min(1, "Add at least one role"),
    address: employeeAddressSchema,
});

export type EmployeeForm = z.infer<typeof employeeFormSchema>;

export function toEmployeeForm(employee: OwnerEmployee | null): EmployeeForm {
    if (!employee) {
        return {
            name: "",
            surname: "",
            phone: "",
            email: "",
            salary: 0,
            roles: [],
            address: {street: "", apartment: "", region: "", country: "", postalCode: ""},
        };
    }
    return {
        name: employee.name,
        surname: employee.surname,
        phone: employee.phone.startsWith(PHONE_PREFIX) ? employee.phone.slice(PHONE_PREFIX.length) : employee.phone,
        email: employee.email,
        salary: employee.salary,
        roles: employee.roles,
        address: {
            street: employee.address.street,
            apartment: employee.address.apartment,
            region: employee.address.region,
            country: employee.address.country,
            postalCode: employee.address.postalCode,
        },
    };
}

export function toEmployeeRequest(form: EmployeeForm): OwnerEmployeeRequest {
    return {
        name: form.name.trim(),
        surname: form.surname.trim(),
        phone: `${PHONE_PREFIX}${form.phone.trim()}`,
        email: form.email.trim(),
        salary: form.salary,
        roles: form.roles,
        address: {
            street: form.address.street.trim(),
            apartment: form.address.apartment.trim(),
            region: form.address.region.trim(),
            country: form.address.country.trim(),
            postalCode: form.address.postalCode.trim(),
        },
    };
}
