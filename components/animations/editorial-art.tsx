"use client";
import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
export function SilkRibbon() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  return (
    <div ref={ref} className="fabric-line" aria-hidden="true">
      <motion.div className="ribbon-motion" style={{ y: reduced ? 0 : y }}>
        <img src="/images/silk-sculpture.svg" alt="" />
      </motion.div>
    </div>
  );
}
export function SignaturePhoto() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-22, 22]);
  return (
    <motion.div
      ref={ref}
      className="signature-photo"
      style={{ y: reduced ? 0 : y }}
    >
      <Image
        src="/images/heritage-hero.jpg"
        alt="AI-generated concept editorial of an ivory and gold saree; not actual product photography"
        fill
        sizes="(max-width:540px) 1200px, 100vw"
      />
    </motion.div>
  );
}
