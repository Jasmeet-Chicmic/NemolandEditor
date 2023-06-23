import { Vector2 } from "three";
import Experience from "../Experience";
import * as THREE from "three";
export class ToJSON {
  constructor() {
    this.customJSON = {};
    this.experience = new Experience();
  }

  convertGroupToJSON(group) {
    var jsonGroup = group.toJSON();
    //     jsonGroup = { ...jsonGroup, position: this.position };
    //     // Convert the JSON object to a string
    var jsonString = JSON.stringify(jsonGroup);
    //     console.log("GROUP", this.group.children);
    //   this.customJSONFormatter(this.group);
    return jsonGroup;
    // console.log("JSON DATA", jsonString);
  }

  localToWorldPosition(local) {
    const localVector = new THREE.Vector3(local.x, local.y, local.z);

    // Get the camera's projection matrix
    // const projectionMatrix = this.experience.camera.instance.projectionMatrix;

    // Apply the projection matrix to the local vector
    localVector.project(this.experience.camera.instance);

    // Convert the projected vector to screen coordinates
    const canvasX = (localVector.x + 1) * 0.5 * this.experience.sizes.width;
    const canvasY = (-localVector.y + 1) * 0.5 * this.experience.sizes.height;
    return new Vector2(canvasX, canvasY);
  }
  customJSONFormatter(group) {
    this.customJSON.meshes = [];

    group.map((e, index) => {
      let mesh = {};
      mesh.localPosition = e.position;
      mesh.worldPosition = this.localToWorldPosition(e.position);
      //   console.log("INSIDE GROUP", e);
      mesh.textureType = e.material.map.name;
      mesh.canvasSize = {};
      mesh.canvasSize.height = this.experience.sizes.height;
      mesh.canvasSize.width = this.experience.sizes.width;
      this.customJSON.meshes.push(mesh);
    });

    console.log("custom JSON", this.customJSON);
    const jsonString = JSON.stringify(this.customJSON);

    localStorage.setItem("meshData", jsonString);
  }
}
