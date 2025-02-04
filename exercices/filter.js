// Tableau de test
const users = [
    { id: 1, username: "nora", role: "admin" },
    { id: 2, username: "ayoub", role: "user" },
    { id: 3, username: "sara", role: "user" },
];

// Fonction de filtrage
function filterUsersByRole(users, role) {
    return users.filter(user => user.role === role);
}

// TEST
console.log("Admins :", filterUsersByRole(users, "admin"));
console.log("Users :", filterUsersByRole(users, "user"));
