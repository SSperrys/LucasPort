import { Github, Linkedin, FileText, ChevronDown } from 'lucide-react';

export const HeroSection = () => {
  const scrollToExperience = () => {
    const element = document.getElementById('experience');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center items-start px-8 md:px-16 lg:px-32 relative">
      <div className="max-w-4xl">
        <p className="text-triangle-yellow text-lg mb-4 font-medium">
          Hi, my name is
        </p>
        
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-foreground mb-8 font-hero leading-tight">
          Lucas Cho.
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
          I am a mechanical engineer studying at{' '}
          <span className="text-foreground font-semibold">CMA</span>{' '}
          who is interested in{' '}
          <span className="text-triangle-blue font-semibold">robotics</span>{' '}
          and{' '}
          <span className="text-triangle-green font-semibold">energy</span>.
        </p>

        {/* Social Links */}
        <div className="flex items-center gap-6 mt-12">
          <a
            href="#"
            className="p-3 rounded-lg bg-secondary hover:bg-accent transition-all duration-300 hover-lift"
            aria-label="GitHub"
          >
            <Github size={24} />
          </a>
          <a
            href="#"
            className="p-3 rounded-lg bg-secondary hover:bg-accent transition-all duration-300 hover-lift"
            aria-label="LinkedIn"
          >
            <Linkedin size={24} />
          </a>
          <a
            href="#"
            className="p-3 rounded-lg bg-secondary hover:bg-accent transition-all duration-300 hover-lift"
            aria-label="Resume"
          >
            <FileText size={24} />
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToExperience}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 scroll-indicator text-muted-foreground hover:text-foreground transition-colors duration-300"
        aria-label="Scroll to experience section"
      >
        <ChevronDown size={32} />
      </button>
    </section>
  );
};