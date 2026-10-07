import { Vec2 } from 'cc';
import type { EnemyInputSystem } from './EnemyInputSystem';
import type { IState } from './IState';

export class LostPlayerState implements IState {
    private timer: number = 0;
    private waitTime: number = 0.5;

    public enter(brain: EnemyInputSystem): void {
        brain.setMoveDirection(new Vec2());
        this.timer = this.waitTime;
    }

    public execute(brain: EnemyInputSystem, dt: number): void {
        this.timer -= dt;
        const currentPosition = new Vec2(
            brain.node.worldPosition.x,
            brain.node.worldPosition.y,
        );
        if (brain.getDistanceToPlayer(currentPosition) < brain.spotPlayerDistance) {
            brain.changeState(brain.chaseState);
            return;
        }
        if (this.timer <= 0) {
            brain.changeState(brain.patrolState);
        }
    }

    public exit(brain: EnemyInputSystem): void {}
}
