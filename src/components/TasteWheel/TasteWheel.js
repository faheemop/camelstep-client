/* eslint-disable func-names */

import React, {
  useEffect, useRef, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import * as d3 from 'd3';

import { readyToUse as tasteWheelData } from './data';
import { eventBus } from '../../helpers/eventBus';
import { Button } from '../common/Button/Button';
import { CustomSelect } from '../inputs/CustomSelect/CustomSelect';
import { capitalizeFirstLetter } from '../../helpers/textHelpers';
import { TasteWheelBreadcrumbs } from './TasteWheelBreadcrumbs';

import './TasteWheel.scss';

const initialEmptyState = {
  majorNote: {
    name: 'none',
    translationName: {
      en: '',
      ar: '',
    },
  },
  minorNote: {
    name: 'none',
    translationName: {
      en: '',
      ar: '',
    },
  },
  flavor: {
    name: 'none',
    translationName: {
      en: '',
      ar: '',
    },
  },
};

/**
 * openTasteWheelModal method: remotely open a modal with <TasteWheel {...props} /> component as content
 *
 * @param {object} props object with params for TasteWheel component
 * @param {boolean} majorNotesOnly boolean value if true tastewheel renders only majorNotes
 * @param {object} currentState current taste values to render in taste wheel
 * @property {string} title translation string with title
 * @property {Function} props.handleStateSubmit external function that consumes object with majorNote and minorNote props
 */

const emptyTaste = {
  name: 'none',
  translationName: {
    en: '',
    ar: '',
  },
};

const setNote = (name, translationName) => ({
  name,
  translationName,
});

export const openTasteWheelModal = ({
  title, handleStateSubmit, majorNotesOnly, currentState,
}) => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  eventBus.publish('modal:open', {
    title,
    body: (
      <TasteWheel majorNotesOnly={majorNotesOnly} handleStateSubmit={handleStateSubmit} currentState={currentState} />
    ),
  });
};

const getInitialState = (state, majorNotesOnly) => {
  if (majorNotesOnly) {
    return ({
      majorNote: setNote(state?.majorNote?.name || 'none', state?.majorNote?.translationName),
      minorNote: setNote('none'),
      flavor: setNote('none'),
    });
  }
  const initialState = {
    majorNote: setNote(state.majorNote.name || 'none', state.majorNote.translationName),
    minorNote: setNote(state.minorNote.name || 'none', state.minorNote.translationName),
    flavor: setNote(state.flavor.name || 'none', state.flavor.translationName),
  };

  return initialState;
};

