export default class Users  {
    private username: string;
    private gender: string;
    private race:string;
    private user_class:string;
    private str:number;
    private dex:number;
    private con:number;
    private int:number;
    private wis:number;
    private cha:number;
    private xp:number;

    constructor
    (
    username:string, 
    gender: string, 
    race:string, 
    user_class:string, 
    str:number, 
    dex:number,
    con:number,
    int:number,
    wis:number,
    cha:number
    ) 
    {

        this.username = username;
        this.gender = gender;
        this.race = race;
        this.user_class = user_class;
        this.str= str;
        this.dex=dex;
        this.con=con;
        this.int=int;
        this.wis=wis;
        this.cha=cha;
        this.xp=0;
    }

    calculateHitpoints() {
        const diceRoll = Math.round(Math.random() * (10-1));
        const ConModifier = Math.floor((this.con-10)/2);
        const hitpoints = Math.round(diceRoll+ConModifier);
        return hitpoints;
    }

    // calculateDopamine(ability:number) {
    //     const diceRoll = Math.round(Math.random() * (10-1));
    //     const mainAbilityModifier = Math.floor((ability-10)/2);
    //     const dopamine = Math.round(diceRoll+mainAbilityModifier);
    //     return dopamine;
    // }

    calculateDopamine(classes:any, currentUser:any, abilityScores:any) {
        // we fetch the presets stats of the chosen class
        const chosenClassStats = classes.find((n: { class: any; }) => n.class === currentUser.user_class);
        if(chosenClassStats) {
            // each class has a 'main' ability, we get it
            const mainAbility = chosenClassStats.mainAbility;
            
            // we fetch the value of the 'main ability' set by the user during character creation
            const mainAbilityValue= Object.entries(abilityScores).find(([key, value]) => {
                if (key === mainAbility) return value;
            }) as [string, number] | undefined;

        const diceRoll = Math.round(Math.random() * (10-1));
        const mainAbilityModifier = mainAbilityValue && mainAbilityValue[1]  ? Math.floor((mainAbilityValue[1]-10)/2) : 0;
        const dopamine = Math.round(diceRoll+mainAbilityModifier);
        return dopamine;
        }
    }

    async completeProfile(id:number, hp:number, dopamine:number) {
        const response = await fetch(`/api/users/${id}`, {
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
                hp:hp,
                dopamine:dopamine
            })
        });
        const feedback = await response.json();
        return feedback;
    }
}