import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei'
import * as THREE from 'three'

function NeuronParticles() {
  const ref = useRef()
  const count = 120

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const palette = [
      new THREE.Color('#7C5CFC'),
      new THREE.Color('#E040FB'),
      new THREE.Color('#60A5FA'),
      new THREE.Color('#A78BFA'),
    ]
    for (let i = 0; i < count; i++) {
      const r = 1.8 + Math.random() * 1.4
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
      const c = palette[Math.floor(Math.random() * palette.length)]
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
    }
    return [pos, col]
  }, [])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.08
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.2
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.8} sizeAttenuation />
    </points>
  )
}

function CoreSphere() {
  const meshRef = useRef()
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.08
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <MeshDistortMaterial
          color="#7C5CFC"
          attach="material"
          distort={0.45}
          speed={1.8}
          roughness={0.1}
          metalness={0.6}
          emissive="#4B2FBF"
          emissiveIntensity={0.5}
        />
      </Sphere>
      {/* inner glow ring */}
      <mesh>
        <torusGeometry args={[1.25, 0.015, 16, 80]} />
        <meshBasicMaterial color="#E040FB" transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.15, 0.01, 16, 80]} />
        <meshBasicMaterial color="#7C5CFC" transparent opacity={0.4} />
      </mesh>
    </Float>
  )
}

export default function BrainOrb({ height = 420 }) {
  return (
    <div style={{ width: '100%', height }}>
      <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[3, 3, 3]} intensity={2} color="#7C5CFC" />
        <pointLight position={[-3, -2, -2]} intensity={1.5} color="#E040FB" />
        <pointLight position={[0, 0, 4]} intensity={0.8} color="#60A5FA" />
        <Stars radius={30} depth={20} count={800} factor={3} fade speed={0.5} />
        <NeuronParticles />
        <CoreSphere />
      </Canvas>
    </div>
  )
}
