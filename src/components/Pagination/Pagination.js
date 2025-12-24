/* eslint-disable react/jsx-props-no-spreading */
import React, {
  useEffect, useMemo, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { SvgIcon } from '../common/SvgIcon/SvgIcon';
import { useMediaQuery } from '../../hooks/useCurrentScreenWidth';

import './pagination.scss';

export const Pagination = ({
  postsPerPage, totalPosts, paginate, currentPage,
}) => {
  const { t } = useTranslation('application');
  const pageNumbers = Array(Math.ceil(totalPosts / postsPerPage))
    .fill()
    .map((_, i) => i + 1);
  const [maxPaginationItems, setMaxPaginationItems] = useState(3);
  const max575 = useMediaQuery('(max-width: 575px)');

  const limitPages = () => {
    if (pageNumbers.length > maxPaginationItems) {
      if (
        currentPage > Math.ceil(maxPaginationItems / 2)
        && currentPage - 1 < pageNumbers.length - Math.ceil(maxPaginationItems / 2)
      ) {
        return pageNumbers.slice(
          currentPage - Math.ceil(maxPaginationItems / 2),
          currentPage + Math.ceil(maxPaginationItems / 2) - 1,
        );
      }
      if (pageNumbers.length - Math.ceil(maxPaginationItems / 2) < currentPage) {
        return pageNumbers.slice(pageNumbers.length - maxPaginationItems, pageNumbers.length);
      }
      return pageNumbers.slice(0, maxPaginationItems);
    }
    return pageNumbers;
  };

  const limitedItems = useMemo(() => limitPages(), [pageNumbers, currentPage]);

  useEffect(() => {
    if (max575) {
      setMaxPaginationItems(1);
    } else {
      setMaxPaginationItems(3);
    }
  }, [max575]);

  const handleNextPage = () => {
    const canGoNextPage = currentPage < pageNumbers.length;
    if (canGoNextPage) paginate(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage !== 1) paginate(currentPage - 1);
  };

  if (pageNumbers.length <= 1) return <div />;

  return (
    <nav aria-label="pagination" className="pagination-container">
      <ul className="pagination">
        <li className="pagination-item">
          <button
            type="button"
            onClick={handlePreviousPage}
            className="pagination-link"
            disabled={currentPage === 1}
            aria-label={t('common.pagination.prev')}
          >
            <SvgIcon id="icon-chevron_up" className="pagination-icon--prev" width={20} height={20} />
          </button>
        </li>

        {pageNumbers.length > maxPaginationItems && limitedItems[0] > 1 && (
          <>
            <li className="pagination-item">
              <button type="button" className="pagination-link" onClick={() => paginate(1)}>
                1
              </button>
            </li>
            {limitedItems[0] > 2 && (
              <li className="pagination-item dots">
                <span className="pagination-ellipsis">. . .</span>
              </li>
            )}
          </>
        )}

        {limitedItems.map((number) => (
          <li key={number} className={`pagination-item ${currentPage === number ? 'active' : ''}`}>
            <button
              type="button"
              onClick={() => {
                paginate(number);
              }}
              className="pagination-link"
              aria-label={t('common.pagination.page', { page: number })}
              {...(currentPage === number ? { 'aria-current': 'page' } : {})}
            >
              {number}
            </button>
          </li>
        ))}

        {pageNumbers.length > maxPaginationItems && pageNumbers[pageNumbers.length - 1] - limitedItems[limitedItems.length - 1] > 1 && (
          <>
            <li className="pagination-item dots">
              <span className="pagination-ellipsis">. . .</span>
            </li>
            <li className="pagination-item">
              <button type="button" className="pagination-link" onClick={() => paginate(pageNumbers.length)}>
                {pageNumbers.length}
              </button>
            </li>
          </>
        )}

        {pageNumbers.length > maxPaginationItems && pageNumbers[pageNumbers.length - 1] - limitedItems[limitedItems.length - 1] === 1 && (
          <li className="pagination-item">
            <button type="button" className="pagination-link" onClick={() => paginate(pageNumbers.length)}>
              {pageNumbers.length}
            </button>
          </li>
        )}

        <li className="pagination-item">
          <button
            type="button"
            onClick={handleNextPage}
            className="pagination-link"
            disabled={currentPage === pageNumbers.length}
            aria-label={t('common.pagination.next')}
          >
            <SvgIcon id="icon-chevron_up" className="pagination-icon--next" width={20} height={20} />
          </button>
        </li>
      </ul>
    </nav>
  );
};
