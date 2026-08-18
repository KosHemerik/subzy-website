"use client";

import { useEffect, useRef, useState } from "react";

function useCountUp(target, duration, triggered) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!triggered || target === null) return;
    let startTime = null;
    let rafId;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(eased * target));
      if (progress < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [triggered, target, duration]);
  return value;
}

const statsConfig = [
  {
    target: 360,
    format: (n) => `€${n}K+`,
    label: "Teruggevraagd voor klanten",
  },
  {
    target: 1400,
    format: (n) => `${n.toLocaleString("nl-NL")}+`,
    label: "Succesvolle aanvragen",
  },
  {
    target: null,
    static: "Ruim 8 jaar",
    label: "Ervaring in energiebelasting & subsidie",
  },
];

function StatItem({ config, triggered }) {
  const count = useCountUp(config.target, 2000, triggered);
  const display = config.target !== null ? config.format(count) : config.static;
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-accent mb-1">{display}</div>
      <div className="text-sm text-gray-500">{config.label}</div>
    </div>
  );
}

export default function StatsCounter() {
  const [triggered, setTriggered] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="mt-16 text-center">
      <p className="text-sm text-gray-400 mb-6">Waarom klanten ons vertrouwen</p>
      <div className="flex flex-wrap justify-center gap-8 md:gap-16">
        {statsConfig.map((config, i) => (
          <StatItem key={i} config={config} triggered={triggered} />
        ))}
      </div>
    </div>
  );
}
