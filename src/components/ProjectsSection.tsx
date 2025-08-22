import { useState, useCallback } from 'react';

interface Project {
  title: string;
  description: string;
  gearType: 'spur' | 'bevel' | 'internal' | 'worm';
  targetGearColor: string;
  link: string;
  isActive: boolean;
  hasPlacedGear: boolean;
}

const projects: Project[] = [
  {
    title: 'Robotics Control System',
    description: 'Advanced motor control using spur gear mechanisms',
    gearType: 'spur',
    targetGearColor: 'gear-emerald',
    link: 'https://example.com/robotics',
    isActive: false,
    hasPlacedGear: false
  },
  {
    title: 'Precision Machining',
    description: 'High-precision bevel gear manufacturing',
    gearType: 'bevel',
    targetGearColor: 'gear-grey',
    link: 'https://example.com/machining',
    isActive: false,
    hasPlacedGear: false
  },
  {
    title: 'Energy Transmission',
    description: 'Efficient power transfer with internal gear systems',
    gearType: 'internal',
    targetGearColor: 'gear-crimson',
    link: 'https://example.com/energy',
    isActive: false,
    hasPlacedGear: false
  },
  {
    title: 'Mechanical Drives',
    description: 'Worm gear drive systems for heavy machinery',
    gearType: 'worm',
    targetGearColor: 'gear-sky-blue',
    link: 'https://example.com/drives',
    isActive: false,
    hasPlacedGear: false
  }
];

