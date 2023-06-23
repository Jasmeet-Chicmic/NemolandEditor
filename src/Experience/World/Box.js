import * as THREE from "three";
import Experience from "../Experience";

export class Box {
  constructor(texture) {
    console.log(texture);
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.texture = texture;
    this.createBox();
  }

  createBox = () => {
    var boxGeometry = new THREE.BoxGeometry(1, 1, 1);

    // Create a material

    var material = new THREE.MeshBasicMaterial({
      map: this.texture,
    });

    // Create a mesh using the geometry and material
    this.boxMesh = new THREE.Mesh(boxGeometry, material);
    // this.scene.add(this.boxMesh);
    this.boxMesh.name = "box";
    this.boxMesh.isDragable = true;
    this.experience.raycasterElements.push(this.boxMesh);
  };
}
