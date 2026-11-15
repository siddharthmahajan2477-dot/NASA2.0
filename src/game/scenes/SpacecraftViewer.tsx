import { Component, Suspense, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { BakeShadows, Html, Line, OrbitControls } from '@react-three/drei'
import { Box3, DataTexture, Euler, Group, LinearFilter, Mesh, PerspectiveCamera, PlaneGeometry, RepeatWrapping, RGBAFormat, Sphere, Vector3, type Material, type Texture } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import type { OrbitControls as OrbitControlsType } from 'three-stdlib'
import type { Point3, SpacecraftConfig } from './inspection'

interface Model { scene: Group; center: Point3; radius: number; bounds: Box3; meshes: number; materials: number; textures: number; triangles: number }

function release(scene: Group) {
  const materials = new Set<Material>()
  const textures = new Set<Texture>()
  scene.traverse((object) => {
    if (object instanceof Mesh) {
      object.geometry.dispose()
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) materials.add(material)
    }
  })
  for (const material of materials) {
    for (const value of Object.values(material)) if (value && typeof value === 'object' && 'isTexture' in value) textures.add(value as Texture)
    material.dispose()
  }
  for (const texture of textures) { (texture.source.data as ImageBitmap | undefined)?.close?.(); texture.dispose() }
}

class GraphicsBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <p role="alert" className="viewer-message">3D rendering is unavailable. Component explanations below remain accessible. Reload to retry graphics.</p> : this.props.children }
}

