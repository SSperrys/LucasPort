import { ExternalLink, Github } from 'lucide-react';

interface Project {
  title: string;
  description: string;
  image: string;
  links: {
    website?: string;
    github?: string;
    marketplace?: string;
  };
  technologies: string[];
}

import slidesBg from '@/assets/slides-bg.jpg';
import bookshelfImg from '@/assets/bookshelf.jpg';
import stressCalendarImg from '@/assets/stress-calendar.jpg';

const projects: Project[] = [
  {
    title: 'Slides Background',
    description: 'Generate beautiful material backgrounds for Google Slides presentations. Over 1 million users!',
    image: slidesBg,
    links: {
      marketplace: 'https://workspace.google.com/marketplace/app/slides_background/732310380877',
      website: 'https://slides.doshy.org/',
      github: 'https://github.com/Doshy-Org/Slides-Background'
    },
    technologies: ['React', 'Google Cloud', 'Javascript']
  },
  {
    title: 'Bookshelf',
    description: 'Create, share, and edit booklists with friends! View friends reading progress in real time.',
    image: bookshelfImg,
    links: {
      website: 'https://bookshelf-kappa-two.vercel.app/',
      github: 'https://github.com/nabil989/Bookshelf'
    },
    technologies: ['NextJS', 'Mongo DB', 'TailwindCSS']
  },
  {
    title: 'Stress Calendar',
    description: 'A smart calendar application that helps manage stress and productivity through intelligent scheduling.',
    image: stressCalendarImg,
    links: {
      github: '#'
    },
    technologies: ['React', 'TypeScript', 'Supabase']
  }
];

export const ProjectsSection = () => {
  return (
    <section id="projects" className="min-h-screen py-20 px-8 md:px-16 lg:px-32">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-16 font-hero">
          Projects
        </h2>
        
        <div className="grid gap-12 lg:gap-16">
          {projects.map((project, index) => (
            <div key={index} className="project-card">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {project.title}
                </h3>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  {project.links.marketplace && (
                    <a
                      href={project.links.marketplace}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-triangle-green/20 text-triangle-green rounded-lg hover:bg-triangle-green/30 transition-colors duration-200"
                    >
                      <ExternalLink size={16} />
                      G Suite Marketplace
                    </a>
                  )}
                  {project.links.website && (
                    <a
                      href={project.links.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-triangle-blue/20 text-triangle-blue rounded-lg hover:bg-triangle-blue/30 transition-colors duration-200"
                    >
                      <ExternalLink size={16} />
                      Website
                    </a>
                  )}
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-accent rounded-lg transition-colors duration-200"
                    >
                      <Github size={16} />
                      Github
                    </a>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};