import type { Vec2 } from 'cc';

export interface IntentConfig {
    seekWeight: number;
    fleeWeight: number;
    maxSpeed: number;
    maxPredictionTime: number;
    spotPlayerDistance: number;
    lostPlayerDistance: number;
}

export interface WhiskerConfig {
    startPos: Vec2;
    angle: number;
    length: number;
}

export interface FlockingWeights {
    separationWeight: number;
    separationRadius: number;
    alignmentWeight: number;
    alignmentRadius: number;
    cohesionWeight: number;
    cohesionRadius: number;
}

export interface MovementConfig {
    maxTurnForce: number;
    avoidWeight: number;
    whiskers: WhiskerConfig[];
    flocking: FlockingWeights;
}

export interface EnemyConfig {
    intent: IntentConfig;
    moving: MovementConfig;
}