export default function SpacecraftViewer({ config, selected, onSelect, reset, reducedMotion, studio = false, zoom = 1, showMarkers = true }: {
  config: SpacecraftConfig; selected: string | null; onSelect: (id: string) => void; reset: number; reducedMotion: boolean; studio?: boolean; zoom?: number; showMarkers?: boolean
}) {
  const [model, setModel] = useState<Model | null>(null)
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [lost, setLost] = useState(false)
  const viewport = useRef<HTMLDivElement>(null)
  // The DOM overlay mounts before Canvas initializes its separate React root.
  const overlay = useRef<HTMLDivElement>(null!)
  useEffect(() => {
    let active = true
    let loaded: Group | undefined
    const request = new AbortController()
    const draco = new DRACOLoader().setDecoderPath(`${import.meta.env.BASE_URL}assets/draco/`)
    const loader = new GLTFLoader().setDRACOLoader(draco)
    // Abort the HTTP request on exit, but let an already-started decode settle
    // before terminating workers. This also handles React StrictMode replay.
    void (async () => {
      // StrictMode replays setup/cleanup synchronously in development. Let that
      // probe finish before starting I/O: the discarded setup must not issue an
      // aborted duplicate request. Real unmounts still abort the active fetch.
      await Promise.resolve()
      if (!active) return
      const response = await fetch(config.modelPath, { signal: request.signal })
      if (!response.ok) throw new Error(`Model request failed: ${response.status}`)
      const bytes = await response.arrayBuffer()
      if (!active) return
      const gltf = await loader.parseAsync(bytes, config.modelPath.slice(0, config.modelPath.lastIndexOf('/') + 1))
      loaded = gltf.scene
      if (!active) { release(loaded); return }
      loaded.rotation.copy(new Euler(...config.rotation))
      loaded.updateMatrixWorld(true)
      const bounds = new Box3().setFromObject(loaded)
      const size = bounds.getSize(new Vector3())
      const scale = config.displaySpan / Math.max(size.x, size.y, size.z)
      if (!Number.isFinite(scale) || scale <= 0) { release(loaded); loaded = undefined; setError(true); return }
      loaded.scale.multiplyScalar(scale)
      loaded.updateMatrixWorld(true)
      bounds.setFromObject(loaded)
      const center = bounds.getCenter(new Vector3())
      loaded.position.set(-center.x, -bounds.min.y, -center.z)
      loaded.updateMatrixWorld(true)
      bounds.setFromObject(loaded)
      let meshes = 0, triangles = 0
      const materials = new Set<Material>(), textures = new Set<Texture>()
      loaded.traverse((object) => { if (object instanceof Mesh) { object.castShadow = true; object.receiveShadow = true; meshes++; triangles += (object.geometry.index?.count ?? object.geometry.attributes.position.count) / 3; for (const material of Array.isArray(object.material) ? object.material : [object.material]) { materials.add(material); for (const value of Object.values(material)) if (value && typeof value === 'object' && 'isTexture' in value) textures.add(value as Texture) } } })
      setModel({ scene: loaded, center: bounds.getCenter(new Vector3()).toArray() as Point3, radius: bounds.getBoundingSphere(new Sphere()).radius, bounds: bounds.clone(), meshes, materials: materials.size, textures: textures.size, triangles })
    })().catch(() => { if (active) setError(true) }).finally(() => draco.dispose())
    return () => { active = false; request.abort(); if (loaded) release(loaded) }
  }, [config, attempt])

  return <div ref={viewport} className="spacecraft-viewport" data-model-state={error ? 'error' : model ? 'loaded' : 'loading'} data-model-meshes={model?.meshes} data-model-materials={model?.materials} data-model-textures={model?.textures} data-model-triangles={model?.triangles} data-camera-mode={selected ?? 'overview'}>
    <div ref={overlay} className="hotspot-layer" />
    {error ? <div className="viewer-message" role="alert"><p>The NASA model could not be loaded. The component notes remain available.</p><button className="primary-button" onClick={() => { setError(false); setModel(null); setAttempt((value) => value + 1) }}>Retry model</button></div> : !model ? <p className="viewer-message" role="status">{config.id === 'astronaut-guide' ? 'Loading your NASA spacesuit model…' : 'Loading the NASA spacecraft…'}</p> : <GraphicsBoundary>
      {lost ? <p className="viewer-message" role="alert">Graphics context lost. Reload to restore the scene. Your component notes remain available.</p> : null}
      <Suspense fallback={<p className="viewer-message" role="status">Starting spacecraft graphics… Component notes remain available.</p>}>
      <Canvas shadows frameloop="demand" dpr={[1, 1.5]} camera={{ position: [9, 6, 12], fov: 42, near: 0.1, far: 160 }} gl={{ preserveDrawingBuffer: true, antialias: true }} fallback={<p className="viewer-message" role="alert">3D rendering is unavailable. Component notes remain accessible below.</p>}>
      {!studio && <color attach="background" args={[config.environment.sky ?? '#080b0e']} />}
        <ambientLight intensity={studio ? 1.5 : config.environment.ambient ?? 0.32} />
        {studio && <><hemisphereLight args={['#ffffff', '#66746f', 1.4]} /><directionalLight position={[-5, 4, -3]} intensity={2} /></>}
        <directionalLight position={config.environment.sun} intensity={3.6} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-normalBias={0.035} />
        <Suspense fallback={null}>
          <primitive object={model.scene} dispose={null} />
          {studio ? <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]} receiveShadow><planeGeometry args={[20, 20]} /><shadowMaterial transparent opacity={0.12} /></mesh> : <Surface config={config} />}
          {/* Inspection geometry and sunlight are static. Camera motion does not
              change their shadows; future object animation must dirty the map. */}
          <BakeShadows />
          {(showMarkers ? config.components : []).filter((component) => component.markerOffset && (component.showMarkerInOverview !== false || selected === component.id)).map((component) => <Line key={component.id} points={[component.position, component.position.map((value, index) => value + component.markerOffset![index]) as Point3]} color="#c1d8dc" lineWidth={1} />)}
          {(showMarkers ? config.components : []).map((component, index) => component.showMarkerInOverview === false && selected !== component.id ? null : <Html portal={overlay} key={component.id} position={component.position.map((value, axis) => value + (component.markerOffset?.[axis] ?? 0)) as Point3} center zIndexRange={selected === component.id ? [25, 21] : [20, 0]} occlude={[{ current: model.scene }]}>
            {component.compactLabelOffset ? <div className="compact-hotspot" style={{ '--marker-x': component.compactLabelOffset[0] + 'px', '--marker-y': component.compactLabelOffset[1] + 'px' } as CSSProperties}>
              <svg className="compact-marker-connector" aria-hidden="true"><line x1="0" y1="0" x2={component.compactLabelOffset[0]} y2={component.compactLabelOffset[1]} stroke="#c1d8dc" /></svg>
              <HotspotButton name={component.name} selected={selected === component.id} onSelect={() => onSelect(component.id)} number={index + 1} />
            </div> : <HotspotButton name={component.name} selected={selected === component.id} onSelect={() => onSelect(component.id)} number={index + 1} />}
          </Html>)}
          <CameraRig model={model} config={config} selected={selected} reset={reset} reducedMotion={reducedMotion} viewport={viewport} zoom={zoom} />
          <ContextEvents onLost={setLost} />
        </Suspense>
      </Canvas>
      </Suspense>
    </GraphicsBoundary>}
  </div>
}

