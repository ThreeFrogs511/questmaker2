import handleAbilityChecks from "./abilityChecks";
import handlePenalties from "./penalties";
import storingUserChoice from "./StoringUserChoice";


export default function determineNextNode(
    currentUser:any,
    setCurrentUser:any,
    currentNode:any,
    currentChoice:any,
    setCurrentNode:any,
    setAbilityCheckData:any,
    userChoices:any,
    setUserChoices:any) 
{
        storingUserChoice(currentNode, userChoices,  setUserChoices)

        if(currentChoice.check) {
        handleAbilityChecks( currentNode, currentUser,currentChoice,setCurrentNode, setAbilityCheckData);
        } else if (currentChoice.penalty) {
        handlePenalties(currentChoice, currentUser, setCurrentUser, setCurrentNode);
        setAbilityCheckData((prev: any) => ({...prev, success:null, value:null, status:false}));
        } else {
        setCurrentNode(currentChoice.next);
        setAbilityCheckData((prev: any) => ({...prev, success:null, value:null, status:false}));
        }
}