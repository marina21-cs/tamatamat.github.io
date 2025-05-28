import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { OrbitControls, Environment, PerspectiveCamera } from "@react-three/drei";
import { useAudio } from "./lib/stores/useAudio";
import { usePet } from "./lib/stores/usePet";
import { useGameTime } from "./lib/stores/useGameTime";
import Pet from "./components/Pet";
import Environment3D from "./components/Environment";
import GameUI from "./components/GameUI";
import ParticleSystem from "./components/ParticleSystem";

import "@fontsource/inter";

function App() {
  const { initializeAudio, playBackgroundMusic } = useAudio();
  const { loadPet } = usePet();
  const { startTime } = useGameTime();

  useEffect(() => {
    // Initialize the game
    loadPet();
    startTime();
    
    // Initialize audio after user interaction
    const handleFirstInteraction = () => {
      initializeAudio();
      playBackgroundMusic();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
    
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
    
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [initializeAudio, playBackgroundMusic, loadPet, startTime]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 3, 8]} fov={60} />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        
        {/* Sky Environment */}
        <Environment preset="sunset" />
        
        <Suspense fallback={null}>
          {/* Game Environment */}
          <Environment3D />
          
          {/* Virtual Pet */}
          <Pet />
          
          {/* Particle Effects */}
          <ParticleSystem />
        </Suspense>
        
        {/* Camera Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          maxDistance={15}
          minDistance={5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 6}
        />
      </Canvas>
      
      {/* Game UI Overlay */}
      <GameUI />
    </div>
  );
}

export default App;
