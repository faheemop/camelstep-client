import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'react-grid-system';
import i18next from 'i18next';

import { useDispatch, useSelector } from 'react-redux';
import { Text } from '../../Text/Text';
import { CupsFilters } from './CupsFilters';
import { BrewingMethodFilters } from './BrewingMethodFilters';
import { BrewingMethodSpecifics } from './BrewingMethodSpecifics';
import { Button } from '../../common/Button/Button';
import { useGetFiltersQuery } from '../../../services/howToBrew';
import { setBaristaMode, resetFilters, setTasteWheelMajorNote } from '../../../features/howToBrew/howToBrewSlice';
import { useMediaQuery } from '../../../hooks/useCurrentScreenWidth';
import { OtherProductsSection } from '../HowToBrewOtherProductsSection/OtherProductsSection';
import { SvgIcon } from '../../common/SvgIcon/SvgIcon';
import { MaybeCollapse } from './MaybeCollapse';

import { openTasteWheelModal } from '../../TasteWheel/TasteWheel';
import { transformName } from '../../../helpers/textHelpers';

export const HowToBrewFilters = () => {
  const { t } = useTranslation('application');
  const {
    data: recipeData,
    refetch: refetchRecipe,
  } = useGetFiltersQuery();
  const dispatch = useDispatch();
  const baristaModeEnabled = useSelector((state) => state.howToBrew.baristaModeEnabled);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const activeFilter = useSelector((state) => state.howToBrew.activeFilter);
  const tasteWheelMajorNote = useSelector((state) => state.howToBrew.tasteWheelMajorNote);

  const moreThan1024 = useMediaQuery('(min-width: 1024px)');

  useEffect(() => {
    if (!recipeData) return;
    i18next.on('languageChanged', refetchRecipe);

    // eslint-disable-next-line consistent-return
    return () => {
      i18next.off('languageChanged', refetchRecipe);
    };
  }, [recipeData]);

  const handleTastePreferencesUpdate = (data) => {
    dispatch(setTasteWheelMajorNote({ majorNote: { ...data.majorNote } }));
  };

  useEffect(() => {
    if (!activeFilter) {
      setIsFilterOpen(true);
    }
  }, []);

  const rowStyle = {
    marginLeft: 0,
    marginRight: 0,
    padding: '2rem 0',
  };

  return (
    <div
      style={{
        display: 'flex',
        flexGrow: 1,
        gap: '1rem',
        width: '100%',
      }}
      className="howToBrew-filtering"
    >
      <div style={{ flexBasis: 'min(10%, 200px)', padding: 0, display: moreThan1024 ? 'block' : 'none' }} />
      <div
        style={{
          flexBasis: '100%',
          flexGrow: '1',
          flexShrink: '1',
          padding: 0,
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {!moreThan1024 && (
          <SvgIcon id="icon-filters" width={32} height={32} onClick={() => setIsFilterOpen(!isFilterOpen)} />
        )}
        <MaybeCollapse disableCollapse={!!moreThan1024} isOpened={isFilterOpen}>
          <Row style={rowStyle}>
            <Col lg={5}>
              <Text type="headline2" className="brew-step__title">
                {t('howToBrew.cupsText')}
              </Text>
            </Col>
            <Col lg={7}>
              <CupsFilters />
            </Col>
          </Row>
          <Row style={rowStyle}>
            <Col lg={5}>
              <Text type="headline2" className="brew-step__title">
                {t('howToBrew.tasteText')}
              </Text>
            </Col>
            <Col lg={7}>
              <Button
                type="tertiary"
                text={t('filtering.tasteWheel')}
                onClick={() => openTasteWheelModal({
                  title: t('tasteWheel.title'), handleStateSubmit: handleTastePreferencesUpdate, majorNotesOnly: true, currentState: tasteWheelMajorNote,
                })}
                style={{ marginInlineEnd: '1rem' }}
              />
              {activeFilter && (
                <Button
                  type="tertiary"
                  text={t('howToBrew.barista')}
                  onClick={() => dispatch(setBaristaMode(!baristaModeEnabled))}
                  style={{ marginInlineEnd: '1rem' }}
                />
              )}
              {tasteWheelMajorNote?.majorNote?.name !== 'none' && (
                <div style={{
                  display: 'flex', flexShrink: 0, alignItems: 'center', marginBlockStart: '1rem',
                }}
                >
                  <Text type="overline">
                    {t(`tastes.${transformName(tasteWheelMajorNote.majorNote.name)}`)}
                  </Text>
                  <SvgIcon id="icon-delete" width={32} height={32} onClick={() => dispatch(resetFilters())} />
                </div>
              )}
            </Col>
          </Row>
          <Row style={rowStyle}>
            <Col>
              <BrewingMethodFilters />
              <BrewingMethodSpecifics />
            </Col>
          </Row>
        </MaybeCollapse>
        <Row style={rowStyle}>
          <Col>
            <OtherProductsSection />
          </Col>
        </Row>
      </div>
    </div>
  );
};
