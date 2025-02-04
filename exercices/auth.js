// Génération du token en Base64
function generateToken(user) {
    const userString = JSON.stringify(user);
    return btoa(userString); // Encode en Base64
}

// Vérification et décodage du token
function verifyToken(token) {
    const decodedString = atob(token); // Décode le Base64
    return JSON.parse(decodedString);
}

// TEST
const user = { id: 1, username: "nora", role: "admin" };
const token = generateToken(user);
console.log("Token:", token);

const decodedUser = verifyToken(token);
console.log("Utilisateur décodé:", decodedUser);
