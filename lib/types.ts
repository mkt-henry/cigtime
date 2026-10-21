export type Room = {
  slug: string;
  name: string;
  description: string;
  descriptionEs: string;
  placeholder: string;
  placeholderEs: string;
  // A few sentences on who the room is for, shown in the room's "About this room" panel.
  about: string;
  aboutEs: string;
  isSilent?: boolean;
};

export type RitualObject = {
  key: string;
  name: string;
  action: string;
  tone: string;
};

export type ReactionType = "same" | "real" | "oof" | "lol" | "hug";

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
