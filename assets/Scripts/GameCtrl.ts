import {
    _decorator,
    Camera,
    Component,
    EventKeyboard,
    EventMouse,
    Node,
    Prefab,
} from 'cc';

import { Player } from './Player';

const { ccclass, property } = _decorator;

@ccclass('GameCtrl')
export class GameCtrl extends Component {
    @property({
        type: Player,
        tooltip: 'Drop the Player Node here',
    })
    public player: Player | null = null;

    @property({
        type: Camera,
        tooltip: 'Drop the Main Camera here',
    })
    public camera: Camera | null = null;

    @property({
        type: Prefab,
        tooltip: 'Drop the Bullet Prefab here',
    })
    public defaultBulletPrefab: Prefab | null = null;

    @property({
        type: Node,
        tooltip: 'Drop the Bullet Container node here',
    })
    public bulletContainer: Node | null = null;

    start(): void {}

    protected onDestroy(): void {}

    update(deltaTime: number): void {}

    private onKeyDown(event: EventKeyboard): void {}

    private onKeyUp(event: EventKeyboard): void {}

    private onMouseMove(event: EventMouse): void {}

    private onMouseDown(event: EventMouse): void {}

    private onMouseUp(event: EventMouse): void {}
}