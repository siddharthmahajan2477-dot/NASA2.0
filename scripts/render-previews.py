import sys, os, json, struct
import DracoPy
import numpy as np
from PIL import Image
import trimesh

ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'../public/assets'))
OUT=ROOT+'/previews'
os.makedirs(OUT,exist_ok=True)

def render(path,name,direction=(.25,.12,1),size=(900,1100)):
    scene=trimesh.load(ROOT+'/models/'+path,force='scene')
    raw=open(ROOT+'/models/'+path,'rb').read()
    json_size=struct.unpack_from('<I',raw,12)[0]
    gltf=json.loads(raw[20:20+json_size]);binary=raw[28+json_size:]
    primitives=[p for mesh in gltf['meshes'] for p in mesh['primitives']]
    assert len(primitives)==len(scene.geometry), 'Geometry mapping must match source primitives'
    for geometry,primitive in zip(scene.geometry.values(),primitives):
        extension=primitive.get('extensions',{}).get('KHR_draco_mesh_compression')
        if not extension:continue
        view=gltf['bufferViews'][extension['bufferView']]
        start=view.get('byteOffset',0)
        decoded=DracoPy.decode(binary[start:start+view['byteLength']])
        attrs={key:decoded.get_attribute_by_unique_id(value)['data'] for key,value in extension['attributes'].items()}
        geometry.vertices=attrs['POSITION'];geometry.faces=decoded.faces
        if 'NORMAL' in attrs:geometry.vertex_normals=attrs['NORMAL']
        if 'TEXCOORD_0' in attrs:geometry.visual.uv=attrs['TEXCOORD_0']
    meshes=[]
    for node in scene.graph.nodes_geometry:
        transform,geo=scene.graph[node]
        mesh=scene.geometry[geo].copy(include_cache=True)
        mesh.apply_transform(transform)
        meshes.append(mesh)
    verts=np.concatenate([m.vertices for m in meshes])
    center=(verts.min(0)+verts.max(0))/2
    forward=np.array(direction,dtype=float);forward/=np.linalg.norm(forward)
    right=np.cross([0,1,0],forward);right/=np.linalg.norm(right)
    up=np.cross(forward,right)
    basis=np.array([right,up,forward]).T
    projected=(verts-center)@basis
    span=np.ptp(projected[:,:2],axis=0)
    width,height=size
    scale=min(width*.89/span[0],height*.91/span[1])
    image=np.zeros((height,width,4),dtype=np.uint8)
    depth=np.full((height,width),-np.inf)
    light=np.array([-.45,.65,.9]);light/=np.linalg.norm(light)
    light2=np.array([.8,.2,.1]);light2/=np.linalg.norm(light2)
    for mesh in meshes:
        p=(mesh.vertices-center)@basis
        p[:,:2]*=scale
        p[:,0]+=width/2;p[:,1]=height/2-p[:,1]
        normals=mesh.vertex_normals@basis
        material=getattr(mesh.visual,'material',None)
        texture=getattr(material,'baseColorTexture',None)
        factor=getattr(material,'baseColorFactor',None)
        color=np.array(factor[:3] if factor is not None else [210,215,215],dtype=float)
        tex=np.asarray(texture.convert('RGB')) if texture else None
        uv=getattr(mesh.visual,'uv',None)
        for face in mesh.faces:
            tri=p[face]
            xmin=max(0,int(np.floor(tri[:,0].min())));xmax=min(width-1,int(np.ceil(tri[:,0].max())))
            ymin=max(0,int(np.floor(tri[:,1].min())));ymax=min(height-1,int(np.ceil(tri[:,1].max())))
            if xmax<xmin or ymax<ymin:continue
            a,b,c=tri
            den=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1])
            if abs(den)<1e-8:continue
            xx,yy=np.meshgrid(np.arange(xmin,xmax+1)+.5,np.arange(ymin,ymax+1)+.5)
            w1=((b[1]-c[1])*(xx-c[0])+(c[0]-b[0])*(yy-c[1]))/den
            w2=((c[1]-a[1])*(xx-c[0])+(a[0]-c[0])*(yy-c[1]))/den
            w3=1-w1-w2
            z=w1*a[2]+w2*b[2]+w3*c[2]
            mask=(w1>=0)&(w2>=0)&(w3>=0)&(z>depth[ymin:ymax+1,xmin:xmax+1])
            if not mask.any():continue
            weights=np.stack([w1[mask],w2[mask],w3[mask]],axis=1)
            n=weights@normals[face];n/=np.maximum(np.linalg.norm(n,axis=1,keepdims=True),1e-8)
            shade=.48+.68*np.maximum(0,n@light)+.2*np.maximum(0,n@light2)
            if tex is not None and uv is not None:
                coords=weights@uv[face]
                tx=(np.mod(coords[:,0],1)*(tex.shape[1]-1)).astype(int)
                ty=((1-np.mod(coords[:,1],1))*(tex.shape[0]-1)).astype(int)
                base=tex[ty,tx].astype(float)*(color/255)[None,:]
            else:base=np.tile(color,(len(weights),1))
            rgb=np.clip(base*shade[:,None]*1.5,0,255).astype(np.uint8)
            image[ymin:ymax+1,xmin:xmax+1][mask]=np.column_stack([rgb,np.full(len(rgb),255)])
            depth[ymin:ymax+1,xmin:xmax+1][mask]=z[mask]
    img=Image.fromarray(image).resize((width//2,height//2),Image.Resampling.LANCZOS)
    img.save(OUT+'/'+name+'.webp',quality=92)
    print(name, 'rendered from',len(meshes),'meshes',flush=True)

models={
 'astronaut':('astronauts/Astronaut.glb',(.14,.06,1),(1100,1400)),
 'apollo':('spacecraft/Apollo Lunar Module.glb',(.65,.4,1),(1200,850)),
 'ingenuity':('spacecraft/Ingenuity Mars Helicopter.glb',(.7,.4,1),(1200,850)),
 'near':('spacecraft/NEAR Shoemaker.glb',(.6,.35,1),(1200,850)),
 'earth':('planets/Earth_1_12756.glb',(.3,.15,1),(1400,1400)),
}
for name in sys.argv[1:] or models:
    path,direction,size=models[name]
    render(path,name,direction,size)
