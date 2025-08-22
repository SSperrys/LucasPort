import { FloatingGears } from '@/components/FloatingGears';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { ExperienceSection } from '@/components/ExperienceSection';
import { ProjectsSection } from '@/components/ProjectsSection';

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Floating gears background */}
      <FloatingGears 
        onGearSnapped={(gearId, gearType, slotIndex) => {
          if ((window as any).onGearSnapped) {
            (window as any).onGearSnapped(gearId, gearType, slotIndex);
          }
        }}
      />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main content */}
      <main>
        <HeroSection />
        <ExperienceSection />
        <ProjectsSection />
      </main>
    </div>
  );
};

export default Index;
