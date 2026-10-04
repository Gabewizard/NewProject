import { _decorator, Component, math, Node, NodePool, Vec2 } from 'cc';
import { Bullet } from './Bullet';

const { ccclass } = _decorator;

@ccclass('Barrel')
export class Barrel extends Component {
    private offsetAngle: number = 0;
    private bulletScale: number = 1.0;

    public initialize(
        localPos: Vec2,
        angleOffset: number,
        sizeModifier: number,
    ): void {
        this.node.setPosition(localPos.x, localPos.y);
        this.offsetAngle = angleOffset;
        this.bulletScale = sizeModifier;
    }

    public shoot(
        bulletNode: Node,
        bulletContainer: Node,
        playerAngleDegrees: number,
        speed: number,
        pool: NodePool,
        damage: number,
        isPlayerWeapon: boolean,
    ): void {
        bulletNode.setParent(bulletContainer);
        bulletNode.active = true;
        bulletNode.worldPosition = this.node.worldPosition;
        bulletNode.setScale(this.bulletScale, this.bulletScale);

        let finalAngleRadians = math.toRadian(playerAngleDegrees + this.offsetAngle);
        let dirVec = new Vec2(Math.cos(finalAngleRadians), Math.sin(finalAngleRadians));
        let velocity = dirVec.normalize().multiplyScalar(speed);

        let bulletScript = bulletNode.getComponent(Bullet);
        if (bulletScript) {
            bulletScript.initialize(pool, velocity, damage, isPlayerWeapon);
        }
    }
}

