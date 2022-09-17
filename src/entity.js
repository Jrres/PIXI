import * as PIXI from "pixi.js";
import * as p2 from "./lib/p2";
import { PixiBody, PIXEL_TO_METER } from "./pixi-p2";

export class Entity {
  constructor(dict, model) {
    dict = dict || {};
    model = model || {};

    this.dict = dict;
    this.model = model;
    this.dead = false;

    this.size = dict.size || 1;
    this.rotationSpeed = dict.rotationSpeed || 0.1;

    let width = 0,
      height = 0;
    // Entity components: pixi, body
    if (model.texture) {
      if (model.program) {
        this.pixi = new PIXI.Container();
      } else {
        this.pixi = new PIXI.Sprite(model.texture);
        this.pixi.scale.set(this.size);
        this.pixi.tint = model.tint || 0xffffff;

        this.pixi.anchor.set(0.5);
      }

      width = model.texture.width;
      height = model.texture.height;
    } else {
      this.pixi = new PIXI.Container();
    }

    /*this.pixi.interactive = true;
    this.pixi.on("mousedown", () => {
      this.dead = true;
    });*/

    if (model.shapeJson) {
      this.body = new PixiBody({
        mass: dict.mass !== undefined ? dict.mass : 1
      });
      this.body.setFromJson(
        model.shapeJson,
        new PIXI.Point(-width / 2, -height / 2),
        this.size
      );
      this.body.display = this.pixi;
    }
    if (dict.body) {
      this.body = dict.body;
      this.body.display = this.pixi;
    }
    this.mesh = null;
  }

  get position() {
    return this.pixi.position;
  }

  update(delta) {
    /*if (this.pixi) {
      this.pixi.rotation += this.rotationSpeed * delta;
    }*/
    if (this.body) {
      this.body.update(delta);

      if (this.mesh) {
        this.mesh.shader.uniforms.speed =
          p2.vec2.length(this.body.velocity) / 5;
      }
    }
  }
}
