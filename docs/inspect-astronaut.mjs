/* global console */
import { readFileSync } from 'node:fs'
import { Box3, Matrix4, Quaternion, Vector3 } from 'three'
const bytes = readFileSync('public/assets/models/astronauts/Astronaut.glb')
const data = JSON.parse(bytes.subarray(20, 20 + bytes.readUInt32LE(12)).toString())
const regions=[]
function walk(id,parent=new Matrix4()) {
 const n=data.nodes[id],local=n.matrix?new Matrix4().fromArray(n.matrix):new Matrix4().compose(new Vector3(...(n.translation??[0,0,0])),new Quaternion(...(n.rotation??[0,0,0,1])),new Vector3(...(n.scale??[1,1,1])))
 const world=parent.clone().multiply(local)
 if(n.mesh!==undefined) {
  const box=new Box3()
  for(const p of data.meshes[n.mesh].primitives) {const a=data.accessors[p.attributes.POSITION];box.union(new Box3(new Vector3(...a.min),new Vector3(...a.max)).applyMatrix4(world))}
  regions.push({name:n.name,box}); if(['solar_panel','rotors_01','rotors_02','cams','bus'].includes(n.name)) for(const p of data.meshes[n.mesh].primitives) {const a=data.accessors[p.attributes.POSITION]; regions.push({name:n.name+' / '+data.materials[p.material].name,box:new Box3(new Vector3(...a.min),new Vector3(...a.max)).applyMatrix4(world)})}
 }
 for(const child of n.children??[]) walk(child,world)
}
for(const root of data.scenes[data.scene??0].nodes) walk(root)
const bounds=new Box3();for(const r of regions)bounds.union(r.box)
const center=bounds.getCenter(new Vector3()),size=bounds.getSize(new Vector3()),scale=5/Math.max(...size.toArray())
const convert=v=>v.clone().sub(new Vector3(center.x,bounds.min.y,center.z)).multiplyScalar(scale).toArray().map(n=>+n.toFixed(3))
console.log(JSON.stringify({bytes:bytes.length,triangles:data.meshes.flatMap(m=>m.primitives).reduce((n,p)=>n+data.accessors[p.indices].count/3,0),bounds:{min:bounds.min,max:bounds.max,size},scale,regions:regions.map(r=>({name:r.name,min:convert(r.box.min),max:convert(r.box.max),center:convert(r.box.getCenter(new Vector3()))}))},null,2))
