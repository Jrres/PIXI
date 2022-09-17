import * as PIXI from "pixi.js";
import { Entity } from "./entity";

export class Level {
  constructor(app) {
    this.app = app;
    this.entities = [];
  }
  load() {
    this.debugContainer = new PIXI.Container();
    //this.debugContainer.alpha = 0.5;

    const models = this.app.models.all;
    for (let i = 0; i < 8; i++) {
      let orange = new Entity(
        {
          size: 1,
          mass: 3
        },
        models.crate
      );
      orange.pixi.position.set(
        this.app.screen.width / 2,
        this.app.screen.height / 2 + (i - 5) * 100
      );
      this.add(orange);
    }

    let crate = new Entity(
      {
        size: 1,
        mass: 1
      },
      models.orange
    );
    crate.pixi.position.set(80, this.app.screen.height / 4);
    this.add(crate);

    let ground = new Entity(
      {
        size: 0.6,
        mass: 0
      },
      models.ground
    );
    ground.pixi.position.set(360, 1100);

    this.add(ground);

    this.app.ticker.add(delta => {
      this.update(delta);
    });

    this.createPlaneEntity(new PIXI.Point(5, 0), Math.PI / 2);
    this.createPlaneEntity(new PIXI.Point(715, 0), -Math.PI / 2);

    this.app.stage.addChild(this.debugContainer);
  }

  add(entity) {
    this.entities.push(entity);
    this.app.runners.beforeAdd.run(entity);
    if (entity.pixi) {
      this.app.stage.addChild(entity.pixi);
    }
    if (entity.body) {
      this.app.phys.world.addBody(entity.body);
      this.debugContainer.addChild(entity.body.getOrCreateDebug());

      entity.body.update();
    }
  }

  update(delta) {
    const { entities } = this;
    entities.forEach(entity => entity.update(delta));

    for (let i = entities.length - 1; i >= 0; i--) {
      const entity = entities[i];
      if (entity.dead) {
        entities.splice(i, 1);

        if (entity.pixi) {
          this.app.stage.removeChild(entity.pixi);
        }
        if (entity.body) {
          this.app.phys.world.removeBody(entity.body);
          this.debugContainer.removeChild(entity.body.debug);
        }
      }
    }
  }

  createPlaneEntity(pos, angle) {
    const body = this.app.phys.createPlane(pos, angle);
    const obj = new Entity(
      {
        body
      },
      {}
    );
    obj.pixi.rotation = angle;
    obj.pixi.position.copyFrom(pos);

    this.add(obj);

    return obj;
  }
}
