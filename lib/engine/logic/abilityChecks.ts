
    export default function handleAbilityChecks(
        currentNode:any, 
        currentUser:any, 
        currentChoice:any, 
        setCurrentNode:any, 
        setAbilityCheckData:any
    ) {
      if (currentChoice && currentNode) {
          const dc = currentChoice.dc;
          if (dc) {
            const userStat: any = Object.entries(currentUser).find(n => n.includes(currentChoice.check));
            const modifier = Math.floor((userStat[1]-10)/2);
            const abilityScore = Math.floor(Math.random() * 20)+1+modifier;
                
            if (abilityScore<dc) {
              currentChoice.fail && setCurrentNode(currentChoice.fail);
              setAbilityCheckData((prev: any) => ({...prev, success:false, value:abilityScore, status:true}));
            } else {
              setCurrentNode(currentChoice.next);
              setAbilityCheckData((prev: any) => ({...prev, success:true, value:abilityScore, status:true}));
            }              
          }
    }}