import { _decorator, Component, Label, Node, Vec2 } from 'cc';
import type { IInputSystem } from './IInputSystem';
import type { IState } from './IState';
import { WanderBehavior } from './WanderBehavior';
import { PatrolState } from './PatrolState';
import { ArrivedState } from './ArrivedState';
import { SeekBehavior } from './SeekBehavior';
import { ChaseState } from './ChaseState';
import { LostPlayerState } from './LostPlayerState';
import { FleeBehavior } from './FleeBehavior';
import { StuckState } from './StuckState';
import { IntentSteeringBehavior } from './IntentSteeringBehavior';
import type { IntentConfig } from './EnemyConfig';

const { ccclass, property } = _decorator;

@ccclass('EnemyInputSystem')
export class EnemyInputSystem extends Component implements IInputSystem {
    @property({ type: Label })
    public stateDebugLabel: Label | null = null;

    public compositeIntent: IntentSteeringBehavior = new IntentSteeringBehavior();
    public flee: FleeBehavior = new FleeBehavior();
    public stuckState: StuckState = new StuckState();

    public seek: SeekBehavior = new SeekBehavior();
    public targetNode: Node | null = null;
    public spotPlayerDistance: number = 200;
    public losePlayerDistance: number = 250;
    public chaseState: ChaseState = new ChaseState();
    public lostPlayerState: LostPlayerState = new LostPlayerState();
    public wander: WanderBehavior = new WanderBehavior();
    public patrolState: PatrolState = new PatrolState();
    public arrivedState: ArrivedState = new ArrivedState();
    private lastTargetPos: Vec2 | null = null;
    private trackedTargetNode: Node | null = null;
    private targetVelocity: Vec2 = new Vec2();
    private currentState: IState | null = null;
    private currentMoveDir: Vec2 = new Vec2();

    private _isMovingSlowly: boolean = false;

    public get isMovingSlowly(): boolean {
        return this._isMovingSlowly;
    }

    public set isMovingSlowly(value: boolean) {
        this._isMovingSlowly = value;
    }

    public initialize(
        targetNode: Node | null,
        wayPoints: Vec2[],
        intentConfig: IntentConfig,
    ): void {
        this.targetNode = targetNode;
        this.trackedTargetNode = targetNode;
        this.lastTargetPos = targetNode?.isValid
            ? new Vec2(targetNode.worldPosition.x, targetNode.worldPosition.y)
            : null;
        this.targetVelocity.set(0, 0);
        this.spotPlayerDistance = intentConfig.spotPlayerDistance;
        this.losePlayerDistance = intentConfig.lostPlayerDistance;
        this.wander.init(wayPoints, intentConfig);
        this.compositeIntent.setWeights(intentConfig);
        this.changeState(this.patrolState);
    }

    public changeState(newState: IState): void {
        if (this.currentState === newState) return;
        if (this.currentState) this.currentState.exit(this);
        this.currentState = newState;
        this.currentState.enter(this);

        if (this.stateDebugLabel) {
            this.stateDebugLabel.string = newState.constructor.name;
        }
    }

    public processFSM(dt: number): void {
        this.targetVelocity.set(0, 0);
        if (this.targetNode?.isValid) {
            const currentTargetPos = new Vec2(
                this.targetNode.worldPosition.x,
                this.targetNode.worldPosition.y,
            );
            if (this.trackedTargetNode === this.targetNode && this.lastTargetPos
                && Number.isFinite(dt) && dt > 0) {
                Vec2.subtract(this.targetVelocity, currentTargetPos, this.lastTargetPos);
                this.targetVelocity.multiplyScalar(1.0 / dt);
            }
            this.lastTargetPos = currentTargetPos;
            this.trackedTargetNode = this.targetNode;
        } else {
            this.lastTargetPos = null;
            this.trackedTargetNode = null;
        }
        if (this.currentState) this.currentState.execute(this, dt);
    }

    public setMoveDirection(direction: Vec2): void {
        this.currentMoveDir = direction;
    }

    public getMoveDirection(): Vec2 {
        return this.currentMoveDir;
    }

    public getTargetVelocity(): Vec2 {
        return this.targetVelocity.clone();
    }

    public getPlayerPos(): Vec2 {
        return this.targetNode?.isValid
            ? new Vec2(this.targetNode.worldPosition.x, this.targetNode.worldPosition.y)
            : new Vec2();
    }

    public getDistanceToPlayer(currentPosition: Vec2): number {
        if (!this.targetNode?.isValid) return Infinity;
        return Vec2.distance(currentPosition, this.getPlayerPos());
    }

    public getRotationAngle(): number | null {
        return null;
    }
}
