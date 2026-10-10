import type { Vec2 } from 'cc';

export interface IntentConfig {
    seekWeight: number;
    fleeWeight: number;
    // pursuitWeight: number;
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
    maxSpeed: number;
    maxTurnForce: number;
    avoidWeight: number;
    whiskers: WhiskerConfig[];
    flocking: FlockingWeights;
}

export interface EnemyConfig {
    intent: IntentConfig;
    moving: MovementConfig;
}

