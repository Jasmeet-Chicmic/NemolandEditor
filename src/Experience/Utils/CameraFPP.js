import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import Experience from "../Experience";
import * as THREE from "three";
import { Box } from "../World/Box";
// import
export class CameraFPP {
  constructor() {
    this.experience = new Experience();
    this.experience.crossHair_Button.style.display = "none";
    this.smooth = true;
    this.createPointerLock();
  }

  createPointerLock() {
    this.controls = new PointerLockControls(
      this.experience.camera.instance,
      this.experience.camera.canvas
    );
    this.controls.pointerSpeed = 1;
    const keyStates = {};

    // Function to update camera velocity based on key states
    const updateCameraVelocity = () => {
      const { moveForward, moveRight } = this.controls;
      this.moveForward = moveForward;
      this.moveRight = moveRight;
      this.velocity = new THREE.Vector3();

      if (keyStates["ArrowUp"] || keyStates["KeyW"]) {
        this.velocity.z += 1;
      }
      if (keyStates["ArrowLeft"] || keyStates["KeyA"]) {
        this.velocity.x -= 1;
      }
      if (keyStates["ArrowDown"] || keyStates["KeyS"]) {
        this.velocity.z -= 1;
      }
      if (keyStates["ArrowRight"] || keyStates["KeyD"]) {
        this.velocity.x += 1;
      }

      // Normalize the this.velocity and set the movement speed
      this.velocity.normalize().multiplyScalar(0.01);
    };

    const onKeyDown = (event) => {
      keyStates[event.code] = true;
      this.smooth = true;
      updateCameraVelocity();
    };

    const onKeyUp = (event) => {
      keyStates[event.code] = false;
      this.smooth = false;
      updateCameraVelocity();
    };

    // ...

    document.addEventListener("keydown", (event) => {
      if (event.key === "q" && this.controls.isLocked) {
        console.log("controlls unlocked");
        this.experience.camera.orbitControl.enabled = true;
        document.removeEventListener("keydown", onKeyDown);
        this.experience.crossHair_Button.style.display = "none";
        this.controls.unlock();
        this.experience.world.tranformControlls.transformControls.enabled = true;
        this.controls.removeEventListener("change", () => {
          console.log(
            "camera position",
            this.experience.camera.instance.position
          );
        });
        this.experience.scene.add(
          this.experience.world.tranformControlls.transformControls
        );
      } else if (event.key === "q" && !this.controls.isLocked) {
        this.controls.lock();
        // this.createObject();
        this.experience.camera.orbitControl.enabled = false;
        this.experience.crossHair_Button.style.display = "block";
        // this.experience.world.tranformControlls.transformControls.enabled = false;

        this.experience.scene.remove(
          this.experience.world.tranformControlls.transformControls
        );

        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("keyup", onKeyUp);
      }
    });

    // this.experience.canvas.addEventListener("click", () => {
    //   console.log("CONTROLLS", this.controls);

    // });

    this.experience.scene.add(this.controls.getObject());

    // document.addEventListener("keyup", onKeyUp);
  }

  update() {
    // console.log(this.velocity);
    if (this.controls.isLocked && this.velocity && this.smooth) {
      // console.log("working");
      this.moveForward(this.velocity.z * this.experience.time.delta);
      this.moveRight(this.velocity.x * this.experience.time.delta);
    }
  }

  createObject(position) {
    // document.addEventListener("mousedown", (event) => {
    console.log("from createobject", position);
    // if (event.button === 0) {
    // Left mouse button
    // Get the current camera position
    // const { x, y, z } = this.experience.camera.instance.position;

    let mesh = new Box(this.experience.textureType);
    // Set the position of the sphere to the current camera position
    mesh.boxMesh.position.set(position.x, position.y, position.z);

    // Add the sphere to the scene
    this.experience.parentGroup.add(mesh.boxMesh);
    // }
    // });
  }
}
