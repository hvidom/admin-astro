"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "motion/react";
import { Button } from "./button";
import { Ghost } from "lucide-react";

export const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
    price: string; // Added price here
  }[];
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );
  return (
    <div
      ref={ref}
      className="h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto perspective-[1000px] transform-3d"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20 ">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
      <h1 className="text-2xl md:text-7xl font-extrabold scroll-m-20 tracking-tight text-balance">
        Elevate Your Style <br /> with Premium Quality
      </h1>
      <p className="max-w-2xl md:text-xl mt-8 text-lg font-semibold text-neutral-400">
        Discover our curated collection of exclusive products designed for those 
        who demand excellence. Shop the latest arrivals and redefine your 
        everyday essentials today.
      </p>
      <div className="mt-10 flex gap-4">
        <Button variant={"ghost"} className="px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-neutral-200 transition">
          Shop Collection
        </Button>
        <Button className="px-6 py-3 border border-white text-white rounded-full font-bold hover:bg-white/10 transition">
          View Arrivals
        </Button>
      </div>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
    price: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-96 w-120 relative shrink-0"
    >
      <a
        href={product.link}
        className="block group-hover/product:shadow-2xl"
      >
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          className="object-cover object-top-left absolute h-full w-full inset-0"
          alt={product.title}
        />
      </a>
      
      {/* Overlay background */}
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none transition duration-200"></div>
      
      {/* Product Info and Action Row */}
      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover/product:opacity-100 text-white transition duration-200 flex flex-col gap-2">
        <h2 className="text-xl font-bold">{product.title}</h2>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-emerald-400">
            {product.price}
          </span>
          
          <a 
            href={product.link}
            className="px-4 py-2 bg-white text-black text-xs font-bold uppercase rounded-lg hover:bg-neutral-200 transition duration-150"
          >
            Buy Now
          </a>
        </div>
      </div>
    </motion.div>
  );
};