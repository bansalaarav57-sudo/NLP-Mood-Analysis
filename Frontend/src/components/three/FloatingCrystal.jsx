import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial, Float } from '@react-three/drei'

function Crystal() {
  const meshRef = useRef()
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <Float speed={2} floatIntensity={0.8} rotationIntensity={0.5}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[1, 0]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.5}
          roughness={0.05}
          transmissionSampler
          chromaticAberration={0.06}
          anisotropy={0.3}
          distortion={0.5}
          distortionScale={0.3}
          temporalDistortion={0.1}
          iridescence={1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
          color="#7C5CFC"
        />
      </mesh>
    </Float>
  )
}

export default function FloatingCrystal({ size = 180 }) {
  return (
    <div style={{ width: size, height: size }}>
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[3, 3, 3]} intensity={4} color="#7C5CFC" />
        <pointLight position={[-3, -3, -3]} intensity={2} color="#E040FB" />
        <Crystal />
      </Canvas>
    </div>
  )
}
