# Day 1 — Learning Summary

**Date:** 10 April 2026
**Project:** Ecommerce Auth Flow (React + FastAPI)

---

## 1. Project Structure

Folder layout inside `src/`:

| Folder | Purpose |
|--------|---------|
| `api/` | API call functions |
| `components/` | Reusable UI components |
| `config/` | Axios instance + API endpoints |
| `locales/` | `en.js` (strings) + `routes.js` (paths) |
| `pages/` | Page-level components |
| `routes/` | App routing setup |
| `validators/` | Yup schemas |

---

## 2. React Concepts

- Reusable components — `FormInput`, `FormButton`
- **Barrel exports** — `index.js` per folder so imports stay clean
  ```js
  import { Login, Register } from "../pages";
  ```

---

## 3. Routing

- Route paths stored in one file (`routes.js`) — no magic strings scattered around
- Used `BrowserRouter`, `Routes`, `Route`, `Link`

---

## 4. Formik — Form Handling

- `useFormik` with `initialValues`, `validationSchema`, `onSubmit`
- Destructure formik to keep JSX clean:
  ```js
  const {
    values: { email },
    touched: { email: touchedEmail },
    errors: { email: errorEmail },
    handleChange,
    handleSubmit,
  } = formik;
  ```

---

## 5. Yup — Validation

- Schema-based validation paired with Formik
- Key methods: `.string()`, `.email()`, `.required()`, `.min()`, `.oneOf()`, `.ref()`
- Factory function pattern so error messages come from `en.js`:
  ```js
  const createLoginSchema = (v) => yup.object({ ... });
  ```

---

## 6. en.js — String Externalization

- All UI text in one file, grouped by section (AUTH, LOGIN, REGISTER, VALIDATION …)
- Keys sorted in **ascending (A→Z) order**
- No hardcoded strings inside components
- Route paths kept separately in `routes.js`

---

## 7. Axios — API Setup

- Single `axiosInstance` created with `baseURL`, `timeout`, `headers` — reused everywhere
- API endpoint paths in `apiConfig.js`
- Base URL stored in `.env`:
  ```
  VITE_API_URL=http://127.0.0.1:8000
  ```
- Error handling:
  ```js
  err.response?.data?.detail ?? ERROR_FALLBACK
  // optional chaining (?.)  +  nullish coalescing (??)
  ```

---

## 8. React Toastify — Notifications

- `<ToastContainer>` placed once in `App.jsx`
- `successToast` / `errorToast` as separate util functions
- v11 fix: must pass `theme="light"` to avoid grey overlay bug

---

## 9. JS Patterns

- **Destructuring** — objects, nested, with aliases
- **Import order:**
  1. React / core
  2. External libraries
  3. Internal project files
  4. Styles / images / data
Formik

---

## 10. Axios Interceptors

- Axios interceptors run before a request leaves the app or after a response comes back.
- Request interceptor:
  ```js
  axiosInstance.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  ```
- Response interceptor:
  - catches global API errors
  - can log out the user on `401 Unauthorized`
  - avoids repeating the same token logic in every API file

---

## 11. Redux Auth Storage

- Redux keeps login credentials in one central store:
  - `token`
  - `username`
  - `email`
  - `role`
- Components read auth data with selectors instead of reading `localStorage` directly.
- The store can still persist auth data to `localStorage` so refresh does not immediately log the user out.
- Main flow:
  ```js
  dispatch(setCredentials(response));
  dispatch(clearCredentials());
  ```

---

## 12. Role-Based Auth

- Registration now stores a user role such as:
  - `customer`
  - `sales`
  - `support`
  - `admin`
- Login can send the selected role, but the backend verifies it against the saved account role.
- Never trust the role only from the frontend dropdown.
- JWT token payload includes the role so protected APIs can know what kind of user is logged in.

---

## 13. Role-Based Routing

- Admin users redirect to:
  ```txt
  /admin
  ```
- Customer, sales, and support users redirect to:
  ```txt
  /dashboard
  ```
- `ProtectedRoute` checks:
  - user is logged in
  - required role matches when a page is admin-only
- Admin dashboard and normal dashboard are separate components, so admins do not see the same buying/product dashboard as customers.

---

## 14. PostgreSQL Auth Mode

- `VITE_AUTH_MODE=api` uses the FastAPI backend instead of local demo users.
- Signup data is stored in PostgreSQL in the `users` table.
- The backend database URL is stored in:
  ```txt
  backend/.env
  ```
- Current local DB URL:
  ```txt
  postgresql://postgres@localhost:5433/reactproject
  ```
- SQLAlchemy creates the table from `backend/models/user.py`.
- Passwords are not stored as plain text in PostgreSQL; the backend stores `hashed_password`.
- After successful login, only the active session is stored in Redux.

---

## 15. Local Auth Mode

- `VITE_AUTH_MODE=local` skips the backend login request and checks users from `src/data/users.js`.
- Demo credentials live in:
  ```txt
  src/data/users.js
  ```
- After login, the active session is stored in Redux:
  ```js
  dispatch(setCredentials(response));
  ```
- Redux persists the active session to browser `localStorage` using:
  ```txt
  authCredentials
  ```
- Newly registered local users cannot be written back to source files from the browser, so they are saved in browser `localStorage` using:
  ```txt
  localUsers
  ```
