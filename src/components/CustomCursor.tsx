import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "../styles/Cursor.module.css";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    // Direct positions
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };

    // GSAP quickTo for smooth high-performance tracking
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.4, ease: "power3.out" });

    // Instantly set dot position
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Update dot instantly
      gsap.set(dot, { x: e.clientX, y: e.clientY });

      // Trigger smooth follow for outer ring
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", onMouseMove);

    // Dynamic hover bindings for interactive items
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check if target is clickable/interactive
      const isInteractive = 
        target.tagName === "BUTTON" || 
        target.tagName === "A" || 
        target.closest("button") || 
        target.closest("a") ||
        target.closest("[data-hover-magnetic]") ||
        target.classList.contains("clickable-cursor");

      if (isInteractive) {
        setIsHovered(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovered(false);
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <>
      {/* Outer elastic ring */}
      <div 
        ref={cursorRef} 
        className={`${styles.customCursor} ${isHovered ? styles.cursorHovering : ""}`} 
        style={{ left: 0, top: 0 }}
      />
      {/* Inner precise dot */}
      <div 
        ref={dotRef} 
        className={styles.dot} 
        style={{ left: 0, top: 0 }}
      />
    </>
  );
}
