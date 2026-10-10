import { Vec2 } from 'cc';
import type { ISteeringBehavior } from './ISteeringBehavior';
import type { EnemyMovementSystem } from './EnemyMovementSystem';

export class AlignmentBehavior implements ISteeringBehavior {
    private brain: EnemyMovementSystem;
    private alignmentRadius: number;

    constructor(enemyMovementSystem: EnemyMovementSystem, alignmentRadius: number) {
        this.brain = enemyMovementSystem;
        this.alignmentRadius = alignmentRadius;
    }

    public getDesiredVelocity(currentPosition: Vec2): Vec2 {
        const alignmentForce = new Vec2();
        if (this.alignmentRadius <= 0) return alignmentForce;

        let neighborCount = 0;
        for (const neighbor of this.brain.getNeighbors()) {
            if (Vec2.distance(currentPosition, neighbor.position) >= this.alignmentRadius) continue;
            alignmentForce.add(neighbor.velocity);
            neighborCount++;
        }

        if (neighborCount === 0) return alignmentForce;
        alignmentForce.multiplyScalar(1.0 / neighborCount);
        if (alignmentForce.lengthSqr() > 0) alignmentForce.normalize();
        return alignmentForce;
    }
}

