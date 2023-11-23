db = db.getSiblingDB("findings");

db.users.insert({
  username: "admin",
  local: {
    email: "admin@domain.tld",
    password: "$2b$12$J48JuCJdhFoKW98O/8KsauXGMYhPsB7xmLBwAtTWLhvjiIAynr0G.",
  },
  avatar: "/images/default-profile.svg",
  firstname: "Admin",
  lastname: "User",
  function: "Built-in Administrator",
  bio: "I'm just a default admin user",
  role: "admin",
  isVerified: true,
  twoFASecret: null,
  twoFAEnabled: false,
});