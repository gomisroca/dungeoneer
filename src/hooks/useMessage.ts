import { useSetAtom } from 'jotai';

import { messageAtom } from '@/atoms/message';

export const useMessage = () => {
  const setMessage = useSetAtom(messageAtom);
  return setMessage;
};
