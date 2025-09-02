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
      {/* Navigation */}
      <Navigation />
      
      {/* Main content with lower z-index so gears can be clicked */}
      <main className="relative z-10">
        <HeroSection />
        <ExperienceSection />
        <ProjectsSection onGearSnapped={handleGearSnapped} />
      </main>
      
      {/* Floating gears with highest z-index for interaction */}
      <FloatingGears onGearSnapped={handleGearSnapped} />
    </div>
  );
};

export default Index;
