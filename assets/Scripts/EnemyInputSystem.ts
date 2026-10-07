import { _decorator, Component, Vec2 } from 'cc';
import type { IInputSystem } from './IInputSystem';
import type { IState } from './IState';
import { WanderBehavior } from './WanderBehavior';
import { PatrolState } from './PatrolState';
import { ArrivedState } from './ArrivedState';

const { ccclass } = _decorator;

@ccclass('EnemyInputSystem')
export class EnemyInputSystem extends Component implements IInputSystem {
    public wander: WanderBehavior = new WanderBehavior();
    public patrolState: PatrolState = new PatrolState();
    public arrivedState: ArrivedState = new ArrivedState();
    private currentState: IState | null = null;
    private currentMoveDir: Vec2 = new Vec2();

    public initialize(wayPoints: Vec2[]): void {
        this.wander.setWayPoints(wayPoints);
        this.changeState(this.patrolState);
    }

    public changeState(newState: IState): void {
        if (this.currentState === newState) return;
        if (this.currentState) this.currentState.exit(this);
        this.currentState = newState;
        this.currentState.enter(this);
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

    public getRotationAngle(): number | null {
        return null;
    }
}
