import {
    _decorator,
    Component,
    RigidBody2D,
    Vec2,
} from 'cc';

const { ccclass, property } = _decorator;

@ccclass('PlayerMovementSystem')
export class PlayerMovementSystem extends Component {
    @property
    public speed: number = 10;

    private rigidBody: RigidBody2D | null = null;

    protected onLoad(): void {
        this.rigidBody = this.getComponent(RigidBody2D);
    }

    public updateRotation(angleDegrees: number): void {
        this.node.angle = angleDegrees;
    }

    public updateMovement(moveDir: Vec2): void {
        if (!this.rigidBody) {
            return;
        }

        let currentVelocity = new Vec2();
        Vec2.multiplyScalar(currentVelocity, moveDir, this.speed);
        this.rigidBody.linearVelocity = currentVelocity;
    }
}
