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

    public initialize(camera: Camera): void {}

    start(): void {}

    protected update(deltaTime: number): void {}

    public processKeyDown(event: EventKeyboard): void {}

    public processKeyUp(event: EventKeyboard): void {}

    public processMouseDown(event: EventMouse): void {}

    public processMouseUp(event: EventMouse): void {}

    public processMouseMove(event: EventMouse): void {}
}