import {
    _decorator,
    Camera,
    Component,
    EventKeyboard,
    EventMouse,
    Vec2,
    Vec3,
} from 'cc';

const { ccclass } = _decorator;

@ccclass('PlayerInputSystem')
export class PlayerInputSystem extends Component {
    public isShooting: boolean = false;

    public handleKeyDown(event: EventKeyboard): void {}

    public handleKeyUp(event: EventKeyboard): void {}

    public handleMouseDown(event: EventMouse): void {}

    public handleMouseUp(event: EventMouse): void {}

    public handleMouseMove(event: EventMouse): void {}

    public getMoveDirection(): Vec2 {
        return new Vec2();
    }

    public calculateRotationAngle(
        event: EventMouse,
        camera: Camera,
        playerPos: Readonly<Vec3>,
    ): number {
        return 0;
    }
}