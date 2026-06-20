export type Room = {
  slug: string;
  name: string;
  description: string;
  placeholder: string;
  isSilent?: boolean;
};

export type RitualObject = {
  key: string;
  name: string;
  action: string;
  tone: string;
};

export type ReactionType = "same" | "real" | "oof" | "lol" | "hug";

export type ChatMessage = {
  id: string;
  roomSlug: string;
  anonymousUserId: string;
  nickname: string;
  body: string;
  createdAt: string;
  reactions: Record<ReactionType, string[]>;
  reported?: boolean;
};

export type AnonymousUser = {
  id: string;
  nickname: string;
};

export type MessageReaction = {
  anonymous_user_id: string;
  reaction_type: ReactionType;
};

export type SharedMessage = {
  id: string;
  roomSlug: string;
  sessionId: string | null;
  anonymousUserId: string;
  nickname: string;
  body: string;
  createdAt: string;
  reactions: MessageReaction[];
};
