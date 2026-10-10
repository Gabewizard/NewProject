import { _decorator, Component, find, Vec2 } from 'cc';
import { EnemyInputSystem } from './EnemyInputSystem';
import { EnemyMovementSystem } from './EnemyMovementSystem';
import { HealthSystem } from './HealthSystem';
import type { IntentConfig, MovementConfig } from './EnemyConfig';

const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {
    @property({ group: 'Intent Weights', slide: true, range: [0, 5, 0.1] })
    public seekWeight: number = 1.0;

    @property({ group: 'Intent Weights', slide: true, range: [0, 5, 0.1] })
    public fleeWeight: number = 0.0;

    @property({ group: 'Movement Weights', slide: true, range: [0, 5, 0.1] })
    public maxSpeed: number = 4;

    @property({ group: 'Movement Weights', slide: true, range: [0, 1, 0.1] })
    public maxTurnForce: number = 0.2;

    private movementConfig: MovementConfig = { maxSpeed: 4, maxTurnForce: 0.2 };
    private intentConfig: IntentConfig = { seekWeight: 1.0, fleeWeight: 0.0 };
    private inputSystem: EnemyInputSystem | null = null;
    private movementSystem: EnemyMovementSystem | null = null;
    private healthSystem: HealthSystem | null = null;

    protected onLoad(): void {
        this.inputSystem = this.getComponent(EnemyInputSystem);
        this.movementSystem = this.getComponent(EnemyMovementSystem);
        this.healthSystem = this.getComponent(HealthSystem);
        if (this.healthSystem) this.healthSystem.initialize(20);

        this.intentConfig = {
            seekWeight: this.seekWeight,
            fleeWeight: this.fleeWeight,
        };
        this.movementConfig = {
            maxSpeed: this.maxSpeed,
            maxTurnForce: this.maxTurnForce,
        };
    }

    protected start(): void {
        if (this.movementSystem) this.movementSystem.init(this.movementConfig);
        if (!this.inputSystem) return;
        const wanderNodes = this.node.parent?.getChildByName('WanderNodes');
        const wanderPoints = wanderNodes
            ? wanderNodes.children.map(child => new Vec2(
                child.worldPosition.x,
                child.worldPosition.y,
            ))
            : [];
        this.inputSystem.initialize(find('Canvas/Player'), wanderPoints, this.intentConfig);
    }

    protected update(deltaTime: number): void {
        if (this.healthSystem && this.healthSystem.isDead) {
            // Remove the physics body outside the contact callback.
            this.node.destroy();
            return;
        }
        if (this.inputSystem && this.movementSystem) {
            this.inputSystem.isMovingSlowly = this.movementSystem.isMovingSlowly();
            this.inputSystem.processFSM(deltaTime);
            this.movementSystem.updateMovement(this.inputSystem.getMoveDirection());
            this.movementSystem.updateRotation(this.inputSystem.getRotationAngle());
        }

        if (this.inputSystem?.stateDebugLabel) {
            this.inputSystem.stateDebugLabel.node.angle = -this.node.angle;
        }
    }
}
