// … your imports and Gear interface remain

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

  // Drag start
  const handleMouseDown = (e: React.MouseEvent, gearId: number) => {
    e.preventDefault();
    const gear = gears.find((g) => g.id === gearId);
    if (!gear || gear.isSnapped) return;
    dragOffset.current = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
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
    const newX = ((e.clientX - rect.left) / rect.width) * 100;
    const newY = ((e.clientY - rect.top) / rect.height) * 100;
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
  }, [draggedGear]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none">
      {gears
        .filter((g) => !g.isSnapped)
        .map((gear) => (
          <div
            key={gear.id}
            className={`absolute pointer-events-auto transition-transform ${
              gear.isDragging ? "gear-dragging" : "gear-float"
            }`}
            style={{
              left: `${gear.x}%`,
              top: `${gear.y}%`,
              width: gear.size,
              height: gear.size,
              transform: `translate(-50%, -50%) rotate(${gear.rotation}deg)`,
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
