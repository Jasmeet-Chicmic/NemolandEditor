import * as THREE from "three";
import Experience from "../Experience";

export class Raycaster {
  constructor(textureSelector) {
    this.isIntersected = [];
    this.experience = new Experience();
    this.mouse = new THREE.Vector2(0, 0);
    this.mouseMovement = new THREE.Vector2(0, 0);
    this.raycaster = new THREE.Raycaster();

    this.textureSelector = textureSelector;
    this.setMouseEvents();
  }

  setMouseEvents() {
    window.addEventListener(
      "mousedown",
      (e) => {
        this.onMouseClick(e);
      },
      false
    );
    window.addEventListener(
      "mousemove",
      (e) => {
        this.onMouseMove(e);
      },
      false
    );
  }

  onMouseClick = (event) => {
    const intersectedObject = this.isIntersected[0];

    if (event.button === THREE.MOUSE.LEFT) {
      this.dragable = true;

      if (intersectedObject) {
        if (intersectedObject.object.name === "box") {
          if (intersectedObject.faceIndex !== -1) {
            const clickedFaceNormal = intersectedObject.face.normal;
            const distance = 1.0; // Desired distance from the existing box
            const oldCubeCenter = intersectedObject.object.position.clone();
            const newCubeSize = 1.0;
            const offset = clickedFaceNormal
              .clone()
              .multiplyScalar(newCubeSize * 0.5);

            // Calculate the position for the new box
            this.newPosition = oldCubeCenter
              .clone()
              .add(clickedFaceNormal.multiplyScalar(distance));
          }
          this.experience.world.tranformControlls.transformControlls(
            intersectedObject
          );
          if (this.experience.world.camerFPP.controls.isLocked) {
            this.experience.world.camerFPP.createObject(this.newPosition);
          }
        } else if (intersectedObject.object.name === "floor") {
          if (this.experience.world.camerFPP.controls.isLocked) {
            intersectedObject.point.y += 0.5;
            this.experience.world.camerFPP.createObject(
              intersectedObject.point
            );
          }
        }
      }
    } else if (event.button === THREE.MOUSE.MIDDLE) {
      if (intersectedObject && intersectedObject.object.name === "box") {
        this.experience.parentGroup.remove(intersectedObject.object);
        console.log(
          "this.experience.parentGroup",
          this.experience.parentGroup.children.length
        );
        this.experience.raycasterElements =
          this.experience.parentGroup.children;
        // intersectedObject = null;
      }
    }
  };

  onMouseMove = (event) => {
    if (this.experience.world.camerFPP.controls.isLocked) {
      this.mouse.x = 0.5 * 2 - 1; //(event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -1 * 0.5 * 2 + 1; //-1 * (event.clientY / window.innerHeight) * 2 + 1;
    } else {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -1 * (event.clientY / window.innerHeight) * 2 + 1;
    }
  };
  update() {
    this.raycaster.setFromCamera(this.mouse, this.experience.camera.instance);
    this.isIntersected = this.raycaster.intersectObjects(
      this.experience.raycasterElements
    );
  }
}
