import type { Vec2 } from 'cc';

export interface ISteeringBehavior {
    getDesiredVelocity(
        currentPosition: Vec2,
        targetPosition?: Readonly<Vec2>,
        targetVelocity?: Readonly<Vec2>,
    ): Vec2;
}
