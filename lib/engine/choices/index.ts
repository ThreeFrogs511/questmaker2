


export default function prepareChoicesForPlayer(
    setAllAvailableChoices:any, 
    currentChoices:any, 
    userChoices:any,
    currentNode:any,
    currentUser:any ) 
{

    const availableChoices = currentChoices.filter((n: any) => {
        if (!userChoices.includes(n.text)) return n 
    });
        
    if (currentNode && availableChoices) {
        const dynamicChoices = availableChoices.map(((n: { text: string; }) => {
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
    setAllAvailableChoices(dynamicChoices);
}}