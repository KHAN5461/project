import { GameObject } from '@/types/project';

export interface PlatformerProperties {
  gravity: number;
  jumpForce: number;
  moveSpeed: number;
  groundFriction: number;
  airControl: number;
  maxFallSpeed: number;
  maxJumps: number;
  coyoteTime: number;
  jumpBufferTime: number;
}

export class PlatformerBehavior {
  private velocity: { x: number; y: number } = { x: 0, y: 0 };
  private isGrounded: boolean = false;
  private jumpsLeft: number = 0;
  private lastGroundedTime: number = 0;
  private lastJumpPressedTime: number = 0;
  private isJumping: boolean = false;

  constructor(
    private gameObject: GameObject,
    private properties: PlatformerProperties = {
      gravity: 0.5,
      jumpForce: -10,
      moveSpeed: 5,
      groundFriction: 0.8,
      airControl: 0.5,
      maxFallSpeed: 15,
      maxJumps: 2,
      coyoteTime: 150,
      jumpBufferTime: 150
    }
  ) {}

  update(deltaTime: number, colliders: GameObject[]): void {
    this.applyGravity();
    this.handleMovement();
    this.handleCollisions(colliders);
    this.updatePosition();
  }

  private applyGravity(): void {
    if (!this.isGrounded) {
      const fallMultiplier = 1.5;
      const lowJumpMultiplier = 2.0;
      
      this.velocity.y += this.properties.gravity;
      
      if (this.velocity.y > 0) {
        this.velocity.y += this.properties.gravity * (fallMultiplier - 1);
      } else if (this.velocity.y < 0 && !keysPressed.has('space')) {
        this.velocity.y += this.properties.gravity * (lowJumpMultiplier - 1);
      }
      
      this.velocity.y = Math.min(this.velocity.y, this.properties.maxFallSpeed);
    }
  }

  private handleMovement(): void {
    const friction = this.isGrounded ? this.properties.groundFriction : 1;
    const control = this.isGrounded ? 1 : this.properties.airControl;
    
    this.velocity.x *= friction;
    if (Math.abs(this.velocity.x) < 0.1) this.velocity.x = 0;
    
    if (this.velocity.x !== 0) {
      const maxSpeed = this.properties.moveSpeed * control;
      this.velocity.x = Math.min(Math.abs(this.velocity.x), maxSpeed) * Math.sign(this.velocity.x);
    }
  }

  private handleCollisions(colliders: GameObject[]): void {
    this.isGrounded = false;

    for (const collider of colliders) {
      if (this.checkCollision(collider)) {
        this.resolveCollision(collider);
      }
    }
  }

  private checkCollision(collider: GameObject): boolean {
    return (
      this.gameObject.x < collider.x + collider.width &&
      this.gameObject.x + this.gameObject.width > collider.x &&
      this.gameObject.y < collider.y + collider.height &&
      this.gameObject.y + this.gameObject.height > collider.y
    );
  }

  private resolveCollision(collider: GameObject): void {
    const overlapX = Math.min(
      this.gameObject.x + this.gameObject.width - collider.x,
      collider.x + collider.width - this.gameObject.x
    );
    const overlapY = Math.min(
      this.gameObject.y + this.gameObject.height - collider.y,
      collider.y + collider.height - this.gameObject.y
    );

    if (overlapX < overlapY) {
      this.velocity.x = 0;
      if (this.gameObject.x < collider.x) {
        this.gameObject.x = collider.x - this.gameObject.width;
      } else {
        this.gameObject.x = collider.x + collider.width;
      }
    } else {
      this.velocity.y = 0;
      if (this.gameObject.y < collider.y) {
        this.gameObject.y = collider.y - this.gameObject.height;
      } else {
        this.gameObject.y = collider.y + collider.height;
        if (!this.isGrounded) {
          this.isGrounded = true;
          this.jumpsLeft = this.properties.maxJumps - 1;
          this.lastGroundedTime = Date.now();
          this.isJumping = false;
        }
      }
    }
  }

  private updatePosition(): void {
    this.gameObject.x += this.velocity.x;
    this.gameObject.y += this.velocity.y;
  }

  moveLeft(): void {
    const acceleration = this.isGrounded ? 1.0 : 0.7;
    this.velocity.x = Math.max(this.velocity.x - this.properties.moveSpeed * acceleration, -this.properties.moveSpeed);
  }

  moveRight(): void {
    const acceleration = this.isGrounded ? 1.0 : 0.7;
    this.velocity.x = Math.min(this.velocity.x + this.properties.moveSpeed * acceleration, this.properties.moveSpeed);
  }

  jump(): void {
    const now = Date.now();
    this.lastJumpPressedTime = now;
    
    const canCoyoteJump = now - this.lastGroundedTime < this.properties.coyoteTime;
    const canBufferJump = this.isGrounded && (now - this.lastJumpPressedTime < this.properties.jumpBufferTime);
    
    if ((this.isGrounded || canCoyoteJump || this.jumpsLeft > 0) && !this.isJumping) {
      this.velocity.y = this.properties.jumpForce;
      this.isJumping = true;
      
      if (!this.isGrounded && !canCoyoteJump) {
        this.jumpsLeft--;
      }
      
      this.isGrounded = false;
    }
  }

  getVelocity(): { x: number; y: number } {
    return { ...this.velocity };
  }

  isOnGround(): boolean {
    return this.isGrounded;
  }
}