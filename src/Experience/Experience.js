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
let instance = null;
export default class Experience {
  constructor(canvas) {
    if (instance) {
      return instance;
    }
    this.textureType = "brick";
    this.boundary = {
      minX: -200, // Minimum X coordinate
      maxX: 200, // Maximum X coordinate
      minY: -0.51, // Minimum Y coordinate
      maxY: 100, // Maximum Y coordinate
      minZ: -200, // Minimum Z coordinate
      maxZ: 200, // Maximum Z coordinate
    };
    this.save_Button = this.saveButton();
    this.crossHair_Button = this.crossHairButton();
    this.textureButtons = this.textureTypeButtons();
    this.addEventSaveButton();
    this.parentGroup = new THREE.Group();
    instance = this;
    this.canvas = canvas;
    this.debug = new Debug();
    console.log("Experience", this.canvas);
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

  saveButton() {
    const divElement = document.createElement("div");
    divElement.id = "save";

    const buttonElement = document.createElement("button");
    buttonElement.textContent = "Save";
    buttonElement.id = "saveButton";
    divElement.appendChild(buttonElement);

    const bodyElement = document.body;
    const firstChild = bodyElement.firstChild;

    bodyElement.insertBefore(divElement, firstChild);
    return buttonElement;
  }

  crossHairButton() {
    const divElement = document.createElement("div");
    divElement.id = "crossParent";
    document.body.appendChild(divElement);

    const imgElement = document.createElement("img");
    imgElement.src = "./textures/crossHair.png";
    imgElement.id = "cross";
    divElement.appendChild(imgElement);
    document.body.appendChild(divElement);
    return imgElement;
  }

  textureTypeButtons() {
    // Create the <div> element
    const divElement = document.createElement("div");
    divElement.id = "textureType";
    // Create the first <img> tag
    const img1 = document.createElement("img");
    img1.src = "./textures/brick/brick_wall_02_diff_1k.jpg";
    img1.className = "img";
    img1.id = "img1";
    divElement.appendChild(img1);

    // Create the second <img> tag
    const img2 = document.createElement("img");
    img2.src = "./textures/wooden/raw_plank_wall_diff_1k.jpg";
    img2.className = "img";
    img2.id = "img2";
    divElement.appendChild(img2);

    // Append the <div> element to the document body or any other parent element
    document.body.appendChild(divElement);
    return divElement;
  }

  addEventSaveButton() {
    this.save_Button.addEventListener("click", () => {
      if (this.parentGroup.children.length > 0) {
        console.log("your data is saved");
        this.jsonConverter.customJSONFormatter(this.parentGroup.children);
      } else {
        console.log("Nothing to save");
      }
    });
  }

  checkSavedData() {
    let stringdata = localStorage.getItem("meshData");
    if (stringdata) {
      let data = JSON.parse(stringdata);
      this.geometry = new THREE.BoxGeometry(1, 1, 1); // Width, height, and depth of the box
      // Create a basic material for the box

      // Create a mesh and set the geometry and material
      data.meshes.map((e) => {
        let texture = this.resources.items[e.textureType];
        // console.log(texture);
        texture.name = e.textureType;
        this.material = new THREE.MeshBasicMaterial({
          map: this.resources.items[e.textureType],
        });
        var box = new THREE.Mesh(this.geometry, this.material);
        box.position.set(
          e.localPosition.x,
          e.localPosition.y,
          e.localPosition.z
        );
        this.parentGroup.add(box);
        box.name = "box";
        box.material.map.name = e.textureType;
        this.raycasterElements.push(box);

        // this.scene.add(box);
      });
    }
  }
}
