import { Vec2 } from 'cc';
import type { EnemyInputSystem } from './EnemyInputSystem';
import type { IState } from './IState';

export class PatrolState implements IState {
    public enter(brain: EnemyInputSystem): void {}

    public execute(brain: EnemyInputSystem, dt: number): void {
        const currentPosition = new Vec2(
            brain.node.worldPosition.x,
            brain.node.worldPosition.y,
        );
        if (brain.wander.hasArrived(currentPosition)) {
            brain.wander.pickNewWanderPoint();
            brain.changeState(brain.arrivedState);
            return;
        }
        const direction = brain.wander.getDesiredVelocity(currentPosition);
        brain.setMoveDirection(direction);
    }

    public exit(brain: EnemyInputSystem): void {}
}
