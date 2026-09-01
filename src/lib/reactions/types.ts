export interface CurrentUser {
  id: string;
  name: string;
  avatarUrl?: string;
  email?: string;
}

export type ReactionType = "LIKE" | "DISLIKE";

export interface ReactionSummary {
  likes: number;
  dislikes: number;
  userReaction: ReactionType | null;
}
