import { useEffect, useState, useCallback, useRef } from 'react';

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
  isSnapped: boolean;
}

const gearConfigs = [
  { type: 'spur' as const, color: 'gear-emerald', count: 3 },
  { type: 'bevel' as const, color: 'gear-grey', count: 3 },
  { type: 'internal' as const, color: 'gear-crimson', count: 3 },
  { type: 'worm' as const, color: 'gear-sky-blue', count: 3 }
];

interface FloatingGearsProps {
  onGearSnapped?: (gearId: number, gearType: string, slotIndex: number) => void;
}

export const FloatingGears = ({ onGearSnapped }: FloatingGearsProps) => {
  const [gears, setGears] = useState<Gear[]>([]);
  const [draggedGear, setDraggedGear] = useState<number | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate gears on mount
  useEffect(() => {
    const newGears: Gear[] = [];
    let id = 0;
    
    gearConfigs.forEach((config) => {
      for (let i = 0; i < config.count; i++) {
        newGears.push({
          id: id++,
          x: Math.random() * 85 + 7.5, // Keep gears within bounds
          y: Math.random() * 85 + 7.5,
          size: Math.random() * 25 + 40, // 40-65px
          type: config.type,
          color: config.color,
          rotation: Math.random() * 360,
          animationDelay: Math.random() * 10,
          isDragging: false,
          isSnapped: false
        });
      }
    });
    
    setGears(newGears);
  }, []);

  // Handle mouse down - start dragging
  const handleMouseDown = useCallback((e: React.MouseEvent, gearId: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    const gear = gears.find(g => g.id === gearId);
    if (!gear || gear.isSnapped) return;

    const rect = e.currentTarget.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2
    };

    setDraggedGear(gearId);
    setGears(prev => prev.map(g => 
      g.id === gearId ? { ...g, isDragging: true } : g
    ));

    document.body.style.cursor = 'grabbing';
  }, [gears]);

  // Handle mouse move - update gear position
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (draggedGear === null || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newX = ((e.clientX - containerRect.left - dragOffset.current.x) / containerRect.width) * 100;
    const newY = ((e.clientY - containerRect.top - dragOffset.current.y) / containerRect.height) * 100;

    setGears(prev => prev.map(g => 
      g.id === draggedGear 
        ? { 
            ...g, 
            x: Math.max(0, Math.min(100, newX)), 
            y: Math.max(0, Math.min(100, newY)) 
          }
        : g
    ));
  }, [draggedGear]);

  // Handle mouse up - check for slot snapping
  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (draggedGear === null) return;

    document.body.style.cursor = '';
    
    const draggedGearData = gears.find(g => g.id === draggedGear);
    if (!draggedGearData) return;

    // Check for slot collision
    const slots = document.querySelectorAll('.gear-slot');
    let snappedToSlot = false;
    
    slots.forEach((slot, index) => {
      const rect = slot.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      );
      
      // Snap distance threshold
      if (distance < 80) {
        const slotType = slot.getAttribute('data-gear-type');
        if (slotType === draggedGearData.type) {
          // Correct gear type - snap to slot
          setGears(prev => prev.map(g => 
            g.id === draggedGear 
              ? { ...g, isDragging: false, isSnapped: true }
              : g
          ));
          onGearSnapped?.(draggedGear, draggedGearData.type, index);
          snappedToSlot = true;
        }
      }
    });

    if (!snappedToSlot) {
      // No valid slot - return to floating
      setGears(prev => prev.map(g => 
        g.id === draggedGear 
          ? { ...g, isDragging: false }
          : g
      ));
    }

    setDraggedGear(null);
  }, [draggedGear, gears, onGearSnapped]);

  // Mouse event listeners
  useEffect(() => {
    if (draggedGear !== null) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedGear, handleMouseMove, handleMouseUp]);

  // Remove gear function (for when gear is placed)
  const removeGear = useCallback((gearId: number) => {
    setGears(prev => prev.filter(g => g.id !== gearId));
  }, []);

  // Expose remove function globally
  useEffect(() => {
    (window as any).removeFloatingGear = removeGear;
    return () => {
      delete (window as any).removeFloatingGear;
    };
  }, [removeGear]);

  // Render different gear types with distinct visual designs
  const renderGear = (gear: Gear) => {
    const baseClasses = `fill-current text-${gear.color}`;
    
    switch (gear.type) {
      case 'spur':
        return (
          <svg viewBox="0 0 100 100" className={baseClasses}>
            {/* Central hub */}
            <circle cx="50" cy="50" r="18" fill="currentColor" />
            {/* Gear teeth */}
            {Array.from({ length: 12 }).map((_, i) => (
              <rect
                key={i}
                x="47"
                y="8"
                width="6"
                height="18"
                fill="currentColor"
                transform={`rotate(${i * 30} 50 50)`}
              />
            ))}
            {/* Center hole */}
            <circle cx="50" cy="50" r="8" fill="hsl(var(--background))" />
          </svg>
        );
      
      case 'bevel':
        return (
          <svg viewBox="0 0 100 100" className={baseClasses}>
            {/* Central hub */}
            <circle cx="50" cy="50" r="20" fill="currentColor" />
            {/* Triangular teeth for bevel gear */}
            {Array.from({ length: 10 }).map((_, i) => (
              <polygon
                key={i}
                points="50,12 58,28 42,28"
                fill="currentColor"
                transform={`rotate(${i * 36} 50 50)`}
              />
            ))}
            {/* Center hole */}
            <circle cx="50" cy="50" r="10" fill="hsl(var(--background))" />
          </svg>
        );
      
      case 'internal':
        return (
          <svg viewBox="0 0 100 100" className={baseClasses}>
            {/* Outer ring */}
            <circle cx="50" cy="50" r="30" fill="currentColor" />
            {/* Inner cutout */}
            <circle cx="50" cy="50" r="18" fill="hsl(var(--background))" />
            {/* Internal teeth */}
            {Array.from({ length: 18 }).map((_, i) => (
              <rect
                key={i}
                x="48"
                y="18"
                width="4"
                height="10"
                fill="hsl(var(--background))"
                transform={`rotate(${i * 20} 50 50)`}
              />
            ))}
          </svg>
        );
      
      case 'worm':
        return (
          <svg viewBox="0 0 100 100" className={baseClasses}>
            {/* Elongated body */}
            <ellipse cx="50" cy="50" rx="35" ry="18" fill="currentColor" />
            {/* Spiral threads */}
            {Array.from({ length: 8 }).map((_, i) => (
              <line
                key={i}
                x1="15"
                y1="50"
                x2="85"
                y2="50"
                stroke="hsl(var(--background))"
                strokeWidth="3"
                transform={`rotate(${i * 22.5} 50 50)`}
              />
            ))}
            {/* Center shaft */}
            <ellipse cx="50" cy="50" rx="8" ry="18" fill="hsl(var(--background))" />
          </svg>
        );
      
      default:
        return null;
    }
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-10"
    >
      {gears
        .filter(gear => !gear.isSnapped)
        .map((gear) => (
          <div
            key={gear.id}
            className={`absolute opacity-80 transition-opacity duration-300 will-change-transform ${
              gear.isDragging 
                ? 'gear-dragging pointer-events-auto' 
                : 'gear-float gear-idle pointer-events-auto'
            }`}
            style={{
              left: `${gear.x}%`,
              top: `${gear.y}%`,
              animationDelay: gear.isDragging ? '0s' : `${gear.animationDelay}s`,
              animationPlayState: gear.isDragging ? 'paused' : 'running',
              transform: `translate(-50%, -50%)`,
            }}
            onMouseDown={(e) => handleMouseDown(e, gear.id)}
          >
            <div 
              className="select-none"
              style={{ 
                width: gear.size, 
                height: gear.size,
                pointerEvents: 'auto'
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