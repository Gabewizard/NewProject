import {
    _decorator,
    Camera,
    Component,
    EventKeyboard,
    EventMouse,
    KeyCode,
    log,
    Vec2,
    Vec3,
} from 'cc';

const { ccclass } = _decorator;

@ccclass('PlayerInputSystem')
export class PlayerInputSystem extends Component {
    public isShooting: boolean = false;

    private isUp: boolean = false;
    private isDown: boolean = false;
    private isLeft: boolean = false;
    private isRight: boolean = false;

    public handleKeyDown(event: EventKeyboard): void {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
            case KeyCode.ARROW_UP:
                this.isUp = true;
                log('Input System received: Up');
                break;

            case KeyCode.KEY_S:
            case KeyCode.ARROW_DOWN:
                this.isDown = true;
                log('Input System received: Down');
                break;

            case KeyCode.KEY_A:
            case KeyCode.ARROW_LEFT:
                this.isLeft = true;
                log('Input System received: Left');
                break;

            case KeyCode.KEY_D:
            case KeyCode.ARROW_RIGHT:
                this.isRight = true;
                log('Input System received: Right');
                break;
        }
    }

    public handleKeyUp(event: EventKeyboard): void {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
            case KeyCode.ARROW_UP:
                this.isUp = false;
                break;

            case KeyCode.KEY_S:
            case KeyCode.ARROW_DOWN:
                this.isDown = false;
                break;

            case KeyCode.KEY_A:
            case KeyCode.ARROW_LEFT:
                this.isLeft = false;
                break;

            case KeyCode.KEY_D:
            case KeyCode.ARROW_RIGHT:
                this.isRight = false;
                break;
        }
    }

    public handleMouseDown(event: EventMouse): void {
        if (event.getButton() === 0) {
            this.isShooting = true;
            log('Input System received: Trigger pulled');
        }
    }

    public handleMouseUp(event: EventMouse): void {
        if (event.getButton() === 0) {
            this.isShooting = false;
            log('Input System received: Trigger released');
        }
    }

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

