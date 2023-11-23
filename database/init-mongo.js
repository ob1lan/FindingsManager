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
  function: "Built-in Administrator",
  bio: "I'm just a default admin user",
  role: "admin",
  isVerified: true,
  twoFASecret: null,
  twoFAEnabled: false,
});

console.log("User admin created and activated");
