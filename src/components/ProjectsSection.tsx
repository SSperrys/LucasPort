import React, { useState } from 'react';

// Project interface
interface Project {
  title: string;
  gearType: string;
  link: string;
  isActive: boolean;
  hasPlacedGear: boolean;
  slotColor: string;
}

// Initial projects data
const initialProjects: Project[] = [
  {
    title: "Prosthetic Hand",
    gearType: "spur",
    link: "https://csuma-my.sharepoint.com/:p:/g/personal/lcho51_csum_edu/EUGuctz_7m5CszKytxylpDEBxHk3zWNa6jH9DSMm_ozIyQ?e=HxeXPU",
    isActive: false,
    hasPlacedGear: false,
    slotColor: "hsl(158, 64%, 35%)" // slightly lighter emerald for slot
  },
  {
    title: "Energy Efficiency Monitor",
    gearType: "bevel",
    link: "https://github.com/example/energy-monitor",
    isActive: false,
    hasPlacedGear: false,
    slotColor: "hsl(0, 0%, 75%)" // slightly darker grey for slot
  },
  {
    title: "Transmission System",
    gearType: "internal",
    link: "https://github.com/example/transmission",
    isActive: false,
    hasPlacedGear: false,
    slotColor: "hsl(355, 78%, 45%)" // slightly lighter crimson for slot
  },
  {
    title: "Motor Control Unit",
    gearType: "worm",
    link: "https://github.com/example/motor-control",
    isActive: false,
    hasPlacedGear: false,
    slotColor: "hsl(200, 80%, 50%)" // slightly darker sky blue for slot
  },
];

// Slot gear rendering function
const renderSlotGear = (project: Project, index: number) => {
  const { gearType, title, isActive, hasPlacedGear, slotColor } = project;
  
  const gearSize = 80;
  const commonProps = {
    width: gearSize,
    height: gearSize,
    viewBox: "0 0 100 100",
    fill: slotColor,
    className: `transition-all duration-500 ${isActive ? 'animate-spin' : ''}`
  };

  const renderSlotGearSVG = () => {
    switch (gearType) {
      case 'spur':
        return (
          <svg {...commonProps}>
            <circle cx="50" cy="50" r="40" fill={slotColor} stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
            {[...Array(16)].map((_, i) => (
              <rect
                key={i}
                x="48"
                y="8"
                width="4"
                height="12"
                fill={slotColor}
                transform={`rotate(${i * 22.5} 50 50)`}
              />
            ))}
            <circle cx="50" cy="50" r="12" fill="rgba(255,255,255,0.1)" />
          </svg>
        );

      case 'bevel':
        return (
          <svg {...commonProps}>
            <polygon
              points="50,10 90,50 50,90 10,50"
              fill={slotColor}
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="2"
            />
            <circle cx="50" cy="50" r="12" fill="rgba(255,255,255,0.1)" />
          </svg>
        );

      case 'internal':
        return (
          <svg {...commonProps}>
            <circle cx="50" cy="50" r="45" fill={slotColor} stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
            <circle cx="50" cy="50" r="30" fill="rgba(255,255,255,0.05)" />
            {[...Array(20)].map((_, i) => (
              <rect
                key={i}
                x="48"
                y="30"
                width="4"
                height="10"
                fill="rgba(0,0,0,0.2)"
                transform={`rotate(${i * 18} 50 50)`}
              />
            ))}
            <circle cx="50" cy="50" r="12" fill="rgba(255,255,255,0.1)" />
          </svg>
        );

      case 'worm':
        return (
          <svg {...commonProps}>
            <rect x="10" y="45" width="80" height="10" fill={slotColor} rx="5" />
            {[...Array(10)].map((_, i) => (
              <rect
                key={i}
                x={10 + (i * 8)}
                y="42"
                width="4"
                height="16"
                fill="rgba(0,0,0,0.2)"
                rx="2"
              />
            ))}
            <circle cx="50" cy="50" r="8" fill="rgba(255,255,255,0.1)" />
          </svg>
        );

      default:
        return (
          <svg {...commonProps}>
            <circle cx="50" cy="50" r="40" fill={slotColor} />
          </svg>
        );
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <div className={`relative transition-all duration-500 ${hasPlacedGear ? 'scale-110' : ''}`}>
        {renderSlotGearSVG()}
        {hasPlacedGear && (
          <div className="absolute inset-0 animate-pulse">
            <div className="w-full h-full rounded-full bg-primary/20 animate-ping" />
          </div>
        )}
      </div>
    </div>
  );
};

interface ProjectsSectionProps {
  onGearSnapped?: (gearId: number, gearType: string, slotIndex: number) => void;
}

export const ProjectsSection = ({ onGearSnapped }: ProjectsSectionProps) => {
  const [projects, setProjects] = useState(initialProjects);

  const handleGearSnapped = (gearId: number, gearType: string, slotIndex: number) => {
    setProjects((prev) =>
      prev.map((p, i) =>
        i === slotIndex && p.gearType === gearType
          ? { ...p, isActive: true, hasPlacedGear: true }
          : p
      )
    );

    // Call parent handler
    onGearSnapped?.(gearId, gearType, slotIndex);

    // Open link after animation
    setTimeout(() => {
      const project = projects[slotIndex];
      if (project?.link) {
        window.open(project.link, "_blank");
      }
      setProjects((prev) =>
        prev.map((p, i) =>
          i === slotIndex ? { ...p, isActive: false, hasPlacedGear: false } : p
        )
      );
    }, 1500);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Interactive Projects</h2>
          <p className="text-muted-foreground text-lg">
            Drag the floating gears to their matching slots to explore my projects
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {projects.map((project, i) => (
            <div
              key={i}
              className="gear-slot relative bg-card rounded-lg border shadow-lg hover:shadow-xl transition-all duration-300"
              data-gear-type={project.gearType}
            >
              {renderSlotGear(project, i)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
