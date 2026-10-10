import { _decorator, Component, Label, Node, Vec2 } from 'cc';
import type { IInputSystem } from './IInputSystem';
import type { IState } from './IState';
import { WanderBehavior } from './WanderBehavior';
import { PatrolState } from './PatrolState';
import { ArrivedState } from './ArrivedState';
import { SeekBehavior } from './SeekBehavior';
import { ChaseState } from './ChaseState';
import { LostPlayerState } from './LostPlayerState';

const { ccclass, property } = _decorator;

@ccclass('EnemyInputSystem')
export class EnemyInputSystem extends Component implements IInputSystem {
    @property({ type: Label })
    public stateDebugLabel: Label | null = null;

    public seek: SeekBehavior = new SeekBehavior();
    public targetNode: Node | null = null;
    public spotPlayerDistance: number = 200;
    public losePlayerDistance: number = 250;
    public chaseState: ChaseState = new ChaseState();
    public lostPlayerState: LostPlayerState = new LostPlayerState();
    public wander: WanderBehavior = new WanderBehavior();
    public patrolState: PatrolState = new PatrolState();
    public arrivedState: ArrivedState = new ArrivedState();
    private currentState: IState | null = null;
    private currentMoveDir: Vec2 = new Vec2();

    public initialize(targetNode: Node | null, wayPoints: Vec2[]): void {
        this.targetNode = targetNode;
        this.wander.setWayPoints(wayPoints);
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
        if (this.currentState) this.currentState.execute(this, dt);
    }

    public setMoveDirection(direction: Vec2): void {
        this.currentMoveDir = direction;
    }

    public getMoveDirection(): Vec2 {
        return this.currentMoveDir;
    }

    public getPlayerPos(): Vec2 {
        return this.targetNode
            ? new Vec2(this.targetNode.worldPosition.x, this.targetNode.worldPosition.y)
            : new Vec2();
    }

    public getDistanceToPlayer(currentPosition: Vec2): number {
        if (!this.targetNode) return Infinity;
        return Vec2.distance(currentPosition, this.getPlayerPos());
    }

    public getRotationAngle(): number | null {
        return null;
    }
}
