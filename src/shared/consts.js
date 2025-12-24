// [[:space:]] Matches whitespace characters. Equivalent to \s. The double square brackets is not a typo, POSIX notation demands it.
export const zipCodeRegEx = /^[a-zA-Z0-9]+[-\u0020]?[a-zA-Z0-9]*$/;

export const fullNameRegex = /^[a-zA-Z\u0600-\u06FF\s]+$/;
