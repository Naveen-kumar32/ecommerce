import { USERS } from "../data/users";

export const loginApi = ({ email, password }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const user = USERS.find(
          (u) => u.email === email && u.password === password
        );

        if (!user) {
          throw new Error("Invalid email or password");
        }

        resolve({
          status: 200,
          data: user,
        });
      } catch (err) {
        reject({
          status: 401,
          message: err.message,
        });
      }
    }, 1000);
  });
};