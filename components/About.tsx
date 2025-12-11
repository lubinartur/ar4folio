import React from "react";
import { AboutIntro } from "./AboutIntro";
import { Experience } from "./Experience";
import { Services } from "./Services";

export const About: React.FC = () => {
  return (
    <div className="bg-[#0f0f0f] relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-[20%] right-[-10%] w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Intro, Experience, Services as separate sections */}
      <AboutIntro />
      <Experience />
      <Services />
    </div>
  );
};

export default About;