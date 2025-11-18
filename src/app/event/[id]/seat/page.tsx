"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetSeatsByConcert, useLockSeats, useUnlockSeats } from "@/hooks/useSeat";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { useSeatStore } from "@/store/useSeatStore";
import { getSeatColor, items } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuth";
import { SeatButtonProps, SeatMapProps, ISeat } from "@/lib/types";
import BookingPanel from "@/components/seat/BookingPanel";
import InteractiveSeatMap from "@/components/seat/InteractiveSeatMap";
import { Button } from "@/components/ui/button";
import { Theater, Circle, Lock } from "lucide-react";
import { useSocket } from "@/hooks/useSocket";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";



const SeatSelectionPage = () => {
  const params = useParams();
  const router = useRouter();
  const concertId = params.id;
  const [layoutType, setLayoutType] = useState<"arena" | "theater">("theater");

  const { isAuthenticated, currentUser, isInitialized } = useAuthStore();
  const userId = currentUser?.id;

  // Seat store hooks (must be before handlers that use them)
  const {
    selectedSeats,
    totalAmount,
    locked,
    timer,
    setLocked,
    setTimer,
    setSelectedSeats,
    setTotalAmount,
    toggleSeat,
    resetSeats,
  } = useSeatStore();

  // Only fetch seats if user is authenticated
  const { data: seats = [], isLoading } = useGetSeatsByConcert(concertId as string, {
    enabled: isAuthenticated === true, // Only fetch if authenticated
  });

  const lockSeatsMutation = useLockSeats();
  const unlockSeatsMutation = useUnlockSeats();
  const queryClient = useQueryClient();

  // Handler functions (defined after hooks that they depend on)
  const handleLockSeats = () => {
    lockSeatsMutation.mutate(
      { concertId, seatIds: selectedSeats.map((s) => s._id) },
      {
        onSuccess: (res) => {
          setLocked(true);
          setTimer(600);
          if (res.failedSeats?.length) {
            alert(`These seats are already locked/reserved: ${res.failedSeats.join(", ")}`);
          }
        },
      }
    );
  };

  const handleUnlockSeats = () => {
    unlockSeatsMutation.mutate(
      { concertId, seatIds: selectedSeats.map((s) => s._id) },
      { onSuccess: () => resetSeats() }
    );
  };


  // Real-time seat updates via WebSocket
  useSocket({
    concertId: concertId as string,
    enabled: !!concertId,
    onSeatUpdate: (data) => {
      console.log('📡 Real-time seat update received:', data);

      // Invalidate and refetch seats to get latest status
      queryClient.invalidateQueries({ queryKey: ['seats', concertId] });

      // If seats were unlocked and we had them selected, update our state
      if (data.type === 'UNLOCKED' && selectedSeats.length > 0) {
        const unlockedSeatIds = data.seats.map(s => s._id);
        const ourUnlockedSeats = selectedSeats.filter(s =>
          unlockedSeatIds.includes(s._id) && s.lockedBy === userId
        );

        if (ourUnlockedSeats.length > 0) {
          // If our locked seats were unlocked by someone else or expired, reset
          resetSeats();
        }
      }

      // If seats were booked, remove them from our selection if we had them
      if (data.type === 'BOOKED' && selectedSeats.length > 0) {
        const bookedSeatIds = data.seats.map(s => s._id);
        const ourBookedSeats = selectedSeats.filter(s => bookedSeatIds.includes(s._id));

        if (ourBookedSeats.length > 0) {
          // Remove booked seats from selection
          const remainingSeats = selectedSeats.filter(s => !bookedSeatIds.includes(s._id));
          setSelectedSeats(remainingSeats);
          const newTotal = remainingSeats.reduce((sum, s) => sum + s.price, 0);
          setTotalAmount(newTotal);
        }
      }
    },
  });

  // ========== ALL useEffect HOOKS (must be before any conditional returns) ==========
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (isInitialized && !isAuthenticated && typeof window !== 'undefined') {
      router.push("/register");
    }
  }, [isInitialized, isAuthenticated, router]);





  // Restore locked seats and timer on page load/refresh
  useEffect(() => {
    if (!seats.length || !userId) {
      // If no seats or user, reset state
      if (locked) {
        resetSeats();
      }
      return;
    }

    // Find ALL seats locked by the current user
    const lockedSeats = seats.filter(
      (s) => s.lockedBy === userId && s?.lockedAt && s.status === "RESERVED"
    );

    if (lockedSeats.length > 0) {
      // Get the earliest lockedAt time (oldest lock) - this determines when timer expires
      const earliestLock = lockedSeats.reduce((earliest, seat) => {
        if (!earliest) return seat;
        const seatLockTime = new Date(seat.lockedAt).getTime();
        const earliestTime = new Date(earliest.lockedAt).getTime();
        return seatLockTime < earliestTime ? seat : earliest;
      }, null as ISeat | null);

      if (earliestLock?.lockedAt) {
        const lockedTime = new Date(earliestLock.lockedAt).getTime();
        const now = Date.now();
        const lockDuration = 10 * 60 * 1000; // 10 minutes in milliseconds
        const remainingTime = Math.max(0, Math.floor((lockDuration - (now - lockedTime)) / 1000));

        if (remainingTime > 0) {
          // Restore locked state
          setLocked(true);
          setTimer(remainingTime);

          // Restore selected seats from locked seats
          const lockedSeatObjects = lockedSeats.map(seat => ({
            _id: seat._id,
            seatNumber: seat.seatNumber,
            row: seat.row,
            column: seat.column,
            seatType: seat.seatType,
            price: seat.price,
            status: seat.status,
            lockedBy: seat.lockedBy,
            lockedAt: new Date(seat.lockedAt).getTime(),
            concertId: seat.concert || concertId,
          }));

          setSelectedSeats(lockedSeatObjects);

          // Calculate total amount from locked seats
          const total = lockedSeatObjects.reduce((sum, seat) => sum + seat.price, 0);
          setTotalAmount(total);
        } else {
          // Timer expired, reset everything
          resetSeats();
        }
      }
    } else {
      // No locked seats found, ensure state is reset
      if (locked) {
        resetSeats();
      }
    }
  }, [seats, userId, concertId, setLocked, setTimer, setSelectedSeats, setTotalAmount, resetSeats, locked]);

  useEffect(() => {
    if (!locked || timer <= 0) return;

    const countdownInterval = setInterval(() => {
      setTimer((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          // Timer expired, unlock seats
          handleUnlockSeats();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [locked, timer, handleUnlockSeats, setTimer]);

  // Periodically sync timer with backend to handle page refresh and ensure accuracy
  useEffect(() => {
    if (!locked || !userId || !seats.length) return;

    const syncInterval = setInterval(() => {
      const lockedSeats = seats.filter(
        (s) => s.lockedBy === userId && s?.lockedAt && s.status === "RESERVED"
      );

      if (lockedSeats.length > 0) {
        const earliestLock = lockedSeats.reduce((earliest, seat) => {
          if (!earliest) return seat;
          const seatLockTime = new Date(seat.lockedAt).getTime();
          const earliestTime = new Date(earliest.lockedAt).getTime();
          return seatLockTime < earliestTime ? seat : earliest;
        }, null as ISeat | null);

        if (earliestLock?.lockedAt) {
          const lockedTime = new Date(earliestLock.lockedAt).getTime();
          const now = Date.now();
          const lockDuration = 10 * 60 * 1000;
          const remainingTime = Math.max(0, Math.floor((lockDuration - (now - lockedTime)) / 1000));

          if (remainingTime > 0) {
            // Only update if there's a significant difference (more than 2 seconds)
            // This prevents unnecessary updates while countdown is running
            if (Math.abs(timer - remainingTime) > 2) {
              setTimer(remainingTime);
            }
          } else {
            // Timer expired
            resetSeats();
          }
        }
      } else {
        // No locked seats found, reset
        resetSeats();
      }
    }, 10000); // Sync every 10 seconds to avoid too many API calls

    return () => clearInterval(syncInterval);
  }, [locked, userId, seats, timer, setTimer, resetSeats]);

  // ========== CONDITIONAL RETURNS (after all hooks) ==========
  
  // Show loading while checking authentication
  if (!isInitialized) {
    return <Loading />;
  }

  // Show auth required message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <Lock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-6">
              Please sign in or create an account to view and select seats.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/register">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Sign Up
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col min-h-screen p-6 gap-6 bg-gray-50">
      {/* Layout Toggle */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Select Your Seats</h1>
        <div className="flex gap-2">
          <Button
            variant={layoutType === "theater" ? "default" : "outline"}
            onClick={() => setLayoutType("theater")}
            className="flex items-center gap-2"
          >
            <Theater className="w-4 h-4" />
            Theater View
          </Button>
          <Button
            variant={layoutType === "arena" ? "default" : "outline"}
            onClick={() => setLayoutType("arena")}
            className="flex items-center gap-2"
          >
            <Circle className="w-4 h-4" />
            Arena View
          </Button>
        </div>
      </div>

      <div className="flex gap-6 flex-1">
        {/* Interactive Seat Map */}
        <Card className="flex-1 p-4">
          <CardContent className="p-0 h-full">
            <div className="h-[800px] w-full">
              <InteractiveSeatMap
                seats={seats}
                selectedSeats={selectedSeats}
                onSeatClick={toggleSeat}
                locked={locked}
                layoutType={layoutType}
              />
            </div>
          </CardContent>
        </Card>

        {/* Booking Panel */}
        <BookingPanel
          selectedSeats={selectedSeats}
          totalAmount={totalAmount}
          locked={locked}
          timer={timer}
          handleLockSeats={handleLockSeats}
          handleUnlockSeats={handleUnlockSeats}
        />
      </div>
    </div>
  );
};

export default SeatSelectionPage;


const SeatButton: React.FC<SeatButtonProps> = ({ seat, toggleSeat, selectedSeats, locked }) => {
  const isDisabled =
    seat.status === "RESERVED" || seat.status === "BOOKED" || locked;

  return (
    <button
      key={seat._id}
      onClick={() => !isDisabled && toggleSeat(seat)}
      className={`rounded-lg text-white flex items-center justify-center font-bold 
        ${getSeatColor(seat, selectedSeats)} 
        ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105 transition"}`}
    >
      {seat.seatNumber}
    </button>
  );
};



const SeatMap: React.FC<SeatMapProps> = ({ seats, toggleSeat, selectedSeats, locked }) => {
  const maxRow = Math.max(...seats.map((s) => parseInt(s.row)));
  const maxColumn = Math.max(...seats.map((s) => s.column));

  return (
    <Card className="flex-1 p-4">
      <CardHeader>
        <CardTitle>Choose Your Seats</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="grid gap-2 justify-center"
          style={{
            gridTemplateRows: `repeat(${maxRow}, 50px)`,
            gridTemplateColumns: `repeat(${maxColumn}, 50px)`,
          }}
        >
          {seats.map((seat) => (
            <SeatButton
              key={seat._id}
              seat={seat}
              toggleSeat={toggleSeat}
              selectedSeats={selectedSeats}
              locked={locked}
            />
          ))}
        </div>
        <Legend />
      </CardContent>
    </Card>
  );
};

const Legend: React.FC = () => {

  return (
    <div className="flex flex-col gap-1 mt-4 text-sm">
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-2">
          <span className={`w-4 h-4 inline-block ${item.color}`}></span>
          {item.label}
        </span>
      ))}
    </div>
  );
};