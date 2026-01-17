import { useRef, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  OrbitControls, 
  Stars, 
  Float, 
  Line, 
  Text,
  Html,
  Sphere,
  PerspectiveCamera,
  CameraControls
} from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";

type SectionType = "profile" | "experience" | "skills" | "achievements" | "contact" | null;

interface NetworkSceneProps {
  onNodeClick: (section: SectionType) => void;
}

// Node data structure
const NODES = [
  { id: "profile", label: "PROFILE", position: [0, 0, 0], color: "#00ffff", size: 1.5 },
  { id: "experience", label: "MISSION_LOGS", position: [-4, 2, -2], color: "#bd00ff", size: 1 },
  { id: "skills", label: "ARSENAL", position: [4, 1, -2], color: "#00ff00", size: 1 },
  { id: "achievements", label: "HALL_OF_FAME", position: [-3, -3, 2], color: "#eab308", size: 1 },
  { id: "contact", label: "SECURE_UPLINK", position: [3, -2, 3], color: "#ef4444", size: 1 },
] as const;

// Calculate connections (Star topology: all connect to center)
const CONNECTIONS = NODES.slice(1).map(node => ({
  start: NODES[0].position,
  end: node.position,
  color: node.color
}));

function Node({ position, color, size, label, onClick, isHovered, isActive, onPointerOver, onPointerOut }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
      // Pulse effect
      const t = state.clock.getElapsedTime();
      const scale = size + Math.sin(t * 2) * 0.1 + (isHovered ? 0.3 : 0);
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh 
          ref={meshRef} 
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          onPointerOver={(e) => { e.stopPropagation(); onPointerOver(); }}
          onPointerOut={(e) => { e.stopPropagation(); onPointerOut(); }}
        >
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial 
            color={color} 
            wireframe={true}
            emissive={color}
            emissiveIntensity={isHovered || isActive ? 2 : 0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
        
        {/* Glow Sphere */}
        <mesh scale={[size * 1.2, size * 1.2, size * 1.2]}>
           <sphereGeometry args={[1, 16, 16]} />
           <meshBasicMaterial color={color} transparent opacity={0.1} />
        </mesh>

        <Text
          position={[0, -size - 0.5, 0]}
          fontSize={0.4}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </Float>
    </group>
  );
}

function Connections() {
  return (
    <group>
      {CONNECTIONS.map((conn, idx) => (
        <Connection key={idx} start={conn.start as [number, number, number]} end={conn.end as [number, number, number]} color={conn.color} />
      ))}
    </group>
  );
}

function Connection({ start, end, color }: { start: [number, number, number], end: [number, number, number], color: string }) {
  // Animate particles moving along lines
  const curve = useMemo(() => new THREE.LineCurve3(
    new THREE.Vector3(...start), 
    new THREE.Vector3(...end)
  ), [start, end]);

  return (
    <>
      <Line
        points={[start, end]}
        color={color}
        lineWidth={1}
        transparent
        opacity={0.3}
      />
      {/* Animated data packet */}
      <DataPacket curve={curve} color={color} />
    </>
  );
}

function DataPacket({ curve, color }: { curve: THREE.LineCurve3, color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [speed] = useState(() => Math.random() * 0.5 + 0.5);

  useFrame((state) => {
    if (meshRef.current) {
      const t = (state.clock.getElapsedTime() * speed) % 1;
      const pos = curve.getPoint(t);
      meshRef.current.position.copy(pos);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

function Scene({ onNodeClick }: NetworkSceneProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const cameraControlsRef = useRef<CameraControls>(null);

  const handleNodeClick = (id: string, position: number[]) => {
    // Zoom camera to node
    cameraControlsRef.current?.setLookAt(
      position[0] * 1.2, position[1] * 1.2 + 2, position[2] * 1.2 + 5, // Camera position
      position[0], position[1], position[2], // Target position
      true // Animate
    );
    onNodeClick(id as SectionType);
  };

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
      <CameraControls 
        ref={cameraControlsRef} 
        minDistance={5} 
        maxDistance={30} 
      />

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Network Group */}
      <group>
        {NODES.map((node) => (
          <Node
            key={node.id}
            {...node}
            isHovered={hoveredNode === node.id}
            onClick={() => handleNodeClick(node.id, node.position as number[])}
            onPointerOver={() => {
              setHoveredNode(node.id);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              setHoveredNode(null);
              document.body.style.cursor = 'auto';
            }}
          />
        ))}
        <Connections />
      </group>

      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
        <Noise opacity={0.05} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </>
  );
}

export function NetworkScene(props: NetworkSceneProps) {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas dpr={[1, 2]} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <Scene {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
}
