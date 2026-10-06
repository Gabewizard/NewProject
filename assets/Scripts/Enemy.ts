import { _decorator, Component } from 'cc';
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

        if (this.healthSystem) {
            this.healthSystem.initialize(20);
        }
    }

    protected update(deltaTime: number): void {
        if (this.healthSystem && this.healthSystem.isDead) {
            // Remove the physics body outside the contact callback.
            this.node.destroy();
        }
    }
}
