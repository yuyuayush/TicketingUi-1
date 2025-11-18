import { create } from "zustand";

interface Seat {
  _id: string;
  seatNumber: string;
  row: string;
  column: number;
  seatType: string;
  price: number;
  status: string; // AVAILABLE, RESERVED, BOOKED
  lockedBy?: string;
  lockedAt?: number; // timestamp in ms
}

interface SeatState {
  selectedSeats: Seat[];
  totalAmount: number;
  locked: boolean;
  timer: number;
  setSelectedSeats: (seats: Seat[]) => void;
  setTotalAmount: (amount: number) => void;
  setLocked: (locked: boolean) => void;
  setTimer: (time: number | ((prev: number) => number)) => void;
  toggleSeat: (seat: Seat) => void;
  resetSeats: () => void;
}

export const useSeatStore = create<SeatState>((set, get) => ({
  selectedSeats: [],
  totalAmount: 0,
  locked: false,
  timer: 0,

  setSelectedSeats: (seats: Seat[]) => set({ selectedSeats: seats }),
  setTotalAmount: (amount: number) => set({ totalAmount: amount }),
  setLocked: (locked: boolean) => set({ locked }),
  setTimer: (time: number | ((prev: number) => number)) => 
    set((state) => ({ 
      timer: typeof time === 'function' ? time(state.timer) : time 
    })),

  toggleSeat: (seat: Seat) => {
    const { selectedSeats, totalAmount } = get();
    const exists = selectedSeats.find((s) => s._id === seat._id);

    if (exists) {
      const updatedSeats = selectedSeats.filter((s) => s._id !== seat._id);
      set({ selectedSeats: updatedSeats, totalAmount: totalAmount - seat.price });
    } else {
      const updatedSeats = [...selectedSeats, seat];
      set({ selectedSeats: updatedSeats, totalAmount: totalAmount + seat.price });
    }
  },

  resetSeats: () => set({ selectedSeats: [], totalAmount: 0, locked: false, timer: 0 }),
}));
