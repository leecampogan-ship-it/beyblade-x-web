# /public/models

All 3D Beyblade and stadium models on this site are generated procedurally at runtime with
Three.js (see `components/three/BeybladeModel.tsx` and `components/three/StadiumScene.tsx`),
so no GLB/GLTF files are required.

To use a licensed GLB model instead, place it here and load it with `useGLTF("/models/<file>.glb")`
from `@react-three/drei`.
