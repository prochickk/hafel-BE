const drivers = [
  {
    id: 1,
    name: "Mosh",
    email: "mosh@domain.com",
    password: "12345",
    addresses: {latitude: 7, longitude: 7}
  },
  {
    id: 2,
    name: "John",
    email: "john@domain.com",
    password: "12345",
    addresses: {latitude: 7, longitude: 7}
  },
];

const getDrivers = () => drivers;

const getDriverById = (id) => drivers.find((driver) => driver.id === id);

const getDriverByEmail = (email) => drivers.find((driver) => driver.email === email);

const addDriver = (driver) => {
  driver.id = drivers.length + 1;
  drivers.push(driver);
};

module.exports = {
  getDrivers,
  getDriverByEmail,
  getDriverById,
  addDriver,
};
