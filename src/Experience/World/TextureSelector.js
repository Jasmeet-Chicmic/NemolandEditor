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
    this.brickTexture = this.resources.items["brick"];
    this.woodenTexture = this.resources.items["wooden"];
    this.brickTexture.minFilter = THREE.LinearMipmapLinearFilter;
    this.brickTexture.encoding = THREE.sRGBEncoding;
    this.woodenTexture.minFilter = THREE.LinearMipmapLinearFilter;
    this.woodenTexture.encoding = THREE.sRGBEncoding;

    var brickImageButton = this.Experience.textureButtons.children[0];
    var woodenImageButton = this.Experience.textureButtons.children[1];

    this.addEventToTextureTypes(brickImageButton, woodenImageButton);
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
  setTexture(element) {
    // console.log("element", element);

    this.obj = null;
    if (element == TEXTURE_TYPE.BRICK) {
      // this.Experience.textureType = "brick";
      console.log("created");
      this.brickTexture.name = "brick";
      this.Experience.textureType = this.brickTexture;
    } else if (element == TEXTURE_TYPE.WOODEN) {
      this.woodenTexture.name = "wooden";
      this.Experience.textureType = this.woodenTexture;
    }
  }
  moveBox(element, position) {
    element.object.position.set(position.y, 0, position.x);
  }

  addEventToTextureTypes(brick, wooden) {
    brick.addEventListener("click", () => {
      this.setTexture("1");
    });

    wooden.addEventListener("click", () => {
      this.setTexture("2");
    });
  }
}
