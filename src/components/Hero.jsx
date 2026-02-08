import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload, useGLTF, useAnimations } from '@react-three/drei';
import { styles } from '../styles';
import { personalInfo, stats } from '../constants';
import { useThemeStore } from '../store/useThemeStore';
import CanvasLoader from './Loader';
import { SplitText, GradientText, BlurText, Magnet, ScrollReveal, InteractiveStats } from './ui';

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

// MacBook 3D Model Component
const MacBook = ({ isMobile }) => {
  const { scene, animations } = useGLTF('./desktop_pc/scene.gltf');
  const { actions } = useAnimations(animations, scene);
  
  useEffect(() => {
    const openAnimation = actions['Animation'];
    if (openAnimation) {
      openAnimation.reset();
      openAnimation.setLoop(false, 1);
      openAnimation.clampWhenFinished = true;
      openAnimation.play();
    }
  }, [actions]);

  return (
    <group>
      <ambientLight intensity={0.4} />
      <hemisphereLight intensity={0.8} groundColor="#1a1a2e" />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <spotLight position={[0, 10, 5]} angle={0.3} penumbra={1} intensity={1.5} />
      <primitive
        object={scene}
        scale={isMobile ? 4 : 5.5}
        position={isMobile ? [0, -1.5, 0] : [0, -2, 0]}
        rotation={[0.1, -0.3, 0]}
      />
    </group>
  );
};

// MacBook Canvas with controls
const MacBookCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Canvas
      frameloop="demand"
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls 
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2.5}
          autoRotate
          autoRotateSpeed={0.5}
        />
        <MacBook isMobile={isMobile} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

const Hero = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  // Add fun facts to stats for easter eggs
  const statsWithFacts = stats.slice(0, 3).map((stat, i) => ({
    ...stat,
    funFact: [
      "That's countless cups of coffee! ☕",
      "And still counting! 🚀",
      "AI is my superpower! 🤖"
    ][i]
  }));

  return (
    <section className="relative w-full min-h-screen mx-auto overflow-hidden">
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
                ? `radial-gradient(circle, var(--color-accent) 0%, transparent 70%)`
                : `radial-gradient(circle, var(--color-accent-secondary) 0%, transparent 70%)`,
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
        <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-8 lg:gap-0">
          
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
              {/* Main Heading with SplitText animation */}
              <h1 className={`${styles.heroHeadText}`} style={{ color: 'var(--color-text)' }}>
                <SplitText 
                  text="Hi, I'm" 
                  animationType="slide"
                  staggerChildren={0.05}
                  delay={0.2}
                />
                <br />
                <GradientText duration={4}>
                  <SplitText 
                    text={personalInfo.name.split(' ')[0]} 
                    animationType="scale"
                    staggerChildren={0.08}
                    delay={0.5}
                  />
                </GradientText>
              </h1>
              
              {/* Subtitle with BlurText */}
              <div className={`${styles.heroSubText} mt-2`} style={{ color: 'var(--color-text-muted)' }}>
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
                      className="px-8 py-3 rounded-xl font-semibold border-2 border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-primary)] transition-all duration-300"
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
                className="mt-6 text-xs text-[var(--color-text-muted)] flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <kbd className="px-2 py-1 rounded bg-[var(--color-secondary)] border border-[var(--color-card-border)]">⌘</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 rounded bg-[var(--color-secondary)] border border-[var(--color-card-border)]">K</kbd>
                <span>for quick navigation</span>
              </motion.div>
            </div>
          </div>

          {/* Right Side - MacBook 3D Model */}
          <motion.div 
            className="lg:w-1/2 h-[400px] lg:h-[600px] w-full"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <MacBookCanvas />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute xs:bottom-10 bottom-6 w-full flex justify-center items-center">
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
      </div>
    </section>
  );
};

// Preload the model
useGLTF.preload('./desktop_pc/scene.gltf');

export default Hero;
