import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAppSelector } from '@/redux/hook';
import { Mesh } from 'three';

const Scene3D: React.FC = () => {
  const currentTime = useAppSelector(state => state.videoTime.value);
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      // 让物体随着时间轴旋转，方便调试
      meshRef.current.rotation.y = currentTime;
      meshRef.current.rotation.x = currentTime * 0.5;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <gridHelper args={[20, 20]} />
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color={'#1677ff'} />
      </mesh>
    </>
  );
};

export default Scene3D;