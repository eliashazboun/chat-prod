export const strip = (item) => {
  let res;
  try {
    res = item.replace(/\s/g, "");
  } catch (err) {
    return item;
  }
  return res;
};

export const sortUsers = (userList) => {
  const admins = userList.filter((item) => item.admin);
  const users = userList.filter((item) => !item.admin);

  users.sort((a, b) => (a.name < b.name ? -1 : 1));
  admins.sort((a, b) => (a.name < b.name ? -1 : 1));

  return admins.concat(users);
};
