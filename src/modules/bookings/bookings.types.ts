export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

/**
 * Core Booking Entity (what your system returns)
 */
export type Booking = {
  id: string;
  organizationId: string;
  customerId?: string | null;
  serviceId?: string | null;
  title: string;
  notes?: string | null;
  status: BookingStatus;

  startTime: Date;
  endTime: Date;

  createdAt: Date;
  updatedAt: Date;
};

/**
 * Input when creating a booking
 * (NOTE: Dates come in as strings from API)
 */
export type CreateBookingInput = {
  organizationId: string;
  customerId?: string;
  serviceId?: string;

  title: string;
  notes?: string;

  startTime: string; // ISO string
  endTime: string;   // ISO string
};

/**
 * Input when updating a booking
 */
export type UpdateBookingInput = Partial<{
  customerId: string;
  serviceId: string;

  title: string;
  notes: string;
  status: BookingStatus;

  startTime: string;
  endTime: string;
}>;

/**
 * Query filters (GET /bookings)
 */
export type BookingQueryParams = {
  organizationId: string;

  status?: BookingStatus;

  startDate?: string;
  endDate?: string;

  page?: number;
  limit?: number;
};

/**
 * Pagination response wrapper
 */
export type PaginatedBookings = {
  data: Booking[];
  total: number;
  page: number;
  limit: number;
};