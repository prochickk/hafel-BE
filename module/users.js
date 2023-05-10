const users = [
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

const getUsers = () => users;

const getUserById = (id) => users.find((user) => user.id === id);

const getUserByEmail = (email) => users.find((user) => user.email === email);

const addUser = (user) => {
  user.id = users.length + 1;
  users.push(user);
};

module.exports = {
  getUsers,
  getUserByEmail,
  getUserById,
  addUser,
};
