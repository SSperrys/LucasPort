import { useState, useEffect } from 'react';

export const Navigation = () => {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'experience', 'projects'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 right-0 z-50 p-8">
      <div className="flex items-center gap-8">
        <button
          onClick={() => scrollToSection('experience')}
          className={`text-sm font-medium transition-all duration-300 hover:text-primary ${
            activeSection === 'experience' ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          Experience
        </button>
        <button
          onClick={() => scrollToSection('projects')}
          className={`text-sm font-medium transition-all duration-300 hover:text-primary ${
            activeSection === 'projects' ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          Projects
        </button>
        
        {/* Theme toggle triangle */}
        <div className="relative">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="fill-current text-triangle-yellow transition-colors duration-300 hover:text-triangle-blue cursor-pointer"
          >
            <path d="M12 2 L22 20 L2 20 Z" />
          </svg>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            className="absolute -top-1 -right-1 fill-current text-triangle-blue"
          >
            <path d="M12 2 L22 20 L2 20 Z" />
          </svg>
        </div>
      </div>
    </nav>
  );
};