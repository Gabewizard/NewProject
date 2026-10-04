import { _decorator, Component, instantiate, Node, NodePool, Prefab, Quat, Vec3 } from 'cc';
import { Barrel } from './Barrel';
import { FireMode } from './WeaponConfig';
import type { WeaponConfig } from './WeaponConfig';

const { ccclass } = _decorator;

@ccclass('Weapon')
export class Weapon extends Component {
    private bulletPrefab: Prefab | null = null;
    private magazinePool: NodePool = new NodePool();
    private barrels: Barrel[] = [];
    private bulletContainer: Node | null = null;

    private fireMode: FireMode = FireMode.SEMI_AUTO;
    private fireRate: number = 0.1;
    private bulletSpeed: number = 25;
    private damageAmount: number = 1;
    private fireCoolDown: number = 0;
    private burstCount: number | null = null;
    private burstDelay: number | null = null;
    private burstTimer: number = 0;
    private pendingBurstShots: number = 0;
    private isPlayerWeapon: boolean = false;
    private firingEuler: Vec3 = new Vec3();

    public get currentFireMode(): FireMode {
        return this.fireMode;
    }

    public initialize(
        config: WeaponConfig,
        prefab: Prefab,
        container: Node,
        isPlayerWeapon: boolean,
    ): void {
        this.bulletPrefab = prefab;
        this.bulletContainer = container;
        this.fireMode = config.fireMode;
        this.fireRate = config.fireRate;
        this.bulletSpeed = config.bulletSpeed;
        this.damageAmount = config.damageAmount;
        this.burstCount = config.burstCount ?? 0;
        this.burstDelay = config.burstDelay ?? 0;
        this.isPlayerWeapon = isPlayerWeapon;

        this.setUpObjectPool(config);
        this.setUpBarrels(config);
    }

    private setUpBarrels(config: WeaponConfig): void {
        for (let i = 0; i < config.barrels.length; i++) {
            let barrelData = config.barrels[i];
            let barrelNode = new Node(`Barrel ${i}`);
            barrelNode.setParent(this.node);

            let barrelComp = barrelNode.addComponent(Barrel);
            barrelComp.initialize(barrelData.pos, barrelData.angle, barrelData.size);
            this.barrels.push(barrelComp);
        }
    }

    private setUpObjectPool(config: WeaponConfig): void {
        if (!this.bulletPrefab) return;

        for (let i = 0; i < config.magazineSize; i++) {
            let bulletNode = instantiate(this.bulletPrefab);
            bulletNode.active = false;
            this.magazinePool.put(bulletNode);
        }
    }

    public update(dt: number): void {
        if (this.fireCoolDown > 0) this.fireCoolDown -= dt;

        if (this.pendingBurstShots > 0) {
            this.burstTimer -= dt;
            if (this.burstTimer <= 0) {
                let angle = 0;
                if (this.node.parent) {
                    Quat.toEulerInYXZOrder(this.firingEuler, this.node.parent.worldRotation);
                    angle = this.firingEuler.z;
                }
                this.executeFireLogic(angle);
                this.pendingBurstShots--;
                this.burstTimer = this.burstDelay ?? 0;
            }
        }
    }

    public triggerPulled(playerAngle: number): void {
        if (this.fireCoolDown > 0 || this.pendingBurstShots > 0) return;

        if (this.fireMode === FireMode.BURST) {
            this.pendingBurstShots = this.burstCount ?? 0;
            this.burstTimer = 0;
            this.fireCoolDown = this.fireRate;
        } else {
            this.executeFireLogic(playerAngle);
            this.fireCoolDown = this.fireRate;
        }
    }

    private executeFireLogic(playerAngle: number): void {
        if (!this.bulletContainer) return;

        for (let barrel of this.barrels) {
            let bulletNode = this.magazinePool.get();
            if (!bulletNode) return;

            barrel.shoot(
                bulletNode,
                this.bulletContainer,
                playerAngle,
                this.bulletSpeed,
                this.magazinePool,
                this.damageAmount,
                this.isPlayerWeapon,
            );
        }
    }
}

