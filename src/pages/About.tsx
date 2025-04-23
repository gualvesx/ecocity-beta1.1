
import { HeroSection } from '@/components/about/HeroSection';
import { MissionSection } from '@/components/about/MissionSection';
import { TeamSection } from '@/components/about/TeamSection';
import { MapDataSection } from '@/components/about/MapDataSection';
import { TimelineSection } from '@/components/about/TimelineSection';
import { ContactSection } from '@/components/about/ContactSection';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="container px-4 py-8">
        <HeroSection />
        <MissionSection />
        <TeamSection />
        <MapDataSection />
        <TimelineSection />
        <ContactSection />
      </div>
    </div>
  );
};

export default About;