function HotspotButton({ name, selected, onSelect, number }: { name: string; selected: boolean; onSelect: () => void; number: number }) {
  const start = useRef({ x: 0, y: 0, moved: false })
  return <button className={`hotspot ${selected ? 'is-selected' : ''}`} aria-label={`Inspect ${name}`} aria-pressed={selected}
    onPointerDown={(event) => { start.current = { x: event.clientX, y: event.clientY, moved: false } }}
    onPointerMove={(event) => { if (Math.hypot(event.clientX - start.current.x, event.clientY - start.current.y) > 8) start.current.moved = true }}
    onClick={(event) => { if (event.detail === 0 || !start.current.moved) onSelect() }}>{number}</button>
}

function ContextEvents({ onLost }: { onLost: (lost: boolean) => void }) {
  const gl = useThree((state) => state.gl)
  const invalidate = useThree((state) => state.invalidate)
  useEffect(() => {
    const canvas = gl.domElement
    const lost = (event: Event) => { event.preventDefault(); onLost(true) }
    const restored = () => { gl.shadowMap.needsUpdate = true; invalidate(); onLost(false) }
    canvas.addEventListener('webglcontextlost', lost)
    canvas.addEventListener('webglcontextrestored', restored)
    return () => { canvas.removeEventListener('webglcontextlost', lost); canvas.removeEventListener('webglcontextrestored', restored) }
  }, [gl, invalidate, onLost])
  return null
}

function CameraRig({ model, config, selected, reset, reducedMotion, viewport, zoom }: {
  model: Model; config: SpacecraftConfig; selected: string | null; reset: number; reducedMotion: boolean; viewport: React.RefObject<HTMLDivElement | null>; zoom: number
}) {
  const controls = useRef<OrbitControlsType>(null)
  const camera = useThree((state) => state.camera) as PerspectiveCamera
  const size = useThree((state) => state.size)
  const invalidate = useThree((state) => state.invalidate)
  const destination = useRef<{ position: Vector3; target: Vector3 } | null>(null)
  const component = config.components.find((item) => item.id === selected)
  const center = useMemo(() => new Vector3(...model.center), [model.center])
  // An off-center focus must not allow the camera to orbit through the cabin
  // or landing gear on the opposite side of its target.
  const clearance = model.radius + (component ? new Vector3(...component.position).distanceTo(center) : 0) + 0.25
  const framing = useMemo(() => {
    const vertical = camera.fov * Math.PI / 180
    const horizontal = 2 * Math.atan(Math.tan(vertical / 2) * size.width / size.height)
    const direction = new Vector3(...config.cameraDirection).normalize()
    const right = new Vector3().crossVectors(new Vector3(0, 1, 0), direction).normalize()
    const up = new Vector3().crossVectors(direction, right).normalize()
    let distance = 0
    for (const x of [model.bounds.min.x, model.bounds.max.x]) for (const y of [model.bounds.min.y, model.bounds.max.y]) for (const z of [model.bounds.min.z, model.bounds.max.z]) {
      const point = new Vector3(x, y, z).sub(new Vector3(...model.center))
      distance = Math.max(distance, point.dot(direction) + Math.max(Math.abs(point.dot(right)) / Math.tan(horizontal / 2), Math.abs(point.dot(up)) / Math.tan(vertical / 2)))
    }
    return distance * 1.12
  }, [camera.fov, size.width, size.height, model, config.cameraDirection])
  useEffect(() => {
    const target = new Vector3(...(component?.position ?? model.center))
    const direction = new Vector3(...(component?.view ?? config.cameraDirection)).normalize()
    const distance = Math.max(clearance, (component ? framing * 0.55 : framing) * zoom)
    const position = target.clone().addScaledVector(direction, distance)
    if (!controls.current) return
    const area = viewport.current?.getBoundingClientRect()
    const offscreen = area && (area.bottom <= 0 || area.top >= window.innerHeight)
    // Notes can be well below the canvas on phones. Apply an unseen focus
    // immediately instead of rendering its tween behind the evidence panel.
    if (reducedMotion || offscreen || reset === 0 && !selected) {
      camera.position.copy(position); controls.current.target.copy(target); controls.current.update(); destination.current = null
    } else destination.current = { position, target }
    invalidate()
  }, [camera, clearance, component, config.cameraDirection, framing, invalidate, model.center, reducedMotion, reset, selected, viewport, zoom])
  useFrame((_, delta) => {
    if (!destination.current || !controls.current) return
    const amount = 1 - Math.exp(-8 * Math.min(delta, 0.05))
    camera.position.lerp(destination.current.position, amount)
    const offset = camera.position.clone().sub(center)
    if (offset.length() < model.radius + 0.25) camera.position.copy(center).add(offset.setLength(model.radius + 0.25))
    controls.current.target.lerp(destination.current.target, amount)
    if (camera.position.distanceTo(destination.current.position) < 0.005 && controls.current.target.distanceTo(destination.current.target) < 0.005) {
      camera.position.copy(destination.current.position); controls.current.target.copy(destination.current.target); destination.current = null
    }
    controls.current.update(); invalidate()
  })
  return <OrbitControls ref={controls} makeDefault enablePan={false} enableDamping={false} minDistance={clearance} maxDistance={Math.max(clearance * 1.5, framing * 1.7)} minPolarAngle={0.15} maxPolarAngle={Math.PI / 2 - 0.025} onStart={() => { destination.current = null }} onChange={() => {
    // DOM hotspots project before Three's render pass. Update the inverse view
    // matrix now so reduced-motion resets cannot leave stale label positions.
    camera.updateMatrixWorld()
    if (viewport.current) viewport.current.dataset.cameraPosition = camera.position.toArray().map((value) => value.toFixed(3)).join(',')
  }} />
}

