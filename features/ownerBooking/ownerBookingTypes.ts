export interface OwnerBookingCustomer {
    name: string;
    phone: string;
    email: string;
}

export interface OwnerBookingCar {
    brand: string;
    model: string;
    plate: string;
}

export interface OwnerBookingService {
    name: string;
    durationMinutes: number;
    price: number;
}

export interface OwnerBookingEmployee {
    name: string;
    role: string;
}

export interface OwnerBooking {
    reference: string;
    status: string;
    date: string;
    start: string;
    end: string;
    customer: OwnerBookingCustomer;
    car: OwnerBookingCar;
    services: OwnerBookingService[];
    bay: string;
    employees: OwnerBookingEmployee[];
    equipment: string[];
    totalDurationMinutes: number;
    createdAt: string;
}
