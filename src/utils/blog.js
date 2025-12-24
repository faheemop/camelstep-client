import { localizedPath } from '../helpers/localizedPath';
import { notify } from './notifications';

// Function to copy the share link to clipboard
export const copyBlogLinkToClipboard = (e, blogId) => {
  e.stopPropagation();
  e.preventDefault();
  const baseUrl = window.location.origin;
  const endpoint = localizedPath(`/blogs/${blogId}`);
  const completeUrl = baseUrl + endpoint;
  navigator.clipboard.writeText(completeUrl);
  if (baseUrl) notify('Link has been copied to clipboard', 'success');
};
