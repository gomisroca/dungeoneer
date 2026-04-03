import { atom } from 'jotai';

export type MessageType = 'success' | 'error' | 'warning';

export type Message = {
  content: string;
  type?: MessageType;
};

export const messageAtom = atom<Message | null>(null);
