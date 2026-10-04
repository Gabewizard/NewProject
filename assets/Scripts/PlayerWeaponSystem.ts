import {
    _decorator,
    Component,
    Node,
    Prefab,
} from 'cc';

const { ccclass } = _decorator;

@ccclass('PlayerWeaponSystem')
export class PlayerWeaponSystem extends Component {
    public initializeWeapon(
        bulletPrefab: Prefab,
        bulletContainer: Node,
    ): void {}

    public processFiring(
        isFiring: boolean,
        currentAngle: number,
        dt: number,
    ): void {}

    public triggerSingleShot(currentAngle: number): void {}
}