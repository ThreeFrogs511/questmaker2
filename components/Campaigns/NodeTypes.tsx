

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
  success?: string;
  fail?: string;
  win?: string;
  lose?: string;
  enemyHp?: number;
  enemyDmg?: number;
  effects?: Record<string, unknown>;
  action?: string;
  penalty?:{ability:string, value:number};
  };

   