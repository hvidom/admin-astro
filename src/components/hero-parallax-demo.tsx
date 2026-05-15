// src/components/react/HeroParallaxDemo.tsx
import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";

interface Product {
  title: string;
  link: string;
  thumbnail: string;
}

interface HeroParallaxDemoProps {
  products: Product[];
}

export default function HeroParallaxDemo({ products }: HeroParallaxDemoProps) {
  // Fallback check: HeroParallax expects at least 15 items to look good with 3 rows
  if (!products || products.length === 0) {
    return <div className="py-20 text-center text-slate-400">No products found.</div>;
  }

  return <HeroParallax products={products} />;
}