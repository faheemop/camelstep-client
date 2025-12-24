import { toast } from 'react-toastify';
import { Text } from '../../../components/Text/Text';
import { API_ROOT } from '../../../config';

export const FILE_SIZE = 5000000;
export const SUPPORTED_DOCS = ['pdf', 'doc', 'docx', 'jpg', 'jpeg'];
export const SUPPORTED_IMAGES = ['pdf', 'jpg', 'jpeg', 'png'];

/**
 * @param file
 * @param isPhoto
 */
export function checkFileFormat(file, isPhoto = false) {
  if (!file?.name && !file?.type) return false;
  if (isPhoto) return SUPPORTED_IMAGES.includes(file.type.split('/').pop());
  if (SUPPORTED_DOCS.findIndex((el) => file.name.includes(el)) >= 0) {
    if (file.name.endsWith(SUPPORTED_DOCS[1]) || file.name.endsWith(SUPPORTED_DOCS[2])) {
      return file.type.includes('officedocument') || file.type.includes('msword');
    }
    return SUPPORTED_DOCS.includes(file.type.split('/').pop());
  }
  return false;
}

/**
 * @param cb
 */
function callCallback(cb) {
  if (typeof (cb) === 'function') cb(true);
}

/**
 * @param url
 * @param data
 * @param callback
 * @param translate
 * @param language
 */
export function handleApiRequest(url, data, callback, translate, language = 'en') {
  if (!url || !data) {
    callCallback(callback);
    return null;
  }
  const formData = new FormData();
  Object.entries(data).forEach(([key, val]) => {
    formData.append(key, val);
  });

  const notify = (message, notificationType) => {
    toast(<Text type="subtitle2">{message}</Text>, {
      notificationType,
    });
  };

  fetch(`${API_ROOT}/backend/api/v1/contacts/${url}_form`, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept-Language': language,
    },
  })
    .then((resp) => {
      if (resp.ok) callCallback(callback);
    })
    .catch((err) => {
      console.error(err);
      notify(translate('notifications.error'), 'error');
      callCallback(callback);
    });
  return null;
}

/**
 * @param arr
 * @param key
 * @param lang
 */
export function getLabelForKey(arr, key, lang) {
  return arr[arr.findIndex((el) => el.value === key)].translationName[lang];
}

/**
 * @param data
 * @param field
 * @param file
 */
export function checkIfNoAttachment(data, field, file) {
  if (data[field]) {
    // eslint-disable-next-line immutable/no-mutation
    return {
      ...data,
      [field]: file,
    };
  }
  const { [field]: emptyField, ...restOfData } = data;
  return restOfData;
}

/**
 * @param msgSubject
*/
export function resolveTypeToApiEndpoint(msgSubject) {
  switch (msgSubject) {
    case 'career_request':
      return 'career';
    case 'maintenance':
      return 'maintenance';
    case 'complaint':
      return 'suggestions';
    case 'returns':
    case 'business_sales':
    case 'assist_online_purchase':
    case 'opportunities':
    case 'other_inquiries':
    case 'training':
      return 'generic';
    default:
      return 'corporate_partners';
  }
}
