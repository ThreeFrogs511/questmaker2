import { User } from "@/types/types";


export default class Character {
    private id : string;
    private username: string;
    private gender: string;
    private race:string;
    private user_class:string;
    private ac:number;
    private str:number;
    private dex:number;
    private con:number;
    private int:number;
    private wis:number;
    private cha:number;
    private xp:number;
    private hp:number;
    private dopamine:number;

    private updateDraft;

    constructor({...draft}, updateDraft:(patch: Partial<User>) => void) 
    {

        // attributes based on draft
        this.id = draft.id;
        this.username = draft.username;
        this.gender = draft.gender;
        this.race = draft.race;
        this.user_class = draft.user_class;
        this.str= draft.str;
        this.dex=draft.dex;
        this.con=draft.con;
        this.int=draft.int;
        this.wis=draft.wis;
        this.cha=draft.cha;
        this.updateDraft = updateDraft;

        // attributes that'll be calculated later
        this.ac=10;
        this.xp=0;
        this.hp=0;
        this.dopamine=0;
    }

    calculateHitpoints() {
        const conModifier = Math.floor((this.con-10)/2);
        this.hp = Math.round(10+conModifier);
        this.updateDraft({hp:this.hp});
    }

    calculateDopamine(classes:any, draft:Partial<User>) {
        // we fetch the presets stats of the chosen class
        const chosenClassStats = classes.find((n: { class: any; }) => n.class === this.user_class);
        if(chosenClassStats) {
            // each class has a 'main' ability, we get it
            const mainAbility = chosenClassStats.mainAbility;
            
            // we fetch the value of the 'main ability' set by the user during character creation
            const mainAbilityValue= Object.entries(draft).find(([key, value]) => {
                if (key === mainAbility) return value;
            }) as [string, number] | undefined;

        // const diceRoll = Math.round(Math.random() * (10-1));
        const mainAbilityModifier = mainAbilityValue && mainAbilityValue[1]  ? Math.floor((mainAbilityValue[1]-10)/2) : 0;
        this.dopamine= Math.round(20+mainAbilityModifier);
        this.updateDraft({dopamine:this.dopamine});
        }
    }

    calculateAC(draft:Partial<User>) {
        const dex = draft.dex;
        const dexModifier = dex && Math.floor((dex-10)/2);
        this.ac = dexModifier ? 10+dexModifier : 10;
        this.updateDraft({ac:this.ac});
    }

    buildUserFromDraft(draft:Partial<User>) {

      const newUser =  {
        id: draft.id ?? null, 
        username:draft.username ?? null, 
        email:draft.email ?? null, 
        xp:0, 
        hp:this.hp ?? null, 
        dopamine: this.dopamine,
        dopamine_consumed: 0,
        gender: draft.gender ?? null,
        user_class:draft.user_class ?? null, 
        race:draft.race ?? null,
        lvl:1,
        str : draft.str ?? 10,
        dex : draft.dex ?? 10,
        con : draft.con ?? 10,
        int : draft.int ?? 10,
        wis : draft.wis ?? 10,
        cha : draft.cha ?? 10,
        ac:this.ac ?? null,
        profile_completed: true,
        damage_taken:0,
        coins:0
    }
    return newUser;

    }
    async completeProfile(draft:Partial<User>, classes:any) {
        this.calculateHitpoints();
        this.calculateDopamine(classes, draft);
        this.calculateAC(draft);
        try {
            const response = await fetch(`/api/users/${this.id}`, {
                method: 'PATCH',
                headers: {"content-type": "application/JSON"},
                body: JSON.stringify({
                    username: this.username,
                    gender: this.gender,
                    race:this.race,
                    user_class:this.user_class,
                    str:this.str,
                    dex:this.dex,
                    con:this.con,
                    int:this.int,
                    wis:this.wis,
                    cha:this.cha,
                    hp:this.hp,
                    ac:this.ac,
                    dopamine:this.dopamine
                })
            });
        const feedback = await response.json();
        return feedback;
        } catch (err) {
            return err;
        }
    }
}

