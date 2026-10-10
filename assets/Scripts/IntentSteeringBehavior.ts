import { Vec2 } from 'cc';
import type { ISteeringBehavior } from './ISteeringBehavior';
import type { IntentConfig } from './EnemyConfig';
import { SeekBehavior } from './SeekBehavior';
import { FleeBehavior } from './FleeBehavior';

export class IntentSteeringBehavior implements ISteeringBehavior {
    private intent: IntentConfig = { seekWeight: 1.0, fleeWeight: 0.0 };
    private seekBehavior: SeekBehavior = new SeekBehavior();
    private fleeBehavior: FleeBehavior = new FleeBehavior();

    public setWeights(intent: IntentConfig): void {
        this.intent = intent;
    }

    public getDesiredVelocity(
        currentPosition: Vec2,
        targetPosition?: Readonly<Vec2>,
    ): Vec2 {
        const totalSteeringForce = new Vec2();

        if (this.intent.seekWeight > 0 && targetPosition) {
            const seekForce = this.seekBehavior.getDesiredVelocity(
                currentPosition,
                targetPosition,
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
