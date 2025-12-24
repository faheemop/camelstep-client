import React from 'react';

import { Collapse } from 'react-collapse';
import { AnimatePresence, motion } from 'framer-motion';

export const EXPANDABLE_VARIANTS = {
  accordion: 'accordion',
  dropdown: 'dropdown',
};

export const ExpandableVariant = ({
  variant, isOpen, children,
}) => {
  if (variant === EXPANDABLE_VARIANTS.accordion) {
    return <Collapse isOpened={isOpen}>{children}</Collapse>;
  }
  if (variant === EXPANDABLE_VARIANTS.dropdown) {
    return (
      <AnimatePresence exitBeforeEnter>
        {isOpen && (
          <motion.div
            style={{ position: 'relative', zIndex: 100 }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 15 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
  return null;
};
