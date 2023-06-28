import Experience from "../Experience";
import Environment from "./Environment";
import { TextureSelector } from "./TextureSelector";
import { Raycaster } from "../Utils/Raycaster";
import { TransformControlls } from "../Utils/transformControlls";

import Floor from "./Floor";
import { CameraFPP } from "../Utils/CameraFPP";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    //Test cube

    this.resources.on("resourcesLoaded", () => {
      this.textureSelector = new TextureSelector();
      this.experience.checkSavedData();
      this.floor = new Floor();
      this.experience.raycasterElements.push(this.floor.floor);
      this.raycaster = new Raycaster(this.textureSelector);
      this.tranformControlls = new TransformControlls();

      this.environment = new Environment();
      this.camerFPP = new CameraFPP();
      // this.scene.environment = this.resources.items["clouds"];
    });
  }

  update() {
    // if (this.tranformControlls) {
    //   this.tranformControlls.checkBoundaries();
    // }
    if (this.camerFPP) {
      this.camerFPP.update();
    }
    if (this.raycaster) {
      this.raycaster.update();
    }
  }
}
