import { Vec2 } from 'cc';
import type { EnemyInputSystem } from './EnemyInputSystem';
import type { IState } from './IState';

export class PatrolState implements IState {
    private stuckTimer: number = 0;
    private stuckThresholdTime: number = 0.5;

    public enter(brain: EnemyInputSystem): void {
        this.stuckTimer = 0;
    }

    public execute(brain: EnemyInputSystem, dt: number): void {
        const currentPosition = new Vec2(
            brain.node.worldPosition.x,
            brain.node.worldPosition.y,
        );
        if (brain.getDistanceToPlayer(currentPosition) < brain.spotPlayerDistance) {
            brain.changeState(brain.chaseState);
            return;
        }
        if (brain.wander.hasArrived(currentPosition)) {
            brain.wander.pickNewWanderPoint();
            brain.changeState(brain.arrivedState);
            return;
        }
        if (brain.isMovingSlowly) {
            this.stuckTimer += dt;
            if (this.stuckTimer >= this.stuckThresholdTime) {
                brain.changeState(brain.stuckState);
                return;
            }
        } else {
            this.stuckTimer = Math.max(0, this.stuckTimer - dt * 2);
        }

        const direction = brain.wander.getDesiredVelocity(currentPosition);
        brain.setMoveDirection(direction);
    }

    public exit(brain: EnemyInputSystem): void {}
}
