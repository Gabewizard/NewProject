import { math, Vec2 } from 'cc';
import type { ISteeringBehavior } from './ISteeringBehavior';
import { SeekBehavior } from './SeekBehavior';

export class WanderBehavior implements ISteeringBehavior {
    private wayPoints: Vec2[] = [];
    private currentWayPointIndex: number = 0;
    private wayPointThreshold: number = 10;
    private seekBehavior: SeekBehavior = new SeekBehavior();

    public setWayPoints(points: Vec2[]): void {
        this.wayPoints = points;
        this.pickNewWanderPoint();
    }

    public pickNewWanderPoint(): void {
        if (this.wayPoints.length === 0) return;
        this.currentWayPointIndex = math.randomRangeInt(0, this.wayPoints.length);
    }

    public hasArrived(currentPosition: Vec2): boolean {
        if (this.wayPoints.length === 0) return false;
        const currentTarget = this.wayPoints[this.currentWayPointIndex];
        return Vec2.distance(currentPosition, currentTarget) <= this.wayPointThreshold;
    }

    public getDesiredVelocity(currentPosition: Vec2): Vec2 {
        if (this.wayPoints.length === 0) return new Vec2();
        const currentTarget = this.wayPoints[this.currentWayPointIndex];
        return this.seekBehavior.getDesiredVelocity(currentPosition, currentTarget);
    }
}
