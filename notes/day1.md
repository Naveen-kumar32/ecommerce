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

