import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Group } from "three";
import { Suspense, useRef, useMemo } from "react";
import { OrthographicCamera } from "@react-three/drei";

import useMouseAndScreen from "@/ui/hooks/useMouseAndScreen";
import * as THREE from "three";
THREE.ColorManagement.enabled = true;

function MeshComponent({
  canvasRef,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}) {
  const fileUrl = "/3d/frog.glb";
  const mesh = useRef<Group>(null!);
  const gltf = useLoader(GLTFLoader, fileUrl);

  const { camera } = useThree();
  const { mousePosition } = useMouseAndScreen();

  // Center the model using useMemo
  const centeredScene = useMemo(() => {
    if (gltf && gltf.scene) {
      const scene = gltf.scene.clone();

      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      scene.position.set(-center.x, -center.y, -center.z);
      scene.add(new THREE.AmbientLight(new THREE.Color(0xffffff), Math.PI));

      return scene;
    }
  }, [gltf]);

  useFrame(() => {
    if (mesh.current && canvasRef.current) {
      const { x: mouseX, y: mouseY } = mousePosition;

      // Get the canvas's position and size
      const rect = canvasRef.current.getBoundingClientRect();

      // Adjust mouse coordinates to be relative to the canvas
      const x = mouseX - rect.left;
      const y = mouseY - rect.top;
      const width = rect.width;
      const height = rect.height;

      // Convert mouse coordinates to normalized device coordinates (-1 to 1)
      const ndcX = (x / width) * 2 - 1;
      const ndcY = 1 - (2 * y) / height;

      // Adjust rotation sensitivity
      const rotationFactor = 50; // Adjust as needed

      // Create a vector for the mouse position in NDC
      const vector = new THREE.Vector3(
        ndcX * rotationFactor,
        ndcY * rotationFactor,
        -2
      );

      // Convert the NDC to world space
      vector.unproject(camera);

      // Make the object look at the converted world space position
      mesh.current.lookAt(vector);
    }
  });

  return (
    <group ref={mesh} position={[0, 0, 0]}>
      {centeredScene && <primitive object={centeredScene} />}
    </group>
  );
}

function Scene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  return (
    <Canvas
      ref={canvasRef}
      gl={{
        outputColorSpace: "srgb",
        toneMapping: THREE.NoToneMapping,
        toneMappingExposure: 1, // Match Blender exposure
      }}
    >
      <OrthographicCamera
        makeDefault
        position={[0, 0, 3]}
        zoom={50}
        near={0.1}
        far={1000}
      />
      <Suspense fallback={<LoadingIndicator />}>
        <MeshComponent canvasRef={canvasRef} />
      </Suspense>
    </Canvas>
  );
}

// Simple loading indicator
function LoadingIndicator() {
  return (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial color="white" />
    </mesh>
  );
}

export default Scene;
