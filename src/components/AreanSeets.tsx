import React, { useState, useRef, useMemo } from "react";
import { Stage, Layer, Circle, Text, Group } from "react-konva";

interface Seat {
  id: number;
  x: number;
  y: number;
  tier: number;
  status: "available" | "reserved";
}

const tiersConfig = [
  { name: "VIP", color: "#FFD700", radiusOffset: 40, price: 150 },
  { name: "Premium", color: "#1E90FF", radiusOffset: 80, price: 100 },
  { name: "Standard", color: "#32CD32", radiusOffset: 120, price: 75 },
  { name: "Economy", color: "#FF6347", radiusOffset: 160, price: 50 },
  { name: "Balcony", color: "#8A2BE2", radiusOffset: 200, price: 30 },
];

const generateArenaSeats = (totalSeats: number): Seat[] => {
  const seats: Seat[] = [];
  const arenaCenter = { x: 400, y: 300 };
  let seatId = 1;

  tiersConfig.forEach((tier, tierIndex) => {
    // Generate fewer seats per tier for better visual distinction in a small demo
    const seatsInTier = Math.ceil(totalSeats / tiersConfig.length / 2); // Reduced density
    for (let i = 0; i < seatsInTier; i++) {
      const angle = (i / seatsInTier) * 2 * Math.PI; // full circle
      // Add small randomness to x/y to prevent perfect overlap at large radius
      const x = arenaCenter.x + tier.radiusOffset * Math.cos(angle) + (Math.random() - 0.5) * 5; 
      const y = arenaCenter.y + tier.radiusOffset * Math.sin(angle) + (Math.random() - 0.5) * 5;
      const status = Math.random() < 0.15 ? "reserved" : "available";
      seats.push({ id: seatId, x, y, tier: tierIndex, status });
      seatId++;
    }
  });

  return seats;
};

