import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface EyeShapeProps {
  deformation: number;
}

const EyeShape: React.FC<EyeShapeProps> = ({ deformation }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Function to create the eye shape geometry
  const createEyeGeometry = (deformation: number) => {
    const geometry = new THREE.CircleGeometry(1, 64); // Create a circle geometry with 64 segments
    const position = geometry.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);

      // Apply deformation: transition from circle to eye shape
      const factor = Math.abs(y) > 0.8 ? deformation : 1; // Deform points at the top and bottom
      position.setX(i, x * factor);
    }

    position.needsUpdate = true; // Mark position as updated for rendering
    return geometry;
  };

  const geometry = React.useMemo(() => createEyeGeometry(deformation), [deformation]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.01; // Optional: Animate rotation for dynamic effect
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial color="white" />
    </mesh>
  );
};

const EyeShapeScene: React.FC = () => {
  const deformation = 2; // Adjust this value to control the shape dynamically

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <color attach="background" args={['black']} />
      <fog attach="fog" args={['black', 5, 15]} />
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 2]} intensity={1} />

      <EyeShape deformation={deformation} />
      <OrbitControls />
    </Canvas>
  );
};

export default EyeShapeScene;
