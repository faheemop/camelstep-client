/* eslint-disable immutable/no-mutation */
import en from '../../translations/en/application.json';
import ar from '../../translations/ar/application.json';

const seedData = [
  ['sweet', 'brownsugar', 'molasses'],
  ['sweet', 'brownsugar', 'maplesyrup'],
  ['sweet', 'brownsugar', 'carmelized'],
  ['sweet', 'brownsugar', 'honey'],
  ['sweet', 'vanilla', 'vanilla'],
  ['sweet', 'vanillin', 'vanillin'],
  ['sweet', 'overallsweet', 'overallsweet'],
  ['sweet', 'sweetaromatics', 'sweetaromatics'],
  ['floral', 'blacktea', 'blacktea'],
  ['floral', 'floral', 'chamomile'],
  ['floral', 'floral', 'rose'],
  ['floral', 'floral', 'jasmine'],
  ['fruity', 'berry', 'blackberry'],
  ['fruity', 'berry', 'raspberry'],
  ['fruity', 'berry', 'blueberry'],
  ['fruity', 'berry', 'strawberry'],
  ['fruity', 'driedfruit', 'raisin'],
  ['fruity', 'driedfruit', 'prune'],
  ['fruity', 'otherfruit', 'coconut'],
  ['fruity', 'otherfruit', 'cherry'],
  ['fruity', 'otherfruit', 'pomegranate'],
  ['fruity', 'otherfruit', 'pineapple'],
  ['fruity', 'otherfruit', 'grape'],
  ['fruity', 'otherfruit', 'apple'],
  ['fruity', 'otherfruit', 'peach'],
  ['fruity', 'otherfruit', 'pear'],
  ['fruity', 'citrusfruit', 'grapefruit'],
  ['fruity', 'citrusfruit', 'orange'],
  ['fruity', 'citrusfruit', 'lemon'],
  ['fruity', 'citrusfruit', 'lime'],
  ['sourfermented', 'sour', 'souraromatics'],
  ['sourfermented', 'sour', 'aceticacid'],
  ['sourfermented', 'sour', 'butyricacid'],
  ['sourfermented', 'sour', 'malicacid'],
  ['sourfermented', 'alcoholfermented', 'winey'],
  ['sourfermented', 'alcoholfermented', 'whiskey'],
  ['sourfermented', 'alcoholfermented', 'fermented'],
  ['sourfermented', 'alcoholfermented', 'overripe'],
  ['greenvegetative', 'oliveoil', 'oliveoil'],
  ['greenvegetative', 'raw', 'raw'],
  ['greenvegetative', 'greenvegetative', 'underripe'],
  ['greenvegetative', 'greenvegetative', 'peapod'],
  ['greenvegetative', 'greenvegetative', 'fresh'],
  ['greenvegetative', 'greenvegetative', 'darkgreen'],
  ['greenvegetative', 'greenvegetative', 'vegetative'],
  ['greenvegetative', 'greenvegetative', 'haylike'],
  ['greenvegetative', 'greenvegetative', 'herblike'],
  ['greenvegetative', 'beany', 'beany'],
  ['other', 'papermusty', 'stale'],
  ['other', 'papermusty', 'cardboard'],
  ['other', 'papermusty', 'papery'],
  ['other', 'papermusty', 'woody'],
  ['other', 'papermusty', 'moldydamp'],
  ['other', 'papermusty', 'mustydusty'],
  ['other', 'papermusty', 'mustyearthy'],
  ['other', 'papermusty', 'animalic'],
  ['other', 'papermusty', 'meatybrothy'],
  ['other', 'papermusty', 'phenolic'],
  ['other', 'chemical', 'bitter'],
  ['other', 'chemical', 'salty'],
  ['other', 'chemical', 'medicinal'],
  ['other', 'chemical', 'petroleum'],
  ['other', 'chemical', 'skunky'],
  ['other', 'chemical', 'rubber'],
  ['roasted', 'pipetobacco', 'pipetobacco'],
  ['roasted', 'tobacco', 'tobacco'],
  ['roasted', 'burnt', 'acrid'],
  ['roasted', 'burnt', 'ashy'],
  ['roasted', 'burnt', 'smoky'],
  ['roasted', 'burnt', 'brownroast'],
  ['roasted', 'cereal', 'grain'],
  ['roasted', 'cereal', 'malt'],
  ['spices', 'pungent', 'pungent'],
  ['spices', 'pepper', 'pepper'],
  ['spices', 'brownspice', 'anise'],
  ['spices', 'brownspice', 'nutmeg'],
  ['spices', 'brownspice', 'cinnamon'],
  ['spices', 'brownspice', 'clove'],
  ['nuttycocoa', 'nutty', 'peanuts'],
  ['nuttycocoa', 'nutty', 'hazelnut'],
  ['nuttycocoa', 'nutty', 'almond'],
  ['nuttycocoa', 'cocoa', 'chocolate'],
  ['nuttycocoa', 'cocoa', 'darkchocolate'],
];
const filteredSeedData = new Set(seedData.flat());
const translationsData = {};

filteredSeedData.forEach((key) => {
  translationsData[key] = {
    en: en.tastes[key],
    ar: ar.tastes[key],
  };
});

// Print all translations keys - left in case of seed data changes
// console.log(
//   Object.fromEntries([...filteredSeedData].map((key) => [key, en.tastes[key] || key])),
//   Object.fromEntries([...filteredSeedData].map((key) => [key, ar.tastes[key] || key])),
// );

const createRecordWithChildren = (key) => {
  const { en: nameEn, ar: nameAr } = translationsData[key];
  return ({
    name: nameEn,
    translationName: { en: nameEn, ar: nameAr },
    children: {},
  });
};

const createRecordWithValue = (key) => {
  const { en: nameEn, ar: nameAr } = translationsData[key];
  return ({
    name: nameEn,
    translationName: { en: nameEn, ar: nameAr },
    value: 200,
  });
};

const formattedSeedData = {};
seedData.forEach((data) => {
  const [majorNote, minorNote, taste] = data;
  if (!formattedSeedData[majorNote]) formattedSeedData[majorNote] = createRecordWithChildren(majorNote);
  if (majorNote === minorNote) formattedSeedData[majorNote].children[taste] = createRecordWithValue(taste);
  if (majorNote !== minorNote && minorNote !== taste) {
    if (!formattedSeedData[majorNote].children[minorNote]) formattedSeedData[majorNote].children[minorNote] = createRecordWithChildren(minorNote);
    formattedSeedData[majorNote].children[minorNote].children[taste] = createRecordWithValue(taste);
  }
  if (majorNote !== minorNote && minorNote === taste) {
    formattedSeedData[majorNote].children[minorNote] = createRecordWithValue(minorNote);
  }
});

export const readyToUse = {
  name: en.common.taste,
  translationName: {
    en: en.common.taste,
    ar: ar.common.taste,
  },
  children: Object.values(formattedSeedData).map((l0) => ({
    ...l0,
    children: Object.values(l0.children).map((l1) => {
      const newL1 = { ...l1 };
      if (l1.children) newL1.children = Object.values(l1.children);
      return newL1;
    }),
  })),
};
