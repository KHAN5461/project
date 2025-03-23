import { GameObject } from '@/types/project';
import { PlatformerBehavior, PlatformerProperties } from '@/behaviors/PlatformerBehavior';

export class PlatformerEngine {
  private gameObjects: Map<string, GameObject> = new Map();
  private behaviors: Map<string, PlatformerBehavior> = new Map();
  private lastTimestamp: number = 0;

  constructor() {}

  addGameObject(object: GameObject, properties?: PlatformerProperties): void {
    this.gameObjects.set(object.id, object);
    if (object.behaviors?.some(b => b.type === 'platformer')) {
      this.behaviors.set(object.id, new PlatformerBehavior(object, properties));
    }
  }

  removeGameObject(id: string): void {
    this.gameObjects.delete(id);
    this.behaviors.delete(id);
  }

  updateObject(object: GameObject): void {
    this.gameObjects.set(object.id, object);
    if (object.behaviors?.some(b => b.type === 'platformer')) {
      if (!this.behaviors.has(object.id)) {
        this.behaviors.set(object.id, new PlatformerBehavior(object));
      }
    } else {
      this.behaviors.delete(object.id);
    }
  }

  update(timestamp: number): void {
    const deltaTime = this.lastTimestamp ? (timestamp - this.lastTimestamp) / 1000 : 0;
    this.lastTimestamp = timestamp;

    const colliders = Array.from(this.gameObjects.values()).filter(
      obj => obj.physics?.isStatic || !this.behaviors.has(obj.id)
    );

    for (const [id, behavior] of this.behaviors) {
      behavior.update(deltaTime, colliders);
    }
  }

  moveLeft(objectId: string): void {
    const behavior = this.behaviors.get(objectId);
    if (behavior) {
      behavior.moveLeft();
    }
  }

  moveRight(objectId: string): void {
    const behavior = this.behaviors.get(objectId);
    if (behavior) {
      behavior.moveRight();
    }
  }

  jump(objectId: string): void {
    const behavior = this.behaviors.get(objectId);
    if (behavior) {
      behavior.jump();
    }
  }

  getObjectVelocity(objectId: string): { x: number; y: number } | null {
    const behavior = this.behaviors.get(objectId);
    return behavior ? behavior.getVelocity() : null;
  }

  isObjectOnGround(objectId: string): boolean {
    const behavior = this.behaviors.get(objectId);
    return behavior ? behavior.isOnGround() : false;
  }

  reset(): void {
    this.gameObjects.clear();
    this.behaviors.clear();
    this.lastTimestamp = 0;
  }
}