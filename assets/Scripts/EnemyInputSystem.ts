import { _decorator, Component, Node, Vec2 } from 'cc';
import type { IInputSystem } from './IInputSystem';
import { SeekBehavior } from './SeekBehavior';

const { ccclass } = _decorator;

@ccclass('EnemyInputSystem')
export class EnemyInputSystem extends Component implements IInputSystem {
    private seek: SeekBehavior = new SeekBehavior();
    private targetNode: Node | null = null;

    public initialize(targetNode: Node | null): void {
        this.targetNode = targetNode;
    }

    public getMoveDirection(): Vec2 {
        if (!this.targetNode) return new Vec2();

        const currentPosition = new Vec2(
            this.node.worldPosition.x,
            this.node.worldPosition.y,
        );
        const targetPosition = new Vec2(
            this.targetNode.worldPosition.x,
            this.targetNode.worldPosition.y,
        );

        return this.seek.getDesiredVelocity(currentPosition, targetPosition);
    }

    public getRotationAngle(): number | null {
        // Let movement turn the sprite toward its current velocity.
        return null;
    }
}
