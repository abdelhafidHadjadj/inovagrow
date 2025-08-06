export const slugify = (str: string) =>
  str
    .toLowerCase()
    .normalize('NFD')               // remove accents
    .replace(/[\u0300-\u036f]/g, '') // …
    .replace(/[^a-z0-9]+/g, '-')     // spaces & specials → -
    .replace(/^-+|-+$/g, '');        // trim
