import React, { useState, useEffect, Suspense, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Preload, useGLTF, useAnimations, Environment, ContactShadows } from '@react-three/drei';
import { styles } from '../styles';
import { personalInfo, stats } from '../constants';
import { useThemeStore } from '../store/useThemeStore';
import CanvasLoader from './Loader';
// Official React Bits components
import SplitText from './SplitText';
import BlurText from './BlurText';
import Magnet from './Magnet';
import GlitchText from './GlitchText';
// Custom UI components  
import { ScrollReveal, InteractiveStats } from './ui';

// Typing animation component
const TypingText = ({ texts, className }) => {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentText.length) {
          setDisplayText(currentText.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (charIndex > 0) {
          setDisplayText(currentText.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setIsDeleting(false);
          setTextIndex((textIndex + 1) % texts.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts]);

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block w-[3px] h-[1em] bg-[var(--color-accent)] ml-1"
      />
    </span>
  );
};

// MacBook 3D Model Component with scroll-triggered animation
const MacBook = ({ isMobile, triggerClose, onAnimationComplete, isDark }) => {
  const { scene, animations } = useGLTF('./desktop_pc/scene.gltf');
  const { actions, mixer } = useAnimations(animations, scene);
  const hasPlayedOpen = useRef(false);
  const hasPlayedClose = useRef(false);
  
  // Play opening animation on mount
  useEffect(() => {
    const openAnimation = actions['Animation'];
    if (openAnimation && !hasPlayedOpen.current) {
      hasPlayedOpen.current = true;
      openAnimation.reset();
      openAnimation.setLoop(false, 1);
      openAnimation.clampWhenFinished = true;
      openAnimation.timeScale = 1;
      openAnimation.play();
    }
  }, [actions]);

  // Play closing animation when triggered by scroll
  useEffect(() => {
    const closeAnimation = actions['Animation'];
    if (triggerClose && closeAnimation && !hasPlayedClose.current) {
      hasPlayedClose.current = true;
      
      // Reverse the animation to close the MacBook
      closeAnimation.paused = false;
      closeAnimation.timeScale = -1.5; // Faster reverse
      closeAnimation.play();
      
      // Listen for animation complete
      const onFinished = () => {
        onAnimationComplete?.();
        mixer.removeEventListener('finished', onFinished);
      };
      
      // Use timeout as backup since reversed animations don't always fire 'finished'
      setTimeout(() => {
        onAnimationComplete?.();
      }, 800); // Animation duration
    }
  }, [triggerClose, actions, mixer, onAnimationComplete]);

  // Keep the animation loop running when triggerClose is active
  useFrame(() => {
    if (triggerClose) {
      mixer?.update(0.016); // ~60fps
    }
  });

  return (
    <group>
      {/* Ambient fill */}
      <ambientLight intensity={isDark ? 0.35 : 0.5} />

      {/* Hemisphere — cool slate tones */}
      <hemisphereLight
        intensity={isDark ? 0.7 : 0.9}
        color={isDark ? '#C7D2FE' : '#FEF3C7'}
        groundColor={isDark ? '#0F172A' : '#EEF2FF'}
      />

      {/* Key light — indigo in dark, warm amber in light */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={isDark ? 1.4 : 1.6}
        color={isDark ? '#A5B4FC' : '#F59E0B'}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Rim / back light for edge highlights */}
      <directionalLight
        position={[-1, 3, -5]}
        intensity={isDark ? 0.5 : 0.35}
        color={isDark ? '#A78BFA' : '#FDE68A'}
      />

      {/* Top fill spot */}
      <spotLight
        position={[2, 3, -4.2]}
        angle={0.6}
        penumbra={1}
        intensity={isDark ? 1.2 : 1.0}
        color={isDark ? '#818CF8' : '#F59E0B'}
        castShadow={false}
      />

      {/* Subtle accent point light from the front-bottom */}
      <pointLight
        position={[0, -2, 4]}
        intensity={isDark ? 0.3 : 0.25}
        color={isDark ? '#6366F1' : '#4F46E5'}
        distance={10}
        decay={2}
      />

      <primitive
        object={scene}
        scale={isMobile ? 1 : 1.5}
        position={isMobile ? [0, -1.5, 0] : [0, -1, 0]}
        rotation={[0.25, -0.5, 0.05]}
      />
    </group>
  );
};

// MacBook Canvas with animation control
const MacBookCanvas = ({ triggerClose, onAnimationComplete, isDark, onInteract }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Canvas
      frameloop="always"
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ preserveDrawingBuffer: true, antialias: true, toneMapping: 3 }}
      onPointerDown={onInteract}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls 
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2.5}
          autoRotate={!triggerClose}
          autoRotateSpeed={0.5}
        />
        <MacBook 
          isMobile={isMobile} 
          triggerClose={triggerClose}
          onAnimationComplete={onAnimationComplete}
          isDark={isDark}
        />
        {/* Environment map for realistic reflections */}
        <Environment preset={isDark ? 'night' : 'sunset'} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

