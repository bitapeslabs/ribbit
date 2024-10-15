import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Group } from "three";
import { Suspense, useRef, useMemo } from "react";
import useMouseAndScreen from "@/ui/hooks/useMouseAndScreen";
import * as THREE from "three";

function MeshComponent({ frogPositionZ = 0 }) {
  const fileUrl = "/3d/frog.glb";
  const mesh = useRef<Group>(null!);
  const gltf = useLoader(GLTFLoader, fileUrl);

  const { camera } = useThree();
  const { mousePosition, screenDimensions } = useMouseAndScreen();

  // Center the model using useMemo
  const centeredScene = useMemo(() => {
    if (gltf && gltf.scene) {
      const scene = gltf.scene.clone();
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      scene.position.set(-center.x, -center.y, -center.z);
      scene.add(new THREE.AmbientLight(0xffffff, Math.PI));

      return scene;
    }
  }, [gltf]);

  useFrame(() => {
    if (mesh.current) {
      const { x, y } = mousePosition;
      let { width, height } = screenDimensions;

      // Convert mouse coordinates to normalized device coordinates (-1 to 1)
      const mouseX = (x / width) * 2 - 1;
      const mouseY = 1 - (2 * y) / height;

      // Adjust rotation sensitivity
      const rotationFactor = 5; // Adjust as needed

      // Create a vector for the mouse position in NDC
      const vector = new THREE.Vector3(
        mouseX * rotationFactor,
        mouseY * rotationFactor,
        0.5
      );

      // Convert the NDC to world space
      vector.unproject(camera);

      // Make the object look at the converted world space position
      mesh.current.lookAt(vector);
    }
  });

  return (
    <group ref={mesh} position={[0, 0, frogPositionZ]}>
      {centeredScene && <primitive object={centeredScene} />}
    </group>
  );
}

function Scene({ frogDistance = 3 }) {
  // Set the camera's Z position based on frogDistance
  const cameraPositionZ = frogDistance;

  return (
    <Canvas camera={{ position: [0, 0, cameraPositionZ] }}>
      <Suspense fallback={<LoadingIndicator />}>
        <MeshComponent />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
}

// Simple loading indicator
function LoadingIndicator() {
  return (
    <mesh>
      <boxGeometry />
      <meshBasicMaterial color="lightgray" />
    </mesh>
  );
}

export default Scene;
