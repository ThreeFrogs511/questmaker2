

// describe the 'nodes' global object
 export type Nodes = Record<string, Node>;

  // describe the type of each node
 export type Node = {
  text: string;
  choices?: Choice[];                 
  effects?: Record<string, unknown>;
  type?: string;                     
  condition?: string;
  true?: string;
  false?: string;
  fail?: string;
  };

  // describe the type of the choice array and all the possibles options
 export type Choice = {
  text: string;
  check?:string;
  next?: string;
  type?: "check" | "combat" | "redirect_condition";
  stat?: string;
  dc?: number;
  alt?:Alt[];
  success?: string;
  fail?: string;
  win?: string;
  lose?: string;
  enemy:Enemy;
  enemyHp?: number;
  enemyDmg?: number;
  userDmg?:number;
  combat_on?:boolean;
  combat_started?:boolean;
  effects?: Record<string, unknown>;
  action?: string;
  penalty?:{ability:string, value:number};
  };


type Alt = {
  type:string; 
  value:string
}

  // describe the type for the currentUser global state
export type User = {
id: number | null,
username: string | null,
email: string | null,
hp: number | null,
xp: number | null,
dopamine: number | null,
dopamine_consumed:number | null,
gender: string | null
user_class : string | null,
race: string | null,
lvl : number | null,
str : number | null,
dex : number | null,
con : number | null,
int : number | null,
wis : number | null,
cha : number | null,
profile_completed : boolean,
damage_taken: number
}
   
export type Enemy = [
  string,
  {"str": number, "dex":number, "con": number,"int": number, "wis": number, "cha": number},
  number,
  number,
  Object
]

export type Encounter = {
  name?:string; 
  stats?:{"str": number, "dex":number, "con": number,"int": number, "wis": number, "cha": number},
  hp?:number; 
  dopamine?:number; 
  movesets?:Object
}