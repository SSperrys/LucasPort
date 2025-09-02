import React, { useRef } from 'react';
import { FloatingGears } from '@/components/FloatingGears';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { ExperienceSection } from '@/components/ExperienceSection';
import { ProjectsSection } from '@/components/ProjectsSection';

const Index = () => {
  const handleGearSnapped = (gearId: number, gearType: string, slotIndex: number) => {
    // This will be handled by the ProjectsSection component
    console.log(`Gear ${gearId} of type ${gearType} snapped to slot ${slotIndex}`);
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* Single floating gears instance that works across all sections */}
      <FloatingGears onGearSnapped={handleGearSnapped} />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main content */}
      <main className="relative z-10">
        <HeroSection />
        <ExperienceSection />
        <ProjectsSection onGearSnapped={handleGearSnapped} />
      </main>
    </div>
  );
};

export default Index;
