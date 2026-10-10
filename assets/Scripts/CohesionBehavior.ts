import { Vec2 } from 'cc';
import type { ISteeringBehavior } from './ISteeringBehavior';
import type { EnemyMovementSystem } from './EnemyMovementSystem';

export class CohesionBehavior implements ISteeringBehavior {
    private brain: EnemyMovementSystem;
    private cohesionRadius: number;

    constructor(enemyMovementSystem: EnemyMovementSystem, cohesionRadius: number) {
        this.brain = enemyMovementSystem;
        this.cohesionRadius = cohesionRadius;
    }

    public getDesiredVelocity(currentPosition: Vec2): Vec2 {
        const cohesionForce = new Vec2();
        if (this.cohesionRadius <= 0) return cohesionForce;

        const centerOfMass = new Vec2();
        let neighborCount = 0;
        for (const neighbor of this.brain.getNeighbors()) {
            if (Vec2.distance(currentPosition, neighbor.position) >= this.cohesionRadius) continue;
            centerOfMass.add(neighbor.position);
            neighborCount++;
        }

        if (neighborCount === 0) return cohesionForce;
        centerOfMass.multiplyScalar(1.0 / neighborCount);
        Vec2.subtract(cohesionForce, centerOfMass, currentPosition);

        const distanceToCenter = cohesionForce.length();
        if (distanceToCenter > 0) {
            cohesionForce.normalize();
            const strength = Math.min(distanceToCenter / this.cohesionRadius, 1.0);
            cohesionForce.multiplyScalar(strength);
        }
        return cohesionForce;
    }
}

