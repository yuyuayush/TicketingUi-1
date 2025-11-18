"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import { Stage, Layer, Circle, Text, Group, Rect, Line } from "react-konva";
import { ISeat } from "@/lib/types";
import { getSeatColor } from "@/lib/utils";
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from "lucide-react";
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
  const stageRef = useRef<any>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    seat: ISeat | null;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Calculate seat positions based on layout type
  const seatPositions = useMemo(() => {
    if (layoutType === "arena") {
      return generateArenaLayout(seats);
    } else {
      return generateTheaterLayout(seats);
    }
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

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const scaleBy = 1.1;
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    const clampedScale = Math.max(0.5, Math.min(3, newScale));

    stage.scale({ x: clampedScale, y: clampedScale });

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    };

    stage.position(newPos);
    stage.batchDraw();
    setScale(clampedScale);
    setPosition(newPos);
  };

  const handleDragEnd = (e: any) => {
    const stage = e.target.getStage();
    if (stage) {
      setPosition({ x: stage.x(), y: stage.y() });
    }
  };

  const zoomIn = () => {
    const stage = stageRef.current;
    if (!stage) return;
    const newScale = Math.min(3, scale * 1.2);
    stage.scale({ x: newScale, y: newScale });
    stage.batchDraw();
    setScale(newScale);
  };

  const zoomOut = () => {
    const stage = stageRef.current;
    if (!stage) return;
    const newScale = Math.max(0.5, scale / 1.2);
    stage.scale({ x: newScale, y: newScale });
    stage.batchDraw();
    setScale(newScale);
  };

  const resetView = () => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.scale({ x: 1, y: 1 });
    stage.position({ x: 0, y: 0 });
    stage.batchDraw();
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

  const isSeatDisabled = (seat: ISeat) => {
    return seat.status === "RESERVED" || seat.status === "BOOKED" || locked;
  };

  return (
    <div className="relative w-full h-full bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2 bg-white rounded-lg shadow-lg p-2">
        <Button
          variant="outline"
          size="sm"
          onClick={zoomIn}
          className="h-8 w-8 p-0"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={zoomOut}
          className="h-8 w-8 p-0"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={resetView}
          className="h-8 w-8 p-0"
          title="Reset View"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Stage indicator for theater layout */}
      {layoutType === "theater" && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-white rounded-lg shadow-lg px-4 py-2">
          <span className="text-sm font-bold">STAGE</span>
        </div>
      )}

      <Stage
        width={1000}
        height={800}
        ref={stageRef}
        onWheel={handleWheel}
        draggable
        onDragEnd={handleDragEnd}
        onMouseDown={() => setIsDragging(false)}
        onMouseMove={() => setIsDragging(true)}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <Layer>
          {/* Stage/Center for arena layout */}
          {layoutType === "arena" && (
            <Group>
              <Circle
                x={500}
                y={400}
                radius={60}
                fill="#1F2937"
                stroke="#FBBF24"
                strokeWidth={3}
              />
              <Text
                x={440}
                y={390}
                text="STAGE"
                fontSize={18}
                fill="#FFFFFF"
                fontStyle="bold"
              />
            </Group>
          )}

          {/* Stage for theater layout */}
          {layoutType === "theater" && (
            <Group>
              <Rect
                x={50}
                y={700}
                width={900}
                height={60}
                fill="#1F2937"
                stroke="#FBBF24"
                strokeWidth={3}
                cornerRadius={5}
              />
              <Text
                x={400}
                y={720}
                text="STAGE"
                fontSize={20}
                fill="#FFFFFF"
                fontStyle="bold"
                align="center"
              />
            </Group>
          )}

          {/* Seats */}
          {seats.map((seat) => {
            const pos = seatPositions.get(seat._id);
            if (!pos) return null;

            const isSelected = selectedSeats.find((s) => s._id === seat._id);
            const isDisabled = isSeatDisabled(seat);
            const fill = getSeatFill(seat);

            return (
              <Group key={seat._id}>
                <Circle
                  x={pos.x}
                  y={pos.y}
                  radius={layoutType === "arena" ? 12 : 14}
                  fill={fill}
                  stroke={isSelected ? "#1E40AF" : "#000000"}
                  strokeWidth={isSelected ? 2 : 1}
                  opacity={isDisabled ? 0.5 : 1}
                  onClick={() => !isDisabled && onSeatClick(seat)}
                  onTap={() => !isDisabled && onSeatClick(seat)}
                  onMouseEnter={(e) => {
                    if (!isDisabled) {
                      const stage = e.target.getStage();
                      if (stage) {
                        const container = stage.container();
                        container.style.cursor = "pointer";
                      }
                      setTooltip({
                        x: pos.x,
                        y: pos.y - 25,
                        seat,
                      });
                    }
                  }}
                  onMouseLeave={(e) => {
                    const stage = e.target.getStage();
                    if (stage) {
                      const container = stage.container();
                      container.style.cursor = "grab";
                    }
                    setTooltip(null);
                  }}
                />
                {/* Seat number label (only when zoomed in) */}
                {scale > 1.2 && (
                  <Text
                    x={pos.x - 10}
                    y={pos.y - 5}
                    text={seat.seatNumber}
                    fontSize={10}
                    fill="#FFFFFF"
                    fontStyle="bold"
                    align="center"
                  />
                )}
              </Group>
            );
          })}

          {/* Tooltip */}
          {tooltip && tooltip.seat && (
            <Group>
              <Rect
                x={tooltip.x - 60}
                y={tooltip.y - 30}
                width={120}
                height={25}
                fill="rgba(0, 0, 0, 0.8)"
                cornerRadius={4}
              />
              <Text
                x={tooltip.x}
                y={tooltip.y - 15}
                text={`${tooltip.seat.seatNumber} - ₹${tooltip.seat.price} (${tooltip.seat.seatType})`}
                fontSize={12}
                fill="#FFFFFF"
                align="center"
                fontStyle="bold"
              />
            </Group>
          )}

          {/* Row labels for theater layout */}
          {layoutType === "theater" && scale > 0.8 && (
            <>
              {Array.from(new Set(seats.map((s) => s.row))).map((row) => {
                const rowSeats = seats.filter((s) => s.row === row);
                if (rowSeats.length === 0) return null;
                const firstSeat = rowSeats[0];
                const pos = seatPositions.get(firstSeat._id);
                if (!pos) return null;
                return (
                  <Text
                    key={row}
                    x={pos.x - 50}
                    y={pos.y}
                    text={`Row ${row}`}
                    fontSize={12}
                    fill="#6B7280"
                    fontStyle="bold"
                    align="right"
                  />
                );
              })}
            </>
          )}
        </Layer>
      </Stage>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-10">
        <h4 className="text-sm font-semibold mb-2">Legend</h4>
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 border border-black"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 border border-black"></div>
            <span>Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-cyan-300 border border-black"></div>
            <span>Platinum</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-400 border border-black"></div>
            <span>Gold</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-400 border border-black"></div>
            <span>Silver</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 border border-black"></div>
            <span>Available</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveSeatMap;

