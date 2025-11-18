"use client"

import React, { useState } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react'; // Using lucide-react for icons

// Mock data to simulate a successful and confirmed booking immediately
const initialBookingData = {
    id: 'TICKET-ABC-12345',
    productName: 'The Ethereal Symphony Concert',
    amount: 12500, // $125.00 (in cents)
};

// The main application component
const App = () => {
    // State is initialized immediately with the successful booking data
    const [booking, setBooking] = useState(initialBookingData); 

    // --- 3. UI Rendering ---

    const renderContent = () => {
        // Since we are simulating immediate success, we only render the final state.
        if (booking) {
            return (
                <div className="flex flex-col items-center p-8">
                    {/* Final Success State - Animated Checkmark */}
                    <CheckCircle className="w-20 h-20 text-green-500 stroke-[1.5px] animate-scale-in" />
                    
                    <h2 className="text-4xl font-extrabold mt-8 text-gray-900 tracking-tight">
                        Ticket Confirmed!
                    </h2>
                    <p className="text-green-600 text-lg font-medium mt-2">
                        Booking ID: <span className="text-gray-900 font-bold">{booking.id}</span>
                    </p>
                    
                    <div className="mt-8 w-full max-w-xs space-y-3 border-t border-gray-200 pt-4">
                        <div className="flex justify-between text-gray-600">
                            <span>Concert/Event</span>
                            <span className="font-medium text-gray-800">{booking.productName}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Total Charged</span>
                            <span className="font-bold text-gray-900 text-xl">${(booking.amount / 100).toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="mt-10 pt-4 border-t border-gray-200 text-center">
                        <p className="text-lg font-semibold text-gray-700">
                            Ticket Generated Successfully!
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            You can check all details in your **Profile/Tickets** section.
                        </p>
                    </div>

                    {/* Call-to-action button */}
                    <button
                        // Use a custom modal or routing logic in a real app, not alert()
                        onClick={() => alert('Navigating to your Profile/Tickets page (Simulated).')}
                        className="mt-8 flex items-center justify-center w-full max-w-xs px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition duration-150 transform hover:scale-[1.02] font-semibold text-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
                    >
                        Go to My Tickets
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </button>
                </div>
            );
        }
        
        return null; // Should not happen with mock data, but good practice
    };

    return (
        <>
            {/* Tailwind CSS Script */}
            <script src="https://cdn.tailwindcss.com"></script>
            {/* Custom Styles for the 'Apple Pay' look and feel and animations */}
            <style>
                {`
                @keyframes scaleIn {
                    0% { transform: scale(0.5); opacity: 0; }
                    80% { transform: scale(1.1); }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scaleIn 0.5s ease-out forwards;
                }
                /* Removing pulse-check animation as it is now always in the final state */
                `}
            </style>

            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 transform transition duration-500 hover:shadow-3xl">
                    {renderContent()}
                </div>
            </div>
        </>
    );
};

export default App;