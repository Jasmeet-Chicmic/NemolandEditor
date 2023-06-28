import Experience from "../Experience.js";
import * as THREE from "three";
export default class Floor {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Setup
    this.boundary = this.experience.boundary;
    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    // this.geometry = new THREE.PlaneGeometry(1200, 1200);
  }
  setMaterial() {
    // this.material = new THREE.MeshStandardMaterial();
  }
  setMesh() {
    // this.mesh = new THREE.Mesh(this.geometry, this.material);
    // this.mesh.rotation.x = -Math.PI * 0.5;
    // this.mesh.receiveShadow = true;
    // this.scene.add(this.mesh);
    const vertex = new THREE.Vector3();
    const color = new THREE.Color();
    let floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
    floorGeometry.rotateX(-Math.PI / 2);

    // vertex displacement

    let position = floorGeometry.attributes.position;

    for (let i = 0, l = position.count; i < l; i++) {
      vertex.fromBufferAttribute(position, i);

      vertex.x += 1; //Math.random() * 20 - 10;
      vertex.y -= 0.5; //Math.random() * 2;
      vertex.z += 1; //Math.random() * 20 - 10;

      position.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

    position = floorGeometry.attributes.position;

    const floorMaterial = new THREE.MeshStandardMaterial({
      map: this.textures.color,
      normalMap: this.textures.normal,
      side: THREE.DoubleSide,
    });

    this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
    this.floor.name = "floor";
    // this.floor.receiveShadow = true;

    //Stoping orbit controls at some angle
    const maxPolarAngle = Math.acos(
      this.experience.camera.instance.position
        .clone()
        .normalize()
        .dot(this.floor.position.clone().normalize())
    );
    this.experience.camera.orbitControl.maxPolarAngle = maxPolarAngle;

    this.scene.add(this.floor);
  }

  setTextures() {
    this.textures = {};

    this.textures.color = this.resources.items.grassColorTexture;
    this.textures.color.encoding = THREE.sRGBEncoding;
    this.textures.color.repeat.set(300, 300);
    // this.textures.offset.set(0.5, 0.5);
    this.textures.color.wrapS = THREE.RepeatWrapping;
    this.textures.color.wrapT = THREE.RepeatWrapping;

    this.textures.normal = this.resources.items.grassNormalTexture;
    this.textures.normal.repeat.set(300, 300);
    this.textures.normal.wrapS = THREE.RepeatWrapping;
    this.textures.normal.wrapT = THREE.RepeatWrapping;
  }
}
