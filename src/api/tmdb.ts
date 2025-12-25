import { env } from "@/utils/env";
import { isEmpty } from "@/utils/helpers";
import { TMDB } from "tmdb-ts";
import { LANGUAGE_STORAGE_KEY, IS_BROWSER } from "@/utils/constants";

const token = env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;

if (isEmpty(token)) {
  throw new Error("TMDB_ACCESS_TOKEN is not defined");
}

export const getLanguage = (): string => {
  if (IS_BROWSER) {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) || "en-US";
      } catch {
        return "en-US";
      }
    }
  }
  return "en-US";
};

export const tmdb = new TMDB(token);
