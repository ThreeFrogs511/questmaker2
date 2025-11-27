export default class Quest {

    async insert(body:string, id:number) {
        const response = await fetch(`/api/todo/`, {
                    method:'POST',
                    headers:{'content-type':'application/json'},
                    body: JSON.stringify({body:body, completed:false, user_id:id})
        });
        const feedback = await response.json();
        return feedback;
    }

    async delete(todo_id:number) {
        const response = await fetch(`/api/todo/${todo_id}`, {
            method: 'DELETE',
        });
        const feedback = await response.json();
        return feedback;
    }

    async complete(todo_id:number, isCompleted:boolean) {
        const response = await fetch(`/api/todo/${todo_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: isCompleted }),
      });

      const feedback = await response.json();
      return feedback;
    }

}