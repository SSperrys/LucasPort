interface Experience {
  company: string;
  position: string;
  team: string;
  duration: string;
  technologies: string[];
  current?: boolean;
}

const experiences: Experience[] = [
  {
    company: 'Tesla',
    position: 'SWE Intern',
    team: 'Automation Engineering',
    duration: 'Current',
    technologies: ['Mongo DB', 'GraphQL', 'Fast Api'],
    current: true
  },
  {
    company: 'Capital One',
    position: 'SWE Intern',
    team: 'Autonomous Insights',
    duration: 'Jun 2024 - Aug 2024',
    technologies: ['Python', 'Spark', 'Snowflake', 'AWS']
  },
  {
    company: 'Roblox',
    position: 'SWE Intern',
    team: 'Creator Success',
    duration: 'May 2023 - Aug 2023',
    technologies: ['NextJS', 'TypeScript']
  }
];

export const ExperienceSection = () => {
  return (
    <section id="experience" className="min-h-screen py-20 px-8 md:px-16 lg:px-32">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-16 font-hero">
          Experience
        </h2>
        
        <div className="grid gap-8 md:gap-12">
          {experiences.map((exp, index) => (
            <div key={index} className="experience-card">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {exp.company}
                  </h3>
                  <p className="text-lg text-muted-foreground mb-1">
                    {exp.position}
                  </p>
                  <p className="text-sm text-triangle-blue font-medium">
                    {exp.team}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                  {exp.current && (
                    <span className="px-3 py-1 bg-triangle-green/20 text-triangle-green text-sm font-medium rounded-full">
                      Current
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {exp.duration}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {exp.technologies.map((tech, techIndex) => (
                  <span key={techIndex} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Fabric.js watermark */}
        <p className="text-xs text-muted-foreground/60 mt-12 text-center">
          Created with Fabric.js 5.2.4
        </p>
      </div>
    </section>
  );
};