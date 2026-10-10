import { Vec2 } from 'cc';
import type { EnemyInputSystem } from './EnemyInputSystem';
import type { IState } from './IState';

export class ChaseState implements IState {
    private stuckTimer: number = 0;
    private stuckThresholdTime: number = 1.0;
    private attackRange: number = 50;

    public enter(brain: EnemyInputSystem): void {
        this.stuckTimer = 0;
    }

    public execute(brain: EnemyInputSystem, dt: number): void {
        const currentPosition = new Vec2(
            brain.node.worldPosition.x,
            brain.node.worldPosition.y,
        );
        const distanceToPlayer = brain.getDistanceToPlayer(currentPosition);
        if (!brain.targetNode || distanceToPlayer > brain.losePlayerDistance) {
            brain.changeState(brain.lostPlayerState);
            return;
        }

        if (distanceToPlayer > this.attackRange) {
            if (brain.isMovingSlowly) {
                this.stuckTimer += dt;
                if (this.stuckTimer >= this.stuckThresholdTime) {
                    brain.changeState(brain.stuckState);
                    return;
                }
            } else {
                this.stuckTimer = Math.max(0, this.stuckTimer - dt * 2);
            }
        } else {
            this.stuckTimer = 0;
        }

        const direction = brain.compositeIntent.getDesiredVelocity(
            currentPosition, brain.getPlayerPos(), brain.getTargetVelocity(),
        );
        brain.setMoveDirection(direction);
    }

    public exit(brain: EnemyInputSystem): void {}
}
