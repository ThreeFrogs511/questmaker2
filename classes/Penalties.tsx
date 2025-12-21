

export default class Penalties {

    handler(currentChoice:any, setCurrentNode:any, updateStats:any) {
        const penaltyTarget = currentChoice.penalty.ability;
        const penaltyValue = currentChoice.penalty.value;
        
        if (penaltyTarget === 'hp') {
            updateStats({damage_taken:penaltyValue})
            setCurrentNode(currentChoice.next);
        }
    }
}
