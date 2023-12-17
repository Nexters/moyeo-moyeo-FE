import { useMemo, useState } from 'react';

export const useDisclosure = (open?: boolean) => {
  const [isOpen, setIsOpen] = useState(open ?? false);

  return useMemo(
    () => ({
      isOpen,
      onOpen: () => setIsOpen(true),
      onClose: () => setIsOpen(false),
      onToggle: () => setIsOpen(!isOpen),
    }),
    [isOpen],
  );
};
