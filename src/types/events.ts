
export enum EventStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected"
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  address: string;
  lat: number;
  lng: number;
  organizer: string;
  contactEmail?: string;
  status: EventStatus;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventRequest {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  address: string;
  organizer: string;
  createdBy?: string;
  status?: EventStatus;
  createdAt?: Date | string;
}

export interface CreateEventRequestData {
  title: string;
  description: string;
  date: string;
  time: string;
  address: string;
  organizer: string;
}
