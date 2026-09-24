import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Float } from '@react-three/drei'
import * as THREE from 'three'

const MOOD_CONFIG = {
  Normal:               { color: '#10B981', emissive: '#065F46', distort: 0.2, speed: 1.2 },
  Stress:               { color: '#F59E0B', emissive: '#92400E', distort: 0.55, speed: 3.5 },
  Bipolar:              { color: '#A78BFA', emissive: '#5B21B6', distort: 0.5,  speed: 2.8 },
  Suicidal:             { color: '#EF4444', emissive: '#7F1D1D', distort: 0.65, speed: 2.0 },
  Anxiety:              { color: '#60A5FA', emissive: '#1E3A5F', distort: 0.6,  speed: 4.0 },
  Depression:           { color: '#FB923C', emissive: '#7C2D12', distort: 0.3,  speed: 0.8 },
  'Personality disorder':{ color: '#2DD4BF', emissive: '#134E4A', distort: 0.45, speed: 2.2 },
}

function MoodMesh({ mood }) {
  const meshRef = useRef()
  const cfg = MOOD_CONFIG[mood] || MOOD_CONFIG.Normal

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <Float speed={1.8} floatIntensity={0.5} rotationIntensity={0.3}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={cfg.color}
          emissive={cfg.emissive}
          emissiveIntensity={0.6}
          distort={cfg.distort}
          speed={cfg.speed}
          roughness={0.15}
          metalness={0.5}
        />
      </mesh>
      <mesh>
        <torusGeometry args={[1.3, 0.012, 16, 80]} />
        <meshBasicMaterial color={cfg.color} transparent opacity={0.5} />
      </mesh>
    </Float>
  )
}

export function MoodSphere({ mood = 'Normal', size = 200 }) {
  const cfg = MOOD_CONFIG[mood] || MOOD_CONFIG.Normal

  return (
    <div style={{ width: size, height: size }}>
      <Canvas camera={{ position: [0, 0, 3.2], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[2, 2, 2]} intensity={3} color={cfg.color} />
        <pointLight position={[-2, -1, -1]} intensity={1.5} color={cfg.emissive} />
        <MoodMesh mood={mood} />
      </Canvas>
    </div>
  )
}

export default MoodSphere
