const categories = [{
  id:1,
  dayCateIdL:1,
  addressCateIdL: 2,
  typeCateLabelL: "المباركية - الـمحـدود",
  timeCateLabelL: "9:00-9:50",
  describtionL: ""
} ,
{
  id:1,
  dayCateIdL:2,
  addressCateIdL: 3,
  typeCateLabelL: "الشـهـابية - الـمزروعية",
  timeCateLabelL: "8:00-8:50",
  describtionL: ""
},
{
  id:1,
  dayCateIdL:1,
  addressCateIdL: 2,
  typeCateLabelL: "المباركية - الـمحـدود",
  timeCateLabelL: "9:00-9:50",
  describtionL: ""
} 
];

const nearLocCates = [
  {
    id: 11,
    name: "المباركية - الـمحـدود",
    icon: "floor-lamp",
    backgroundColor: "#fc5c65",
    color: "white"
  },
  {
    id: 22,
    name: "الشـهـابية - الـمزروعية",
    icon: "car",
    backgroundColor: "#fd9644",
    color: "white"
  },
  {
    id: 33,
    name: "الخـالـدية - المـعلـمين",
    icon: "camera",
    backgroundColor: "#fed330",
    color: "white"
  },
];

const addressCates = [
  {
    id: 1,
    name: "الأحد",
    nearLocCatesId: 22,
    color: "white",
  },
  {
    id: 2,
    name: "المباركية",
    nearLocCatesId: 33,
    color: "white",
  },
  {
    id: 3,
    name: "المزرررع",
    nearLocCatesId: 11,
    color: "white",
  },
]

const getCategories = () => categories;
const getCategory = id => categories.find(c => c.id === id);

const getNearLocCates = () => nearLocCates;
const getNearLocCate = id => nearLocCates.find(c => c.id === id);

const getAddressCates = () => addressCates;
const getAddressCate = id => addressCates.find(c => c.id === id);

module.exports = {
  getCategories,
  getCategory,

  getAddressCates,
  getAddressCate,

  getNearLocCates,
  getNearLocCate

};
