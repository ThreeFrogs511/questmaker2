import { useUserStore } from "@/stores/useUserStore";

export default class Quest {
  async insert(body: string) {
    try {
      const response = await fetch(`/api/quests/`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ body: body, completed: false }),
      });
      if (!response.ok) return { success: false, error: "internal error" };

      const feedback = await response.json();
      return feedback;
    } catch {
      return { success: false, error: "server error" };
    }
  }

  async delete(quest_id: number) {
    const response = await fetch(`/api/quests/${quest_id}`, {
      method: "DELETE",
    });
    const feedback = await response.json();
    return feedback;
  }

  async complete(
    quest_id: number,
    isCompleted: boolean,
    user_id: number | null,
  ) {
    try {
      const currentUser = useUserStore.getState().currentUser;
      if (!quest_id) throw new Error("no quest id found");
      
      const response = await fetch(`/api/quests/${quest_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completed: isCompleted,
          taskUserId: user_id,
          currentUser: currentUser,
        }),
      });

      const feedback = await response.json();
      return feedback;
    } catch (error) {
      return {err: error}
    }
  }
}