export const TasteWheel = ({ handleStateSubmit, currentState, majorNotesOnly }) => {
  const [t] = useTranslation('application');

  const wrapperRef = useRef(null);
  const svgRef = useRef(null);
  const [size, setSize] = useState(null);
  const [selectedNotes, setSelectedNotes] = useState(initialEmptyState);
  const defaultVal = {
    name: t('tasteWheel.title'),
    value: '',
    id: 0,
    index: 0,
    hideFromList: true,
  };
  const [options, setOptions] = useState({
    l1: [],
    l2: [],
    l3: [],
  });
  const radius = size / 2;
  const minSize = majorNotesOnly ? 550 : 700;

  useEffect(() => {
    const { innerHeight, innerWidth } = window;
    const vMin = innerWidth < innerHeight ? innerWidth : innerHeight;
    const vMin70 = 0.7 * vMin;
    const theSize = Math.floor(Math.max(vMin70, minSize));

    setSize(theSize);
  }, []);

  const handleSelect = () => {
    const { majorNote, minorNote, flavor } = selectedNotes;
    const tasteValues = {
      majorNote,
      minorNote,
      flavor,
    };
    if (typeof handleStateSubmit === 'function') handleStateSubmit(tasteValues);
    eventBus.publish('modal:close');
  };

  const partition = (data) => {
    const root = d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);
    return d3.partition().size([2 * Math.PI, root.height + 1])(root);
  };

  const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, tasteWheelData.children.length + 1));

  const format = d3.format(',d');

  const arc = d3
    .arc()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius * 1.5)
    .innerRadius((d) => d.y0 * radius)
    .outerRadius((d) => Math.max(d.y0 * radius, d.y1 * radius - 1));

  const getAutoBox = () => {
    if (!svgRef.current) {
      return '';
    }

    const {
      x, y, width, height,
    } = svgRef.current.getBBox();

    return [x, y, width, height].toString();
  };

  const arcVisible = (d) => d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;

  const labelVisible = (d) => d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;

  const labelTransform = (d) => {
    const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
    const y = ((d.y0 + d.y1) / 2) * radius;
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
  };

  useEffect(() => {
    if (!size) return;
    const graphData = !majorNotesOnly ? tasteWheelData : { ...tasteWheelData, children: tasteWheelData.children.map((c) => ({ ...c, children: [], value: 1 })) };
    const root = partition(graphData);

    root.each((d) => {
      const element = d;
      // eslint-disable-next-line immutable/no-mutation
      element.current = d;
    });

    const svg = d3.select(svgRef.current).attr('viewBox', [0, 0, size, size]).style('font', '10px sans-serif');

    const g = svg.append('g').attr('transform', `translate(${size / 2},${size / 2})`);

    const path = g
      .append('g')
      .selectAll('path')
      .data(root.descendants().slice(1))
      .join('path')
      .attr('fill', (d) => {
        let element = d;
        while (element.depth > 1) element = element.parent;
        return color(element.data.name);
      })
      .attr('fill-opacity', (d) => {
        if (arcVisible(d.current)) {
          return d.children ? 0.6 : 0.4;
        }
        return 0;
      })
      .attr('d', (d) => arc(d.current));

    path.style('cursor', 'pointer');

    path.append('title').text(
      (d) => `${d
        .ancestors()
        .filter((p) => p.data.name !== 'tastes')
        .map((p) => p.data.name)
        .reverse()
        .join(' / ')}${d.children?.length > 0 ? `\noptions: ${format(d.children.length)}` : ''}`,
    );

    const fontSize = (size / 100) * 0.57;

    const label = g
      .append('g')
      .attr('pointer-events', 'none')
      .attr('text-anchor', 'middle')
      .style('user-select', 'none')
      .style('font-size', `${fontSize}em`)
      .selectAll('text')
      .data(root.descendants().slice(1))
      .join('text')
      .attr('dy', '0.35em')
      .attr('fill-opacity', (d) => +labelVisible(d.current))
      .attr('transform', (d) => labelTransform(d.current))
      .text((d) => d.data?.translationName?.[i18next.language]);

    const parent = g.append('g').attr('text-anchor', 'middle').style('font-size', 'clamp(20px, 10vmin, 40px)');

    if (!majorNotesOnly) {
      parent
        .append('text')
        .attr('dx', '1')
        .attr('dy', '1')
        .attr('id', 'tastewheel_back_button')
        .attr('fill-opacity', 0)
        .attr('style', 'user-select: none;')
        .text(capitalizeFirstLetter(t('common.back')));
    }

    parent.append('circle').datum(root).attr('r', radius).attr('fill', 'none');

    const setNotes = (el) => {
      if (!el) return;
      const { depth, data } = el;
      const btn = document.getElementById('tastewheel_back_button');

      if (btn) {
        btn.setAttribute('fill-opacity', depth);
        // eslint-disable-next-line immutable/no-mutation
        btn.nextElementSibling.style.cursor = depth > 0 ? 'pointer' : 'unset';
        btn.nextElementSibling.setAttribute('pointer-events', depth > 0 ? 'all' : 'none');
      }

      if (depth === 0) setSelectedNotes(initialEmptyState);
      if (depth === 1) {
        setSelectedNotes({
          ...initialEmptyState,
          majorNote: setNote(data.name, data.translationName),
        });
      }
      if (depth === 2) {
        if (!data.children) {
          setSelectedNotes({
            ...initialEmptyState,
            majorNote: setNote(el.parent.data.name, el.parent.data.translationName),
            flavor: setNote(data.name, data.translationName),
          });
        } else {
          setSelectedNotes({
            ...initialEmptyState,
            majorNote: setNote(el.parent.data.name, el.parent.data.translationName),
            minorNote: data.children ? setNote(data.name, data.translationName) : emptyTaste,
          });
        }
      }
      if (depth === 3) {
        setSelectedNotes({
          majorNote: setNote(el.parent.parent.data.name, el.parent.parent.data.translationName),
          minorNote: setNote(el.parent.data.name, el.parent.data.translationName),
          flavor: setNote(data.name, data.translationName),
        });
      }
    };

    const clicked = (event, p) => {
      const hiddenElement = parseFloat(event.target.getAttribute('fill-opacity')) === 0;
      if (hiddenElement) return;

      setNotes(p);
      if (!p?.children) return;
      parent.datum(p.parent || root);

      root.each((d) => {
        const element = d;
        // eslint-disable-next-line immutable/no-mutation
        element.target = {
          x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
          x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
          y0: Math.max(0, d.y0 - p.depth),
          y1: Math.max(0, d.y1 - p.depth),
        };
      });

      const d3t = g.transition().duration(750);

      path
        .transition(d3t)
        .tween('data', (d) => {
          const i = d3.interpolate(d.current, d.target);
          return (tr) => {
            // eslint-disable-next-line immutable/no-mutation, no-param-reassign
            d.current = i(tr);
          };
        })
        .filter(function (d) {
          // eslint-disable-next-line react/no-this-in-sfc, immutable/no-this
          return +this.getAttribute('fill-opacity') || arcVisible(d.target);
        })
        .attr('fill-opacity', (d) => {
          if (arcVisible(d.target)) {
            return d.children ? 0.6 : 0.4;
          }
          return 0;
        })
        .attrTween('d', (d) => () => arc(d.current));
      label
        .filter(function (d) {
          // eslint-disable-next-line react/no-this-in-sfc, immutable/no-this
          return +this.getAttribute('fill-opacity') || labelVisible(d.target);
        })
        .transition(d3t)
        .attr('fill-opacity', (d) => +labelVisible(d.target))
        .attrTween('transform', (d) => () => labelTransform(d.current));
    };

    parent.on('click', clicked);
    path.on('click', clicked);

    svg.attr('viewBox', getAutoBox);
  }, [size, i18next.language]);

  const getObjectValues = (data) => Object.entries(data)?.map(([key, val]) => ({
    name: val.name,
    value: val.name,
    id: key + 1,
    index: key + 1,
    translationName: val.translationName,
  }));

  useEffect(() => {
    if (options.l1.length > 0) return;
    setOptions((prevState) => ({
      ...prevState,
      l1: [defaultVal, ...getObjectValues(tasteWheelData.children)],
    }));
  }, []);

  const updateState = (key, value, option) => {
    if (!value || value === 'none') {
      return false;
    }
    if (key === 'majorNote') {
      setSelectedNotes({
        ...initialEmptyState,
        [key]: setNote(option.name, option.translationName),
      });
      setOptions((prevState) => ({
        ...prevState,
        l2: [defaultVal, ...getObjectValues(tasteWheelData.children.find((el) => el.name === value)?.children)],
        l3: [],
      }));
    }
    if (key === 'minorNote') {
      const hasChildren = tasteWheelData.children
        .find((el) => el.name === selectedNotes.majorNote.name)
        ?.children.find((child) => child.name === value)?.children;
      if (hasChildren) {
        setSelectedNotes((prevState) => ({
          ...prevState,
          [key]: setNote(option.name, option.translationName),
          flavor: emptyTaste,
        }));
        setOptions((prevState) => ({
          ...prevState,
          l3: [
            defaultVal,
            ...getObjectValues(
              tasteWheelData.children
                .find((el) => el.name === selectedNotes.majorNote.name)
                ?.children.find((child) => child.name === value)?.children,
            ),
          ],
        }));
      } else {
        setSelectedNotes((prevState) => ({
          ...prevState,
          flavor: emptyTaste,
          minorNote: setNote(option.name, option.translationName),
        }));
        setOptions((prevState) => ({
          ...prevState,
          l3: [],
        }));
      }
    }

    if (key === 'flavor') {
      setSelectedNotes((prevState) => ({
        ...prevState,
        [key]: setNote(option.name, option.translationName),
      }));
    }
    return value;
  };

  useEffect(() => {
    setSelectedNotes(getInitialState(currentState, majorNotesOnly));
  }, [currentState, majorNotesOnly]);

  return (
    <>
      <div ref={wrapperRef} className={`tastewheel ${majorNotesOnly && 'tastewheel--major-notes'}`}>
        <TasteWheelBreadcrumbs data={selectedNotes} />
        {size > 0 && <svg ref={svgRef} width={size} height={size} />}
      </div>
      <div className="tastewheel--actions">
        <Button type="primary" onClick={handleSelect}>
          {t('tasteWheel.save')}
        </Button>
      </div>
      <div className="tastewheel--mobile">
        <TasteWheelBreadcrumbs data={selectedNotes} />
        {options.l1.length > 0 && (
          <CustomSelect
            inputName="majorNote"
            options={options.l1}
            value={selectedNotes.majorNote.name || ''}
            setValue={(value, el, option) => updateState(el.name, value, option)}
            defaultValueLabel={t('tasteWheel.selectLabel', { noteType: t('common.majorNote') })}
          />
        )}
        {options.l2.length > 0 && !majorNotesOnly && (
          <CustomSelect
            inputName="minorNote"
            options={options.l2}
            value={selectedNotes.minorNote.name || selectedNotes.flavor.name || ''}
            setValue={(value, el, option) => updateState(el.name, value, option)}
            defaultValueLabel={t('tasteWheel.selectLabel', { noteType: t('common.minorNote') })}
          />
        )}
        {options.l3.length > 0 && !majorNotesOnly && (
          <CustomSelect
            inputName="flavor"
            options={options.l3}
            value={selectedNotes.flavor.name || ''}
            setValue={(value, el, option) => updateState(el.name, value, option)}
            defaultValueLabel={t('tasteWheel.selectLabel', { noteType: t('common.flavour') })}
          />
        )}
        <Button type="primary" onClick={handleSelect}>
          {t('tasteWheel.save')}
        </Button>
      </div>
    </>
  );
};
