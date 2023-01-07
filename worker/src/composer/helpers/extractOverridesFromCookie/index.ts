import { Target } from "../createPayloadFromCookie";
import { ComposerEntry, ComposerApiSetBody } from "../../types";

/**
 * Xxxx xxxxxx.
 * Xxxx xxxxxx.
 * Xxxx xxxxxx.
 */
export const extractOverridesFromCookie = (
  // request: Request
  target: Target,
  payload?: ComposerApiSetBody
): ComposerEntry | undefined => {
  // const target = getBaseAndAppHostTargets(request);
  // const payload = createCookiePayloadFromRequest(request);

  if (!payload) return;

  const entries = [payload.base, ...payload?.dependencies ?? []];
  
  return entries.find((item) => item.application === target.app);
};
