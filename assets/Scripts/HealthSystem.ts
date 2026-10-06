import { _decorator, Component } from 'cc';

const { ccclass } = _decorator;

@ccclass('HealthSystem')
export class HealthSystem extends Component {
    private maxHealth: number = 0;
    private currentHealth: number = 0;
    private _isDead: boolean = false;

    public get isDead(): boolean {
        return this._isDead;
    }

    public initialize(maxHealth: number): void {
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;
        this._isDead = false;
    }

    public takeDamage(amount: number): void {
        if (this._isDead) return;

        this.currentHealth -= amount;

        if (this.currentHealth <= 0) {
            this.currentHealth = 0;
            this._isDead = true;
        }
    }
}
