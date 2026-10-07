import { _decorator, Component, find, Node } from 'cc';
import { EnemyInputSystem } from './EnemyInputSystem';
import { EnemyMovementSystem } from './EnemyMovementSystem';
import { HealthSystem } from './HealthSystem';

const { ccclass } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {
    private inputSystem: EnemyInputSystem | null = null;
    private movementSystem: EnemyMovementSystem | null = null;
    private healthSystem: HealthSystem | null = null;
    private targetNode: Node | null = null;

    protected onLoad(): void {
        this.inputSystem = this.getComponent(EnemyInputSystem);
        this.movementSystem = this.getComponent(EnemyMovementSystem);
        this.healthSystem = this.getComponent(HealthSystem);

        if (this.healthSystem) {
            this.healthSystem.initialize(20);
        }

        if (this.inputSystem) {
            this.targetNode = find('Canvas/Player');
            this.inputSystem.initialize(this.targetNode);
        }
    }

    protected update(deltaTime: number): void {
        if (this.healthSystem && this.healthSystem.isDead) {
            // Remove the physics body outside the contact callback.
            this.node.destroy();
            return;
        }

        if (this.inputSystem && this.movementSystem && this.targetNode) {
            const moveDirection = this.inputSystem.getMoveDirection();
            this.movementSystem.updateMovement(moveDirection);
            const targetAngle = this.inputSystem.getRotationAngle();
            this.movementSystem.updateRotation(targetAngle);
        }
    }
}
