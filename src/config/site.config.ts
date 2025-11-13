/**
 * Site Configuration
 * 
 * Edit this file to customize your portfolio content.
 * All the text, links, and personal information are defined here.
 */

export const siteConfig = {
  // Personal Information
  name: "[YOUR_NAME]",
  tagline: "Pixel-perfect full-stack engineer",
  shortBio: "I craft modern web experiences with clean code and creative design. From concept to deployment, I build applications that users love.",
  
  // About Section
  about: {
    description: `Hey there! I'm a full-stack developer passionate about building elegant solutions to complex problems. 
    
With a background in modern web technologies and a love for pixel-perfect design, I specialize in creating responsive, performant applications that delight users. When I'm not coding, you'll find me exploring new technologies, contributing to open source, or playing retro video games that inspire my design aesthetic.

I believe in writing clean, maintainable code and always learning something new. Let's build something amazing together!`,
    image: "/placeholder.svg", // Path to your avatar image
  },

  // Contact Information
  contact: {
    email: "[EMAIL_ADDRESS]",
    github: "https://github.com/[GITHUB_USERNAME]",
    linkedin: "https://linkedin.com/in/[LINKEDIN_USERNAME]", // Optional
    twitter: "https://twitter.com/[TWITTER_HANDLE]", // Optional
    // Add more social links as needed
  },

  // Timeline / Experience
  timeline: [
    {
      year: "2024",
      title: "Senior Full-Stack Developer",
      company: "Tech Company",
      description: "Leading development of scalable web applications using React, TypeScript, and Node.js.",
    },
    {
      year: "2022",
      title: "Full-Stack Developer",
      company: "Startup Inc",
      description: "Built and maintained multiple client projects from design to deployment.",
    },
    {
      year: "2020",
      title: "Frontend Developer",
      company: "Digital Agency",
      description: "Specialized in React development and UI/UX implementation.",
    },
    {
      year: "2019",
      title: "Computer Science Degree",
      company: "University Name",
      description: "Graduated with honors, focused on software engineering and web technologies.",
    },
  ],

  // Footer
  footer: {
    copyright: `© ${new Date().getFullYear()} [YOUR_NAME]. All rights reserved.`,
    builtWith: "Built with React, TypeScript, and Tailwind CSS",
  },
};