export const ProjectsSection = () => {
  const [projectStates, setProjectStates] = useState(projects);

  // Handle gear snapping from FloatingGears
  const handleGearSnapped = useCallback((gearId: number, gearType: string, slotIndex: number) => {
    const project = projectStates[slotIndex];
    
    if (project && project.gearType === gearType && !project.hasPlacedGear) {
      // Activate the project with meshing animation
      setProjectStates(prev => prev.map((p, i) => 
        i === slotIndex 
          ? { ...p, isActive: true, hasPlacedGear: true }
          : p
      ));

      // Remove the floating gear
      if ((window as any).removeFloatingGear) {
        (window as any).removeFloatingGear(gearId);
      }

      // After meshing animation, open link and reset
      setTimeout(() => {
        window.open(project.link, '_blank');
        
        // Reset state after opening
        setTimeout(() => {
          setProjectStates(prev => prev.map((p, i) => 
            i === slotIndex 
              ? { ...p, isActive: false, hasPlacedGear: false }
              : p
          ));
        }, 500);
      }, 2000);
    }
  }, [projectStates]);

  // Expose handler for FloatingGears
  useState(() => {
    (window as any).onGearSnapped = handleGearSnapped;
    return () => {
      delete (window as any).onGearSnapped;
    };
  });

  // Render slot gear based on project type
  const renderSlotGear = (project: Project, index: number) => {
    const baseSize = 100;
    const isActive = project.isActive;
    const hasGear = project.hasPlacedGear;
    
    const slotAnimation = isActive ? 'gear-spin-clockwise' : '';
    const placedAnimation = isActive ? 'gear-mesh-in gear-spin-counterclockwise' : '';

    switch (project.gearType) {
      case 'spur':
        return (
          <div className={`relative ${slotAnimation}`}>
            {/* Target slot gear - larger background gear */}
            <svg 
              width={baseSize + 30} 
              height={baseSize + 30} 
              viewBox="0 0 130 130" 
              className={`fill-current text-${project.targetGearColor} opacity-40`}
            >
              <circle cx="65" cy="65" r="40" fill="currentColor" />
              {Array.from({ length: 20 }).map((_, i) => (
                <rect
                  key={i}
                  x="63"
                  y="15"
                  width="4"
                  height="20"
                  fill="currentColor"
                  transform={`rotate(${i * 18} 65 65)`}
                />
              ))}
              <circle cx="65" cy="65" r="15" fill="hsl(var(--background))" />
            </svg>
            
            {/* Placed gear animation */}
            {hasGear && (
              <svg 
                width={baseSize} 
                height={baseSize} 
                viewBox="0 0 100 100" 
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fill-current text-${project.targetGearColor} ${placedAnimation}`}
              >
                <circle cx="50" cy="50" r="18" fill="currentColor" />
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
                <circle cx="50" cy="50" r="8" fill="hsl(var(--background))" />
              </svg>
            )}
          </div>
        );

      case 'bevel':
        return (
          <div className={`relative ${slotAnimation}`}>
            <svg 
              width={baseSize} 
              height={baseSize} 
              viewBox="0 0 100 100" 
              className={`fill-current text-${project.targetGearColor} opacity-40`}
            >
              <circle cx="50" cy="50" r="25" fill="currentColor" />
              {Array.from({ length: 12 }).map((_, i) => (
                <polygon
                  key={i}
                  points="50,8 58,28 42,28"
                  fill="currentColor"
                  transform={`rotate(${i * 30} 50 50)`}
                />
              ))}
              <circle cx="50" cy="50" r="12" fill="hsl(var(--background))" />
            </svg>
            
            {hasGear && (
              <svg 
                width={baseSize - 20} 
                height={baseSize - 20} 
                viewBox="0 0 100 100" 
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fill-current text-${project.targetGearColor} ${placedAnimation}`}
              >
                <circle cx="50" cy="50" r="20" fill="currentColor" />
                {Array.from({ length: 10 }).map((_, i) => (
                  <polygon
                    key={i}
                    points="50,12 58,28 42,28"
                    fill="currentColor"
                    transform={`rotate(${i * 36} 50 50)`}
                  />
                ))}
                <circle cx="50" cy="50" r="10" fill="hsl(var(--background))" />
              </svg>
            )}
          </div>
        );

      case 'internal':
        return (
          <div className={`relative ${slotAnimation}`}>
            {/* Inner gear for internal system */}
            <svg 
              width={baseSize} 
              height={baseSize} 
              viewBox="0 0 100 100" 
              className={`fill-current text-${project.targetGearColor} opacity-40`}
            >
              <circle cx="50" cy="50" r="25" fill="currentColor" />
              {Array.from({ length: 15 }).map((_, i) => (
                <rect
                  key={i}
                  x="48"
                  y="8"
                  width="4"
                  height="15"
                  fill="currentColor"
                  transform={`rotate(${i * 24} 50 50)`}
                />
              ))}
              <circle cx="50" cy="50" r="10" fill="hsl(var(--background))" />
            </svg>
            
            {/* Outer internal gear when placed */}
            {hasGear && (
              <svg 
                width={baseSize + 20} 
                height={baseSize + 20} 
                viewBox="0 0 120 120" 
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fill-current text-${project.targetGearColor} ${placedAnimation} opacity-70`}
              >
                <circle cx="60" cy="60" r="35" fill="currentColor" />
                <circle cx="60" cy="60" r="20" fill="hsl(var(--background))" />
                {Array.from({ length: 18 }).map((_, i) => (
                  <rect
                    key={i}
                    x="58"
                    y="20"
                    width="4"
                    height="12"
                    fill="hsl(var(--background))"
                    transform={`rotate(${i * 20} 60 60)`}
                  />
                ))}
              </svg>
            )}
          </div>
        );

      case 'worm':
        return (
          <div className={`relative ${slotAnimation}`}>
            {/* Straight-cut gear for worm drive */}
            <svg 
              width={baseSize} 
              height={baseSize} 
              viewBox="0 0 100 100" 
              className={`fill-current text-${project.targetGearColor} opacity-40`}
            >
              <circle cx="50" cy="50" r="28" fill="currentColor" />
              {Array.from({ length: 16 }).map((_, i) => (
                <rect
                  key={i}
                  x="48"
                  y="8"
                  width="4"
                  height="18"
                  fill="currentColor"
                  transform={`rotate(${i * 22.5} 50 50)`}
                />
              ))}
              <circle cx="50" cy="50" r="12" fill="hsl(var(--background))" />
            </svg>
            
            {/* Worm gear when placed */}
            {hasGear && (
              <svg 
                width={baseSize + 10} 
                height={baseSize - 20} 
                viewBox="0 0 110 80" 
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fill-current text-${project.targetGearColor} ${placedAnimation}`}
              >
                <ellipse cx="55" cy="40" rx="35" ry="18" fill="currentColor" />
                {Array.from({ length: 8 }).map((_, i) => (
                  <line
                    key={i}
                    x1="20"
                    y1="40"
                    x2="90"
                    y2="40"
                    stroke="hsl(var(--background))"
                    strokeWidth="3"
                    transform={`rotate(${i * 22.5} 55 40)`}
                  />
                ))}
                <ellipse cx="55" cy="40" rx="8" ry="18" fill="hsl(var(--background))" />
              </svg>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="projects" className="min-h-screen py-20 px-8 md:px-16 lg:px-32 relative z-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-16 font-hero text-center">
          Mechanical Engineering Projects
        </h2>
        
        <p className="text-xl text-muted-foreground text-center mb-20 max-w-3xl mx-auto">
          Drag the floating gears to their matching project slots. 
          Watch as they mesh and spin together in perfect mechanical harmony.
        </p>
        
        {/* Horizontal lineup of project slots */}
        <div className="flex justify-center items-center gap-8 lg:gap-12 flex-wrap">
          {projectStates.map((project, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center group"
            >
              {/* Project title above gear */}
              <h3 className="text-lg font-semibold text-foreground mb-4 text-center min-h-[2.5rem] flex items-center max-w-[200px]">
                {project.title}
              </h3>
              
              {/* Invisible gear slot */}
              <div 
                className="gear-slot relative flex items-center justify-center p-8 transition-transform duration-200"
                data-gear-type={project.gearType}
                data-slot-index={index}
              >
                {renderSlotGear(project, index)}
              </div>
              
              {/* Project description below gear */}
              <p className="text-sm text-muted-foreground text-center mt-4 max-w-[200px] min-h-[2.5rem] flex items-center">
                {project.description}
              </p>
              
              {/* Active state feedback */}
              {project.isActive && (
                <div className="mt-3 text-center">
                  <div className="text-primary text-sm font-medium animate-pulse">
                    Gears meshing... Opening project
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};