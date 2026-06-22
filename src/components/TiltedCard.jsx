import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import './TiltedCard.css';

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2
};

export default function TiltedCard({
  children,
  imageSrc,
  altText = 'Tilted card image',
  captionText = '',
  containerHeight = '300px',
  containerWidth = '100%',
  imageHeight = '300px',
  imageWidth = '300px',
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  showMobileWarning = true,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false,
  className = '',
  // Aliases for backward compatibility / wrapper usage
  maxTilt,
  scale
}) {
  const ref = useRef(null);

  // Use props or aliases (aliases take precedence if provided for backward compat)
  const finalScaleOnHover = scale ?? scaleOnHover;
  const finalRotateAmplitude = maxTilt ?? rotateAmplitude;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scaleSpring = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1
  });

  const [lastY, setLastY] = useState(0);

  function handleMouse(e) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -finalRotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * finalRotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);

    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);

    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    scaleSpring.set(finalScaleOnHover);
    opacity.set(1);
  }

  function handleMouseLeave() {
    opacity.set(0);
    scaleSpring.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
  }

  return (
    <figure
      ref={ref}
      className={`tilted-card-figure ${className}`}
      style={{
        height: containerHeight,
        width: containerWidth
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showMobileWarning && (
        <div className="tilted-card-mobile-alert">This effect is not optimized for mobile. Check on desktop.</div>
      )}

      <motion.div
        className="tilted-card-inner"
        style={{
          width: children ? '100%' : imageWidth,
          height: children ? '100%' : imageHeight,
          rotateX,
          rotateY,
          scale: scaleSpring,
          transformStyle: 'preserve-3d'
        }}
      >
        {children ? (
          <div className="w-full h-full transform preserve-3d">
            {children}
          </div>
        ) : (
          <>
            <motion.img
              src={imageSrc}
              alt={altText}
              className="tilted-card-img"
              style={{
                width: imageWidth,
                height: imageHeight
              }}
            />
            {displayOverlayContent && overlayContent && (
              <motion.div className="tilted-card-overlay">{overlayContent}</motion.div>
            )}
          </>
        )}
      </motion.div>

      {showTooltip && captionText && !children && (
        <motion.figcaption
          className="tilted-card-caption"
          style={{
            x,
            y,
            opacity,
            rotate: rotateFigcaption
          }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
}
