import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointsMaterial } from "three";
import { usePet } from "../lib/stores/usePet";
import { useGameTime } from "../lib/stores/useGameTime";

export default function ParticleSystem() {
  const pointsRef = useRef<Points>(null);
  const { pet } = usePet();
  const { isNight } = useGameTime();
  
  // Generate particle positions
  const particles = useMemo(() => {
    const particleCount = 50;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Random positions around the pet area
      positions[i3] = (Math.random() - 0.5) * 16; // x
      positions[i3 + 1] = Math.random() * 8 + 1; // y
      positions[i3 + 2] = (Math.random() - 0.5) * 16; // z
    }
    
    return positions;
  }, []);

  // Animation for floating particles
  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < positions.length; i += 3) {
      // Gentle floating motion
      positions[i + 1] += Math.sin(time + i) * 0.01; // y movement
      
      // Reset particles that float too high
      if (positions[i + 1] > 10) {
        positions[i + 1] = 1;
      }
      
      // Add some horizontal drift
      positions[i] += Math.sin(time * 0.5 + i) * 0.005; // x drift
      positions[i + 2] += Math.cos(time * 0.5 + i) * 0.005; // z drift
      
      // Keep particles within bounds
      if (Math.abs(positions[i]) > 8) {
        positions[i] = (Math.random() - 0.5) * 16;
      }
      if (Math.abs(positions[i + 2]) > 8) {
        positions[i + 2] = (Math.random() - 0.5) * 16;
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  // Show different particles based on pet state and happiness
  const getParticleColor = () => {
    if (pet.happiness > 80) return "#FFD700"; // Golden happy particles
    if (pet.health < 30) return "#FF6B6B"; // Red concern particles
    if (isNight) return "#87CEEB"; // Blue night particles
    return "#90EE90"; // Green normal particles
  };

  const getParticleSize = () => {
    return pet.happiness > 70 ? 3 : 2;
  };

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={getParticleColor()}
        size={getParticleSize()}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.6}
        alphaTest={0.001}
      />
    </points>
  );
}
