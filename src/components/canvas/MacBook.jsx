import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Preload, useGLTF, useAnimations, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CanvasLoader from '../Loader';
import { useThemeStore } from '../../store/useThemeStore';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const MacBook = ({ scrollProgress }) => {
  const group = useRef();
  const { scene, animations } = useGLTF('./desktop_pc/scene.gltf');
  const { actions, mixer } = useAnimations(animations, group);
  
  useEffect(() => {
    // Get the opening animation
    const openAnimation = actions['Animation'];
    
    if (openAnimation) {
      // Pause the animation so we can control it manually
      openAnimation.play();
      openAnimation.paused = true;
      
      // Get the total duration
      const duration = openAnimation.getClip().duration;
      
      // Set the animation time based on scroll progress
      openAnimation.time = scrollProgress * duration;
    }
  }, [scrollProgress, actions]);
  
  // Update animation on each frame
  useFrame(() => {
    if (mixer) {
      mixer.update(0);
    }
  });

  return (
    <group ref={group}>
      {/* Improved lighting for better visibility */}
      <ambientLight intensity={0.5} />
      <hemisphereLight intensity={1} groundColor="#1a1a2e" />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={1.5}
        castShadow
      />
      <pointLight position={[0, 0, 3]} intensity={1} color="#ffffff" />
      <spotLight
        position={[0, 10, 5]}
        angle={0.4}
        penumbra={1}
        intensity={2}
        castShadow
      />
      <primitive
        object={scene}
        scale={5} // Increased from 2.5 to 5
        position={[0, -2, 0]} // Adjusted position
        rotation={[0.15, 0, 0]} // Slightly tilted up for better view
      />
    </group>
  );
};

// Post-processing effects component
const Effects = () => {
  return (
    <EffectComposer>
      <Bloom
        intensity={0.3}
        luminanceThreshold={0.7}
        luminanceSmoothing={0.9}
        blendFunction={BlendFunction.ADD}
      />
      <Vignette
        offset={0.3}
        darkness={0.4}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
};

const MacBookCanvas = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      // Create the scroll-triggered animation using GSAP ScrollTrigger
      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          pin: canvasContainerRef.current,
          scrub: 0.5, // Smoother scrubbing
          onUpdate: (self) => {
            setScrollProgress(self.progress);
            setIsComplete(self.progress >= 0.95);
          },
        });
      });

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative"
      style={{ height: '150vh' }} // Reduced from 200vh for less scrolling
    >
      {/* Pinned canvas container */}
      <div 
        ref={canvasContainerRef}
        className="w-full h-screen flex items-center justify-center"
        style={{
          background: isDark 
            ? 'linear-gradient(to bottom, var(--color-primary), #0a0a1f)' 
            : 'linear-gradient(to bottom, #fef3e2, #fff9f0)'
        }}
      >
        {/* Progress indicator */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10">
          <div 
            className="backdrop-blur-md rounded-full px-6 py-3 text-sm font-medium"
            style={{
              background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)',
              color: 'var(--color-text)',
              border: '1px solid var(--color-card-border)'
            }}
          >
            {isComplete ? '✓ Scroll down to continue' : `Scroll to open MacBook • ${Math.round(scrollProgress * 100)}%`}
          </div>
        </div>
        
        <Canvas
          frameloop="always"
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 1, 4], fov: 45 }} // Closer camera, wider FOV
          gl={{ preserveDrawingBuffer: true, antialias: true }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={<CanvasLoader />}>
            <MacBook scrollProgress={scrollProgress} />
            <Effects />
          </Suspense>
          <Preload all />
        </Canvas>

        {/* Bottom scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-sm text-[var(--color-text-muted)]">
              {isComplete ? 'Continue' : 'Keep scrolling'}
            </span>
            <svg 
              className="w-6 h-6 text-[var(--color-accent)]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// Preload the model
useGLTF.preload('./desktop_pc/scene.gltf');

export default MacBookCanvas;
