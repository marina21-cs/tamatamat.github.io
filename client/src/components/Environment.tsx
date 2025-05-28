import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useGameTime } from "../lib/stores/useGameTime";
import { usePet } from "../lib/stores/usePet";

export default function Environment3D() {
  const { isNight } = useGameTime();
  const { pet } = usePet();
  
  // Load textures
  const grassTexture = useTexture("/textures/grass.png");
  const woodTexture = useTexture("/textures/wood.jpg");
  
  // Pre-calculate positions for decorative elements
  const decorativeElements = useMemo(() => {
    const elements = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 4 + Math.random() * 2;
      elements.push({
        position: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius],
        height: 0.5 + Math.random() * 1.5,
        type: Math.random() > 0.5 ? 'tree' : 'rock'
      });
    }
    return elements;
  }, []);

  return (
    <group>
      {/* Ground */}
      <mesh receiveShadow position={[0, -0.1, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[8, 32]} />
        <meshStandardMaterial
          map={grassTexture}
          color={isNight ? "#2d4a2d" : "#4a7c4a"}
        />
      </mesh>
      
      {/* Pet House */}
      <group position={[-3, 0, -2]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.5, 1, 1.5]} />
          <meshStandardMaterial
            map={woodTexture}
            color={isNight ? "#8B4513" : "#D2691E"}
          />
        </mesh>
        {/* Roof */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <coneGeometry args={[1.2, 0.8, 4]} />
          <meshStandardMaterial color={isNight ? "#8B0000" : "#DC143C"} />
        </mesh>
      </group>
      
      {/* Food Bowl */}
      <group position={[2, 0, 1]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.3, 0.2, 0.2, 16]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Food in bowl if pet was recently fed */}
        {pet.lastFed && Date.now() - pet.lastFed < 300000 && (
          <mesh position={[0, 0.15, 0]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshStandardMaterial color="#FFD700" />
          </mesh>
        )}
      </group>
      
      {/* Water Bowl */}
      <group position={[2.5, 0, 0.5]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.25, 0.2, 0.15, 16]} />
          <meshStandardMaterial color="#4169E1" />
        </mesh>
        {/* Water surface */}
        <mesh position={[0, 0.1, 0]} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[0.2, 16]} />
          <meshStandardMaterial color="#87CEEB" transparent opacity={0.8} />
        </mesh>
      </group>
      
      {/* Default Toy Ball */}
      <mesh position={[1, 0.2, -1]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#FF69B4" />
      </mesh>

      {/* Purchased Items from Store */}
      {pet.inventory?.appliances.includes('super_ball') && (
        <mesh position={[2, 0.3, -2]} castShadow>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#FFD700" metalness={0.3} roughness={0.2} />
        </mesh>
      )}

      {pet.inventory?.appliances.includes('comfort_chair') && (
        <group position={[3, 0, 1]}>
          {/* Chair seat */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.8, 0.1, 0.8]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          {/* Chair back */}
          <mesh position={[0, 0.5, -0.3]} castShadow>
            <boxGeometry args={[0.8, 0.8, 0.1]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          {/* Chair legs */}
          {[[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]].map((pos, i) => (
            <mesh key={i} position={[pos[0], -0.3, pos[1]] as [number, number, number]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 0.6]} />
              <meshStandardMaterial color="#654321" />
            </mesh>
          ))}
        </group>
      )}

      {pet.inventory?.appliances.includes('flower_pot') && (
        <group position={[-2, 0, 3]}>
          {/* Pot */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.3, 0.25, 0.4, 8]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          {/* Flower */}
          <mesh position={[0, 0.4, 0]} castShadow>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial color="#FF69B4" />
          </mesh>
          {/* Stem */}
          <mesh position={[0, 0.1, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.3]} />
            <meshStandardMaterial color="#228B22" />
          </mesh>
        </group>
      )}

      {pet.inventory?.appliances.includes('mini_playground') && (
        <group position={[-4, 0, 0]}>
          {/* Playground platform */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[1.5, 1.5, 0.2, 16]} />
            <meshStandardMaterial color="#FF6B35" />
          </mesh>
          {/* Mini slide */}
          <mesh position={[0.8, 0.4, 0]} rotation-z={-Math.PI / 6} castShadow>
            <boxGeometry args={[0.8, 0.1, 0.4]} />
            <meshStandardMaterial color="#4169E1" />
          </mesh>
          {/* Swing */}
          <group position={[-0.8, 0.8, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.4, 0.05, 0.2]} />
              <meshStandardMaterial color="#FFD700" />
            </mesh>
            {/* Swing chains */}
            <mesh position={[-0.15, 0.4, 0]} castShadow>
              <cylinderGeometry args={[0.01, 0.01, 0.8]} />
              <meshStandardMaterial color="#696969" />
            </mesh>
            <mesh position={[0.15, 0.4, 0]} castShadow>
              <cylinderGeometry args={[0.01, 0.01, 0.8]} />
              <meshStandardMaterial color="#696969" />
            </mesh>
          </group>
        </group>
      )}

      {pet.inventory?.appliances.includes('garden_set') && (
        <group position={[4, 0, -3]}>
          {/* Multiple small plants */}
          {[{x: 0, z: 0}, {x: 0.8, z: 0.3}, {x: -0.5, z: 0.7}].map((pos, i) => (
            <group key={i} position={[pos.x, 0, pos.z]}>
              <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.15, 0.12, 0.25, 8]} />
                <meshStandardMaterial color="#8B4513" />
              </mesh>
              <mesh position={[0, 0.2, 0]} castShadow>
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshStandardMaterial color="#32CD32" />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {pet.inventory?.appliances.includes('pet_mansion') && (
        <group position={[-5, 0, -1]}>
          {/* Luxury house base */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2.5, 1.5, 2]} />
            <meshStandardMaterial color="#DAA520" />
          </mesh>
          {/* Mansion roof */}
          <mesh position={[0, 1.2, 0]} castShadow>
            <coneGeometry args={[1.8, 1.2, 8]} />
            <meshStandardMaterial color="#B22222" />
          </mesh>
          {/* Mansion windows */}
          <mesh position={[-0.8, 0.3, 1.05]} castShadow>
            <boxGeometry args={[0.3, 0.3, 0.05]} />
            <meshStandardMaterial color="#87CEEB" />
          </mesh>
          <mesh position={[0.8, 0.3, 1.05]} castShadow>
            <boxGeometry args={[0.3, 0.3, 0.05]} />
            <meshStandardMaterial color="#87CEEB" />
          </mesh>
          {/* Mansion door */}
          <mesh position={[0, -0.2, 1.05]} castShadow>
            <boxGeometry args={[0.4, 0.8, 0.05]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
        </group>
      )}
      
      {/* Bed */}
      <group position={[-1, 0, 2]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.8, 0.8, 0.2, 16]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Cushion */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.7, 0.7, 0.1, 16]} />
          <meshStandardMaterial color="#DDA0DD" />
        </mesh>
      </group>
      
      {/* Decorative Environment Elements */}
      {decorativeElements.map((element, index) => (
        <group key={index} position={element.position}>
          {element.type === 'tree' ? (
            <>
              {/* Tree trunk */}
              <mesh castShadow>
                <cylinderGeometry args={[0.1, 0.15, element.height]} />
                <meshStandardMaterial color="#8B4513" />
              </mesh>
              {/* Tree foliage */}
              <mesh position={[0, element.height * 0.8, 0]} castShadow>
                <sphereGeometry args={[0.4, 8, 8]} />
                <meshStandardMaterial color={isNight ? "#1a4a1a" : "#228B22"} />
              </mesh>
            </>
          ) : (
            /* Rock */
            <mesh castShadow>
              <sphereGeometry args={[0.3, 6, 6]} />
              <meshStandardMaterial color={isNight ? "#2F4F4F" : "#696969"} />
            </mesh>
          )}
        </group>
      ))}
      
      {/* Sky color changes based on time */}
      <mesh position={[0, 0, -10]} scale={[20, 20, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color={isNight ? "#0a0a2e" : "#87CEEB"}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}
