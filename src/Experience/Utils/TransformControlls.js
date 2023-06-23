import { TransformControls } from "three/addons/controls/TransformControls.js";
import Experience from "../Experience";
import * as THREE from "three";
export class TransformControlls {
  constructor() {
    this.experience = new Experience();
    this.transformControls = new TransformControls(
      this.experience.camera.instance,
      this.experience.canvas
    );
    this.transformControls.name = "transformcontrols";
    this.transformControls.setTranslationSnap(1);
    this.experience.scene.add(this.transformControls);
    this.boundary = this.experience.boundary;
    this.addVisibleBoundries();
  }
  checkPosition(old, nnew) {
    if (
      old.position.x === nnew.position.x &&
      old.position.y === nnew.position.y &&
      old.position.z === nnew.position.z
    ) {
      return true;
    }
    return false;
  }
  transformControlls(box) {
    this.transformControls.attach(box.object);
    // this.transformControls.addEventListener("mouseDown", () => {
    //   // this.oldPosition = box.object.position;
    //   // console.log("old position", this.oldPosition);
    // });
    // this.transformControls.addEventListener("mouseUp", () => {
    //   // box.object.position.set(
    //   //   this.oldPosition.x,
    //   //   this.oldPosition.y,
    //   //   this.oldPosition.z
    //   // );
    //   // this.experience.parentGroup.children.map((object) => {
    //   //   if (object != box.object) {
    //   //     if (this.checkPosition(object, box.object)) {
    //   //       console.log("old position intersect", this.oldPosition);
    //   //       box.object.position.set(
    //   //         this.oldPosition.x,
    //   //         this.oldPosition.y,
    //   //         this.oldPosition.z
    //   //       );
    //   //     }
    //   //   }
    //   //   // let yes = this.scene.getObjectsAt(this.obj.boxMesh.position);
    //   //   // console.log(yes, "yes");
    //   // });
    // });
    this.transformControls.addEventListener("change", () => {
      // Get the object being transformed
      const object = this.transformControls.object;

      // Perform position checks and restrict object movement within the boundaries

      // Check X coordinate
      if (object.position.x < this.boundary.minX) {
        object.position.x = this.boundary.minX;
      } else if (object.position.x > this.boundary.maxX) {
        object.position.x = this.boundary.maxX;
      }

      // Check Y coordinate
      if (object.position.y < this.boundary.minY) {
        object.position.y = this.boundary.minY;
      } else if (object.position.y > this.boundary.maxY) {
        object.position.y = this.boundary.maxY;
      }

      // Check Z coordinate
      if (object.position.z < this.boundary.minZ) {
        object.position.z = this.boundary.minZ;
      } else if (object.position.z > this.boundary.maxZ) {
        object.position.z = this.boundary.maxZ;
      }
      this.checkBoundaries();
    });
  }

  addVisibleBoundries() {
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff, // Set the color of the boundaries (change as needed)
      transparent: true, // Make the material transparent
      opacity: 0.5, // Set the opacity of the boundaries (0.0 - fully transparent, 1.0 - fully opaque)
      side: THREE.DoubleSide,
    });

    // Create a box geometry based on the boundary values
    const geometry = new THREE.BoxGeometry(
      this.boundary.maxX - this.boundary.minX,
      this.boundary.maxY - this.boundary.minY,
      this.boundary.maxZ - this.boundary.minZ
    );

    // Create a mesh with the geometry and material
    this.boundaries = new THREE.Mesh(geometry, material);
    this.boundaries.visible = false;
    // Set the position of the this.boundaries based on the center of the this.boundary values
    this.boundaries.position.set(
      (this.boundary.maxX + this.boundary.minX) / 2,
      (this.boundary.maxY + this.boundary.minY) / 2,
      (this.boundary.maxZ + this.boundary.minZ) / 2
    );

    // Add the this.boundaries to the scene
    this.experience.scene.add(this.boundaries);
  }

  checkBoundaries = () => {
    const object = this.transformControls.object;
    if (object != undefined) {
      // console.log(object.position);
      if (
        object.position.x <= this.boundary.minX ||
        object.position.x >= this.boundary.maxX ||
        object.position.y - 0.5 <= this.boundary.minY ||
        object.position.y >= this.boundary.maxY ||
        object.position.z <= this.boundary.minZ ||
        object.position.z >= this.boundary.maxZ
      ) {
        // console.log("inside visible true");
        this.boundaries.visible = true; // Show the boundaries
      } else {
        this.boundaries.visible = false; // Hide the boundaries
      }
    }
  };
}
