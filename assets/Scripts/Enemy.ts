import { _decorator, Component, find, Vec2 } from 'cc';
import { EnemyInputSystem } from './EnemyInputSystem';
import { EnemyMovementSystem } from './EnemyMovementSystem';
import { HealthSystem } from './HealthSystem';
import type { IntentConfig, MovementConfig } from './EnemyConfig';

const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {
    public static activeEnemies: Enemy[] = [];

    @property({ group: 'Intent Weights', slide: true, range: [0, 5, 0.1] })
    public seekWeight: number = 1.0;

    @property({ group: 'Intent Weights', slide: true, range: [0, 5, 0.1] })
    public fleeWeight: number = 0.0;

    @property({ group: 'Movement Weights', slide: true, range: [0, 5, 0.1] })
    public maxSpeed: number = 4;

    @property({ group: 'Movement Weights', slide: true, range: [0, 1, 0.1] })
    public maxTurnForce: number = 0.2;

    @property({ group: 'Movement Weights', slide: true, range: [0, 10, 0.1] })
    public avoidWeight: number = 3;

    @property({ group: 'Movement Weights', slide: true, range: [0, 5, 0.1] })
    public separationWeight: number = 0;

    @property({ group: 'Movement Weights', slide: true, range: [0, 150, 5] })
    public separationRadius: number = 50;

    @property({ group: 'Movement Weights', slide: true, range: [0, 5, 0.1] })
    public alignmentWeight: number = 0;

    @property({ group: 'Movement Weights', slide: true, range: [0, 200, 5] })
    public alignmentRadius: number = 0;

    @property({ group: 'Movement Weights', slide: true, range: [0, 5, 0.1] })
    public cohesionWeight: number = 0;

    @property({ group: 'Movement Weights', slide: true, range: [0, 400, 5] })
    public cohesionRadius: number = 0;

    private movementConfig: MovementConfig = {
        maxSpeed: 4,
        maxTurnForce: 0.2,
        avoidWeight: 3,
        whiskers: [],
        flocking: {
            separationWeight: 0, separationRadius: 50,
            alignmentWeight: 0, alignmentRadius: 0,
            cohesionWeight: 0, cohesionRadius: 0,
        },
    };
    private intentConfig: IntentConfig = { seekWeight: 1.0, fleeWeight: 0.0 };
    private inputSystem: EnemyInputSystem | null = null;
    private movementSystem: EnemyMovementSystem | null = null;
    private healthSystem: HealthSystem | null = null;

    protected onLoad(): void {
        Enemy.activeEnemies.push(this);
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
            avoidWeight: this.avoidWeight,
            flocking: {
                separationWeight: this.separationWeight,
                separationRadius: this.separationRadius,
                alignmentWeight: this.alignmentWeight,
                alignmentRadius: this.alignmentRadius,
                cohesionWeight: this.cohesionWeight,
                cohesionRadius: this.cohesionRadius,
            },
            whiskers: [
                { startPos: new Vec2(), angle: 0, length: 100 },
                { startPos: new Vec2(), angle: 25, length: 75 },
                { startPos: new Vec2(), angle: -25, length: 75 },
                { startPos: new Vec2(), angle: 45, length: 50 },
                { startPos: new Vec2(), angle: -45, length: 50 },
            ],
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
    protected onDestroy(): void {
        const index = Enemy.activeEnemies.indexOf(this);
        if (index > -1) Enemy.activeEnemies.splice(index, 1);
    }
}

