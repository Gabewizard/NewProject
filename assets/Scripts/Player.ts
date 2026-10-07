import {
    _decorator,
    Camera,
    Component,
    Node,
    Prefab,
    Quat,
    Vec3,
} from 'cc';

import { PlayerInputSystem } from './PlayerInputSystem';
import { PlayerMovementSystem } from './PlayerMovementSystem';
import { PlayerWeaponSystem } from './PlayerWeaponSystem';
import type { WeaponConfig } from './WeaponConfig';

const { ccclass } = _decorator;

@ccclass('Player')
export class Player extends Component {
    private inputSystem: PlayerInputSystem | null = null;
    private movementSystem: PlayerMovementSystem | null = null;
    private weaponSystem: PlayerWeaponSystem | null = null;
    private mainCamera: Camera | null = null;
    private firingEuler: Vec3 = new Vec3();

    protected onLoad(): void {
        this.inputSystem = this.getComponent(PlayerInputSystem);
        this.movementSystem = this.getComponent(PlayerMovementSystem);
        this.weaponSystem = this.getComponent(PlayerWeaponSystem);
    }

    public initialize(camera: Camera): void {
        this.mainCamera = camera;
        // Inject the camera when GameCtrl supplies it, independent of start order.
        if (this.inputSystem) {
            this.inputSystem.initialize(this.mainCamera);
        }
    }

    public initializeWeapon(
        config: WeaponConfig,
        bulletPrefab: Prefab,
        bulletContainer: Node,
    ): void {
        if (this.weaponSystem) {
            this.weaponSystem.equipWeapon(
                config,
                bulletPrefab,
                bulletContainer,
                this.node,
            );
        }
    }

    protected update(deltaTime: number): void {
        if (this.inputSystem && this.movementSystem) {
            let moveDir = this.inputSystem.getMoveDirection();
            this.movementSystem.updateMovement(moveDir);
            const targetAngle = this.inputSystem.getRotationAngle();
            this.movementSystem.updateRotation(targetAngle);
        }

        if (this.inputSystem && this.weaponSystem) {
            let isFiring = this.inputSystem.isShooting;
            const firingAngle = this.getFiringAngle();
            this.weaponSystem.processFiring(isFiring, firingAngle);
            if (this.inputSystem.getSingleShotIntent()) {
                this.weaponSystem.triggerSingleShot(firingAngle);
            }
        }
    }

    private getFiringAngle(): number {
        // Use the full 2D heading after physics writes the node rotation.
        Quat.toEulerInYXZOrder(this.firingEuler, this.node.worldRotation);
        return this.firingEuler.z;
    }
}
