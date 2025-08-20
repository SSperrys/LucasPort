import { useState } from 'react';
import { ExternalLink } from 'lucide-react';

interface Project {
  title: string;
  description: string;
  gearType: 'spur' | 'bevel' | 'internal' | 'worm';
  targetGearColor: string;
  link: string;
  placed: boolean;
}

const projects: Project[] = [
  {
    title: 'Robotics Control System',
    description: 'Advanced motor control using spur gear mechanisms',
    gearType: 'spur',
    targetGearColor: 'gear-emerald',
    link: 'https://example.com/robotics',
    placed: false
  },
  {
    title: 'Precision Machining',
    description: 'High-precision bevel gear manufacturing',
    gearType: 'bevel',
    targetGearColor: 'gear-grey',
    link: 'https://example.com/machining',
    placed: false
  },
  {
    title: 'Energy Transmission',
    description: 'Efficient power transfer with internal gear systems',
    gearType: 'internal',
    targetGearColor: 'gear-crimson',
    link: 'https://example.com/energy',
    placed: false
  },
  {
    title: 'Mechanical Drives',
    description: 'Worm gear drive systems for heavy machinery',
    gearType: 'worm',
    targetGearColor: 'gear-sky-blue',
    link: 'https://example.com/drives',
    placed: false
  }
];

