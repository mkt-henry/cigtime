export type Guide = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
  prompts?: string[];
  faq: { q: string; a: string }[];
  cta: { href: string; label: string };
  roomSlug: string;
};

export const GUIDES: Guide[] = [
  {
    slug: "vent-anonymously",
    title: "Vent Anonymously With No Sign-Up",
    description:
      "Vent anonymously with no sign-up on cigtime. Write one short line, get simple reactions, and leave after a brief break. Messages are deleted after 24 hours.",
    h1: "Vent anonymously, one line at a time",
    intro:
      "Some days you want to say what happened without opening a group chat or explaining the whole story. cigtime is an anonymous vent site for that small moment. Enter Let It Out, write one line of up to 140 characters, and take a brief break. There is no sign-up, and you get a random nickname.",
    sections: [
      {
        heading: "Start with the part you actually want to say",
        paragraphs: [
          "You do not need a tidy introduction. Start with a feeling, a small disappointment, or the sentence you keep rehearsing. Something like 'I worked hard on that and wish someone had noticed' is enough. You can leave the background out.",
          "If your first draft is long, ask yourself which part matters right now. Remove the names, the timeline, and the evidence. The limit is 140 characters, so this is a place for one thought rather than a detailed account of a difficult day.",
        ],
      },
      {
        heading: "Choose a room that fits the moment",
        paragraphs: [
          "Let It Out is for the feeling you want to put into words. Tiny Rants is another option when the issue is smaller: a noisy commute, a meeting that could have been a message, or the last biscuit disappearing. You do not have to make a complaint sound bigger to share it.",
          "Choose a session of 1, 3, 5, or 10 minutes. Pick an on-screen object, such as coffee, a candle, or a lollipop, and let the time pass. You do not need to smoke or have anything beside you to use cigtime.",
        ],
      },
      {
        heading: "A reaction is enough, and none is promised",
        paragraphs: [
          "Other people can react with same, real, oof, lol, or hug. Those small responses can acknowledge a line without turning it into a long exchange. Nobody owes anyone a conversation, and your message may receive no reaction at all.",
          "Write something you want to express rather than a question that needs an answer. When your time runs out, you can leave without waiting for agreement or checking whether the room understood every detail.",
        ],
      },
      {
        heading: "Keep identifying details out of the room",
        paragraphs: [
          "Anonymous does not mean private. Other people in the room can read what you post. Leave out names, workplaces, addresses, and details that could identify you or someone else. Links and personal contact information are blocked. You can report a message or mute someone if needed.",
          "Messages are deleted automatically after 24 hours under the default retention policy. The end of your session is not an instant deletion of your line. Avoid posting anything you would only be comfortable keeping in a private notebook.",
          "cigtime is not a crisis service. If you are in crisis, contact your local emergency services.",
        ],
      },
    ],
    faq: [
      { q: "Can I vent anonymously with no sign-up?", a: "Yes. You can enter a room without creating an account. cigtime gives you a random nickname, so you do not need to supply a name or email address." },
      { q: "Can I write a long vent?", a: "Each line has a 140-character limit. Choose one thought you want to express, and leave out identifying details. This format is meant for a short break." },
      { q: "Does my message disappear when I leave?", a: "Leaving ends your visit, not the message retention window. Messages are deleted automatically after 24 hours by default and may be read by others before then." },
    ],
    cta: { href: "/room/let-it-out", label: "Let it out, one line" },
    roomSlug: "let-it-out",
  },
  {
    slug: "unsent-messages",
    title: "Write a Message You'll Never Send",
    description:
      "Write a message you'll never send in cigtime's anonymous Unsent Replies room. Try a short prompt, leave one line, and let it disappear after 24 hours.",
    h1: "Write the message you'll never send",
    intro:
      "There is a reply you have rewritten in your head, but you do not want to put it in someone's inbox. Unsent Replies gives that sentence somewhere else to go. On cigtime, you can write an unsent message as one anonymous line of up to 140 characters, then leave when your short break ends.",
    sections: [
      {
        heading: "Unsent means it never reaches the person",
        paragraphs: [
          "Your reply is never delivered to the person it is about. There is no recipient to choose and no delivery to schedule. You are posting a line in a shared anonymous room, where other visitors can read it and react. That is different from a private draft.",
          "Do not include the person's name, username, phone number, or other identifying details. Links and personal contact information are blocked. Keep the meaning while removing the clues. 'I wanted you to ask how it went' says plenty without telling strangers who you mean.",
        ],
      },
      {
        heading: "Find the sentence underneath the explanation",
        paragraphs: [
          "An unsent message does not have to be an argument. It could be a thank-you that feels too late, an apology you are still thinking about, or an ordinary observation you no longer have someone to tell. Choose the part that belongs in a single line.",
          "Try writing directly to an unnamed 'you.' If you start listing everything that happened, return to what you wanted to say at the time. You do not need to prove your version of events or make a stranger take your side.",
          "The prompts below are starting points, not instructions to disclose more. Finish one in your own words, shorten it to fit, and remove personal details before posting. You can also ignore them and write the sentence you already brought with you.",
        ],
      },
      {
        heading: "Leave it here without building an archive",
        paragraphs: [
          "cigtime is not an archive of letters to revisit later. Messages are deleted automatically after 24 hours by default. Your session ending does not delete the line immediately, so write with the understanding that people in the room may see it during that window.",
          "You can choose 1, 3, 5, or 10 minutes for your visit. A random nickname lets you participate without signing up. Pick an on-screen object, such as a candle or coffee, and use its progress as a cue to finish your break.",
        ],
      },
      {
        heading: "You do not have to wait for a response",
        paragraphs: [
          "Other visitors can respond with same, real, oof, lol, or hug. A reaction comes from someone in the room, never from your intended recipient through cigtime. It is not evidence of what that person would say. There may be no reaction, and you can leave anyway.",
          "If a message crosses a line, reporting and muting are available. Keep your own post free of threats, harassment, and personal information. cigtime is a short place to put words, not a crisis service or a way to settle a dispute.",
        ],
      },
    ],
    prompts: [
      "What I wanted to say before the conversation ended was...",
      "I never thanked you for...",
      "The small thing I still wish you knew is...",
      "If I stopped explaining myself, I would say...",
      "This reply can stay unsent: ...",
    ],
    faq: [
      { q: "Will my unsent message be delivered to anyone?", a: "It will never be delivered to the person you have in mind. You post it to the shared Unsent Replies room, where other visitors can read and react to it." },
      { q: "Is this a private journal or a message archive?", a: "No. It is a shared anonymous room. Messages are deleted automatically after 24 hours by default, so do not use it to keep a letter or store something important." },
      { q: "Do I need to explain who the message is for?", a: "No. Leave out names and identifying details. One line of up to 140 characters is enough, and you do not need an account to write it." },
    ],
    cta: { href: "/room/unsent-replies", label: "Write your unsent line" },
    roomSlug: "unsent-replies",
  },
  {
    slug: "let-it-go",
    title: "Write It Down and Let It Go",
    description:
      "Write it down and let it go on cigtime. Leave one anonymous line on The Rooftop, watch a short ritual finish, and move on. Messages disappear after 24 hours.",
    h1: "Write it down and let it go",
    intro:
      "Sometimes a thought keeps asking for another minute of your attention. You can give it one sentence instead. The Rooftop on cigtime is a shared anonymous room where you can write a line, watch a short ritual run its course, and leave. You do not need to sign up or explain your whole day.",
    sections: [
      {
        heading: "Choose one thing to put into words",
        paragraphs: [
          "Start with something specific enough to fit in 140 characters. 'I am still annoyed that my afternoon disappeared into meetings' works without a list of every interruption. So does a small hope, a passing observation, or something you are finished discussing for now.",
          "Writing it down does not have to mean solving it. You might still have a decision to make or a conversation to return to. This is simply a way to mark a pause before the next thing, with one line instead of another long explanation.",
        ],
      },
      {
        heading: "Give the break a visible ending",
        paragraphs: [
          "Choose a session length of 1, 3, 5, or 10 minutes. The on-screen ritual object changes as time passes, giving your visit a beginning and an end. The burn-out ritual is that simple: put down a thought, watch the time go, and let the session finish.",
          "The object does not have to be a cigarette. You can choose a lollipop, ball pop, incense, coffee, or candle instead. A cup empties, a flame gets smaller, or another object marks the passing time. These are screen visuals, so you do not need to light or prepare anything.",
          "When the time is up, use that ending as permission to leave. You do not need to refresh for another reaction or decide whether your sentence was interesting enough. The thought can remain unfinished while you return to whatever comes next.",
        ],
      },
      {
        heading: "Disappearing messages have a separate clock",
        paragraphs: [
          "The ritual ending and the message disappearing are two different things. Your session lasts for the duration you choose. Messages are deleted automatically after 24 hours by default, rather than being erased the moment your object finishes or you close the page.",
          "If you are looking for anonymous messages that disappear, that limit matters. The room is not a permanent archive, but it is also not a private page. Other visitors may read your line during the retention window. Do not post something that depends on instant deletion.",
        ],
      },
      {
        heading: "Leave room for other people's minutes",
        paragraphs: [
          "You enter with a random nickname. Others can react with same, real, oof, lol, or hug, and you can offer those small acknowledgments too. Nobody has to reply, agree, or remain in the room. A quiet visit counts just as much as a line that gets a reaction.",
          "Keep names and identifying details out of your post. Links and personal contact information are blocked, and reporting and muting are available. A temporary message still needs care for the people who might read it. cigtime is a brief break, not a crisis service.",
        ],
      },
    ],
    faq: [
      { q: "Does letting it go mean my problem will be solved?", a: "No. The ritual gives a short break a visible ending. It makes no promise about how you will feel or what will happen afterward. You can leave with things still unfinished." },
      { q: "Are messages deleted when the timer runs out?", a: "No. The timer ends your session. Messages are deleted automatically after 24 hours by default, and other visitors may read them before that happens." },
      { q: "Do I have to choose a cigarette?", a: "No. The on-screen options also include a lollipop, ball pop, incense, coffee, and candle. Choose whichever fits the kind of break you want." },
    ],
    cta: { href: "/room/rooftop", label: "Take a minute on The Rooftop" },
    roomSlug: "rooftop",
  },
  {
    slug: "one-minute-break",
    title: "Take a One Minute Break, No Words Needed",
    description:
      "Take a one minute break in cigtime's Silent Cigtime room. Choose a candle, incense, or coffee, set 60 seconds, and pause without posting or signing up.",
    h1: "A one minute break, no words needed",
    intro:
      "You can take a break without finding something to say. Silent Cigtime is the room on cigtime with no posting: just a place to spend a short stretch of time before you go back to your day. Choose one minute and an on-screen candle, incense, or coffee. There is no sign-up and no introduction to write.",
    sections: [
      {
        heading: "Set up a 60-second reset",
        paragraphs: [
          "Open Silent Cigtime and select the one-minute duration. The site also offers 3, 5, and 10 minutes, so check your choice if you want a 60-second visit. Pick an object you would like to watch, then give this minute a simple purpose: stop switching tasks for a moment.",
          "You do not need to prepare a routine. If it is convenient, put down whatever you are holding and leave the next tab alone. The aim is to spend a small piece of time on a break, rather than spend the whole minute deciding how to take one.",
        ],
      },
      {
        heading: "Let an ordinary object mark the time",
        paragraphs: [
          "A candle gives you a small flame to watch. Incense offers a thin line of smoke. Coffee marks the break with a cup that empties as time passes. These are on-screen objects. You do not need a real candle, incense stick, or drink, and nothing needs lighting.",
          "Choose the one that suits your moment, not the one you think a break ought to involve. Coffee might fit the gap between tasks. A candle might be the simplest thing to look at. You can use cigtime without smoking or choosing a cigarette at all.",
        ],
      },
      {
        heading: "Give each part of the minute less to do",
        paragraphs: [
          "For the first few seconds, let yourself arrive. Notice the room image and the object you chose. You do not need to read a message, compose a line, or decide how a stranger should react. Silent Cigtime has no posting, so there is nothing to contribute.",
          "Through the middle of the minute, let the visual carry the time. If your attention returns to an unfinished task, you can leave that task for the end of the break. There is no score for staying focused and no need to restart because your mind wandered.",
          "As the session finishes, decide on one ordinary next step: return to your document, stand up, or get some water. A minute does not have to transform your day to be a minute you chose to spend differently.",
        ],
      },
      {
        heading: "A small break with a clear stopping point",
        paragraphs: [
          "A take-a-break website can become another place to linger. Here, the selected duration gives your visit a stopping point. When the minute ends, you can leave. You do not need to post a goodbye or stay to see whether anyone noticed you.",
          "cigtime uses a random nickname rather than an account. Silent Cigtime is for a visit without writing; the other rooms offer anonymous lines and simple reactions if you want words another time. This is a short break, not a crisis service, and it makes no promise to change your mood or concentration.",
        ],
      },
    ],
    faq: [
      { q: "Can I use cigtime without posting anything?", a: "Yes. Silent Cigtime has no posting. You can choose your duration and on-screen object, spend the time quietly, and leave without writing a line." },
      { q: "Is every visit exactly one minute?", a: "No. You can select 1, 3, 5, or 10 minutes. Choose the one-minute option for a 60-second break rather than assuming it is already selected." },
      { q: "Do I need an account or any supplies?", a: "No account is needed. The candle, incense, and coffee are on-screen visuals, so there is nothing to buy, light, or prepare before your break." },
    ],
    cta: { href: "/room/silent", label: "Take a silent minute" },
    roomSlug: "silent",
  },
];

export function guidePath(slug: string) {
  return `/${slug}`;
}

export function getGuide(slug: string) {
  return GUIDES.find((guide) => guide.slug === slug);
}
