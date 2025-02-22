import React from "react";
import { useGLTF } from "@react-three/drei";

export default function Character() {
  const { scene } = useGLTF("../assets/"); // Load the model

  return <primitive object={scene} scale={2} />;
}
