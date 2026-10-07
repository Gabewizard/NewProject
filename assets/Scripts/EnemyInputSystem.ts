import { _decorator, Component, Vec2 } from 'cc';
import type { IInputSystem } from './IInputSystem';
import { WanderBehavior } from './WanderBehavior';

const { ccclass } = _decorator;

@ccclass('EnemyInputSystem')
export class EnemyInputSystem extends Component implements IInputSystem {
    private wander: WanderBehavior = new WanderBehavior();

    public initialize(wayPoints: Vec2[]): void {
        this.wander.setWayPoints(wayPoints);
    }

    public getMoveDirection(): Vec2 {
        const currentPosition = new Vec2(
            this.node.worldPosition.x,
            this.node.worldPosition.y,
        );
        if (this.wander.hasArrived(currentPosition)) {
            this.wander.pickNewWanderPoint();
        }
        return this.wander.getDesiredVelocity(currentPosition);
    }

    public getRotationAngle(): number | null {
        return null;
    }
}
