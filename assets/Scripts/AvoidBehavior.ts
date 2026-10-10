import { Color, ERaycast2DType, math, PhysicsSystem2D, Vec2 } from 'cc';
import type { ISteeringBehavior } from './ISteeringBehavior';
import type { WhiskerConfig } from './EnemyConfig';
import type { EnemyMovementSystem } from './EnemyMovementSystem';

export class AvoidBehavior implements ISteeringBehavior {
    // OBSTACLES is physics group index 5 in this project (bit mask 32).
    private readonly GROUP_OBSTACLES: number = 1 << 5;
    private brain: EnemyMovementSystem;
    private whiskers: WhiskerConfig[];
    private currentHitNormals: Vec2[] = [];

    constructor(enemyMovementSystem: EnemyMovementSystem, whiskers: WhiskerConfig[]) {
        this.brain = enemyMovementSystem;
        this.whiskers = whiskers;
    }

    public getDesiredVelocity(currentPosition: Vec2): Vec2 {
        this.updateWhiskers(currentPosition);
        const avoidForce = new Vec2();
        for (const normal of this.currentHitNormals) avoidForce.add(normal);
        return avoidForce;
    }

    public updateWhiskers(currentPosition: Vec2): void {
        this.currentHitNormals = [];
        if (this.brain.debugGraphics) this.brain.debugGraphics.clear();
        const myAngle = this.brain.node.angle;
        const radians = math.toRadian(myAngle);

        for (const whisker of this.whiskers) {
            const localStart = whisker.startPos;
            const localEnd = this.getEndPoint(localStart, whisker.angle, whisker.length);
            const worldStart = new Vec2(
                currentPosition.x + localStart.x * Math.cos(radians) - localStart.y * Math.sin(radians),
                currentPosition.y + localStart.x * Math.sin(radians) + localStart.y * Math.cos(radians),
            );
            const worldEnd = this.getEndPoint(worldStart, myAngle + whisker.angle, whisker.length);
            const results = PhysicsSystem2D.instance.raycast(
                worldStart, worldEnd, ERaycast2DType.Closest, this.GROUP_OBSTACLES,
            );

            if (results.length > 0) {
                const hit = results[0];
                const strength = 1.0 - hit.fraction;
                const pushForce = hit.normal.clone().multiplyScalar(strength);
                this.currentHitNormals.push(pushForce);

                const localHit = new Vec2();
                Vec2.lerp(localHit, localStart, localEnd, hit.fraction);
                this.drawDebugRay(localStart, localHit, true);
            } else {
                this.drawDebugRay(localStart, localEnd, false);
            }
        }
    }

    private getEndPoint(startPos: Vec2, angle: number, length: number): Vec2 {
        const radians = math.toRadian(angle);
        return new Vec2(
            startPos.x + length * Math.cos(radians),
            startPos.y + length * Math.sin(radians),
        );
    }

    private drawDebugRay(start: Vec2, end: Vec2, hit: boolean): void {
        const graphics = this.brain.debugGraphics;
        if (!graphics) return;
        graphics.strokeColor = hit ? Color.RED : Color.GREEN;
        graphics.lineWidth = 2;
        graphics.moveTo(start.x, start.y);
        graphics.lineTo(end.x, end.y);
        graphics.stroke();
    }
}
