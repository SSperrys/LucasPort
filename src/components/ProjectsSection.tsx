export const ProjectsSection = () => {
  const [projects, setProjects] = useState(initialProjects);

  const handleGearSnapped = (gearId: number, gearType: string, slotIndex: number) => {
    setProjects((prev) =>
      prev.map((p, i) =>
        i === slotIndex && p.gearType === gearType
          ? { ...p, isActive: true, hasPlacedGear: true }
          : p
      )
    );

    // Open link after animation
    setTimeout(() => {
      const project = projects[slotIndex];
      window.open(project.link, "_blank");
      setProjects((prev) =>
        prev.map((p, i) =>
          i === slotIndex ? { ...p, isActive: false, hasPlacedGear: false } : p
        )
      );
    }, 1500);
  };

  return (
    <div className="relative">
      <FloatingGears onGearSnapped={handleGearSnapped} />
      {projects.map((p, i) => (
        <div
          key={i}
          className="gear-slot"
          data-gear-type={p.gearType}
        >
          {renderSlotGear(p, i)}
        </div>
      ))}
    </div>
  );
};
