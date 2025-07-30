import { writable } from 'svelte/store';

export const messages = writable([
  { id: 1, user: 'Inova AI', text: 'Hi, Welcome to Inova Grow!' },
]);

export const currentUser = writable('Me');
