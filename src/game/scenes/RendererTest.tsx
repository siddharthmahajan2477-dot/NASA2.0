import { useEffect, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function ContextEvents({ onLost, onRestored }: { onLost: () => void; onRestored: () => void }) {
  const gl = useThree((state) => state.gl)
  useEffect(() => {
    const canvas = gl.domElement
    const lost = (event: Event) => { event.preventDefault(); onLost() }
    canvas.addEventListener('webglcontextlost', lost)
    canvas.addEventListener('webglcontextrestored', onRestored)
    return () => {
      canvas.removeEventListener('webglcontextlost', lost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
    }
  }, [gl, onLost, onRestored])
  return null
}

export default function RendererTest() {
  const [ready, setReady] = useState(false)
  const [lost, setLost] = useState(false)
  return <figure className="renderer-test">
    <div className="renderer-viewport" role="img" aria-label="Technical 3D renderer test: a stationary faceted geometric solid. Not a spacecraft.">
      {!ready && !lost ? <p className="renderer-status" role="status">Starting 3D renderer…</p> : null}
      {lost ? <div className="renderer-status" role="alert">The graphics context was lost. Reload to retry.</div> : null}
      <Canvas
        frameloop="demand"
        gl={{ preserveDrawingBuffer: true }}
        dpr={[1, 1.5]}
        camera={{ position: [3, 2, 4], fov: 40 }}
        fallback={<p className="renderer-status" role="alert">3D rendering is unavailable in this browser. The briefing, settings, and sources remain accessible.</p>}
        onCreated={() => setReady(true)}
      >
        <ContextEvents onLost={() => setLost(true)} onRestored={() => setLost(false)} />
        <color attach="background" args={['#11191e']} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 4, 5]} intensity={2} />
        <mesh rotation={[0.25, 0.4, 0]}>
          <icosahedronGeometry args={[1.15, 0]} />
          <meshStandardMaterial color="#9ab6bf" metalness={0.35} roughness={0.55} flatShading />
        </mesh>
        <OrbitControls makeDefault enablePan={false} enableDamping={false} minDistance={3} maxDistance={8} />
      </Canvas>
    </div>
    <figcaption><span className="eyebrow">RENDERER CHECK / TECHNICAL GEOMETRY</span><p>Drag to orbit. Pinch or scroll to zoom. This is a rendering test, not an Apollo model or playable mission.</p></figcaption>
  </figure>
}