function Surface({ config }: { config: SpacecraftConfig }) {
  const ground = useMemo(() => {
    const geometry = new PlaneGeometry(130, 130, 80, 80)
    geometry.rotateX(-Math.PI / 2)
    const positions = geometry.attributes.position
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i), z = positions.getZ(i)
      const edge = Math.min(1, Math.max(0, (Math.hypot(x, z) - 4) / 5))
      positions.setY(i, -0.025 + edge * (Math.sin(x * 1.4) * Math.cos(z * 0.9) * 0.025 + Math.sin(z * 2.1 + x) * 0.01))
    }
    geometry.computeVertexNormals()
    const pixels = new Uint8Array(128 * 128 * 4)
    let seed = 1969
    for (let i = 0; i < pixels.length; i += 4) {
      seed = (seed * 1664525 + 1013904223) >>> 0
      const shade = 150 + (seed >>> 24) * 0.09
      pixels[i] = pixels[i + 1] = pixels[i + 2] = shade; pixels[i + 3] = 255
    }
    const texture = new DataTexture(pixels, 128, 128, RGBAFormat)
    texture.wrapS = texture.wrapT = RepeatWrapping; texture.repeat.set(80, 80); texture.magFilter = texture.minFilter = LinearFilter; texture.needsUpdate = true
    return { geometry, texture }
  }, [])
  useEffect(() => () => { ground.geometry.dispose(); ground.texture.dispose() }, [ground])
  const rocks = useMemo(() => Array.from({ length: 38 }, (_, index) => {
    const angle = index * 2.39996
    const distance = 5 + (index % 9) * 1.4
    const scale = 0.06 + (index % 5) * 0.035
    return { position: [Math.cos(angle) * distance, scale * 0.25, Math.sin(angle) * distance] as Point3, scale }
  }), [])
  return <group>
    <mesh geometry={ground.geometry} receiveShadow><meshStandardMaterial color={config.environment.ground} map={ground.texture} bumpMap={ground.texture} bumpScale={0.006} roughness={1} /></mesh>
    {rocks.map((rock, index) => <mesh key={index} position={rock.position} scale={[rock.scale * 1.8, rock.scale * 0.7, rock.scale]} rotation={[index, index * 0.7, index * 0.2]} castShadow receiveShadow><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color={config.environment.rock} roughness={1} flatShading /></mesh>)}
  </group>
}
