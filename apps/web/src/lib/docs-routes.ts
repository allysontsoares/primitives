export const DOCS_PREFIX = "/docs";

export function routeToHref(route: string) {
  return route === "" ? DOCS_PREFIX : `${DOCS_PREFIX}/${route}`;
}

export function pathToRoute(pathname: string) {
  if (pathname === DOCS_PREFIX || pathname === `${DOCS_PREFIX}/`) return "";
  if (pathname.startsWith(`${DOCS_PREFIX}/`)) {
    return pathname.slice(DOCS_PREFIX.length + 1);
  }
  return null;
}

export function isDocsPath(pathname: string) {
  return pathname === DOCS_PREFIX || pathname.startsWith(`${DOCS_PREFIX}/`);
}

export function isDocsOverview(pathname: string) {
  return pathname === DOCS_PREFIX || pathname === `${DOCS_PREFIX}/`;
}
