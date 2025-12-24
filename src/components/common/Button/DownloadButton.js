import React from 'react';
import { Text } from '../../Text/Text';
import DownloadIcon from '../../../assets/icons/download.svg';

import './downloadButton.scss';

export const DownloadButton = ({
  label, fileUrl, withIcon, clickHandler,
}) => (
  <a className="download-button" href={fileUrl} download onClick={clickHandler}>
    {withIcon && <DownloadIcon />}
    <Text tag="span" type="subtitle2">{label}</Text>
  </a>
);
