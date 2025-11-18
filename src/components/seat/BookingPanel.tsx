"use client";

import { SeatTimer } from "@/components/seat/SeatTimer";
import { Button } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useInitiateStripePayment } from "@/hooks/usePayment";
import { BookingPanelProps } from "@/lib/types";
import { useAuthStore } from "@/store/useAuth";
import { useUserStore } from "@/store/useUserAdminStore";
import { Separator } from "@radix-ui/react-separator";


const BookingPanel: React.FC<BookingPanelProps> = ({
  selectedSeats,
  totalAmount,
  locked,
  timer,
  handleLockSeats,
  handleUnlockSeats,
}) => {

  const { currentUser } = useAuthStore();
  console.log(currentUser);

  const { mutateAsync: stripePayment, isLoading } = useInitiateStripePayment();

  const handleConfirmPayment = () => {
    if (selectedSeats.length === 0) return;

    // Prepare payload for Stripe payment
    const payload = {
      amount: totalAmount,
      currency: "usd",
      productName: `Tickets: ${selectedSeats.map((s) => s.seatNumber).join(", ")}`,
      concertId: selectedSeats[0].concertId,
      seatIds: selectedSeats.map((s) => s._id),
      userId: currentUser?.id,
      email: currentUser?.email
    };

    stripePayment(payload);
  };


  return (
    <Card className="w-96 p-4">
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {selectedSeats.length === 0 ? (
          <p>No seats selected</p>
        ) : (
          <>
            {selectedSeats.map((seat) => (
              <div key={seat._id} className="flex justify-between">
                <span>
                  {seat.seatNumber} ({seat.seatType})
                </span>
                <span>₹{seat.price}</span>
              </div>
            ))}

            <Separator />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>

            {!locked ? (
              <Button className="mt-4" onClick={handleLockSeats}>
                Lock Seats 🔒
              </Button>
            ) : (
              <div className="flex flex-col gap-2">
                <SeatTimer seconds={timer} onExpire={handleUnlockSeats} />

                <Button variant="destructive" onClick={handleUnlockSeats}>
                  Release Seats 🔓
                </Button>

                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleConfirmPayment}
                  disabled={stripePayment?.isLoading}
                >
                  {stripePayment?.isLoading ? "Redirecting..." : "Confirm & Pay 💳"}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingPanel;
