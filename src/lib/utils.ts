import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
        const date = new Date(dateString);
        // Format: Jun 14, 25 (3:30 pm)
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const ampm = date.getHours() >= 12 ? 'pm' : 'am';
        const displayHour = date.getHours() % 12 || 12;
        const minute = date.getMinutes().toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);

        return `${monthNames[date.getMonth()]} ${date.getDate()}, ${year} (${displayHour}:${minute} ${ampm})`;
    } catch {
        return "Invalid Date";
    }
}

 export const items = [
    { color: "bg-green-400", label: "Available" },
    { color: "bg-blue-500", label: "Selected" },
    { color: "bg-red-500", label: "Reserved / Booked" },
    { color: "bg-cyan-300", label: "Platinum" },
    { color: "bg-yellow-400", label: "Gold" },
    { color: "bg-gray-400", label: "Silver" },
  ];


export const toLocalDatetimeString = (dateInput: string | Date | undefined): string => {
    if (!dateInput) return "";
    try {
        const date = new Date(dateInput);
        if (isNaN(date.getTime())) return "";

        const pad = (n: number) => n.toString().padStart(2, '0');
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hour = pad(date.getHours());
        const minute = pad(date.getMinutes());

        return `${year}-${month}-${day}T${hour}:${minute}`;
    } catch {
        return "";
    }
};

export const getSeatColor = (seat:any, selectedSeats:any) => {
  if (selectedSeats.find((s) => s._id === seat._id)) return "bg-blue-500";
  if (seat.status === "RESERVED" || seat.status === "BOOKED") return "bg-red-500";

  switch (seat.seatType) {
    case "platinum":
      return "bg-cyan-300";
    case "gold":
      return "bg-yellow-400";
    case "silver":
      return "bg-gray-400";
    default:
      return "bg-green-500";
  }
};