import { Vec2 } from 'cc';
import type { ISteeringBehavior } from './ISteeringBehavior';
import type { MovementConfig } from './EnemyConfig';
import type { EnemyMovementSystem } from './EnemyMovementSystem';
import { AvoidBehavior } from './AvoidBehavior';
import { SeparationBehavior } from './SeparationBehavior';
import { AlignmentBehavior } from './AlignmentBehavior';
import { CohesionBehavior } from './CohesionBehavior';

export class TacticalSteeringBehavior implements ISteeringBehavior {
    private movementConfig: MovementConfig;
    private brain: EnemyMovementSystem;
    private avoidBehavior: AvoidBehavior;
    private separationBehavior: SeparationBehavior;
    private alignmentBehavior: AlignmentBehavior;
    private cohesionBehavior: CohesionBehavior;

    constructor(movementConfig: MovementConfig, enemyMovementSystem: EnemyMovementSystem) {
        this.movementConfig = movementConfig;
        this.brain = enemyMovementSystem;
        this.avoidBehavior = new AvoidBehavior(enemyMovementSystem, movementConfig.whiskers);
        this.separationBehavior = new SeparationBehavior(
            enemyMovementSystem, movementConfig.flocking.separationRadius,
        );
        this.alignmentBehavior = new AlignmentBehavior(
            enemyMovementSystem, movementConfig.flocking.alignmentRadius,
        );
        this.cohesionBehavior = new CohesionBehavior(
            enemyMovementSystem, movementConfig.flocking.cohesionRadius,
        );
    }

    public getDesiredVelocity(currentPosition: Vec2): Vec2 {
        const totalTacticalForce = new Vec2();
        if (this.movementConfig.avoidWeight > 0) {
            const avoidForce = this.avoidBehavior.getDesiredVelocity(currentPosition);
            avoidForce.multiplyScalar(this.movementConfig.avoidWeight);
            totalTacticalForce.add(avoidForce);
        } else if (this.brain.debugGraphics) {
            this.brain.debugGraphics.clear();
        }

        if (this.movementConfig.flocking.separationWeight > 0) {
            const separationForce = this.separationBehavior.getDesiredVelocity(currentPosition);
            separationForce.multiplyScalar(this.movementConfig.flocking.separationWeight);
            totalTacticalForce.add(separationForce);
        }

        if (this.movementConfig.flocking.alignmentWeight > 0) {
            const alignmentForce = this.alignmentBehavior.getDesiredVelocity(currentPosition);
            alignmentForce.multiplyScalar(this.movementConfig.flocking.alignmentWeight);
            totalTacticalForce.add(alignmentForce);
        }

        if (this.movementConfig.flocking.cohesionWeight > 0) {
            const cohesionForce = this.cohesionBehavior.getDesiredVelocity(currentPosition);
            cohesionForce.multiplyScalar(this.movementConfig.flocking.cohesionWeight);
            totalTacticalForce.add(cohesionForce);
        }

        if (totalTacticalForce.lengthSqr() > 1.0) totalTacticalForce.normalize();
        return totalTacticalForce;
    }
}

