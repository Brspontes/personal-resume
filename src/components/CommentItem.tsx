"use client";

import { useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCreateComment, useDeleteComment, useUpdateComment } from "@/hooks/useCommentMutations";
import CommentForm from "./CommentForm";
import type { Comment } from "@/lib/comments/types";

function formatCommentDate(dateString: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

export default function CommentItem({
  comment,
  articleId,
  articleSlug,
  canReply,
  replyingToId,
  onStartReply,
  onCancelReply,
}: {
  comment: Comment;
  articleId: string;
  articleSlug: string;
  canReply: boolean;
  replyingToId: string | null;
  onStartReply: (commentId: string) => void;
  onCancelReply: () => void;
}) {
  const { status, getLoginUrl } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const createReply = useCreateComment(articleId);
  const updateComment = useUpdateComment(articleId);
  const deleteComment = useDeleteComment(articleId);

  const isReplying = replyingToId === comment.id;
  const isDeleted = comment.deletedAt !== null;
  // Only a reply that will itself be rendered (i.e. not deleted - replies
  // can't have their own replies, so that's the whole check) counts toward
  // keeping a deleted parent's placeholder around. If every reply is also
  // deleted, there is no thread history left to preserve.
  const hasVisibleReplies = comment.replies.some((reply) => reply.deletedAt === null);

  // A deleted comment is only kept visible when it still has a visible
  // reply - it stays as a "removido" placeholder so that reply keeps its
  // thread context. A deleted comment with no visible replies (this covers
  // every deleted reply, since replies can't have their own replies, and a
  // deleted parent whose replies are all themselves deleted) simply
  // disappears.
  if (isDeleted && !hasVisibleReplies) {
    return null;
  }

  function handleReplyClick() {
    if (status === "unauthenticated") {
      window.location.href = getLoginUrl(`/articles/${articleSlug}`);
      return;
    }
    if (status !== "authenticated") {
      return;
    }
    onStartReply(comment.id);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {comment.author.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- avatar host is backend/LinkedIn-controlled, not a configured Next.js image domain
          <img
            src={comment.author.avatarUrl}
            alt=""
            width={32}
            height={32}
            loading="lazy"
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 font-mono text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {comment.author.name.slice(0, 2).toUpperCase()}
          </span>
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">{comment.author.name}</span>
          <time
            dateTime={comment.createdAt}
            className="font-mono text-xs text-zinc-500 dark:text-zinc-500"
          >
            {formatCommentDate(comment.createdAt)}
          </time>
        </div>
      </div>

      {isDeleted ? (
        <p className="text-sm italic text-zinc-500 dark:text-zinc-500">Comentário removido.</p>
      ) : isEditing ? (
        <>
          <CommentForm
            initialContent={comment.content ?? ""}
            submitLabel="Salvar"
            isSubmitting={updateComment.isPending}
            onCancel={() => setIsEditing(false)}
            onSubmit={async (content) => {
              await updateComment.mutateAsync({ commentId: comment.id, content });
              setIsEditing(false);
            }}
          />
          {updateComment.isError && (
            <p role="alert" className="text-xs text-red-600 dark:text-red-400">
              Não foi possível salvar sua edição. Tente novamente.
            </p>
          )}
        </>
      ) : (
        <p className="text-sm text-zinc-700 dark:text-zinc-300">{comment.content}</p>
      )}

      {!isDeleted && (
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {canReply && (
            <button
              type="button"
              onClick={handleReplyClick}
              disabled={status === "loading"}
              className="font-medium text-accent transition-opacity hover:opacity-80 disabled:opacity-60"
            >
              Responder
            </button>
          )}
          {comment.isOwner && !isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-zinc-500 transition-colors hover:text-foreground dark:text-zinc-500"
            >
              Editar
            </button>
          )}
          {comment.isOwner && !isConfirmingDelete && (
            <button
              type="button"
              onClick={() => setIsConfirmingDelete(true)}
              className="text-zinc-500 transition-colors hover:text-red-600 dark:text-zinc-500"
            >
              Excluir
            </button>
          )}
          {isConfirmingDelete && (
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-zinc-500 dark:text-zinc-500">Excluir este comentário?</span>
              <button
                type="button"
                onClick={() => deleteComment.mutate(comment.id)}
                disabled={deleteComment.isPending}
                className="font-medium text-red-600 transition-opacity hover:opacity-80 disabled:opacity-60 dark:text-red-400"
              >
                {deleteComment.isPending ? "Excluindo..." : "Confirmar"}
              </button>
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
                disabled={deleteComment.isPending}
                className="text-zinc-500 transition-colors hover:text-foreground dark:text-zinc-500"
              >
                Cancelar
              </button>
            </span>
          )}
        </div>
      )}

      {deleteComment.isError && (
        <p role="alert" className="text-xs text-red-600 dark:text-red-400">
          Não foi possível excluir o comentário. Tente novamente.
        </p>
      )}

      {isReplying && (
        <div className="mt-2 ml-4">
          <CommentForm
            submitLabel="Responder"
            placeholder="Escreva uma resposta..."
            isSubmitting={createReply.isPending}
            autoFocus
            onCancel={onCancelReply}
            onSubmit={async (content) => {
              await createReply.mutateAsync({ content, parentCommentId: comment.id });
              onCancelReply();
            }}
          />
          {createReply.isError && (
            <p role="alert" className="mt-2 text-xs text-red-600 dark:text-red-400">
              Não foi possível enviar sua resposta. Tente novamente.
            </p>
          )}
        </div>
      )}

      {comment.replies.length > 0 && (
        <div className="mt-3 ml-4 flex flex-col gap-4 border-l-2 border-zinc-200 pl-4 dark:border-zinc-700">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              articleId={articleId}
              articleSlug={articleSlug}
              canReply={false}
              replyingToId={replyingToId}
              onStartReply={onStartReply}
              onCancelReply={onCancelReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}
