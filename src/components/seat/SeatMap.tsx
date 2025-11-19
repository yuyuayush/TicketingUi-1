"use client";

import { SeatsioSeatingChart } from "@seatsio/seatsio-react";

export default function SeatViewer() {
    return (
        <div className="w-full h-screen">

            <SeatsioSeatingChart
                workspaceKey="f416f09a-4b62-47c3-986b-ed6248f5a62c"
                // publicKey="f416f09a-4b62-47c3-986b-ed6248f5a62c"
                // chartKey="860d8ffb-da48-1149-fb8f-7fc2afac1c19"
                event="4425ae29-ea4d-4f26-b487-77aa3819313b"
                region="eu"       // or "na" depending on your account server
            />
        </div>
    );
}
