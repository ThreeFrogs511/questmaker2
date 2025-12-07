

export default class Penalties {

    handler(currentChoice:any, setCurrentNode:any, currentUser:any, setCurrentUser:any) {
        const penaltyTarget = currentChoice.penalty.ability;
        const penaltyValue = currentChoice.penalty.value;
        
        if (penaltyTarget === 'hp') {
            setCurrentUser((prev: any) => ({...prev, damage_taken:penaltyValue}))
            setCurrentNode(currentChoice.next);
        }
    }
}



// old version
    // handlePenalties(currentChoice:any, setCurrentNode:any) {
    //   const penalty = currentChoice.penalty.ability;
    //   const penaltyValue = currentChoice.penalty.value;
    //   const penaltyTarget = Object.entries(this.currentUser).find(([key, item]) => {
    //     if (key === penalty) return [key, penalty];
    //   }) as [string, number];
    //   console.log(penaltyTarget)
    //   if (penaltyTarget && penaltyTarget[1]) {
    //     const newValue = penaltyTarget[1] * (1-penaltyValue/100);
    //     this.setCurrentUser((prev: any) => ({...prev, [penalty]:newValue}))
    //     setCurrentNode(currentChoice.next);
    //     console.log(`${this.currentUser.hp} => ${newValue}`)

    //   }
    // }