
import { Choice, User } from "@/types/types";
import { useUserStore } from "@/stores/useUserStore";
export default class ChoicesOptions {

    constructor() {
    
    }

    handler(setAllAvailableChoices:any, choices:Choice[], userPastChoices:any) {
        const filteredChoices = this.filterOutExpiredChoices(choices, userPastChoices);
        const dynamicChoices = this.insertDynamicInfo(filteredChoices);
        setAllAvailableChoices(dynamicChoices);
    }

    filterOutExpiredChoices(choices:Choice[], userPastChoices:any) {
        // global choices like ['CONTINUE'], ['START COMBAT'] or user's movesets cannot be removed
        const lockedChoices = ['[CONTINUE]', '[START COMBAT]', '[Punch]', '[Fireball]', '[RESTART]'];

        // we remove choices that were already made to avoid unwanted loops
        const filteredChoices = choices.filter((n: any) => {
            if (!userPastChoices.includes(n.text)) {
                return n;
            } else if (userPastChoices.includes(n.text) && lockedChoices.includes(n.text)) {
                return n;
            }
        });
        return [...filteredChoices];
    }

    insertDynamicInfo(filteredChoices:Choice[]) {
        const currentUser = useUserStore.getState().currentUser;
        if (filteredChoices) {
            const dynamicChoices = filteredChoices.map(((n: Choice) => {
                if (n.text.includes('[USERNAME]')) {
                    n.text = n.text.replace('[USERNAME]', `${currentUser.username ?? ''}`)
                    return n;
                } else if (n.text.includes('[RACE]')) {
                    n.text = n.text.replace('[RACE]', `${currentUser.race ?? ''}`)
                    return n;
                } else {
                    return n;
                }
            }));
            return [...dynamicChoices];
        }
    }
}
