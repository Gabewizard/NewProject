import {
    _decorator,
    Camera,
    Component,
    EventKeyboard,
    EventMouse,
} from 'cc';

import { PlayerInputSystem } from './PlayerInputSystem';
import { PlayerMovementSystem } from './PlayerMovementSystem';
import { PlayerWeaponSystem } from './PlayerWeaponSystem';

const { ccclass } = _decorator;

@ccclass('Player')
export class Player extends Component {
    private inputSystem: PlayerInputSystem | null = null;
    private movementSystem: PlayerMovementSystem | null = null;
    private weaponSystem: PlayerWeaponSystem | null = null;
    private mainCamera: Camera | null = null;

    protected onLoad(): void {
        this.inputSystem = this.getComponent(PlayerInputSystem);
        this.movementSystem = this.getComponent(PlayerMovementSystem);
        this.weaponSystem = this.getComponent(PlayerWeaponSystem);
    }

    public initialize(camera: Camera): void {
        this.mainCamera = camera;
    }

    start(): void {}

    protected update(deltaTime: number): void {}

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
    }

    public processMouseUp(event: EventMouse): void {
        if (this.inputSystem) {
            this.inputSystem.handleMouseUp(event);
        }
    }

    public processMouseMove(event: EventMouse): void {
        if (this.inputSystem) {
            this.inputSystem.handleMouseMove(event);
        }
    }
}

