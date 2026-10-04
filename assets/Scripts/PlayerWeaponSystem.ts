import { _decorator, Component, Node, Prefab } from 'cc';
import { Weapon } from './Weapon';
import { WeaponFactory } from './WeaponFactory';
import { FireMode } from './WeaponConfig';
import type { WeaponConfig } from './WeaponConfig';

const { ccclass } = _decorator;

@ccclass('PlayerWeaponSystem')
export class PlayerWeaponSystem extends Component {
    private currentWeaponNode: Node | null = null;
    private currentWeapon: Weapon | null = null;

    public equipWeapon(
        config: WeaponConfig,
        bulletPrefab: Prefab,
        bulletContainer: Node,
        playerNode: Node,
    ): void {
        if (this.currentWeaponNode) this.currentWeaponNode.destroy();

        this.currentWeaponNode = WeaponFactory.createWeapon(
            config,
            bulletPrefab,
            playerNode,
            bulletContainer,
        );
        this.currentWeapon = this.currentWeaponNode.getComponent(Weapon);
    }

    public processFiring(isFiring: boolean, currentAngle: number): void {
        if (!this.currentWeapon || !isFiring) return;

        if (this.currentWeapon.currentFireMode !== FireMode.SEMI_AUTO) {
            this.currentWeapon.triggerPulled(currentAngle);
        }
    }

    public triggerSingleShot(currentAngle: number): void {
        if (!this.currentWeapon) return;

        if (this.currentWeapon.currentFireMode === FireMode.SEMI_AUTO) {
            this.currentWeapon.triggerPulled(currentAngle);
        }
    }
}
