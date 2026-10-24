import { legalCopy, type LegalPageKey } from "@/lib/legal";
import { pageMetadata } from "@/lib/site";
import { article, breadcrumb, CONTENT_DATES } from "@/lib/structuredData";

// Search titles say what the page is; the on-page heading stays the short word.
const SEO_TITLES: Record<LegalPageKey, string> = {
  guidelines: "Community Guidelines for the Anonymous Rooms",
  privacy: "Privacy Policy: What cigtime Keeps and Deletes",
  terms: "Terms of Use for the Anonymous Break Room",
};

export function legalMetadata(page: LegalPageKey) {
  return pageMetadata({ title: SEO_TITLES[page], description: legalCopy("en", page).intro, path: `/${page}` });
}

export function legalStructuredData(page: LegalPageKey) {
  const copy = legalCopy("en", page);
  return [
    article({ path: `/${page}`, headline: SEO_TITLES[page], description: copy.intro, dates: CONTENT_DATES.legal }),
    breadcrumb([[copy.title, `/${page}`]]),
  ];
}
