import * as THREE from "three";
import Experience from "../Experience";
import { TEXTURE_TYPE } from "../Constants/constants";

export class TextureSelector {
  constructor() {
    this.Experience = new Experience();
    this.scene = this.Experience.scene;
    this.resources = this.Experience.resources;
    this.debug = this.Experience.debug;
    this.textures = [];

    this.createSelectors();
  }

  createSelectors() {
    this.textures = {};
    Object.keys(TEXTURE_TYPE).forEach((element, index) => {
      this.texture = this.resources.items[`${element}`];
      this.texture.minFilter = THREE.LinearMipmapLinearFilter;
      this.texture.encoding = THREE.sRGBEncoding;
      this.textures[`${element}`] = this.texture;
    });
    this.Experience.textureType = this.texture;
    this.addEventToTextureTypes(this.Experience.textureButtons);
  }

  setTexture(element) {
    console.log("element", this.textures[element]);
    this.textures[element].name = `${element}`;
    this.Experience.textureType = this.textures[element];
  }

  addEventToTextureTypes(textureButtons) {
    let imgButtons = textureButtons.children;
    for (
      let element = 0;
      element < Object.keys(TEXTURE_TYPE).length;
      element++
    ) {
      imgButtons[element].addEventListener("click", () => {
        this.setTexture(imgButtons[element].id);
      });
    }
  }
}
