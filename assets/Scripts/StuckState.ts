import { Vec2 } from 'cc';
import type { EnemyInputSystem } from './EnemyInputSystem';
import type { IState } from './IState';

export class StuckState implements IState {
    private fleeTimer: number = 0;
    private fleeDuration: number = 1.0;
    private escapePoint: Vec2 = new Vec2();

    public enter(brain: EnemyInputSystem): void {
        this.fleeTimer = this.fleeDuration;

        const currentPosition = new Vec2(
            brain.node.worldPosition.x,
            brain.node.worldPosition.y,
        );
        const intendedDirection = brain.getMoveDirection();
        const randomNoise = new Vec2(
            Math.random() - 0.5,
            Math.random() - 0.5,
        ).normalize();

        this.escapePoint = new Vec2(
            currentPosition.x + intendedDirection.x + randomNoise.x,
            currentPosition.y + intendedDirection.y + randomNoise.y,
        );
    }

    public execute(brain: EnemyInputSystem, dt: number): void {
        this.fleeTimer -= dt;

        if (this.fleeTimer <= 0) {
            brain.changeState(brain.patrolState);
            return;
        }

        const currentPosition = new Vec2(
            brain.node.worldPosition.x,
            brain.node.worldPosition.y,
        );
        const direction = brain.flee.getDesiredVelocity(
            currentPosition,
            this.escapePoint,
        );
        brain.setMoveDirection(direction);
    }

    public exit(brain: EnemyInputSystem): void {}
}
