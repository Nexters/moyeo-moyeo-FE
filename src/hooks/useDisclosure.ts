import { useMemo, useState } from 'react';

export const useDisclosure = () => {
  const [isOpen, setIsOpen] = useState(false);

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
