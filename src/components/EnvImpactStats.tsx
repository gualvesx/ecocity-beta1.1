
import { useEffect, useRef, useState } from 'react';

interface StatItemProps {
  value: number;
  label: string;
  suffix?: string;
  delay?: number;
}

const StatItem = ({ value, label, suffix = "", delay = 0 }: StatItemProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          
          // Delay the start of the animation based on the prop
          const timeoutId = setTimeout(() => {
            // Animate the number counting up
            let startValue = 0;
            const animationDuration = 2000; // 2 seconds
            const increment = value / (animationDuration / 16); // 60fps
            
            const interval = setInterval(() => {
              startValue += increment;
              if (startValue >= value) {
                setDisplayValue(value);
                clearInterval(interval);
              } else {
                setDisplayValue(Math.floor(startValue));
              }
            }, 16);
          }, delay);
          
          return () => clearTimeout(timeoutId);
        }
      },
      { threshold: 0.1 }
    );
    
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    
    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [value, delay]);
  
  return (
    <div ref={elementRef} className="flex flex-col items-center p-6">
      <div className="text-4xl md:text-5xl font-bold text-eco-green-dark flex items-end leading-none">
        {displayValue.toLocaleString()}{suffix}
      </div>
      <p className="mt-2 text-lg text-muted-foreground text-center">{label}</p>
    </div>
  );
};

const EnvImpactStats = () => {
  return (
    <section className="py-16 bg-eco-green/5">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-eco-green-dark">
            Our Collective Impact
          </h2>
          <p className="text-lg text-muted-foreground">
            Together, our community is making a measurable difference in environmental conservation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white rounded-xl shadow-md overflow-hidden">
          <StatItem value={5280} label="Trees Planted" delay={0} />
          <StatItem value={42} label="Tons of Waste Recycled" suffix="+" delay={200} />
          <StatItem value={120} label="Community Clean-ups" delay={400} />
          <StatItem value={3500} label="Volunteers Engaged" delay={600} />
        </div>
      </div>
    </section>
  );
};

export default EnvImpactStats;
