import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles({ count = 200 }) {
  const ref = useRef()

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const spd = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 14
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6
      spd[i] = 0.002 + Math.random() * 0.004
    }
    return [pos, spd]
  }, [count])

  useFrame(() => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += speeds[i]
      if (pos[i * 3 + 1] > 4) pos[i * 3 + 1] = -4
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#7C5CFC" transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

export default function ParticleField({ height = 300 }) {
  return (
    <div style={{ width: '100%', height, position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <Particles count={220} />
      </Canvas>
    </div>
  )
}
