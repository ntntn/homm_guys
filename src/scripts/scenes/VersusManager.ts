export class VersusManager
{
    static get Instance()
    {
        if (!this._instance) this._instance = new VersusManager();
        return this._instance;
    }
    private static _instance: VersusManager;
    
    playerA: { slots: ChubrikSlot[] };
    playerB: { slots: ChubrikSlot[] };
}