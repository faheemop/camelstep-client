export const noneValue = {
  id: 0,
  name: "none",
  translationName: {
    en: "none",
    ar: "لا شيئ",
  },
  value: "none",
  filterParams: [],
};

export const major_notes = [
  // noneValue,
  {
    id: 1,
    name: "sweet",
    translationName: {
      en: "sweet",
      ar: "حلو",
    },
    value: "sweet",
    filterParams: [
      {
        name: "filters[properties][major_note]",
        value: "sweet",
      },
    ],
  },
  {
    id: 2,
    name: "floral",
    value: "floral",
    translationName: {
      en: "floral",
      ar: "زهري",
    },
    filterParams: [
      {
        name: "filters[properties][major_note]",
        value: "floral",
      },
    ],
  },
  {
    id: 3,
    name: "sour/fermented",
    value: "sour/fermented",
    translationName: {
      en: "sour / fermented",
      ar: "حامض/ مخمر",
    },
    filterParams: [
      {
        name: "filters[properties][major_note]",
        value: "sour/fermented",
      },
    ],
  },
  {
    id: 4,
    name: "green/vegetative",
    value: "green/vegetative",
    translationName: {
      en: "green / vegetative",
      ar: "أخضر/ نباتي",
    },
    filterParams: [
      {
        name: "filters[properties][major_note]",
        value: "green/vegetative",
      },
    ],
  },
  {
    id: 5,
    name: "other",
    value: "other",
    translationName: {
      en: "other",
      ar: "أخرى",
    },
    filterParams: [
      {
        name: "filters[properties][major_note]",
        value: "other",
      },
    ],
  },
  {
    id: 6,
    name: "roasted",
    value: "roasted",
    translationName: {
      en: "roasted",
      ar: "محمص",
    },
    filterParams: [
      {
        name: "filters[properties][major_note]",
        value: "roasted",
      },
    ],
  },
  {
    id: 7,
    name: "spices",
    value: "spices",
    translationName: {
      en: "spices",
      ar: "التوابل",
    },
    filterParams: [
      {
        name: "filters[properties][major_note]",
        value: "spices",
      },
    ],
  },
  {
    id: 8,
    name: "nutty/cocoa",
    value: "nutty / cocoa",
    translationName: {
      en: "nutty/cocoa",
      ar: "مكسرات  /  كاكاو",
    },
    filterParams: [
      {
        name: "filters[properties][major_note]",
        value: "nutty/cocoa",
      },
    ],
  },
  {
    id: 9,
    name: "fruity",
    value: "fruity",
    translationName: {
      en: "fruity",
      ar: "فاكهي",
    },
    filterParams: [
      {
        name: "filters[properties][major_note]",
        value: "fruity",
      },
    ],
  },
];

export const sortByOptions = [
  // noneValue,
  {
    id: 2,
    name: "Price Ascending",
    translationName: {
      en: "Price Ascending",
      ar: "السعر تصاعدي",
    },
    value: "price_asc",
    filterParams: [
      {
        name: "order[name]",
        value: "list_price",
      },
      {
        name: "order[type]",
        value: "asc",
      },
    ],
  },
  {
    id: 3,
    name: "Price Descending",
    translationName: {
      en: "Price Descending",
      ar: "السعر تنازلي",
    },
    value: "price_desc",
    filterParams: [
      {
        name: "order[name]",
        value: "list_price",
      },
      {
        name: "order[type]",
        value: "desc",
      },
    ],
  },
  {
    id: 4,
    name: "Name A-Z",
    translationName: {
      en: "Name A-Z",
      ar: "الاسم أ-ي",
    },
    value: "name-az",
    filterParams: [
      {
        name: "order[name]",
        value: "name",
      },
      {
        name: "order[type]",
        value: "asc",
      },
    ],
  },
  {
    id: 5,
    name: "Name Z-A",
    translationName: {
      en: "Name Z-A",
      ar: "الاسم ي-أ",
    },
    value: "name-za",
    filterParams: [
      {
        name: "order[name]",
        value: "name",
      },
      {
        name: "order[type]",
        value: "desc",
      },
    ],
  },
];

// name, nameAr, external_id [indexed from seed]
const countriesBase = [
  ["Brazil", "البرازيل", 0],
  ["Vietnam", "فيتنام", 1],
  ["Colombia", "كولومبيا", 2],
  ["Indonesia", "اندونيسيا", 3],
  ["Honduras", "هندوراس", 4],
  ["Ethiopia", "إثيوبيا", 5],
  ["Peru", "بيرو", 6],
  ["India", "الهند", 7],
  ["Yemen", "اليمن", 8],
  ["Burundi", "بوروندي", 9],
  ["Costa Rica", "كوستاريكا", 10],
  ["El Salvador", "السلفادور", 11],
  ["Panama", "بنما", 12],
  ["Kenya", "كينيا", 13],
  ["Guatemala", "غواتيمالا", 14],
];

export const countriesFilters = [
  // noneValue,
  ...countriesBase.map((el) => ({
    id: el[2],
    name: el[0],
    translationName: {
      en: el[0],
      ar: el[1],
    },
    value: el[0],
    filterParams: [
      {
        name: "filters[country_external_id]",
        value: el[2],
      },
    ],
  })),
];

const brewingMethodsBase = [
  ["Black/Drip", " سوداء/مقطرة"],
  ["Espresso", "إسبرسو"],
  ["Turkish", "تركية"],
  ["Cold Brew", "كولد برو"],
  ["Milk-based", "مع الحليب"],
  ["Saudi", " القهوة السعودية"],
  ["Cold drip Coffee", "قهوة مقطرة باردة"],
];

export const brewing_methods = [
  // noneValue,
  ...brewingMethodsBase.map((el, i) => ({
    id: i + 1,
    name: el[0],
    translationName: {
      en: el[0].split("/").join(" / "),
      ar: el[1],
    },
    value: el[0],
    filterParams: [
      {
        name: "filters[brewing_method_id]",
        value: i + 1,
      },
    ],
  })),
];
