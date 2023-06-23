import Experience from "./Experience";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.boundary = this.experience.boundary;
    this.setInstance();
    this.setOrbitControl();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      75,
      this.sizes.width / this.sizes.height,
      0.01,
      100000000000000000
    );
    this.instance.position.set(
      // (this.boundary.maxX + this.boundary.minX) / 2,
      // this.boundary.minY,
      // (this.boundary.maxZ + this.boundary.minZ) / 2
      0,
      0,
      5
    );

    const helper = new THREE.CameraHelper(this.instance);
    this.scene.add(helper);
    this.scene.add(this.instance);
  }

  setOrbitControl() {
    this.orbitControl = new OrbitControls(this.instance, this.canvas);
    this.orbitControl.mouseButtons = {
      LEFT: null, // Set the left mouse button to pan
      RIGHT: THREE.MOUSE.ROTATE, // Set the right mouse button to rotate
    };
    this.orbitControl.enableDamping = true;
    this.orbitControl.update();
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    // this.orbitControl.update();
  }
}
