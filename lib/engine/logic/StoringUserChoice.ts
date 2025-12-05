    
    
    
    export default function storingUserChoice (
        currentNode:any,
        userChoices:Array<string | undefined>, 
        setUserChoices:React.Dispatch<React.SetStateAction<Array<string | undefined>>>) 
    {

      const choices = userChoices && [...userChoices];
      choices?.push(currentNode);
      choices ? setUserChoices(choices) : setUserChoices([currentNode]);
      
    }