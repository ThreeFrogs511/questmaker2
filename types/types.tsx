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
  check?: string;
  next?: string;
  type?: "check" | "combat" | "redirect_condition";
  stat?: string;
  dc?: number;
  alt?: Alt[];
  success?: string;
  fail?: string;
  win?: string;
  lose?: string;
  enemy_id?: string;
  enemyHp?: number;
  enemyDmg?: number;
  userDmg?: number;
  combat_on?: boolean;
  combat_started?: boolean;
  effects?: Record<string, unknown>;
  action?: string;
  nodeRef?: Array<string>;
  penalty?: { ability: string; value: number };
  campaignEnd?: boolean;
  relevantNodes?: Array<{ node: string; text: string }>;
  xp?: number;
  ost?: string;
};

type Alt = {
  type: string;
  value: string;
};

// describe the type for the currentUser global state
export type User = {
  id: number | null;
  username: string | null;
  hp: number | null;
  xp: number | null;
  email: string | null;
  dopamine: number | null;
  dopamine_consumed: number;
  gender: string | null;
  user_class: string | null;
  race: string | null;
  lvl: number | null;
  str: number | null;
  dex: number | null;
  con: number | null;
  int: number | null;
  wis: number | null;
  cha: number | null;
  ac: number | null;
  profile_completed: boolean;
  damage_taken: number;
  coins: number;
  last_campaign_done: string | null;
};

export type Draft = {
  id: number | null;
  username: string | null;
  email: string | null;
  hp: number | null;
  xp: number | null;
  dopamine: number | null;
  dopamine_consumed: number;
  gender: string | null;
  user_class: string | null;
  race: string | null;
  lvl: number | null;
  str: number | null;
  dex: number | null;
  con: number | null;
  int: number | null;
  wis: number | null;
  cha: number | null;
  ac: number | null;
  profile_completed: boolean;
  damage_taken: number;
  coins: number;
  last_campaign_done: null;
};

export type Encounter = {
  enemy_id?: string;
  name?: string;
  stats?: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  hp?: number;
  dopamine?: number;
  movesets?: object;
  ac?: number;
};

export type ChoiceResult = {
  type: string | null;
  status: boolean;
  value: number | null;
  target: string | null;
  success: boolean | null;
};

export type ListType = {
  id: number | null;
  body: string | null;
  completed: boolean | null;
  list: string | null;
  user_id: number | null;
};

export type Class = {
  class: string;
  description: string;
  abilities: {
    str: number;
    dex: number;
    con: number;
    wis: number;
    int: number;
    cha: number;
  };
  mainAbility: string;
};

export type Attributes = {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
};

export type Store = {
  active: boolean | null;
  description: string | null;
  effectTarget: string | null;
  effectType: string | null;
  effectValue: number | null;
  family: string | null;
  imageUrl: string | null;
  name: string | null;
  price: number | null;
  slug: string | null;
  stackable: boolean | null;
  tier: number | null;
  type: string | null;
  quantity?: number | null;
};

export type Item = {
  inventory_id: number | null;
  slug: string | null;
  user_id: number | null;
  quantity: number | null
}

// Combat item types
export type CombatAttackItem = {
  text?: string;
  userDmg?: number | null;
  type?: undefined;
};

export type CombatConsumableItem = {
  type: "item";
  name: string;
  target: string;
  value: number;
};

export type CombatItem = CombatAttackItem | CombatConsumableItem;