import { _decorator, Component, find, Vec2 } from 'cc';
import { EnemyInputSystem } from './EnemyInputSystem';
import { EnemyMovementSystem } from './EnemyMovementSystem';
import { HealthSystem } from './HealthSystem';

const { ccclass } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {
    private inputSystem: EnemyInputSystem | null = null;
    private movementSystem: EnemyMovementSystem | null = null;
    private healthSystem: HealthSystem | null = null;

    protected onLoad(): void {
        this.inputSystem = this.getComponent(EnemyInputSystem);
        this.movementSystem = this.getComponent(EnemyMovementSystem);
        this.healthSystem = this.getComponent(HealthSystem);
        if (this.healthSystem) this.healthSystem.initialize(20);
    }

    protected start(): void {
        if (!this.inputSystem) return;
        const wanderNodes = this.node.parent?.getChildByName('WanderNodes');
        const wanderPoints = wanderNodes
            ? wanderNodes.children.map(child => new Vec2(
                child.worldPosition.x,
                child.worldPosition.y,
            ))
            : [];
        this.inputSystem.initialize(find('Canvas/Player'), wanderPoints);
    }

    protected update(deltaTime: number): void {
        if (this.healthSystem && this.healthSystem.isDead) {
            // Remove the physics body outside the contact callback.
            this.node.destroy();
            return;
        }
        if (this.inputSystem && this.movementSystem) {
            this.inputSystem.processFSM(deltaTime);
            this.movementSystem.updateMovement(this.inputSystem.getMoveDirection());
            this.movementSystem.updateRotation(this.inputSystem.getRotationAngle());
        }
    }
}
