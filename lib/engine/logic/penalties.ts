   
   
   export default function handlePenalties(currentChoice:any, currentUser:any, setCurrentUser:any, setCurrentNode:any) {
      const penalty = currentChoice.penalty.ability;
      const penaltyValue = currentChoice.penalty.value;
     
      const penaltyTarget = Object.entries(currentUser).find(([key, item]) => {
        if (key === penalty) return [key, item];
      }) as [string, number];
      if (penaltyTarget && penaltyTarget[1]) {
        const newValue = penaltyTarget[1] * (1-penaltyValue/100);
        setCurrentUser((prev: any) => ({...prev, [penalty]:newValue}))
        setCurrentNode(currentChoice.next);

      }
    }