import type { EnemyInputSystem } from './EnemyInputSystem';

export interface IState {
    enter(brain: EnemyInputSystem): void;
    execute(brain: EnemyInputSystem, dt: number): void;
    exit(brain: EnemyInputSystem): void;
}
