import { IWorkingTimesData } from './IWorkingTimesData';

export interface ITabelReservationServiceData {
    service_title: string;
    service_start_date: string;
    service_end_date: string;
    service_description: string;
    current_day_reg_cutoff: string;
    length: number;
    restricted_by: string;
    max_residents_per_interval: number;
    max_number_parties: number;
    max_party_size: number;
    restricted_on_day: string;
    per_day_booking: number;
    per_slot_booking: number;
    allow_admin_override: string;
    max_admin_reservations: number;
    status: string;
    image: string;
    id: number;
    admin_email: string;
    dates: string[];
    working_times: IWorkingTimesData;
}