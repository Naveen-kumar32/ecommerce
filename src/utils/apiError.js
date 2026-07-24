export const getApiErrorMessage = (err, fallback) => {
  const detail = err.response?.data?.detail;

  return typeof detail === "string"
    ? detail
    : Array.isArray(detail)
    ? detail[0]?.msg || detail[0] || JSON.stringify(detail)
    : err.response?.data?.message || err.message || fallback;
};