export const ProjectsSection = () => {
  const [projectStates, setProjectStates] = useState(projects);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverSlot(index);
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverSlot(null);
    
    // This will be handled by mouse events instead since we're using custom drag
  };

  const handleSlotClick = (e: React.MouseEvent, index: number) => {
    const project = projectStates[index];
    if (project.placed) return;

    // Check for dragged gear
    const draggingGears = document.querySelectorAll('.gear-dragging [data-gear-type]');
    if (draggingGears.length > 0) {
      const gearElement = draggingGears[0] as HTMLElement;
      const gearType = gearElement.getAttribute('data-gear-type');
      const gearId = gearElement.getAttribute('data-gear-id');
      
      if (gearType === project.gearType) {
        // Correct gear placed!
        setProjectStates(prev => prev.map((p, i) => 
          i === index ? { ...p, placed: true } : p
        ));
        
        // Remove the floating gear
        if (gearId && (window as any).removeFloatingGear) {
          (window as any).removeFloatingGear(parseInt(gearId));
        }
        
        // After a delay, navigate to the link
        setTimeout(() => {
          window.open(project.link, '_blank');
          // Reset the project state
          setProjectStates(prev => prev.map((p, i) => 
            i === index ? { ...p, placed: false } : p
          ));
        }, 2000);
        return;
      }
    }

    // Also check if clicked on gear directly in slot area
    const rect = e.currentTarget.getBoundingClientRect();
    const gearElements = document.elementsFromPoint(e.clientX, e.clientY);
    
    const gearElement = gearElements.find(el => 
      el.hasAttribute('data-gear-type')
    ) as HTMLElement;

    if (gearElement) {
      const gearType = gearElement.getAttribute('data-gear-type');
      const gearId = gearElement.getAttribute('data-gear-id');
      
      if (gearType === project.gearType) {
        // Correct gear placed!
        setProjectStates(prev => prev.map((p, i) => 
          i === index ? { ...p, placed: true } : p
        ));
        
        // Remove the floating gear
        if (gearId && (window as any).removeFloatingGear) {
          (window as any).removeFloatingGear(parseInt(gearId));
        }
        
        // After a delay, navigate to the link
        setTimeout(() => {
          window.open(project.link, '_blank');
          // Reset the project state
          setProjectStates(prev => prev.map((p, i) => 
            i === index ? { ...p, placed: false } : p
          ));
        }, 2000);
      }
    }
  };

  const renderTargetGear = (project: Project, isPlaced: boolean) => {
    const baseSize = 80;
    const animationClass = isPlaced ? 'gear-spin-clockwise' : '';
    
    switch (project.gearType) {
      case 'spur':
        return (
          <div className={`relative ${animationClass}`}>
            {/* Larger background gear */}
            <svg width={baseSize + 40} height={baseSize + 40} viewBox="0 0 120 120" className={`fill-current text-${project.targetGearColor} opacity-60`}>
              <circle cx="60" cy="60" r="35" fill="currentColor" />
              {Array.from({ length: 16 }).map((_, i) => (
                <rect
                  key={i}
                  x="58"
                  y="15"
                  width="4"
                  height="20"
                  fill="currentColor"
                  transform={`rotate(${i * 22.5} 60 60)`}
                />
              ))}
            </svg>
            {/* Smaller spur gear on top when placed */}
            {isPlaced && (
              <svg 
                width={baseSize} 
                height={baseSize} 
                viewBox="0 0 100 100" 
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fill-current text-${project.targetGearColor} gear-spin-counterclockwise`}
              >
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
            )}
          </div>
        );
      case 'internal':
        return (
          <div className={`relative ${animationClass}`}>
            {/* Inner gear (crimson) */}
            <svg width={baseSize + 20} height={baseSize + 20} viewBox="0 0 110 110" className={`fill-current text-${project.targetGearColor}`}>
              <circle cx="55" cy="55" r="35" fill="currentColor" />
              <circle cx="55" cy="55" r="20" fill="hsl(var(--background))" />
              {Array.from({ length: 20 }).map((_, i) => (
                <rect
                  key={i}
                  x="53"
                  y="20"
                  width="4"
                  height="10"
                  fill="hsl(var(--background))"
                  transform={`rotate(${i * 18} 55 55)`}
                />
              ))}
            </svg>
            {/* Outer internal gear when placed */}
            {isPlaced && (
              <svg 
                width={baseSize} 
                height={baseSize} 
                viewBox="0 0 100 100" 
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fill-current text-${project.targetGearColor} gear-spin-counterclockwise opacity-80`}
              >
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
            )}
          </div>
        );
      case 'worm':
        return (
          <div className={`relative ${animationClass}`}>
            {/* Straight-cut gear */}
            <svg width={baseSize + 20} height={baseSize + 20} viewBox="0 0 110 110" className={`fill-current text-${project.targetGearColor} opacity-60`}>
              <circle cx="55" cy="55" r="30" fill="currentColor" />
              {Array.from({ length: 12 }).map((_, i) => (
                <rect
                  key={i}
                  x="53"
                  y="15"
                  width="4"
                  height="20"
                  fill="currentColor"
                  transform={`rotate(${i * 30} 55 55)`}
                />
              ))}
            </svg>
            {/* Worm gear when placed */}
            {isPlaced && (
              <svg 
                width={baseSize} 
                height={baseSize} 
                viewBox="0 0 100 100" 
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fill-current text-${project.targetGearColor} gear-spin-clockwise`}
              >
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
            )}
          </div>
        );
      default: // bevel
        return (
          <div className={`relative ${animationClass}`}>
            <svg width={baseSize} height={baseSize} viewBox="0 0 100 100" className={`fill-current text-${project.targetGearColor}`}>
              <circle cx="50" cy="50" r="25" fill="currentColor" />
              {Array.from({ length: 10 }).map((_, i) => (
                <polygon
                  key={i}
                  points="50,10 58,30 42,30"
                  fill="currentColor"
                  transform={`rotate(${i * 36} 50 50)`}
                />
              ))}
            </svg>
            {isPlaced && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-foreground text-sm font-bold">
                <ExternalLink size={20} />
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <section id="projects" className="min-h-screen py-20 px-8 md:px-16 lg:px-32">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-16 font-hero text-center">
          Mechanical Engineering Projects
        </h2>
        
        <p className="text-xl text-muted-foreground text-center mb-16 max-w-3xl mx-auto">
          Drag the floating gears to their matching slots to explore each project. 
          Each gear combination demonstrates different mechanical principles.
        </p>
        
        <div className="flex flex-wrap justify-center gap-12 lg:gap-16">
          {projectStates.map((project, index) => (
            <div 
              key={index} 
              className={`gear-slot flex flex-col items-center p-8 rounded-xl transition-all duration-300 min-w-[280px] ${
                dragOverSlot === index ? 'drag-over' : ''
              } ${project.placed ? 'bg-primary/10' : ''}`}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onClick={(e) => handleSlotClick(e, index)}
            >
              <h3 className="text-2xl font-bold text-foreground mb-2 text-center">
                {project.title}
              </h3>
              
              <p className="text-muted-foreground mb-6 text-center text-sm">
                {project.description}
              </p>
              
              <div className="flex items-center justify-center mb-4">
                {renderTargetGear(project, project.placed)}
              </div>
              
              <div className="text-center">
                <span className="text-sm text-muted-foreground">
                  Drop {project.gearType} gear here
                </span>
                {project.placed && (
                  <div className="mt-2 text-primary text-sm font-semibold">
                    Opening project...
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};