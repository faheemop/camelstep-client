import React from 'react';
import { Collapse } from 'react-collapse';
import { useTranslation } from 'react-i18next';

import { Text } from '../../../components/Text/Text';
import { MessageBox } from '../../../components/inputs/MessageBox/MessageBox';

const NOTE_MAX_LENGTH = 750;

export const FeedbackNote = ({ feedbackNoteContent, isNoteSectionVisible, onFeedbackNoteContentChange }) => {
  const [t] = useTranslation('application');

  return (
    <Collapse isOpened={isNoteSectionVisible}>
      <div className="order-feedback-page__note-section">
        <Text
          type="subtitle1"
          className="order-feedback-page__note-subtitle"
        >
          {t('orderFeedback.noteSubtitle')}
        </Text>
        <MessageBox
          label={t('orderFeedback.noteLabel')}
          maxLength={NOTE_MAX_LENGTH}
          value={feedbackNoteContent}
          onChange={onFeedbackNoteContentChange}
        />
      </div>
    </Collapse>
  );
};
