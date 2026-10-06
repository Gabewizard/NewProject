import {
    _decorator,
    Camera,
    Component,
    EventKeyboard,
    EventMouse,
    input,
    Input,
    Node,
    Prefab,
} from 'cc';

import { Player } from './Player';
import { DOUBLE_GUN, FORWARD_REAR_PISTOL, PISTOL, SPREAD_GUN } from './WeaponConfig';
import type { WeaponConfig } from './WeaponConfig';

const { ccclass, property } = _decorator;

@ccclass('GameCtrl')
export class GameCtrl extends Component {
    @property({ type: Player, tooltip: 'Drop the Player Node here' })
    public player: Player | null = null;

    @property({ type: Camera, tooltip: 'Drop the Main Camera here' })
    public camera: Camera | null = null;

    @property({ type: Prefab, tooltip: 'Drop the Bullet Prefab here' })
    public defaultBulletPrefab: Prefab | null = null;

    @property({ type: Node, tooltip: 'Drop the Bullet Container node here' })
    public bulletContainer: Node | null = null;

    start(): void {
        if (this.player && this.camera) {
            this.player.initialize(this.camera);
        }

        if (this.player && this.defaultBulletPrefab && this.bulletContainer) {
            this.player.initializeWeapon(
                PISTOL,
                this.defaultBulletPrefab,
                this.bulletContainer,
            );
        }

        if (this.player) {
            this.player.node.on('WeaponSelect', this.handleWeaponSwap, this);
        }

        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    protected onDestroy(): void {
        if (this.player) {
            this.player.node.off('WeaponSelect', this.handleWeaponSwap, this);
        }

        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    update(deltaTime: number): void {}

    private handleWeaponSwap(weaponIndex: number): void {
        if (!this.player || !this.defaultBulletPrefab || !this.bulletContainer) return;

        let config: WeaponConfig;
        switch (weaponIndex) {
            case 1:
                config = PISTOL;
                break;
            case 2:
                config = DOUBLE_GUN;
                break;
            case 3:
                config = FORWARD_REAR_PISTOL;
                break;
            case 4:
                config = SPREAD_GUN;
                break;
            default:
                return;
        }

        this.player.initializeWeapon(
            config,
            this.defaultBulletPrefab,
            this.bulletContainer,
        );
    }

    private onKeyDown(event: EventKeyboard): void {
        if (this.player) {
            this.player.processKeyDown(event);
        }
    }

    private onKeyUp(event: EventKeyboard): void {
        if (this.player) {
            this.player.processKeyUp(event);
        }
    }

    private onMouseMove(event: EventMouse): void {
        if (this.player) {
            this.player.processMouseMove(event);
        }
    }

    private onMouseDown(event: EventMouse): void {
        if (this.player) {
            this.player.processMouseDown(event);
        }
    }

    private onMouseUp(event: EventMouse): void {
        if (this.player) {
            this.player.processMouseUp(event);
        }
    }
}

