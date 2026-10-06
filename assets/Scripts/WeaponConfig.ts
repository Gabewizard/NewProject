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
    bulletSpeed:50,
    damageAmount: 10,
    magazineSize: 10,
    barrels: [
        { pos: new Vec2(), angle: 0, size: 1.0 },
    ],
};


export const SPREAD_GUN: WeaponConfig = {
    name: 'SpreadGun',
    fireMode: FireMode.RAPID,
    fireRate: 0.2,
    bulletSpeed: 20,
    damageAmount: 5,
    magazineSize: 30,
    barrels: [
        { pos: new Vec2(), angle: 0, size: 0.9 },
        { pos: new Vec2(), angle: 15, size: 0.9 },
        { pos: new Vec2(), angle: -15, size: 0.9 },
    ],
};

export const FORWARD_REAR_PISTOL: WeaponConfig = {
    name: 'ForwardRearPistol',
    fireMode: FireMode.SEMI_AUTO,
    fireRate: 0.1,
    bulletSpeed: 25,
    damageAmount: 7,
    magazineSize: 20,
    barrels: [
        { pos: new Vec2(), angle: 0, size: 1.0 },
        { pos: new Vec2(), angle: 180, size: 1.0 },
    ],
};

export const DOUBLE_GUN: WeaponConfig = {
    name: 'DoubleGun',
    fireMode: FireMode.BURST,
    fireRate: 1.0,
    bulletSpeed: 25,
    damageAmount: 3,
    magazineSize: 30,
    burstCount: 5,
    burstDelay: 0.08,
    barrels: [
        { pos: new Vec2(0, -10), angle: 0, size: 1.0 },
        { pos: new Vec2(0, 10), angle: 0, size: 1.0 },
    ],
};
