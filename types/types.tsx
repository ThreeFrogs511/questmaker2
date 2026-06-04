// users table — no username here, that lives in characters
export type User = {
  user_id: number | null;
  email: string | null;
  profile_completed: boolean;
  tutorial_completed: boolean;
  last_chapter_done: number | null;
};

export type Character = {
  character_id?: number | null;
  user_class: string | null;
  username: string | null;
  race: string | null;
  gender: string | null;
  lvl: number | null;
  xp: number | null;
  hp: number | null;
  damage_taken: number;      // default 0
  dopamine: number | null;
  dopamine_consumed: number; // default 0
  ac: number | null;
  coins: number;             // default 0
  str: number | null;
  dex: number | null;
  con: number | null;
  int: number | null;
  wis: number | null;
  cha: number | null;
};

export type Moveset = {
  moveset_id?: number;
  type?: string;
  name?: string;
  cooldown?: number;
  modifier?: string;
  lvl_required?: number;
  dopamine_required?: number;
  character_id?: number;
  dmg?: number;
  effectTarget?: string;
  effectValue?: number;
  is_skill_activated?:boolean;
  damage?: string;
  for?: string[];
  url?:string;
};

// fetchQuests remaps quest_id → id
export type Quest = {
  id: number | null;
  body: string | null;
  completed: boolean;
  user_id: number | null;
};

export type QuestRateLimit = {
  user_id: number | null;
  window_start: Date | null;
  count: number; // default 0
};

export type CampaignIndex = {
  id: number | null;
  name: string | null;
  mongo_id: string | null;
  description: string | null;
  chapter: number | null;
};

export type PayloadType ={
  userId: number;
  email: string;
  isCompleted: boolean;
  tutorialCompleted: boolean,
  lastChapterDone: number | null,
  accessLevel: string
}

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
  reward?: Item[]
};

type Alt = {
  type: string;
  value: string;
};

export type Draft = {
  username: string | null;
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
  damage_taken: number;
  coins: number;
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
  quest_id: number | null;
  body: string | null;
  completed: boolean | null;
  list?: string | null;
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

export type Item = {
  active?: boolean;
  description?: string;
  effectTarget?: string;
  effectType?: string;
  effectValue?: number;
  family?: string;
  imageUrl?: string;
  inventory_id?: number;
  name?: string;
  price?: number;
  slug?: string;
  stackable?: boolean;
  tier?: number;
  type?: string;
  user_id?: number;
  quantity?: number;
};

