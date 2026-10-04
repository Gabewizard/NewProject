import {
    _decorator,
    Camera,
    Component,
    EventKeyboard,
    EventMouse,
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

    start(): void {}

    protected update(deltaTime: number): void {
        if (this.inputSystem && this.movementSystem) {
            let moveDir = this.inputSystem.getMoveDirection();
            this.movementSystem.updateMovement(moveDir);
        }

        if (this.inputSystem && this.weaponSystem) {
            let isFiring = this.inputSystem.isShooting;
            this.weaponSystem.processFiring(isFiring, this.getFiringAngle());
        }
    }

    private getFiringAngle(): number {
        // Use the full 2D heading after physics writes the node rotation.
        Quat.toEulerInYXZOrder(this.firingEuler, this.node.worldRotation);
        return this.firingEuler.z;
    }

    public processKeyDown(event: EventKeyboard): void {
        if (this.inputSystem) {
            this.inputSystem.handleKeyDown(event);
        }
    }

    public processKeyUp(event: EventKeyboard): void {
        if (this.inputSystem) {
            this.inputSystem.handleKeyUp(event);
        }
    }

    public processMouseDown(event: EventMouse): void {
        if (this.inputSystem) {
            this.inputSystem.handleMouseDown(event);
        }

        if (event.getButton() === 0 && this.weaponSystem) {
            this.weaponSystem.triggerSingleShot(this.getFiringAngle());
        }
    }

    public processMouseUp(event: EventMouse): void {
        if (this.inputSystem) {
            this.inputSystem.handleMouseUp(event);
        }
    }

    public processMouseMove(event: EventMouse): void {
        if (this.inputSystem && this.movementSystem && this.mainCamera) {
            let targetAngle = this.inputSystem.handleMouseMove(
                event,
                this.mainCamera,
                this.node.getWorldPosition(),
            );
            this.movementSystem.updateRotation(targetAngle);
        }
    }
}