const TicketmasterArena = () => {
  const [seats, setSeats] = useState<Seat[]>(generateArenaSeats(250));
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const stageRef = useRef<any>(null);
  const seatRadius = 10; // Slightly smaller for better visual separation

  const toggleSeat = (id: number) => {
    const seat = seats.find((s) => s.id === id);
    if (!seat || seat.status === "reserved") return;
    
    // Limit selection to 10 seats (optional business rule)
    if (!selectedSeats.includes(id) && selectedSeats.length >= 10) {
        alert("Maximum 10 seats allowed per order.");
        return;
    }

    setSelectedSeats((prev) =>
      prev.includes(id) ? prev.filter((seatId) => seatId !== id) : [...prev, id]
    );
  };

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    const scaleBy = 1.05;
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    stage.scale({ x: newScale, y: newScale });

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    stage.position(newPos);
    stage.batchDraw();
  };

  // --- Cart Calculation Logic ---
  const selectedSeatDetails = useMemo(() => {
    const details = seats
      .filter((seat) => selectedSeats.includes(seat.id))
      .map((seat) => {
        const tierInfo = tiersConfig[seat.tier];
        return {
          id: seat.id,
          tierName: tierInfo.name,
          price: tierInfo.price,
        };
      });
    return details;
  }, [seats, selectedSeats]);

  const subtotal = selectedSeatDetails.reduce((sum, seat) => sum + seat.price, 0);
  const fee = selectedSeats.length > 0 ? 5.0 * selectedSeats.length : 0; // Example fee
  const total = subtotal + fee;
  // ------------------------------

  return (
    <div style={{ display: "flex", fontFamily: 'Arial, sans-serif', maxWidth: 1200, margin: '0 auto' }}>
      
      {/* 1. Arena Stage */}
      <div style={{ flex: '2', minWidth: 800 }}>
        <h2>Interactive Arena Map</h2>
        <Stage
          width={800}
          height={600}
          ref={stageRef}
          onWheel={handleWheel}
          draggable
          style={{ border: "2px solid #ccc", cursor: "grab", backgroundColor: '#f9f9f9' }}
        >
          <Layer>
            {/* Center Stage */}
            <Circle x={400} y={300} radius={50} fill="black" stroke="gold" strokeWidth={4} />
            <Text x={375} y={295} text="STAGE" fontSize={14} fill="white" />

            {/* Seats */}
            {seats.map((seat) => {
              const tierColor = tiersConfig[seat.tier].color;
              let fill = seat.status === "reserved" ? "lightgray" : tierColor;
              if (selectedSeats.includes(seat.id)) fill = "orange";

              // Get actual position from the stage to display tooltip correctly relative to viewport
              const seatPos = stageRef.current ? stageRef.current.absolutePosition() : { x: 0, y: 0 };
              const currentScale = stageRef.current ? stageRef.current.scaleX() : 1;

              const tierName = tiersConfig[seat.tier].name;
              const price = tiersConfig[seat.tier].price;

              return (
                <Group key={seat.id}>
                  <Circle
                    x={seat.x}
                    y={seat.y}
                    radius={seatRadius}
                    fill={fill}
                    stroke="black"
                    strokeWidth={1}
                    onClick={() => toggleSeat(seat.id)}
                    onMouseEnter={(e) => {
                      setTooltip({ 
                        x: seat.x, 
                        y: seat.y - 20, 
                        text: `${tierName} | Seat ${seat.id} | $${price}` 
                      });
                      e.target.getStage().container().style.cursor = "pointer";
                    }}
                    onMouseLeave={(e) => {
                      setTooltip(null);
                      e.target.getStage().container().style.cursor = selectedSeats.length === 0 ? "grab" : "grab";
                    }}
                  />
                  {/* Optionally show seat ID only when zoomed in */}
                  {/* <Text
                    x={seat.x - 5}
                    y={seat.y - 5}
                    text={seat.id.toString()}
                    fontSize={8}
                    fill="white"
                  /> */}
                </Group>
              );
            })}

            {/* Tooltip (Fixed position in the Layer) */}
            {tooltip && (
              <Text
                x={tooltip.x}
                y={tooltip.y}
                text={tooltip.text}
                fontSize={14}
                fill="black"
                padding={5}
                fillPriority='color'
                fontStyle="bold"
                // Adding a white background for visibility
                // Konva doesn't have a simple background-color property like HTML, so we use a Rect or complex text styling
              />
            )}
          </Layer>
        </Stage>
      </div>

      {/* 2. Side Panel (Legend and Cart) */}
      <div style={{ flex: '1', marginLeft: 20, padding: 15, border: '1px solid #ddd', borderRadius: 8, backgroundColor: '#fff' }}>
        
        {/* Legend */}
        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: 5 }}>Seat Status Legend</h3>
        {tiersConfig.map((tier) => (
          <div key={tier.name} style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
            <div
              style={{
                width: 20,
                height: 20,
                backgroundColor: tier.color,
                marginRight: 8,
                border: "1px solid black",
                borderRadius: 4
              }}
            />
            <span>{tier.name} (${tier.price})</span>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: "gray",
              marginRight: 8,
              border: "1px solid black",
              borderRadius: 4
            }}
          />
          <span>Reserved (Unavailable)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 15 }}>
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: "orange",
              marginRight: 8,
              border: "1px solid black",
              borderRadius: 4
            }}
          />
          <span>Selected</span>
        </div>
        
        {/* --- Shopping Cart --- */}
        <h3 style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>Your Cart ({selectedSeats.length} Seats)</h3>
        
        {selectedSeatDetails.length === 0 ? (
          <p style={{ color: '#888' }}>Please select seats on the map.</p>
        ) : (
          <>
            {/* List of Selected Seats */}
            <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 10 }}>
              {selectedSeatDetails.map((detail) => (
                <div 
                  key={detail.id} 
                  style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px dotted #eee' }}
                >
                  <span style={{ fontWeight: 'bold' }}>Seat {detail.id}</span>
                  <span>{detail.tierName}</span>
                  <span>${detail.price.toFixed(2)}</span>
                  <button 
                    onClick={() => toggleSeat(detail.id)} 
                    style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', marginLeft: 10 }}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div style={{ borderTop: '2px solid #ccc', paddingTop: 10 }}>
              <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </p>
              <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Booking Fee:</span>
                <span>${fee.toFixed(2)}</span>
              </p>
              <h4 style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ccc', paddingTop: 5 }}>
                <span>Total:</span>
                <span style={{ color: 'green', fontWeight: 'bold' }}>${total.toFixed(2)}</span>
              </h4>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => alert(`Proceeding to checkout for $${total.toFixed(2)}`)}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'darkgreen',
                color: 'white',
                border: 'none',
                borderRadius: 5,
                marginTop: 15,
                fontSize: 16,
                cursor: 'pointer'
              }}
            >
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TicketmasterArena;