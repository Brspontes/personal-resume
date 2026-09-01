export interface CommentAuthor {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Comment {
  id: string;
  content: string | null;
  author: CommentAuthor;
  isOwner: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  replies: Comment[];
}
