import React, { useState, useRef, useEffect } from 'react';

// Gear type definitions
export interface Gear {
  id: number;
  type: string;
  color: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
  animationDelay: number;
  isDragging: boolean;
  isSnapped: boolean;
  dragOffset: { x: number; y: number };
}

// Component props interface
interface FloatingGearsProps {
  onGearSnapped?: (gearId: number, gearType: string, slotIndex: number) => void;
}

// Gear configurations
const gearConfigs = [
  { type: 'spur', color: 'hsl(158, 64%, 25%)', count: 3 }, // dark emerald green
  { type: 'bevel', color: 'hsl(0, 0%, 83%)', count: 3 }, // light grey
  { type: 'internal', color: 'hsl(355, 78%, 35%)', count: 2 }, // dark crimson red
  { type: 'worm', color: 'hsl(200, 80%, 60%)', count: 2 }, // sky blue
];

// SVG gear rendering function
const renderGear = (gear: Gear) => {
  const { type, color, size } = gear;

  const commonProps = {
    width: size,
    height: size,
    viewBox: "0 0 100 100",
    fill: color,
    className: "drop-shadow-lg"
  };

  switch (type) {
    case 'spur':
      return (
        <svg {...commonProps}>
          <circle cx="50" cy="50" r="35" fill={color} />
          {[...Array(12)].map((_, i) => (
            <rect
              key={i}
              x="48"
              y="10"
              width="4"
              height="10"
              fill={color}
              transform={`rotate(${i * 30} 50 50)`}
            />
          ))}
          <circle cx="50" cy="50" r="8" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2" />
        </svg>
      );

    case 'bevel':
      return (
        <svg {...commonProps}>
          <polygon
            points="50,15 85,50 50,85 15,50"
            fill={color}
            stroke="rgba(0,0,0,0.2)"
            strokeWidth="2"
          />
          <circle cx="50" cy="50" r="8" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2" />
        </svg>
      );

    case 'internal':
      return (
        <svg {...commonProps}>
          <circle cx="50" cy="50" r="40" fill={color} />
          <circle cx="50" cy="50" r="25" fill="rgba(255,255,255,0.1)" />
          {[...Array(16)].map((_, i) => (
            <rect
              key={i}
              x="48"
              y="25"
              width="4"
              height="8"
              fill="rgba(0,0,0,0.3)"
              transform={`rotate(${i * 22.5} 50 50)`}
            />
          ))}
          <circle cx="50" cy="50" r="8" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2" />
        </svg>
      );

    case 'worm':
      return (
        <svg {...commonProps}>
          <ellipse cx="50" cy="50" rx="35" ry="15" fill={color} />
          {[...Array(8)].map((_, i) => (
            <ellipse
              key={i}
              cx="50"
              cy="50"
              rx="35"
              ry="3"
              fill="rgba(0,0,0,0.2)"
              transform={`rotate(${i * 22.5} 50 50)`}
            />
          ))}
          <circle cx="50" cy="50" r="6" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2" />
        </svg>
      );

    default:
      return (
        <svg {...commonProps}>
          <circle cx="50" cy="50" r="35" fill={color} />
        </svg>
      );
  }
};

export const FloatingGears = ({ onGearSnapped }: FloatingGearsProps) => {
  const [gears, setGears] = useState<Gear[]>([]);
  const [draggedGear, setDraggedGear] = useState<number | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Spawn gears
  useEffect(() => {
    const newGears: Gear[] = [];
    let id = 0;
    gearConfigs.forEach((cfg) => {
      for (let i = 0; i < cfg.count; i++) {
        newGears.push({
          id: id++,
          type: cfg.type,
          color: cfg.color,
          x: Math.random() * 85 + 7.5,
          y: Math.random() * 85 + 7.5,
          size: Math.random() * 25 + 40,
          rotation: Math.random() * 360,
          animationDelay: Math.random() * 10,
          isDragging: false,
          isSnapped: false,
          dragOffset: { x: 0, y: 0 },
        });
      }
    });
    setGears(newGears);
  }, []);

  // Continuous rotation animation
  useEffect(() => {
    const interval = setInterval(() => {
      setGears((prev) =>
        prev.map((gear) => ({
          ...gear,
          rotation: gear.isDragging ? gear.rotation : (gear.rotation + 0.5) % 360,
        }))
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Drag start
  const handleMouseDown = (e: React.MouseEvent, gearId: number) => {
    e.preventDefault();
    const gear = gears.find((g) => g.id === gearId);
    if (!gear || gear.isSnapped) return;
    
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    dragOffset.current = { 
      x: e.clientX - rect.left, 
      y: e.clientY - rect.top 
    };
    
    setDraggedGear(gearId);
    setGears((prev) =>
      prev.map((g) => (g.id === gearId ? { ...g, isDragging: true } : g))
    );
    document.body.style.cursor = "grabbing";
  };

  // Drag move
  const handleMouseMove = (e: MouseEvent) => {
    if (draggedGear === null || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newX = ((e.clientX - dragOffset.current.x) / rect.width) * 100;
    const newY = ((e.clientY - dragOffset.current.y) / rect.height) * 100;
    setGears((prev) =>
      prev.map((g) =>
        g.id === draggedGear ? { ...g, x: newX, y: newY } : g
      )
    );
  };

  // Drag end (snap check)
  const handleMouseUp = (e: MouseEvent) => {
    if (draggedGear === null) return;
    document.body.style.cursor = "";

    const gear = gears.find((g) => g.id === draggedGear);
    if (!gear) return;

    const slots = document.querySelectorAll(".gear-slot");
    let snapped = false;

    slots.forEach((slot, index) => {
      const rect = slot.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);

      if (dist < 80 && slot.getAttribute("data-gear-type") === gear.type) {
        // ✅ Correct slot
        onGearSnapped?.(gear.id, gear.type, index);
        setGears((prev) =>
          prev.map((g) =>
            g.id === gear.id ? { ...g, isSnapped: true, isDragging: false } : g
          )
        );
        snapped = true;
      }
    });

    if (!snapped) {
      setGears((prev) =>
        prev.map((g) =>
          g.id === draggedGear ? { ...g, isDragging: false } : g
        )
      );
    }
    setDraggedGear(null);
  };

  // Attach listeners
  useEffect(() => {
    if (draggedGear !== null) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [draggedGear, gears]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0">
      {gears
        .filter((g) => !g.isSnapped)
        .map((gear) => (
          <div
            key={gear.id}
            className={`absolute pointer-events-auto transition-all duration-300 ease-out cursor-grab hover:cursor-grab active:cursor-grabbing ${
              gear.isDragging ? "z-50 scale-110" : "hover:scale-105"
            }`}
            style={{
              left: `${gear.x}%`,
              top: `${gear.y}%`,
              width: gear.size,
              height: gear.size,
              transform: `translate(-50%, -50%) rotate(${gear.rotation}deg)`,
              filter: gear.isDragging ? 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' : 'none',
            }}
            data-gear-type={gear.type}
            onMouseDown={(e) => handleMouseDown(e, gear.id)}
          >
            {renderGear(gear)}
          </div>
        ))}
    </div>
  );
};