"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import { ISeat } from "@/lib/types";
import { getSeatColor } from "@/lib/utils";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InteractiveSeatMapProps {
  seats: ISeat[];
  selectedSeats: ISeat[];
  onSeatClick: (seat: ISeat) => void;
  locked: boolean;
  layoutType?: "arena" | "theater";
}

const InteractiveSeatMap: React.FC<InteractiveSeatMapProps> = ({
  seats,
  selectedSeats,
  onSeatClick,
  locked,
  layoutType = "theater",
}) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const dragInfoRef = useRef<{ dragging: boolean; moved: boolean }>({
    dragging: false,
    moved: false,
  });
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    seat: ISeat | null;
  } | null>(null);

  useEffect(() => {
    const handlePointerUp = () => {
      dragInfoRef.current.dragging = false;
      pointerRef.current = null;
      setTooltip((prev) => (prev ? { ...prev } : prev));
    };

    window.addEventListener("pointerup", handlePointerUp);
    return () => window.removeEventListener("pointerup", handlePointerUp);
  }, []);

  const seatPositions = useMemo(() => {
    if (layoutType === "arena") {
      return generateArenaLayout(seats);
    }
    return generateTheaterLayout(seats);
  }, [seats, layoutType]);

  // Generate arena-style circular layout
  function generateArenaLayout(seats: ISeat[]) {
    const centerX = 500;
    const centerY = 400;
    const positions: Map<string, { x: number; y: number }> = new Map();

    // Group seats by row and type
    const seatsByRow = seats.reduce((acc, seat) => {
      const key = `${seat.row}-${seat.seatType}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(seat);
      return acc;
    }, {} as Record<string, ISeat[]>);

    Object.entries(seatsByRow).forEach(([key, rowSeats], rowIndex) => {
      const radius = 150 + rowIndex * 40;
      const angleStep = (2 * Math.PI) / rowSeats.length;

      rowSeats.forEach((seat, index) => {
        const angle = index * angleStep;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        positions.set(seat._id, { x, y });
      });
    });

    return positions;
  }

  // Generate theater-style grid layout
  function generateTheaterLayout(seats: ISeat[]) {
    const positions: Map<string, { x: number; y: number }> = new Map();
    const seatSize = 35;
    const rowSpacing = 45;
    const colSpacing = 40;
    const startX = 100;
    const startY = 100;

    // Group by row
    const seatsByRow = seats.reduce((acc, seat) => {
      const row = seat.row;
      if (!acc[row]) acc[row] = [];
      acc[row].push(seat);
      return acc;
    }, {} as Record<string, ISeat[]>);

    // Sort rows
    const sortedRows = Object.keys(seatsByRow).sort((a, b) => {
      const numA = parseInt(a) || a.charCodeAt(0);
      const numB = parseInt(b) || b.charCodeAt(0);
      return numA - numB;
    });

    sortedRows.forEach((row, rowIndex) => {
      const rowSeats = seatsByRow[row].sort((a, b) => a.column - b.column);
      const rowY = startY + rowIndex * rowSpacing;

      // Center the row
      const totalWidth = rowSeats.length * colSpacing;
      const rowStartX = startX + (800 - totalWidth) / 2;

      rowSeats.forEach((seat, colIndex) => {
        const x = rowStartX + colIndex * colSpacing;
        const y = rowY;
        positions.set(seat._id, { x, y });
      });
    });

    return positions;
  }

  const clampScale = (value: number) => Math.max(0.5, Math.min(3, value));

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!viewportRef.current) return;

    const rect = viewportRef.current.getBoundingClientRect();
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;
    const scaleBy = 1.1;
    const newScale = clampScale(e.deltaY > 0 ? scale / scaleBy : scale * scaleBy);

    const mousePointTo = {
      x: (pointerX - position.x) / scale,
      y: (pointerY - position.y) / scale,
    };

    const newPos = {
      x: pointerX - mousePointTo.x * newScale,
      y: pointerY - mousePointTo.y * newScale,
    };

    setScale(newScale);
    setPosition(newPos);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragInfoRef.current.dragging = true;
    dragInfoRef.current.moved = false;
    pointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragInfoRef.current.dragging || !pointerRef.current) return;
    const dx = e.clientX - pointerRef.current.x;
    const dy = e.clientY - pointerRef.current.y;

    if (!dragInfoRef.current.moved && (Math.abs(dx) > 2 || Math.abs(dy) > 2)) {
      dragInfoRef.current.moved = true;
    }

    setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    pointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerLeave = () => {
    dragInfoRef.current.dragging = false;
    pointerRef.current = null;
  };

  const zoomIn = () => {
    const newScale = clampScale(scale * 1.2);
    setScale(newScale);
  };

  const zoomOut = () => {
    const newScale = clampScale(scale / 1.2);
    setScale(newScale);
  };

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const getSeatFill = (seat: ISeat) => {
    if (selectedSeats.find((s) => s._id === seat._id)) {
      return "#3B82F6"; // Blue for selected
    }
    if (seat.status === "RESERVED" || seat.status === "BOOKED") {
      return "#EF4444"; // Red for reserved
    }
    switch (seat.seatType) {
      case "platinum":
        return "#06B6D4"; // Cyan
      case "gold":
        return "#FBBF24"; // Yellow
      case "silver":
        return "#9CA3AF"; // Gray
      default:
        return "#10B981"; // Green
    }
  };


  const isSeatDisabled = (seat: ISeat) =>
    seat.status === "RESERVED" || seat.status === "BOOKED" || locked;

  const handleSeatClick = (seat: ISeat) => {
    if (dragInfoRef.current.moved) return;
    if (!isSeatDisabled(seat)) {
      onSeatClick(seat);
    }
  };

  return (
    <div className="relative w-full h-full bg-gray-50 rounded-lg border border-gray-200 overflow-hidden select-none">
      <div className="absolute top-4 right-4 z-20 flex gap-2 bg-white rounded-lg shadow-lg p-2">
        <Button variant="outline" size="sm" onClick={zoomIn} className="h-8 w-8 p-0" title="Zoom In">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={zoomOut} className="h-8 w-8 p-0" title="Zoom Out">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={resetView} className="h-8 w-8 p-0" title="Reset View">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {layoutType === "theater" && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white rounded-lg shadow-lg px-4 py-2 text-sm font-bold">
          STAGE
        </div>
      )}

      <div
        ref={viewportRef}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="relative w-full h-full cursor-grab active:cursor-grabbing"
      >
        <div
          className="absolute origin-top-left"
          style={{
            width: 1000,
            height: 800,
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          }}
        >
          {layoutType === "arena" ? (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
              <div className="w-32 h-32 rounded-full bg-gray-900 border-2 border-amber-400 flex items-center justify-center text-white font-bold">
                STAGE
              </div>
            </div>
          ) : (
            <div className="absolute left-[50px] top-[700px] w-[900px] h-[60px] rounded-md bg-gray-900 border-2 border-amber-400 flex items-center justify-center text-white font-bold">
              STAGE
            </div>
          )}

          {seats.map((seat) => {
            const pos = seatPositions.get(seat._id);
            if (!pos) return null;

            const isSelected = selectedSeats.some((s) => s._id === seat._id);
            const isDisabled = isSeatDisabled(seat);
            const fill = getSeatFill(seat);

            return (
              <button
                key={seat._id}
                type="button"
                className="absolute rounded-full border border-black flex items-center justify-center text-[10px] font-semibold transition-transform"
                style={{
                  left: pos.x,
                  top: pos.y,
                  width: layoutType === "arena" ? 24 : 28,
                  height: layoutType === "arena" ? 24 : 28,
                  transform: "translate(-50%, -50%)",
                  backgroundColor: fill,
                  opacity: isDisabled ? 0.5 : 1,
                  boxShadow: isSelected ? "0 0 0 2px #1E40AF" : undefined,
                  color: "#fff",
                  cursor: isDisabled ? "not-allowed" : "pointer",
                }}
                onPointerUp={() => {
                  if (dragInfoRef.current.dragging) {
                    dragInfoRef.current.dragging = false;
                    pointerRef.current = null;
                  }
                }}
                onClick={() => handleSeatClick(seat)}
                onMouseEnter={() =>
                  setTooltip({
                    x: pos.x,
                    y: pos.y - 20,
                    seat,
                  })
                }
                onMouseLeave={() => setTooltip(null)}
                disabled={isDisabled}
              >
                {scale > 1.2 ? seat.seatNumber : ""}
              </button>
            );
          })}

          {layoutType === "theater" &&
            scale > 0.8 &&
            Array.from(new Set(seats.map((s) => s.row))).map((row) => {
              const rowSeats = seats.filter((s) => s.row === row);
              if (rowSeats.length === 0) return null;
              const firstSeat = seatPositions.get(rowSeats[0]._id);
              if (!firstSeat) return null;
              return (
                <span
                  key={row}
                  className="absolute text-xs font-semibold text-gray-500"
                  style={{
                    left: firstSeat.x - 50,
                    top: firstSeat.y - 8,
                  }}
                >
                  Row {row}
                </span>
              );
            })}

          {tooltip && tooltip.seat && (
            <div
              className="absolute px-3 py-1 rounded bg-black/80 text-white text-xs font-semibold pointer-events-none"
              style={{
                left: tooltip.x,
                top: tooltip.y,
                transform: "translate(-50%, -100%)",
              }}
            >
              {tooltip.seat.seatNumber} - ₹{tooltip.seat.price} ({tooltip.seat.seatType})
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-20">
        <h4 className="text-sm font-semibold mb-2">Legend</h4>
        <div className="flex flex-col gap-1 text-xs">
          <LegendItem color="bg-blue-500" label="Selected" />
          <LegendItem color="bg-red-500" label="Reserved" />
          <LegendItem color="bg-cyan-300" label="Platinum" />
          <LegendItem color="bg-yellow-400" label="Gold" />
          <LegendItem color="bg-gray-400" label="Silver" />
          <LegendItem color="bg-green-500" label="Available" />
        </div>
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-2">
    <div className={`w-4 h-4 rounded-full border border-black ${color}`} />
    <span>{label}</span>
  </div>
);

export default InteractiveSeatMap;

