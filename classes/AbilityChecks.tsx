export default class AbilityChecks {

    handler(currentChoice:any, setCurrentNode:any, setAbilityCheckData:any, node:any, currentUser:any) {
      if (currentChoice && node) {
    
          const dc = currentChoice.dc;
          if (dc) {
            const userStat: any = Object.entries(currentUser).find(n => n.includes(currentChoice.check));
            const modifier = Math.floor((userStat[1]-10)/2);
            let abilityScore = Math.floor(Math.random() * 20)+1+modifier;
            abilityScore<= 0 && (abilityScore=1);
                
            if (abilityScore<dc) {
              currentChoice.fail && setCurrentNode(currentChoice.fail);
              setAbilityCheckData((prev: any) => ({...prev, success:false, value:abilityScore, status:true}));
            } else {
              setCurrentNode(currentChoice.next);
              setAbilityCheckData((prev: any) => ({...prev, success:true, value:abilityScore, status:true}));
            }              
          }
    }}
    }



    // old version
      // handleAbilityChecks(currentChoice:any, setCurrentNode:any, setAbilityCheckData:any) {
    //   if (currentChoice && this.node) {
    
    //       const dc = currentChoice.dc;
    //       if (dc) {
    //         const userStat: any = Object.entries(this.currentUser).find(n => n.includes(currentChoice.check));
    //         const modifier = Math.floor((userStat[1]-10)/2);
    //         let abilityScore = Math.floor(Math.random() * 20)+1+modifier;
    //         abilityScore<= 0 && (abilityScore=1);
                
    //         if (abilityScore<dc) {
    //           currentChoice.fail && setCurrentNode(currentChoice.fail);
    //           setAbilityCheckData((prev: any) => ({...prev, success:false, value:abilityScore, status:true}));
    //         } else {
    //           setCurrentNode(currentChoice.next);
    //           setAbilityCheckData((prev: any) => ({...prev, success:true, value:abilityScore, status:true}));
    //         }              
    //       }
    // }}