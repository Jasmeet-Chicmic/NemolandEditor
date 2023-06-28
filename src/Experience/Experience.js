import Camera from "./Camera";
import Renderer from "./Renderer";
import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import * as THREE from "three";
import World from "./World/World";
import Resources from "./Utils/Resources";
import sources from "./sources";
import Debug from "./Utils/Debug";

import { ToJSON } from "./Utils/ToJSON";
import { TEXTURE_TYPE } from "./Constants/constants";
import { UIelements } from "./Utils/UIelements";
import { Box } from "./World/Box";
let instance = null;
export default class Experience {
  constructor(canvas) {
    if (instance) {
      return instance;
    }
    this.htmlUIElements();

    this.textureType = "brick";
    this.boundary = {
      minX: -200, // Minimum X coordinate
      maxX: 200, // Maximum X coordinate
      minY: -0.51, // Minimum Y coordinate
      maxY: 100, // Maximum Y coordinate
      minZ: -200, // Minimum Z coordinate
      maxZ: 200, // Maximum Z coordinate
    };

    // this.addEventSaveButton();
    this.parentGroup = new THREE.Group();
    instance = this;
    this.canvas = canvas;
    this.debug = new Debug();
    this.raycasterElements = [];

    //resize events
    this.sizes = new Sizes();
    this.sizes.on("resize", () => {
      this.resize();
    });

    window.experience = new Experience();
    //Scene creatition
    this.scene = new THREE.Scene();
    this.scene.add(this.parentGroup);
    //resources
    this.resources = new Resources(sources);
    this.boxClass = new Box();
    //camera
    this.camera = new Camera();
    this.time = new Time();
    this.time.on("tick", () => {
      this.update();
    });
    //world
    this.world = new World();

    //renderer
    this.renderer = new Renderer();
    this.jsonConverter = new ToJSON();

    //time tick events
  }
  htmlUIElements() {
    this.UIelements = new UIelements(this);
    this.UIelements.saveButton();
    this.textureButtons = this.UIelements.textureTypeButtons();
    this.crossHair_Button = this.UIelements.crossHairButton();
  }
  update() {
    this.camera.update();
    this.world.update();
    this.renderer.update();
    // console.log("Group--->", this.parentGroup);
  }
  resize() {
    this.camera.resize();
    this.renderer.resize();
  }
  destroy() {
    this.sizes.off("resize");
    this.time.off("tick");
    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        for (const key in child.material) {
          const value = child.material[key];
          if (value && typeof value.dispose === "function") {
            value.dispose();
          }
        }
      }
    });
    this.camera.orbitControl.dispose();
    this.renderer.instance.dispose();
    if (this.debug.active) {
      this.debug.gui.destroy();
    }
  }

  checkSavedData() {
    let stringdata = localStorage.getItem("meshData");
    if (stringdata) {
      let data = JSON.parse(stringdata);
      data.meshes.map((e) => {
        let texture = this.resources.items[e.textureType];
        texture.name = e.textureType;
        let box = this.boxClass.createBox(texture);
        box.position.set(
          e.localPosition.x,
          e.localPosition.y,
          e.localPosition.z
        );
        this.parentGroup.add(box);
        box.material.map.name = e.textureType;
      });
    }
  }
}
