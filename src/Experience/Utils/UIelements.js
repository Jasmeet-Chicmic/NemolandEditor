import { TEXTURE_TYPE } from "../Constants/constants";
export class UIelements {
  constructor(experience) {
    this.experience = experience;
    this.oldElements = 0;
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
    this.addEventSaveButton(buttonElement);
  }

  addEventSaveButton(button) {
    button.addEventListener("click", () => {
      console.log(
        "check ni",
        this.oldElements,
        this.experience.parentGroup.children.length
      );
      if (
        this.experience.parentGroup.children.length > 0 &&
        this.oldElements != this.experience.parentGroup.children.length
      ) {
        this.oldElements = this.experience.parentGroup.children.length;
        console.log("your data is saved");
        this.experience.jsonConverter.customJSONFormatter(
          this.experience.parentGroup.children
        );
      } else {
        console.log(" Already saved");
      }
    });
  }

  textureTypeButtons() {
    // Create the <div> element
    const divElement = document.createElement("div");
    divElement.id = "textureType";
    // Create the first <img> tag
    Object.keys(TEXTURE_TYPE).forEach((element, index) => {
      const img1 = document.createElement("img");
      img1.src = `./textures/box_textures/${element}.jpg`;
      img1.className = "img";
      img1.id = `${element}`;
      divElement.appendChild(img1);
    });
    // Append the <div> element to the document body or any other parent element
    document.body.appendChild(divElement);
    return divElement;
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
}
