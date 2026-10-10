import { Vec2 } from 'cc';
import type { ISteeringBehavior } from './ISteeringBehavior';
import type { IntentConfig } from './EnemyConfig';
import { PursuitBehavior } from './PursuitBehavior';
import { FleeBehavior } from './FleeBehavior';

export class IntentSteeringBehavior implements ISteeringBehavior {
    private intent: IntentConfig = {
        seekWeight: 1.0, fleeWeight: 0.0, maxSpeed: 4, maxPredictionTime: 2.0,
        spotPlayerDistance: 200, lostPlayerDistance: 250,
    };
    private pursuitBehavior: PursuitBehavior = new PursuitBehavior(4, 2.0);
    private fleeBehavior: FleeBehavior = new FleeBehavior();

    public setWeights(intent: IntentConfig): void {
        this.intent = intent;
        this.pursuitBehavior = new PursuitBehavior(intent.maxSpeed, intent.maxPredictionTime);
    }

    public getDesiredVelocity(
        currentPosition: Vec2,
        targetPosition?: Readonly<Vec2>,
        targetVelocity?: Readonly<Vec2>,
    ): Vec2 {
        const totalSteeringForce = new Vec2();

        if (this.intent.seekWeight > 0 && targetPosition) {
            const seekForce = this.pursuitBehavior.getDesiredVelocity(
                currentPosition,
                targetPosition,
                targetVelocity,
            );
            seekForce.multiplyScalar(this.intent.seekWeight);
            totalSteeringForce.add(seekForce);
        }

        if (this.intent.fleeWeight > 0 && targetPosition) {
            const fleeForce = this.fleeBehavior.getDesiredVelocity(
                currentPosition,
                targetPosition,
            );
            fleeForce.multiplyScalar(this.intent.fleeWeight);
            totalSteeringForce.add(fleeForce);
        }

        if (totalSteeringForce.lengthSqr() > 1.0) {
            totalSteeringForce.normalize();
        }

        return totalSteeringForce;
    }
}
