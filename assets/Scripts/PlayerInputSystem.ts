import {
    _decorator,
    Camera,
    Component,
    EventKeyboard,
    EventMouse,
    KeyCode,
    log,
    math,
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

    private moveDir: Vec2 = new Vec2();

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

    public handleMouseMove(
        event: EventMouse,
        camera: Camera,
        playerPos: Readonly<Vec3>,
    ): number {
        return this.calculateRotationAngle(event, camera, playerPos);
    }

    public getMoveDirection(): Vec2 {
        this.moveDir.x = (this.isRight ? 1 : 0) - (this.isLeft ? 1 : 0);
        this.moveDir.y = (this.isUp ? 1 : 0) - (this.isDown ? 1 : 0);
        this.moveDir.normalize();
        return this.moveDir;
    }

    public calculateRotationAngle(
        event: EventMouse,
        camera: Camera,
        playerPos: Readonly<Vec3>,
    ): number {
        let mouseScreenPos = event.getLocation();
        let mouseWorldPos = new Vec3();
        camera.screenToWorld(
            new Vec3(mouseScreenPos.x, mouseScreenPos.y, 0),
            mouseWorldPos,
        );

        let dx = mouseWorldPos.x - playerPos.x;
        let dy = mouseWorldPos.y - playerPos.y;
        return math.toDegree(Math.atan2(dy, dx));
    }
}
