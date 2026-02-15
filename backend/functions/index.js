const functions = require("firebase-functions");
const fetch = require("node-fetch");

// вызывается при удалении пользователя из Firebase Auth
exports.deleteUserInBackend = functions.auth.user().onDelete(async (user) => {
  try {
    console.log("User deleted:", user.uid);

    await fetch("http://localhost:8080/api/users/delete-by-uid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authUid: user.uid,
      }),
    });

    console.log("User removed from PostgreSQL");
  } catch (error) {
    console.error("Error deleting user in backend:", error);
  }
});
