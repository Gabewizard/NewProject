import { math, Vec2 } from 'cc';
import type { ISteeringBehavior } from './ISteeringBehavior';
import type { EnemyMovementSystem } from './EnemyMovementSystem';

export class SeparationBehavior implements ISteeringBehavior {
    private brain: EnemyMovementSystem;
    private separationRadius: number;

    constructor(enemyMovementSystem: EnemyMovementSystem, separationRadius: number) {
        this.brain = enemyMovementSystem;
        this.separationRadius = separationRadius;
    }

    public getDesiredVelocity(currentPosition: Vec2): Vec2 {
        const separationForce = new Vec2();
        if (this.separationRadius <= 0) return separationForce;
        const neighbors = this.brain.getNeighbors();
        let pushCount = 0;

        for (const neighbor of neighbors) {
            const distance = Vec2.distance(currentPosition, neighbor.position);
            if (distance >= this.separationRadius) continue;

            const pushVector = new Vec2();
            if (distance === 0) {
                pushVector.set(math.randomRange(-0.1, 0.1), math.randomRange(-0.1, 0.1));
            } else {
                Vec2.subtract(pushVector, currentPosition, neighbor.position);
                pushVector.normalize();
                const strength = 1.0 - distance / this.separationRadius;
                pushVector.multiplyScalar(strength);
            }
            separationForce.add(pushVector);
            pushCount++;
        }

        if (pushCount > 0) separationForce.multiplyScalar(1.0 / pushCount);
        return separationForce;
    }
}

