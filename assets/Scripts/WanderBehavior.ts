import { math, Vec2 } from 'cc';
import type { ISteeringBehavior } from './ISteeringBehavior';
import { IntentSteeringBehavior } from './IntentSteeringBehavior';
import type { IntentConfig } from './EnemyConfig';

export class WanderBehavior implements ISteeringBehavior {
    private wayPoints: Vec2[] = [];
    private currentWayPointIndex: number = 0;
    private wayPointThreshold: number = 10;
    private compositeIntent: IntentSteeringBehavior = new IntentSteeringBehavior();

    public init(points: Vec2[], intent: IntentConfig): void {
        this.setWayPoints(points);
        this.setWeights(intent);
    }

    private setWeights(intent: IntentConfig): void {
        this.compositeIntent.setWeights(intent);
    }

    private setWayPoints(points: Vec2[]): void {
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
        return this.compositeIntent.getDesiredVelocity(currentPosition, currentTarget);
    }
}
