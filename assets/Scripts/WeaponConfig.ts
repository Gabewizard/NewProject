import { Vec2 } from 'cc';

export enum FireMode {
    RAPID,
    BURST,
    SEMI_AUTO,
}

export interface BarrelConfig {
    pos: Vec2;
    angle: number;
    size: number;
}

export interface WeaponConfig {
    name: string;
    fireMode: FireMode;
    fireRate: number;
    bulletSpeed: number;
    damageAmount: number;
    magazineSize: number;
    burstCount?: number;
    burstDelay?: number;
    barrels: BarrelConfig[];
}

export const PISTOL: WeaponConfig = {
    name: 'Pistol',
    fireMode: FireMode.SEMI_AUTO,
    fireRate: 0.1,
    bulletSpeed: 25,
    damageAmount: 10,
    magazineSize: 10,
    barrels: [
        { pos: new Vec2(), angle: 0, size: 1.0 },
    ],
};
