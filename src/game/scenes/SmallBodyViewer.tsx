import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Line, OrbitControls } from '@react-three/drei'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { BufferGeometry, Vector3, Raycaster, Mesh } from 'three'
import type { OrbitControls as Controls } from 'three-stdlib'
import ErrorBoundary from '../../components/ui/ErrorBoundary'

function ContextNotice({ onLost }: { onLost: (v: boolean) => void }) {
  const { gl } = useThree()
  useEffect(() => { const lost = (e: Event) => { e.preventDefault(); onLost(true) }; const restored = () => onLost(false); const canvas = gl.domElement; canvas.addEventListener('webglcontextlost', lost); canvas.addEventListener('webglcontextrestored', restored); return () => { canvas.removeEventListener('webglcontextlost', lost); canvas.removeEventListener('webglcontextrestored', restored) } }, [gl, onLost])
  return null
}
function BodyScene({ geometry, phase, step, descent }: { geometry: BufferGeometry; phase: string; step: number; descent: number }) {
  const controls = useRef<Controls>(null)
  const { camera, invalidate, gl } = useThree()
  useEffect(() => { camera.position.set(9, 6, 12); controls.current?.target.set(0, 0, 0); controls.current?.update(); gl.domElement.dataset.cameraPosition=camera.position.toArray().map(v=>v.toFixed(3)).join(','); invalidate() }, [camera, invalidate, gl, step])
  const landing = useMemo(() => { const origin = new Vector3(6,4,3); const ray = new Raycaster(origin,origin.clone().negate().normalize()); const temporary = new Mesh(geometry); const hit = ray.intersectObject(temporary)[0]?.point ?? new Vector3(); const material = temporary.material; if (!Array.isArray(material)) material.dispose(); return hit }, [geometry])
  const position = new Vector3(6,4,3).lerp(landing,phase==='surface'?1:descent)
  const orbit = Array.from({length:97}, (_, i) => new Vector3(Math.cos(i * Math.PI / 48) * (phase === 'close' ? 4.5 : 6), Math.sin(i * Math.PI / 48) * 1.5, Math.sin(i * Math.PI / 48) * (phase === 'close' ? 4 : 5)))
  return <><ambientLight intensity={0.5} /><directionalLight position={[8,10,5]} intensity={3} /><mesh geometry={geometry}><meshStandardMaterial color="#8d8378" roughness={1} /></mesh>{['orbit','close'].includes(phase) && <Line points={orbit} color="#b9d8e8" lineWidth={2} />}{phase === 'descent' && <Line points={[new Vector3(6,4,3),landing]} color="#e9bc71" lineWidth={3} />}{['descent','surface'].includes(phase) && <mesh position={position}><sphereGeometry args={[0.09,8,8]} /><meshBasicMaterial color="#ffe9b0" /></mesh>}<OrbitControls onChange={() => { gl.domElement.dataset.cameraPosition=camera.position.toArray().map(v=>v.toFixed(3)).join(',') }} enableDamping={false} ref={controls} makeDefault minDistance={5} maxDistance={28} enablePan={false} /></>
}
export default function SmallBodyViewer({ path, phase }: { path: string; phase: string }) {
 const [geometry, setGeometry] = useState<BufferGeometry | null>(null)
 const [error, setError] = useState(false)
 const [retry, setRetry] = useState(0)
 const [reset, setReset] = useState(0)
 const [descent, setDescent] = useState(0)
 const [lost, setLost] = useState(false)
 useEffect(() => { const abort = new AbortController(); let active = true; let owned: BufferGeometry | null = null
   queueMicrotask(async () => { if (!active) return; setError(false); try { const response = await fetch(path, {signal:abort.signal}); if (!response.ok) throw new Error('Shape request failed'); const g = new STLLoader().parse(await response.arrayBuffer()); if (!active) { g.dispose(); return } g.computeBoundingBox(); const size = g.boundingBox!.getSize(new Vector3()); g.center(); g.scale(6.4/Math.max(size.x,size.y,size.z),6.4/Math.max(size.x,size.y,size.z),6.4/Math.max(size.x,size.y,size.z)); owned = g; setGeometry(g) } catch { if (active) setError(true) } })
   return () => { active=false; abort.abort(); owned?.dispose() }
 }, [path,retry])
 return <div>{phase==='descent' && <label>Illustrative approach progress (not telemetry)<input type="range" min="0" max="1" step="0.05" value={descent} onChange={e=>setDescent(Number(e.target.value))} /></label>}<button className="text-button" onClick={() => setReset(v=>v+1)}>Reset asteroid camera</button><p>Swipe or drag to rotate; pinch or scroll to zoom. Display orientation is not a verified geographic frame.</p>{error ? <p role="alert">Eros could not be loaded. <button onClick={()=>setRetry(v=>v+1)}>Retry Eros model</button></p> : !geometry ? <p role="status">Loading NASA Eros shape.</p> : <ErrorBoundary message="Asteroid graphics are unavailable. Journey notes remain usable."><div className="spacecraft-viewport" data-eros-triangles={geometry.getAttribute('position').count/3}>{lost && <p role="alert">Graphics context lost. Journey notes remain accessible.</p>}<Canvas frameloop="demand" dpr={[1,1.5]} gl={{preserveDrawingBuffer:true}} camera={{position:[9,6,12],fov:42}} fallback={<p role="alert">3D rendering is unavailable. Journey notes remain accessible.</p>}><ContextNotice onLost={setLost} /><BodyScene geometry={geometry} phase={phase} step={reset} descent={descent} /></Canvas></div></ErrorBoundary>}<p>NASA Eros STL; neutral illustrative material, not photographic surface colour. No invented craters. Original shape retained. The small light point represents approach progress, not spacecraft geometry or a geographic landing pin.</p></div>
}
