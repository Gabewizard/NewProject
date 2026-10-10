import { _decorator, Component, math, RigidBody2D, Vec2 } from 'cc';

import type { MovementConfig } from './EnemyConfig';

const { ccclass } = _decorator;

@ccclass('EnemyMovementSystem')
export class EnemyMovementSystem extends Component {
    private maxSpeed: number | null = null;
    private maxTurnForce: number | null = null;
    private rigidBody: RigidBody2D | null = null;

    protected onLoad(): void {
        this.rigidBody = this.getComponent(RigidBody2D);
    }

    public init(movementConfig: MovementConfig): void {
        this.maxSpeed = movementConfig.maxSpeed;
        this.maxTurnForce = movementConfig.maxTurnForce;
    }

    public updateRotation(angleDegrees: number | null): void {
        if (angleDegrees !== null) {
            this.node.angle = angleDegrees;
        } else {
            const currentVelocity = this.getVelocity();
            if (currentVelocity.lengthSqr() > 0.01) {
                this.node.angle = math.toDegree(
                    Math.atan2(currentVelocity.y, currentVelocity.x),
                );
            }
        }
    }

    public getVelocity(): Vec2 {
        return this.rigidBody
            ? this.rigidBody.linearVelocity.clone()
            : new Vec2();
    }

    public updateMovement(moveDirection: Vec2): void {
        if (!this.rigidBody || this.maxSpeed === null || this.maxTurnForce === null) return;

        let currentVelocity = this.getVelocity();
        const desiredVelocity = new Vec2();
        Vec2.multiplyScalar(desiredVelocity, moveDirection, this.maxSpeed);

        let steeringForce = new Vec2();
        Vec2.subtract(steeringForce, desiredVelocity, currentVelocity);
        steeringForce = this.clampForce(steeringForce, this.maxTurnForce);

        currentVelocity.add(steeringForce);
        currentVelocity = this.clampForce(currentVelocity, this.maxSpeed);
        this.rigidBody.linearVelocity = currentVelocity;
    }

    public isMovingSlowly(): boolean {
        if (!this.rigidBody) return true;
        return this.rigidBody.linearVelocity.lengthSqr() < 10;
    }

    private clampForce(force: Vec2, maxForce: number): Vec2 {
        if (force.lengthSqr() > maxForce ** 2) {
            force.normalize().multiplyScalar(maxForce);
        }
        return force;
    }
}
