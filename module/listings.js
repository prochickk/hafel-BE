const listings = [
  {
    id: 1,
    typeCateLabelL: "ذهــاب للـجامـعـة",
    dayCateIdL: 4,
    addressCateIdL: 4,
    timeCateLabelL: "9:00-9:50",
  },
  {
    id: 2,
    typeCateLabelL: "عـودة من الجامعة",
    dayCateIdL: 1,
    addressCateIdL: 1,
    timeCateLabelL: "6:00-6:50",
  },
  {
    id: 3,
    typeCateLabelL: "ذهــاب للـجامـعـة",
    dayCateIdL: 2,
    addressCateIdL: 5,
    timeCateLabelL: "7:00-7:50",
  },
  
];

const addListing = (listing) => {
  listing.id = listings.length + 1;
  listings.push(listing);
};

const getListings = () => listings;

const getListing = (id) => listings.find((listing) => listing.id === id);

const filterListings = (predicate) => listings.filter(predicate);

module.exports = {
  addListing,
  getListings,
  getListing,
  filterListings,
};
