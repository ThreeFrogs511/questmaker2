import enemies from '@/assets/enemies.json'
import { Encounter } from '@/types/types';
export default class Enemy {


    fetchEnemyData(enemy_id:string | undefined) {
        const enemyData:Encounter | undefined = enemies.find(n => {
            if (!enemy_id) return;
            if (n.id === enemy_id) return n;
        });
        return enemyData;
    }


}