"use client";

import { FaRegThumbsDown, FaRegThumbsUp, FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { markPendingLoginCheck, useCurrentUser } from "@/hooks/useCurrentUser";
import { useArticleReactions } from "@/hooks/useArticleReactions";
import type { ReactionType } from "@/lib/reactions/types";

const buttonBaseClasses =
  "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function reactionButtonClasses(active: boolean) {
  return `${buttonBaseClasses} ${
    active
      ? "border-accent/40 bg-accent/10 text-accent"
      : "border-zinc-300 text-foreground hover:border-accent/50 dark:border-zinc-700"
  }`;
}

export default function ArticleReactions({
  articleId,
  articleSlug,
}: {
  articleId: string;
  articleSlug: string;
}) {
  const { status, getLoginUrl } = useCurrentUser();
  const { summary, react, isReacting, reactionError } = useArticleReactions(articleId);

  const isAuthLoading = status === "loading";
  const userReaction = summary?.userReaction ?? null;
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
    react(type);
  }

  return (
    <div className="mt-10 border-t border-zinc-300 pt-6 dark:border-zinc-700">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => handleReact("LIKE")}
          disabled={isAuthLoading || isReacting}
          aria-pressed={isLiked}
          aria-label={isLiked ? "Remover curtida" : "Curtir artigo"}
          className={reactionButtonClasses(isLiked)}
        >
          {isLiked ? (
            <FaThumbsUp aria-hidden="true" />
          ) : (
            <FaRegThumbsUp aria-hidden="true" />
          )}
          <span>{isLiked ? "Curtido" : "Curtir"}</span>
          <span className="font-mono text-xs text-zinc-500 dark:text-zinc-500">
            {summary?.likes ?? 0}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleReact("DISLIKE")}
          disabled={isAuthLoading || isReacting}
          aria-pressed={isDisliked}
          aria-label={isDisliked ? "Remover não curtida" : "Não curtir artigo"}
          className={reactionButtonClasses(isDisliked)}
        >
          {isDisliked ? (
            <FaThumbsDown aria-hidden="true" />
          ) : (
            <FaRegThumbsDown aria-hidden="true" />
          )}
          <span>{isDisliked ? "Não curtido" : "Não curtir"}</span>
          <span className="font-mono text-xs text-zinc-500 dark:text-zinc-500">
            {summary?.dislikes ?? 0}
          </span>
        </button>
      </div>

      {status === "unauthenticated" && (
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-500">
          É necessário estar autenticado com o LinkedIn para reagir a este artigo. Ao clicar,
          você será redirecionado para o login.
        </p>
      )}

      {reactionError && (
        <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">
          Não foi possível registrar sua reação. Tente novamente.
        </p>
      )}
    </div>
  );
}