const Hero = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';
  
  // Scroll-triggered animation state
  const [triggerCloseAnimation, setTriggerCloseAnimation] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const heroRef = useRef(null);

  // Handle scroll attempt to trigger MacBook close animation
  useEffect(() => {
    const handleWheel = (e) => {
      // Only trigger if scrolling down and animation hasn't been triggered
      if (e.deltaY > 0 && !triggerCloseAnimation && !animationComplete) {
        setTriggerCloseAnimation(true);
      }
    };

    const handleTouchMove = (e) => {
      // For mobile touch scroll
      if (!triggerCloseAnimation && !animationComplete) {
        setTriggerCloseAnimation(true);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [triggerCloseAnimation, animationComplete]);

  // Handle animation complete
  const handleAnimationComplete = useCallback(() => {
    setAnimationComplete(true);
  }, []);

  // Add fun facts to stats for easter eggs
  const statsWithFacts = stats.slice(0, 3).map((stat, i) => ({
    ...stat,
    funFact: [
      "That's countless cups of coffee! ☕",
      "And still counting! 🚀",
      "Finance to SaaS to media! 🌐"
    ][i]
  }));

  const firstName = personalInfo.name.split(' ')[0];

  return (
    <section ref={heroRef} className="relative w-full min-h-screen mx-auto overflow-hidden">
      {/* Animated Background */}
      <div className={isDark ? 'aurora-bg' : 'sunrise-bg'} />
      
      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width: `${60 + i * 40}px`,
              height: `${60 + i * 40}px`,
              left: `${10 + i * 18}%`,
              top: `${15 + (i % 3) * 25}%`,
              background: isDark
                ? `radial-gradient(circle, rgba(129, 140, 248, 0.3) 0%, transparent 70%)`
                : `radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, transparent 70%)`,
            }}
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Main Content - Side by Side Layout */}
      <div className="max-w-7xl mx-auto h-screen flex items-center px-6 sm:px-16">
        <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-8 lg:gap-4">
          
          {/* Left Side - Text Content */}
          <div className="flex flex-row items-start gap-5 lg:w-1/2">
            {/* Accent line */}
            <div className="flex flex-col justify-center items-center mt-5">
              <motion.div 
                className="w-5 h-5 rounded-full"
                style={{ background: 'var(--gradient-accent)' }}
                animate={{ 
                  boxShadow: [
                    '0 0 20px var(--color-accent)',
                    '0 0 40px var(--color-accent)',
                    '0 0 20px var(--color-accent)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div 
                className="w-1 sm:h-80 h-40"
                style={{ background: 'var(--gradient-accent)' }}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>

            {/* Text */}
            <div className="z-10">
              {/* Available status */}
              <motion.div
                className="flex items-center gap-2 mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="status-dot" />
                <span 
                  className="text-xs font-medium tracking-wide uppercase"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Available for opportunities
                </span>
              </motion.div>

              {/* Main Heading with SplitText animation */}
              <h1 className={`${styles.heroHeadText}`} style={{ color: 'var(--color-text)' }}>
                <SplitText 
                  text="Hi, I'm" 
                  animationType="slide"
                  staggerChildren={0.05}
                  delay={0.2}
                />
                {/* Name with GlitchText - official React Bits component */}
                <div className="my-0">
                  <GlitchText
                    speed={0.7}
                    enableShadows={true}
                    enableOnHover={true}
                    className="text-[clamp(40px,10vw,90px)] font-black leading-none"
                  >
                    {firstName}
                  </GlitchText>
                </div>
              </h1>
              
              {/* Subtitle with BlurText */}
              <div className={`${styles.heroSubText} mt-4`} style={{ color: 'var(--color-text-muted)' }}>
                <BlurText text="Building" delay={0.8} />
                {' '}
                <TypingText 
                  texts={personalInfo.taglines}
                  className="text-[var(--color-text)]"
                />
              </div>

              {/* Interactive Stats with click easter eggs */}
              <ScrollReveal delay={1} direction="up">
                <div className="mt-8">
                  <InteractiveStats stats={statsWithFacts} />
                </div>
              </ScrollReveal>

              {/* CTA Buttons with Magnet effect */}
              <ScrollReveal delay={1.2} direction="up">
                <div className="flex gap-4 mt-8">
                  <Magnet strength={0.2}>
                    <motion.a
                      href="#contact"
                      className="btn-primary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Get In Touch
                    </motion.a>
                  </Magnet>
                  <Magnet strength={0.2}>
                    <motion.a
                      href="#work"
                      className="px-8 py-3 rounded-xl font-semibold border-2 border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Work
                    </motion.a>
                  </Magnet>
                </div>
              </ScrollReveal>

              {/* Keyboard hint */}
              <motion.div 
                className="mt-6 text-xs flex items-center gap-2"
                style={{ color: 'var(--color-text-muted)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <kbd 
                  className="px-2 py-1 rounded font-mono text-xs font-semibold"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}`,
                    color: 'var(--color-text)',
                  }}
                >
                  ⌘
                </kbd>
                <span style={{ color: 'var(--color-text-muted)' }}>+</span>
                <kbd 
                  className="px-2 py-1 rounded font-mono text-xs font-semibold"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}`,
                    color: 'var(--color-text)',
                  }}
                >
                  K
                </kbd>
                <span style={{ color: 'var(--color-text-muted)' }}>for quick navigation</span>
              </motion.div>

              {/* Scroll hint when locked */}
              {!animationComplete && (
                <motion.div
                  className="mt-4 text-sm"
                  style={{ color: 'var(--color-accent)' }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ↓ Scroll to continue
                </motion.div>
              )}
            </div>
          </div>

          {/* Right Side - MacBook 3D Model - Centered vertically */}
          <motion.div 
            className="lg:w-1/2 w-full flex items-center justify-center relative"
            style={{ height: '70vh', minHeight: '500px' }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <MacBookCanvas 
              triggerClose={triggerCloseAnimation}
              onAnimationComplete={handleAnimationComplete}
              isDark={isDark}
              onInteract={() => setHasInteracted(true)}
            />

            {/* Drag-to-rotate interaction hint */}
            {!hasInteracted && (
              <motion.div
                className="drag-hint"
                initial={{ opacity: 0, y: 10, x: -100 }}
                animate={{ opacity: 1, y: 20, x: -100 }}
                exit={{ opacity: 0, y: 10, x: -100 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                style={{
                  background: isDark
                    ? 'rgba(15, 23, 42, 0.8)'
                    : 'rgba(248, 250, 252, 0.85)',
                  border: `1px solid ${isDark ? 'rgba(129, 140, 248, 0.2)' : 'rgba(79, 70, 229, 0.15)'}`,
                  color: isDark ? 'var(--color-text)' : 'var(--color-text)',
                }}
              >
                {/* Orbit icon */}
                <svg
                  className="drag-hint-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  <polyline points="22 2 22 8 16 8" />
                </svg>
                <span>Drag to explore 3D</span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator - only show after animation complete */}
      <motion.div 
        className="absolute xs:bottom-10 bottom-6 w-full flex justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: animationComplete ? 1 : 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <a href="#about">
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-[var(--color-accent)] flex justify-center items-start p-2">
            <motion.div
              animate={{ y: [0, 24, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'loop',
              }}
              className="w-3 h-3 rounded-full mb-1"
              style={{ background: 'var(--color-accent)' }}
            />
          </div>
        </a>
      </motion.div>
    </section>
  );
};

// Preload the model
useGLTF.preload('./desktop_pc/scene.gltf');

export default Hero;
