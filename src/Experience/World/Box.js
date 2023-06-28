import * as THREE from "three";
import Experience from "../Experience";

export class Box {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  }

  createBox = (texture) => {
    // Create a mesh using the geometry and material
    this.material = new THREE.MeshBasicMaterial();
    this.material.map = texture;
    this.boxMesh = new THREE.Mesh(this.boxGeometry, this.material);
    this.boxMesh.name = "box";
    this.boxMesh.isDragable = true;
    this.experience.raycasterElements.push(this.boxMesh);
    return this.boxMesh;
  };
}
