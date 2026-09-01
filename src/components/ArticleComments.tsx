"use client";

import { useState } from "react";
import { markPendingLoginCheck, useCurrentUser } from "@/hooks/useCurrentUser";
import { useArticleComments } from "@/hooks/useArticleComments";
import { useCreateComment } from "@/hooks/useCommentMutations";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

export default function ArticleComments({
  articleId,
  articleSlug,
}: {
  articleId: string;
  articleSlug: string;
}) {
  const { status, getLoginUrl } = useCurrentUser();
  const { comments, isLoading } = useArticleComments(articleId);
  const createComment = useCreateComment(articleId);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);

  // A deleted top-level comment with no visible replies (none at all, or
  // all of them also deleted) renders nothing (see CommentItem), so it
  // shouldn't count toward the heading or trigger the "has comments" branch
  // either.
  const visibleComments = comments.filter(
    (comment) =>
      comment.deletedAt === null || comment.replies.some((reply) => reply.deletedAt === null),
  );

  return (
    <div className="mt-10">
      <p className="font-mono text-sm text-accent">{"// Comments"}</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
        Comentários{visibleComments.length > 0 ? ` (${visibleComments.length})` : ""}
      </h2>

      <div className="mt-6">
        {status === "authenticated" && (
          <>
            <CommentForm
              submitLabel="Comentar"
              isSubmitting={createComment.isPending}
              onSubmit={(content) => createComment.mutateAsync({ content })}
            />
            {createComment.isError && (
              <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
                Não foi possível enviar seu comentário. Tente novamente.
              </p>
            )}
          </>
        )}

        {status === "unauthenticated" && (
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            <a
              href={getLoginUrl(`/articles/${articleSlug}`)}
              onClick={markPendingLoginCheck}
              className="font-medium text-accent transition-opacity hover:opacity-80"
            >
              Faça login com o LinkedIn
            </a>{" "}
            para comentar neste artigo.
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-6">
        {isLoading ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-500">Carregando comentários...</p>
        ) : visibleComments.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            Nenhum comentário ainda. Seja o primeiro a comentar.
          </p>
        ) : (
          visibleComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              articleId={articleId}
              articleSlug={articleSlug}
              canReply
              replyingToId={replyingToId}
              onStartReply={setReplyingToId}
              onCancelReply={() => setReplyingToId(null)}
            />
          ))
        )}
      </div>
    </div>
  );
}
