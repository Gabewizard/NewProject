import { Vec2 } from 'cc';
import type { EnemyInputSystem } from './EnemyInputSystem';
import type { IState } from './IState';

export class ChaseState implements IState {
    public enter(brain: EnemyInputSystem): void {}

    public execute(brain: EnemyInputSystem, dt: number): void {
        const currentPosition = new Vec2(
            brain.node.worldPosition.x,
            brain.node.worldPosition.y,
        );
        if (!brain.targetNode ||
            brain.getDistanceToPlayer(currentPosition) > brain.losePlayerDistance) {
            brain.changeState(brain.lostPlayerState);
            return;
        }
        const direction = brain.seek.getDesiredVelocity(currentPosition, brain.getPlayerPos());
        brain.setMoveDirection(direction);
    }

    public exit(brain: EnemyInputSystem): void {}
}
