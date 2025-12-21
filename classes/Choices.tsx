
import { Choice, User } from "@/components/Campaigns/NodeTypes";

export default class ChoicesOptions {

    private currentUser:User;
   

    constructor(currentUser:User) {
        this.currentUser=currentUser;
    
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
        if (filteredChoices) {
            const dynamicChoices = filteredChoices.map(((n: Choice) => {
                if (n.text.includes('[USERNAME]')) {
                    n.text = n.text.replace('[USERNAME]', `${this.currentUser.username ?? ''}`)
                    return n;
                } else if (n.text.includes('[RACE]')) {
                    n.text = n.text.replace('[RACE]', `${this.currentUser.race ?? ''}`)
                    return n;
                } else {
                    return n;
                }
            }));
            return [...dynamicChoices];
        }
    }
}



    // prepareChoicesForPlayer(setAllAvailableChoices:any, choices:any, userPastChoices:any) {

    // // global choices like ['CONTINUE'], ['START COMBAT'] or user's movesets cannot be removed
    // const lockedChoices = ['[CONTINUE]', ['START COMBAT']];

    // // we remove choices that were already made to avoid unwanted loops
    // const availableChoices = choices.filter((n: any) => {
    //   if (!userPastChoices.includes(n.text)) {
    //      return n;
    //   } else if (userPastChoices.includes(n.text) && lockedChoices.includes(n.text)) {
    //     return n;
    //   }

    // });
    // if (this.node && availableChoices) {
    //   const dynamicChoices = availableChoices.map(((n: { text: string; }) => {
    //       if (n.text.includes('[USERNAME]')) {
    //         n.text = n.text.replace('[USERNAME]', `${this.currentUser.username ?? ''}`)
    //         return n;
    //       } else if (n.text.includes('[RACE]')) {
    //           n.text = n.text.replace('[RACE]', `${this.currentUser.race ?? ''}`)
    //           return n;
    //       } else {
    //         return n;
    //       }
    //   }));
    //   setAllAvailableChoices(dynamicChoices);
    // }}