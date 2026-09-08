"use client";

import { FaRegThumbsDown, FaRegThumbsUp, FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { markPendingLoginCheck, useCurrentUser } from "@/hooks/useCurrentUser";
import { useCommentReaction } from "@/hooks/useCommentReaction";
import type { ReactionType } from "@/lib/reactions/types";

function reactionButtonClasses(active: boolean) {
  return `flex items-center gap-1 transition-colors disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
    active ? "text-accent" : "text-zinc-500 hover:text-foreground dark:text-zinc-500"
  }`;
}

export default function CommentReaction({
  articleId,
  articleSlug,
  commentId,
  likes,
  dislikes,
  userReaction,
}: {
  articleId: string;
  articleSlug: string;
  commentId: string;
  likes: number;
  dislikes: number;
  userReaction: ReactionType | null;
}) {
  const { status, getLoginUrl } = useCurrentUser();
  const { react, remove, isReacting, reactionError } = useCommentReaction(articleId, commentId);

  const isAuthLoading = status === "loading";
  const isLiked = userReaction === "LIKE";
  const isDisliked = userReaction === "DISLIKE";

  function handleReact(type: ReactionType) {
    if (status === "unauthenticated") {
      markPendingLoginCheck();
      window.location.href = getLoginUrl(`/articles/${articleSlug}`);
      return;
    }
    if (status !== "authenticated") {
      return;
    }
    if (userReaction === type) {
      remove();
      return;
    }
    react(type);
  }

  return (
    <span className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => handleReact("LIKE")}
        disabled={isAuthLoading || isReacting}
        aria-pressed={isLiked}
        aria-label={isLiked ? "Remover reação" : "Curtir comentário"}
        className={reactionButtonClasses(isLiked)}
      >
        {isLiked ? <FaThumbsUp aria-hidden="true" /> : <FaRegThumbsUp aria-hidden="true" />}
        <span className="font-mono">{likes}</span>
      </button>

      <button
        type="button"
        onClick={() => handleReact("DISLIKE")}
        disabled={isAuthLoading || isReacting}
        aria-pressed={isDisliked}
        aria-label={isDisliked ? "Remover reação" : "Não curtir comentário"}
        className={reactionButtonClasses(isDisliked)}
      >
        {isDisliked ? (
          <FaThumbsDown aria-hidden="true" />
        ) : (
          <FaRegThumbsDown aria-hidden="true" />
        )}
        <span className="font-mono">{dislikes}</span>
      </button>

      {reactionError && (
        <span role="alert" className="text-red-600 dark:text-red-400">
          Não foi possível registrar sua reação. Tente novamente.
        </span>
      )}
    </span>
  );
}
