db = db.getSiblingDB("findings");

db.users.insert({
  username: "admin",
  local: {
    email: "admin@example.com",
    password: "$2b$12$J48JuCJdhFoKW98O/8KsauXGMYhPsB7xmLBwAtTWLhvjiIAynr0G.", // Replace with the copied hashed value
  },
  avatar: "/images/default-profile.svg",
  firstname: "Admin",
  lastname: "User",
  function: "Administrator",
  bio: "Default admin user",
  role: "admin",
  twoFASecret: null,
  twoFAEnabled: false,
});
