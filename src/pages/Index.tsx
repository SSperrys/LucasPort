import { FloatingGears } from '@/components/FloatingGears';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { ExperienceSection } from '@/components/ExperienceSection';
import { ProjectsSection } from '@/components/ProjectsSection';

const Index = () => {
  return (
    <div className="relative">
      {/* Floating gears background */}
      <FloatingGears />
      
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
