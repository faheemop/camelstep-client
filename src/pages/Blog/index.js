import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Helmet } from 'react-helmet';
import { useScroll } from '../../hooks/useScroll';
import { Input } from '../../components/inputs/Input/Input';
import { MainLayout } from '../../components/Layout/MainLayout';
import { Text } from '../../components/Text/Text';
import ShareIcon from '../../assets/icons/share-icon.svg';
import { useGetAllBlogsQuery } from '../../services/blogs';
import SortIcon from '../../assets/icons/sort-lines.svg';
import ArrowIcon from '../../assets/icons/back-arrow.svg';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { NoSearchResultFound } from '../../components/NoSearchResultFound/NoSearchResultFound';
import { copyBlogLinkToClipboard } from '../../utils/blog';

import './blog.scss';
import { localizedPath } from '../../helpers/localizedPath';

/**
 * Component that lists all the blogs for camelstep website/
 *
 * @returns Component to render on Blog Page.
 */
export const Blog = () => {
  const { t } = useTranslation('application');
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const [currentPage, setCurrentPage] = useState(1);
  const { data: blogsData, isFetching } = useGetAllBlogsQuery({
    page: currentPage,
    count: 15,
    lang: currentLanguage,
  });

  const [blogs, setBlogs] = useState(blogsData || []);
  const { y: scrollY } = useScroll();
  const [sortOrder, setSortOrder] = useState('desc');
  const [, setSearchInput] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState(blogs || []);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    if (blogsData) {
      setBlogs((prevBlogs) => [...prevBlogs, ...blogsData]);
      setSelectedTopic(null);
      setSearchInput('');
    }
  }, [blogsData]);

  // To update the current page on scroll
  const handleScroll = () => {
    if (
      scrollY >= 90
      && !isFetching
      && blogsData?.length > 0
    ) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    handleScroll();
  }, [scrollY]);

  // To re-sort the blogs whenever the sortOrder changes
  useEffect(() => {
    const sortedBlogs = _.sortBy(blogs, 'original_created_at');
    if (sortOrder === 'desc') {
      setFilteredBlogs(sortedBlogs.reverse());
    } else {
      setFilteredBlogs(sortedBlogs);
    }
  }, [sortOrder]);

  useEffect(() => {
    if (!blogs) return;
    const allTopics = blogs.map((blog) => blog.topic);
    const uniqueTopics = _.compact(_.uniq(allTopics));

    setTopics(uniqueTopics);
    setFilteredBlogs(blogs);
  }, [blogs, currentLanguage]);

  // Function to filter blogs based on search input
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filtered = blogs.filter(
      (blog) => blog?.title.toLowerCase().includes(searchValue),
    );
    setFilteredBlogs(filtered);
    setSearchInput(searchValue);
  };

  // Function to filter blogs based on the selected topic.
  const filterByTopic = (topicName) => {
    const newSelectedTopic = selectedTopic === topicName ? null : topicName;
    const filtered = blogs.filter(
      (blog) => (blog.topic && blog.topic.toLowerCase() === topicName.toLowerCase()),
    );
    setFilteredBlogs(newSelectedTopic === null ? blogs : filtered);
    setSelectedTopic(newSelectedTopic);
  };

  // Generate topic filter buttons based on the available topics.
  const getTopics = topics.map((topic) => {
    const key = `blog_topic_${topic}`;
    const buttonClass = selectedTopic === topic ? 'topicCard selectedTopic' : 'topicCard';
    return (
      <button
        key={key}
        type="button"
        className={buttonClass}
        onClick={() => filterByTopic(topic)}
      >
        <Text type="caption">{topic}</Text>
      </button>
    );
  });

  // Generate a list of BlogCard components based on the filtered blogs.
  const renderBlogCards = filteredBlogs.map((blog, index) => {
    const key = `blog_card_${index}`;
    return <BlogCard key={key} blog={blog} index={index} />;
  });

  // Function to set toggle between ascending and descending SortOrders
  const handleSortClick = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <MainLayout className="static_page blogsPage">
      <Helmet>
        <title>{t('seo.blogs.title')}</title>
        <meta name="description" content={t('seo.blogs.description')} />
      </Helmet>
      <div className="blogsHeaderSection">
        <Text type="headline2" className="blogsHeaderText">
          {t('blog.mineofknowledge')}
        </Text>
      </div>

      <div className="searchContainer">
        <Input
          type="search"
          placeholder={t('blog.search')}
          customWrapperClass="search-input"
          onChange={handleSearch}
          disabled={!blogsData}
        />

        <button
          type="button"
          className="sortSection"
          onClick={() => handleSortClick()}
        >
          <Text className="text" type="caption">
            {t('blog.sort')}
          </Text>
          <div className={`sortIconSection ${sortOrder === 'asc' && 'flip'}`}>
            <div className="sortIcon">
              <SortIcon />
            </div>

            <div className="sortIconArrow">
              <ArrowIcon />
            </div>
          </div>
        </button>
      </div>

      <div className="topicSection">
        <Text className="topicLabel" type="body2">
          {t('blog.topics')}
        </Text>

        <div className="topicContent">{getTopics}</div>
      </div>

      <div className="blogsSection">
        {renderBlogCards}
        <br />
        {filteredBlogs.length === 0 && !isFetching && <NoSearchResultFound />}
      </div>

      {isFetching && (
        <div className="loading-container">
          <LoadingSpinner />
        </div>
      )}
    </MainLayout>
  );
};

const BlogCard = ({ blog }) => {
  const {
    slug,
    cover_image_url,
    title,
    subtitle,
    author_name,
    original_created_at,
    topic,
  } = blog;

  const lastUpdatedDate = moment(original_created_at).format('DD MMMM YY');
  const MAX_SUBTITLE_LENGTH = 60;
  const truncatedSubtitle = subtitle?.length > MAX_SUBTITLE_LENGTH ? `${subtitle.slice(0, MAX_SUBTITLE_LENGTH)}...` : subtitle;

  return (
    <Link to={localizedPath(`/blogs/${slug}`)} className="blogCard">
      <div className="coverImageSection">
        <img src={cover_image_url} alt="" />
        <Text type="caption" className="authorNameText">
          {author_name}
        </Text>
      </div>
      <div className="contentSection">
        <div>
          <Text type="body1" className="blogCardTitle">
            {title}
          </Text>
          <Text type="caption">{truncatedSubtitle}</Text>
        </div>
        <div className="shareBlogSection">
          <div className="blogMetaData">
            <Text type="caption" className="createdAtDate">
              {lastUpdatedDate}
            </Text>
            <Text type="caption" className="blogType">
              {topic}
            </Text>
          </div>
          <button
            type="button"
            className="shareLogoContainer"
            onClick={(e) => copyBlogLinkToClipboard(e, slug)}
          >
            <ShareIcon className="shareIcon" />
          </button>
        </div>
      </div>
    </Link>
  );
};
