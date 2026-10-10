import { Vec2 } from 'cc';
import type { ISteeringBehavior } from './ISteeringBehavior';

export class FleeBehavior implements ISteeringBehavior {
    public getDesiredVelocity(
        currentPosition: Vec2,
        targetPosition?: Readonly<Vec2>,
    ): Vec2 {
        const desiredDirection = new Vec2();
        if (!targetPosition) return desiredDirection;

        Vec2.subtract(desiredDirection, currentPosition, targetPosition);
        return desiredDirection.normalize();
    }
}
