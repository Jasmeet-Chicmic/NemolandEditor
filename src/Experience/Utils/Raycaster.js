import * as THREE from "three";

import { Box } from "../World/Box";
import { TEXTURE_TYPE } from "../Constants/constants";
import Experience from "../Experience";

export class Raycaster {
  constructor(textureSelector) {
    this.isIntersected = [];
    this.experience = new Experience();
    this.mouse = new THREE.Vector2(0, 0);
    this.mouseMovement = new THREE.Vector2(0, 0);
    this.raycaster = new THREE.Raycaster();
    this.elements = this.experience.raycasterElements;

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
  // onMouseClick = (event) => {
  //   // this.touchabeobjects = this.experience.cubes;
  //   if (event.button === THREE.MOUSE.LEFT) {
  //     this.dragable = true;

  //     if (this.isIntersected.length) {
  //       this.isIntersected[0];
  //       this.textureSelector.setTexture(this.isIntersected[0], this.mouse);
  //       console.log("from raycaster", this.isIntersected[0].point);
  //       if (this.isIntersected[0].object.name == "box") {
  //         // console.log("this.isIntersected[0].name", this.isIntersected[0].name);
  //         // this.experience.parentGroup.remove(this.isIntersected[0]);
  //         this.experience.world.tranformControlls.transformControlls(
  //           this.isIntersected[0]
  //         );
  //         if (this.experience.world.camerFPP.controls.isLocked) {
  //           this.experience.world.camerFPP.createObject(
  //             this.isIntersected[0].point
  //           );
  //         }
  //       } else if (this.isIntersected[0].object.name == "floor") {
  //         if (this.experience.world.camerFPP.controls.isLocked) {
  //           this.experience.world.camerFPP.createObject(
  //             this.isIntersected[0].point
  //           );
  //         }
  //       }
  //       // console.log("Mesh clicked!", this.isIntersected);
  //     }
  //   } else if (event.button == THREE.MOUSE.MIDDLE) {
  //     if (this.isIntersected[0].object.name == "box") {
  //       console.log("working", this.isIntersected[0].object);
  //       this.experience.parentGroup.remove(this.isIntersected[0].object);
  //     }
  //   }
  // };
  onMouseClick = (event) => {
    const intersectedObject = this.isIntersected[0];
    console.log("intersectedObject", intersectedObject);

    if (event.button === THREE.MOUSE.LEFT) {
      this.dragable = true;

      if (intersectedObject) {
        this.textureSelector.setTexture(intersectedObject, this.mouse);
        console.log("from raycaster", intersectedObject.point);

        if (intersectedObject.object.name === "box") {
          if (intersectedObject.faceIndex !== -1) {
            const clickedFaceNormal = intersectedObject.face.normal;
            const clickedFacePoint = intersectedObject.point;

            const distance = 0.5; // Desired distance from the existing box

            // Calculate the position for the new box
            this.newPosition = clickedFacePoint
              .clone()
              .add(clickedFaceNormal.multiplyScalar(distance));

            // Create a new box geometry and material
            // const newBoxGeometry = new THREE.BoxGeometry(1, 1, 1);
            // const newBoxMaterial = new THREE.MeshPhongMaterial({
            //   color: 0x00ff00,
            // });

            // // Create a new box mesh
            // const newBoxMesh = new THREE.Mesh(newBoxGeometry, newBoxMaterial);
            // newBoxMesh.position.copy(newPosition);

            // Add the new box to the scene
            // this.experience.scene.add(newBoxMesh);
          }
          this.experience.world.tranformControlls.transformControlls(
            intersectedObject
          );
          if (this.experience.world.camerFPP.controls.isLocked) {
            this.experience.world.camerFPP.createObject(this.newPosition);
          }
        } else if (intersectedObject.object.name === "floor") {
          if (this.experience.world.camerFPP.controls.isLocked) {
            this.experience.world.camerFPP.createObject(
              intersectedObject.point
            );
          }
        }
      }
    } else if (event.button === THREE.MOUSE.MIDDLE) {
      if (intersectedObject && intersectedObject.object.name === "box") {
        console.log("working", intersectedObject.object);

        this.experience.parentGroup.remove(intersectedObject.object);
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
    this.isIntersected = this.raycaster.intersectObjects(this.elements);
  }
}
