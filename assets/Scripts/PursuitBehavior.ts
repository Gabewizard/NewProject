import { Vec2 } from 'cc';
import type { ISteeringBehavior } from './ISteeringBehavior';
import { SeekBehavior } from './SeekBehavior';

export class PursuitBehavior implements ISteeringBehavior {
    private seekBehavior: SeekBehavior = new SeekBehavior();
    private pursuerSpeed: number;
    private maxPredictionTime: number;

    constructor(pursuerSpeed: number, maxPredictionTime: number) {
        this.pursuerSpeed = pursuerSpeed;
        this.maxPredictionTime = maxPredictionTime;
    }

    public getDesiredVelocity(
        currentPosition: Vec2,
        targetPosition?: Readonly<Vec2>,
        targetVelocity?: Readonly<Vec2>,
    ): Vec2 {
        if (!targetPosition) return new Vec2();
        if (!targetVelocity || targetVelocity.lengthSqr() === 0
            || this.pursuerSpeed <= 0 || this.maxPredictionTime <= 0) {
            return this.seekBehavior.getDesiredVelocity(currentPosition, targetPosition);
        }

        const distance = Vec2.distance(currentPosition, targetPosition);
        const predictionTime = Math.min(distance / this.pursuerSpeed, this.maxPredictionTime);
        const predictedPosition = new Vec2(
            targetPosition.x + targetVelocity.x * predictionTime,
            targetPosition.y + targetVelocity.y * predictionTime,
        );
        return this.seekBehavior.getDesiredVelocity(currentPosition, predictedPosition);
    }
}
