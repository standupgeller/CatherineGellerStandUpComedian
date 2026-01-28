import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  viewMargin?: string; // e.g. "-100px"
}

const AnimatedSection = ({ children, className, id, delay = 0, viewMargin = "-100px" }: AnimatedSectionProps) => {
  const ref = useRef(null);
  // @ts-expect-error - margin expects a specific MarginType but string works for IntersectionObserver
  const isInView = useInView(ref, { once: true, margin: viewMargin });

  return (
    <section id={id} ref={ref} className={cn("relative", className)}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: "easeOut", delay }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </section>
  );
};

export default AnimatedSection;
