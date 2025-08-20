import { useEffect, useState } from 'react';

interface Gear {
  id: number;
  x: number;
  y: number;
  size: number;
  type: 'spur' | 'bevel' | 'internal' | 'worm';
  color: string;
  rotation: number;
  animationDelay: number;
  isDragging: boolean;
  dragOffset: { x: number; y: number };
}

const gearTypes = [
  { type: 'spur' as const, color: 'gear-emerald' },
  { type: 'bevel' as const, color: 'gear-grey' },
  { type: 'internal' as const, color: 'gear-crimson' },
  { type: 'worm' as const, color: 'gear-sky-blue' }
];

interface FloatingGearsProps {
  onGearPlaced?: (gearType: string) => void;
}

export const FloatingGears = ({ onGearPlaced }: FloatingGearsProps) => {
  const [gears, setGears] = useState<Gear[]>([]);
  const [draggedGear, setDraggedGear] = useState<number | null>(null);

  useEffect(() => {
    const generateGears = () => {
      const newGears: Gear[] = [];
      
      for (let i = 0; i < 12; i++) {
        const gearConfig = gearTypes[Math.floor(Math.random() * gearTypes.length)];
        newGears.push({
          id: i,
          x: Math.random() * 90 + 5, // Keep within bounds
          y: Math.random() * 90 + 5,
          size: Math.random() * 40 + 30,
          type: gearConfig.type,
          color: gearConfig.color,
          rotation: Math.random() * 360,
          animationDelay: Math.random() * 6,
          isDragging: false,
          dragOffset: { x: 0, y: 0 }
        });
      }
      
      setGears(newGears);
    };

    generateGears();
  }, []);

  const handleMouseDown = (e: React.MouseEvent, gearId: number) => {
    e.preventDefault();
    const gear = gears.find(g => g.id === gearId);
    if (!gear) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    setDraggedGear(gearId);
    setGears(prev => prev.map(g => 
      g.id === gearId 
        ? { ...g, isDragging: true, dragOffset: { x: offsetX, y: offsetY } }
        : g
    ));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedGear === null) return;

    const containerRect = e.currentTarget.getBoundingClientRect();
    const newX = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    const newY = ((e.clientY - containerRect.top) / containerRect.height) * 100;

    setGears(prev => prev.map(g => 
      g.id === draggedGear 
        ? { ...g, x: Math.max(0, Math.min(100, newX)), y: Math.max(0, Math.min(100, newY)) }
        : g
    ));
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (draggedGear !== null) {
      // Check if we're over a gear slot
      const slotElements = document.querySelectorAll('.gear-slot');
      let droppedOnSlot = false;
      
      slotElements.forEach((slot, index) => {
        const rect = slot.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          // Trigger slot click
          const event = new MouseEvent('click', {
            clientX: e.clientX,
            clientY: e.clientY,
            bubbles: true
          });
          slot.dispatchEvent(event);
          droppedOnSlot = true;
        }
      });

      setGears(prev => prev.map(g => 
        g.id === draggedGear 
          ? { ...g, isDragging: false, dragOffset: { x: 0, y: 0 } }
          : g
      ));
      setDraggedGear(null);
    }
  };

  const removeGear = (gearId: number) => {
    setGears(prev => prev.filter(g => g.id !== gearId));
  };

  // Expose removeGear function globally for ProjectsSection to use
  useEffect(() => {
    (window as any).removeFloatingGear = removeGear;
    return () => {
      delete (window as any).removeFloatingGear;
    };
  }, []);

  const renderGear = (gear: Gear) => {
    switch (gear.type) {
      case 'spur':
        return (
          <svg viewBox="0 0 100 100" className={`fill-current text-${gear.color}`}>
            <circle cx="50" cy="50" r="20" fill="currentColor" />
            {Array.from({ length: 12 }).map((_, i) => (
              <rect
                key={i}
                x="48"
                y="10"
                width="4"
                height="15"
                fill="currentColor"
                transform={`rotate(${i * 30} 50 50)`}
              />
            ))}
          </svg>
        );
      case 'bevel':
        return (
          <svg viewBox="0 0 100 100" className={`fill-current text-${gear.color}`}>
            <circle cx="50" cy="50" r="18" fill="currentColor" />
            {Array.from({ length: 8 }).map((_, i) => (
              <polygon
                key={i}
                points="50,15 55,30 45,30"
                fill="currentColor"
                transform={`rotate(${i * 45} 50 50)`}
              />
            ))}
          </svg>
        );
      case 'internal':
        return (
          <svg viewBox="0 0 100 100" className={`fill-current text-${gear.color}`}>
            <circle cx="50" cy="50" r="25" fill="currentColor" />
            <circle cx="50" cy="50" r="15" fill="hsl(var(--background))" />
            {Array.from({ length: 16 }).map((_, i) => (
              <rect
                key={i}
                x="48"
                y="25"
                width="4"
                height="8"
                fill="hsl(var(--background))"
                transform={`rotate(${i * 22.5} 50 50)`}
              />
            ))}
          </svg>
        );
      case 'worm':
        return (
          <svg viewBox="0 0 100 100" className={`fill-current text-${gear.color}`}>
            <ellipse cx="50" cy="50" rx="30" ry="15" fill="currentColor" />
            {Array.from({ length: 6 }).map((_, i) => (
              <line
                key={i}
                x1="20"
                y1="50"
                x2="80"
                y2="50"
                stroke="hsl(var(--background))"
                strokeWidth="2"
                transform={`rotate(${i * 30} 50 50)`}
              />
            ))}
          </svg>
        );
    }
  };

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {gears.map((gear) => (
        <div
          key={gear.id}
          className={`absolute gear-float opacity-70 transition-transform duration-200 ${
            gear.isDragging ? 'gear-dragging pointer-events-auto' : ''
          }`}
          style={{
            left: `${gear.x}%`,
            top: `${gear.y}%`,
            animationDelay: gear.isDragging ? '0s' : `${gear.animationDelay}s`,
            animationPlayState: gear.isDragging ? 'paused' : 'running',
            transform: `translate(-50%, -50%) rotate(${gear.rotation}deg) ${gear.isDragging ? 'scale(1.1)' : ''}`,
            cursor: gear.isDragging ? 'grabbing' : 'grab'
          }}
          onMouseDown={(e) => handleMouseDown(e, gear.id)}
        >
          <div 
            className="pointer-events-auto"
            style={{ 
              width: gear.size, 
              height: gear.size,
              pointerEvents: gear.isDragging ? 'none' : 'auto'
            }}
            data-gear-type={gear.type}
            data-gear-id={gear.id}
          >
            {renderGear(gear)}
          </div>
        </div>
      ))}
    </div>
  );
};