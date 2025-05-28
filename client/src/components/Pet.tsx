import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { Group, Vector3 } from "three";
import { usePet } from "../lib/stores/usePet";
import { useGameTime } from "../lib/stores/useGameTime";

export default function Pet() {
  const petRef = useRef<Group>(null);
  const { pet, updatePet } = usePet();
  const { gameTime } = useGameTime();
  
  // Simple box geometry for the pet until we have a proper model
  const petPosition = useRef(new Vector3(0, 0.5, 0));
  const animationTime = useRef(0);
  const lastUpdateTime = useRef(Date.now());

  // Update pet stats over time
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const deltaMinutes = (now - lastUpdateTime.current) / (1000 * 60);
      
      if (deltaMinutes >= 1) { // Update every minute
        updatePet({
          hunger: Math.max(0, pet.hunger - 1),
          happiness: Math.max(0, pet.happiness - 0.5),
          energy: Math.max(0, pet.energy - 0.3),
          health: pet.hunger < 20 || pet.happiness < 20 ? Math.max(0, pet.health - 1) : Math.min(100, pet.health + 0.1)
        });
        lastUpdateTime.current = now;
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [pet, updatePet]);

  // Animation loop
  useFrame((state, delta) => {
    if (!petRef.current) return;
    
    animationTime.current += delta;
    
    // Idle animation - gentle bobbing
    if (pet.state === 'idle') {
      petRef.current.position.y = 0.5 + Math.sin(animationTime.current * 2) * 0.1;
      petRef.current.rotation.y = Math.sin(animationTime.current * 0.5) * 0.1;
    }
    
    // Sleeping animation - slower breathing
    if (pet.state === 'sleeping') {
      petRef.current.position.y = 0.3 + Math.sin(animationTime.current * 1) * 0.05;
      petRef.current.rotation.z = 0.3; // Lying down
    }
    
    // Eating animation - nodding
    if (pet.state === 'eating') {
      petRef.current.rotation.x = Math.sin(animationTime.current * 4) * 0.2;
    }
    
    // Playing animation - jumping
    if (pet.state === 'playing') {
      petRef.current.position.y = 0.5 + Math.abs(Math.sin(animationTime.current * 4)) * 0.5;
      petRef.current.rotation.y = animationTime.current * 2;
    }
    
    // Color changes based on health
    const healthRatio = pet.health / 100;
    if (petRef.current.children[0] && 'material' in petRef.current.children[0]) {
      const material = petRef.current.children[0].material as any;
      if (material.color) {
        // Healthy: bright colors, Sick: dull colors
        material.color.setHSL(0.6, healthRatio, 0.3 + healthRatio * 0.4);
      }
    }
  });

  // Get pet size based on age and evolution
  const getPetSize = () => {
    const baseSize = 0.6;
    let stageMultiplier = 1;
    
    switch (pet.evolution.stage) {
      case 'baby': stageMultiplier = 0.7; break;
      case 'child': stageMultiplier = 1.0; break;
      case 'teen': stageMultiplier = 1.3; break;
      case 'adult': stageMultiplier = 1.6; break;
    }
    
    return baseSize * stageMultiplier;
  };

  // Get pet color based on type and health
  const getPetColor = () => {
    const baseColors = {
      cat: "#FF8C42",    // Orange
      dog: "#8B4513",    // Brown
      bird: "#4169E1",   // Blue
      rabbit: "#F5F5F5"  // White
    };
    
    const baseColor = baseColors[pet.petType];
    const healthFactor = pet.health / 100;
    
    // Darken color if sick or unhealthy
    if (pet.sickness.isSick || pet.health < 30) {
      return "#696969"; // Gray when sick
    }
    
    return baseColor;
  };

  // Render different shapes based on pet type
  const renderPetBody = () => {
    const size = getPetSize();
    const color = getPetColor();
    
    switch (pet.petType) {
      case 'cat':
        return (
          <group>
            {/* Cat body - oval */}
            <mesh castShadow receiveShadow scale={[size, size * 0.8, size * 1.2]}>
              <sphereGeometry args={[1, 8, 8]} />
              <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
            </mesh>
            {/* Cat ears */}
            <mesh position={[-0.3 * size, 0.4 * size, 0]} castShadow>
              <coneGeometry args={[0.2 * size, 0.4 * size, 3]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0.3 * size, 0.4 * size, 0]} castShadow>
              <coneGeometry args={[0.2 * size, 0.4 * size, 3]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Cat tail */}
            <mesh position={[0, 0, -0.8 * size]} rotation-x={Math.PI / 4} castShadow>
              <cylinderGeometry args={[0.1 * size, 0.05 * size, 1 * size]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );
      
      case 'dog':
        return (
          <group>
            {/* Dog body - elongated */}
            <mesh castShadow receiveShadow scale={[size * 1.2, size * 0.9, size * 1.4]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
            </mesh>
            {/* Dog ears - floppy */}
            <mesh position={[-0.4 * size, 0.2 * size, 0.2 * size]} rotation-z={-Math.PI / 4} castShadow>
              <boxGeometry args={[0.3 * size, 0.6 * size, 0.1 * size]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0.4 * size, 0.2 * size, 0.2 * size]} rotation-z={Math.PI / 4} castShadow>
              <boxGeometry args={[0.3 * size, 0.6 * size, 0.1 * size]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Dog tail - wagging */}
            <mesh position={[0, 0.2 * size, -0.9 * size]} rotation-x={-Math.PI / 6} castShadow>
              <cylinderGeometry args={[0.08 * size, 0.12 * size, 0.8 * size]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );
      
      case 'bird':
        return (
          <group>
            {/* Bird body - round */}
            <mesh castShadow receiveShadow scale={[size * 0.8, size, size * 0.8]}>
              <sphereGeometry args={[1, 8, 8]} />
              <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
            </mesh>
            {/* Bird beak */}
            <mesh position={[0, 0, 0.8 * size]} castShadow>
              <coneGeometry args={[0.1 * size, 0.3 * size, 4]} />
              <meshStandardMaterial color="#FFA500" />
            </mesh>
            {/* Bird wings */}
            <mesh position={[-0.6 * size, 0, 0]} rotation-z={-Math.PI / 6} castShadow>
              <boxGeometry args={[0.8 * size, 0.1 * size, 0.4 * size]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0.6 * size, 0, 0]} rotation-z={Math.PI / 6} castShadow>
              <boxGeometry args={[0.8 * size, 0.1 * size, 0.4 * size]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );
      
      case 'rabbit':
        return (
          <group>
            {/* Rabbit body - oval */}
            <mesh castShadow receiveShadow scale={[size, size * 1.1, size]}>
              <sphereGeometry args={[1, 8, 8]} />
              <meshStandardMaterial color={color} roughness={0.6} metalness={0.0} />
            </mesh>
            {/* Rabbit ears - long */}
            <mesh position={[-0.2 * size, 0.8 * size, 0]} castShadow>
              <cylinderGeometry args={[0.1 * size, 0.05 * size, 1.2 * size]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0.2 * size, 0.8 * size, 0]} castShadow>
              <cylinderGeometry args={[0.1 * size, 0.05 * size, 1.2 * size]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Rabbit tail - fluffy */}
            <mesh position={[0, 0, -0.6 * size]} castShadow>
              <sphereGeometry args={[0.2 * size, 6, 6]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );
      
      default:
        return (
          <mesh castShadow receiveShadow scale={[size, size, size]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
          </mesh>
        );
    }
  };

  const size = getPetSize();

  return (
    <group ref={petRef} position={[0, 0.5, 0]}>
      {/* Pet body based on type */}
      {renderPetBody()}
      
      {/* Eyes */}
      <mesh position={[-0.2 * size, 0.2 * size, 0.5 * size]} castShadow>
        <sphereGeometry args={[0.1 * size, 8, 8]} />
        <meshStandardMaterial color={pet.happiness > 50 ? "#FFD700" : "#666666"} />
      </mesh>
      <mesh position={[0.2 * size, 0.2 * size, 0.5 * size]} castShadow>
        <sphereGeometry args={[0.1 * size, 8, 8]} />
        <meshStandardMaterial color={pet.happiness > 50 ? "#FFD700" : "#666666"} />
      </mesh>
      
      {/* Nose */}
      <mesh position={[0, 0, 0.5 * size]} castShadow>
        <sphereGeometry args={[0.05 * size, 8, 8]} />
        <meshStandardMaterial color="#FF6B6B" />
      </mesh>
      
      {/* Status indicators above pet */}
      {pet.sickness.isSick && (
        <group position={[0, 2, 0]}>
          <mesh>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshBasicMaterial color="#FF4444" />
          </mesh>
          {/* Sickness type indicator */}
          <mesh position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color={
              pet.sickness.type === 'cold' ? "#87CEEB" :
              pet.sickness.type === 'stomach' ? "#90EE90" :
              pet.sickness.type === 'sadness' ? "#9370DB" :
              "#FFA500"
            } />
          </mesh>
        </group>
      )}
      
      {pet.health < 30 && !pet.sickness.isSick && (
        <mesh position={[0, 2, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color="#FF4444" />
        </mesh>
      )}
      
      {pet.happiness > 80 && !pet.sickness.isSick && (
        <mesh position={[0, 2, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color="#FFD700" />
        </mesh>
      )}
      
      {/* Evolution stage indicator */}
      <mesh position={[1.5, 1, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color={
          pet.evolution.stage === 'baby' ? "#FFB6C1" :
          pet.evolution.stage === 'child' ? "#98FB98" :
          pet.evolution.stage === 'teen' ? "#87CEEB" :
          "#FFD700"
        } />
      </mesh>
    </group>
  );
}
