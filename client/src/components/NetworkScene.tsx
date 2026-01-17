import { useRef, useState, useMemo, Suspense, useEffect, useCallback } from "react";
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
  CameraControls,
  useAnimations,
  useGLTF
} from "@react-three/drei";
import * as THREE from "three";

type SectionType = "profile" | "experience" | "skills" | "achievements" | "contact" | null;

interface NetworkSceneProps {
  onNodeClick: (section: SectionType) => void;
}

// Node data structure (City-themed)
const NODES = [
  { id: "profile", label: "CENTRAL_CITY", position: [0, 0, 0] as [number, number, number], color: "#00ffff", size: 1.5 },
  { id: "experience", label: "WORK_DISTRICT", position: [-8, 0, -8] as [number, number, number], color: "#bd00ff", size: 1 },
  { id: "skills", label: "TECH_HUB", position: [8, 0, -8] as [number, number, number], color: "#00ff00", size: 1 },
  { id: "achievements", label: "TROPHY_SQUARE", position: [-8, 0, 8] as [number, number, number], color: "#eab308", size: 1 },
  { id: "contact", label: "COMM_PORT", position: [8, 0, 8] as [number, number, number], color: "#ef4444", size: 1 },
] as const;

// Calculate connections (Street paths)
const CONNECTIONS = NODES.slice(1).map(node => ({
  start: NODES[0].position,
  end: node.position,
  color: node.color
}));

function Character({ targetPosition }: { targetPosition: THREE.Vector3 }) {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.position.lerp(targetPosition, 0.05);
      
      const lookTarget = targetPosition.clone();
      lookTarget.y = group.current.position.y;
      group.current.lookAt(lookTarget);
      
      group.current.position.y = -1.5 + Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
    }
  });

  return (
    <group ref={group}>
      <group scale={[0.5, 0.5, 0.5]}>
        {/* Head */}
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#00ffff" wireframe />
        </mesh>
        {/* Eyes */}
        <mesh position={[0.2, 2.6, 0.5]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-0.2, 2.6, 0.5]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Body */}
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[1.5, 1.8, 0.8]} />
          <meshStandardMaterial color="#00ffff" wireframe />
        </mesh>
        {/* Arms */}
        <mesh position={[1, 1.5, 0]}>
          <boxGeometry args={[0.4, 1.2, 0.4]} />
          <meshStandardMaterial color="#00ffff" wireframe />
        </mesh>
        <mesh position={[-1, 1.5, 0]}>
          <boxGeometry args={[0.4, 1.2, 0.4]} />
          <meshStandardMaterial color="#00ffff" wireframe />
        </mesh>
        {/* Glowing Base */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.8, 32]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

function Node({ position, color, size, label, onClick, isHovered, isActive, onPointerOver, onPointerOut }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      const targetY = position[1] + (isHovered ? 0.5 : 0);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1);
    }
  });

  return (
    <group position={position}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
        <mesh 
          ref={meshRef} 
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          onPointerOver={(e) => { e.stopPropagation(); onPointerOver(); }}
          onPointerOut={(e) => { e.stopPropagation(); onPointerOut(); }}
        >
          <boxGeometry args={[size * 1.5, size * 3, size * 1.5]} />
          <meshStandardMaterial 
            color={color} 
            wireframe={true}
            transparent
            opacity={0.9}
          />
        </mesh>
        
        <mesh position={[0, -size * 1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
           <planeGeometry args={[size * 3, size * 3]} />
           <meshBasicMaterial color={color} transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>

        <Text
          position={[0, size * 2, 0]}
          fontSize={0.6}
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
  const curve = useMemo(() => new THREE.LineCurve3(
    new THREE.Vector3(...start), 
    new THREE.Vector3(...end)
  ), [start[0], start[1], start[2], end[0], end[1], end[2]]);

  return (
    <>
      <Line
        points={[start, end]}
        color={color}
        lineWidth={2}
        transparent
        opacity={0.2}
      />
      <DataPacket curve={curve} color={color} />
    </>
  );
}

function DataPacket({ curve, color }: { curve: THREE.LineCurve3, color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [speed] = useState(() => Math.random() * 0.3 + 0.2);

  useFrame((state) => {
    if (meshRef.current) {
      const t = (state.clock.getElapsedTime() * speed) % 1;
      const pos = curve.getPoint(t);
      meshRef.current.position.copy(pos);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

function Scene({ onNodeClick }: NetworkSceneProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [characterTarget, setCharacterTarget] = useState<THREE.Vector3>(new THREE.Vector3(0, -1.5, 0));
  const cameraControlsRef = useRef<CameraControls>(null);

  useEffect(() => {
    if (cameraControlsRef.current) {
      cameraControlsRef.current.setLookAt(20, 15, 20, 0, 0, 0, false);
    }
  }, []);

  const setView = (type: 'street' | 'isometric') => {
    if (!cameraControlsRef.current) return;
    
    switch (type) {
      case 'street':
        cameraControlsRef.current.setLookAt(15, 2, 15, 0, 0, 0, true);
        break;
      case 'isometric':
        cameraControlsRef.current.setLookAt(25, 25, 25, 0, 0, 0, true);
        break;
    }
  };

  const handleNodeClick = (id: string, position: number[]) => {
    // Move character to the node
    setCharacterTarget(new THREE.Vector3(position[0] + 2, -1.5, position[2] + 2));
    
    // Street-view style zoom
    if (cameraControlsRef.current) {
      cameraControlsRef.current.setLookAt(
        position[0] + 8, position[1] + 4, position[2] + 12,
        position[0], position[1], position[2],
        true
      );
    }
    onNodeClick(id as SectionType);
  };

  return (
    <>
      <CameraControls 
        ref={cameraControlsRef} 
        minDistance={5} 
        maxDistance={60}
        maxPolarAngle={Math.PI / 2.1}
        makeDefault
      />

      {/* View Controls Overlay */}
      <Html position={[-15, 10, -15]} style={{ pointerEvents: 'none' }}>
        <div className="flex flex-col gap-2 pointer-events-auto bg-black/50 p-2 rounded border border-primary/30 backdrop-blur-sm">
          <p className="text-[10px] font-mono text-primary/70 mb-1 uppercase tracking-tighter">Camera_Views</p>
          <button 
            onClick={() => setView('street')}
            className="text-[10px] font-mono text-white hover:text-primary border border-white/20 hover:border-primary px-2 py-1 transition-all uppercase"
          >
            Street View
          </button>
          <button 
            onClick={() => setView('isometric')}
            className="text-[10px] font-mono text-white hover:text-primary border border-white/20 hover:border-primary px-2 py-1 transition-all uppercase"
          >
            Isometric
          </button>
        </div>
      </Html>

      <ambientLight intensity={0.6} />
      <pointLight position={[20, 20, 20]} intensity={2} color="#00ffff" />
      <spotLight position={[-10, 20, -10]} intensity={1} color="#bd00ff" />
      
      <gridHelper args={[200, 40, "#222", "#111"]} position={[0, -2, 0]} />
      
      <Stars radius={200} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />
      
      <group>
        {NODES.map((node) => (
          <Node
            key={node.id}
            {...node}
            isHovered={hoveredNode === node.id}
            onClick={() => handleNodeClick(node.id, [...node.position])}
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

      <Suspense fallback={null}>
        <Character targetPosition={characterTarget} />
      </Suspense>
    </>
  );
}

export function NetworkScene(props: NetworkSceneProps) {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <Scene {...props} />
      </Canvas>
    </div>
  );
}
