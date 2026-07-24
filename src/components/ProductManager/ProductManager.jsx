// Third-party
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Components
import { FormButton, FormInput, PageHeader } from "../index";

// API
import {
  createCategory,
  createProduct,
  deleteProduct,
  getCategories,
  getMyProducts,
  getProductImageUrl,
  updateProduct,
} from "../../api/productApi";

// Constants / Locales
import en from "../../locales/en";

// Utils
import { showError } from "../../utils/errorToast";
import { showSuccess } from "../../utils/successToast";

// Styles
import "./ProductManager.css";

const emptyForm = {
  name: "",
  price: "",
  quantity: "",
  description: "",
  category_id: "",
};

const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const ProductManager = ({ backLinkTo, kicker, subtitle, title }) => {
  const {
    COMMON: { CANCEL, DELETE, LOADING },
    PRODUCT_MANAGER: {
      ADD_BUTTON,
      ADD_CATEGORY_BUTTON,
      CATEGORY_PLACEHOLDER,
      DELETE_CONFIRM,
      DELETE_SUCCESS,
      DESCRIPTION_PLACEHOLDER,
      EDIT_BUTTON,
      EMPTY_STATE,
      FORM_TITLE_ADD,
      FORM_TITLE_EDIT,
      IMAGE_LABEL,
      NAME_PLACEHOLDER,
      NEW_CATEGORY_PLACEHOLDER,
      PRICE_PLACEHOLDER,
      QUANTITY_PLACEHOLDER,
      SAVE_BUTTON,
      SAVE_SUCCESS,
      SAVING_BUTTON,
      TABLE,
    },
  } = en;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState(emptyForm);
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productList, categoryList] = await Promise.all([getMyProducts(), getCategories()]);
      setProducts(productList);
      setCategories(categoryList);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddForm = () => {
    setEditingId(null);
    setFormValues(emptyForm);
    setImageDataUrl(null);
    setFormOpen(true);
  };

  const openEditForm = (product) => {
    setEditingId(product.id);
    setFormValues({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      description: product.description ?? "",
      category_id: product.category_id ?? "",
    });
    setImageDataUrl(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    setImageDataUrl(dataUrl);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const category = await createCategory(newCategoryName.trim());
      setCategories((prev) => [...prev, category]);
      setFormValues((prev) => ({ ...prev, category_id: category.id }));
      setNewCategoryName("");
    } catch (err) {
      showError(err.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    const payload = {
      name: formValues.name,
      price: Number(formValues.price),
      quantity: Number(formValues.quantity),
      description: formValues.description || null,
      category_id: formValues.category_id ? Number(formValues.category_id) : null,
    };

    if (imageDataUrl) {
      payload.image_base64 = imageDataUrl;
    }

    try {
      if (editingId) {
        const updated = await updateProduct(editingId, payload);
        setProducts((prev) => prev.map((product) => (product.id === editingId ? updated : product)));
      } else {
        const created = await createProduct(payload);
        setProducts((prev) => [created, ...prev]);
      }

      showSuccess(SAVE_SUCCESS);
      closeForm();
    } catch (err) {
      showError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(DELETE_CONFIRM)) return;

    try {
      await deleteProduct(product.id);
      setProducts((prev) => prev.filter((item) => item.id !== product.id));
      showSuccess(DELETE_SUCCESS);
    } catch (err) {
      showError(err.message);
    }
  };

  const categoryName = (categoryId) => categories.find((category) => category.id === categoryId)?.name ?? "—";

  return (
    <div className="product-manager-body">
      <PageHeader
        kicker={kicker}
        title={title}
        subtitle={subtitle}
        actions={(
          <div className="product-manager-hero-actions">
            {backLinkTo && <Link className="product-manager-back-link" to={backLinkTo}>{CANCEL}</Link>}
            <button type="button" className="product-manager-add-btn" onClick={openAddForm}>
              {ADD_BUTTON}
            </button>
          </div>
        )}
      />

      {formOpen && (
        <section className="product-manager-panel">
          <h2>{editingId ? FORM_TITLE_EDIT : FORM_TITLE_ADD}</h2>
          <form onSubmit={handleSubmit} className="product-manager-form">
            <FormInput
              type="text"
              name="name"
              placeholder={NAME_PLACEHOLDER}
              value={formValues.name}
              onChange={handleChange}
            />
            <FormInput
              type="number"
              name="price"
              placeholder={PRICE_PLACEHOLDER}
              value={formValues.price}
              onChange={handleChange}
            />
            <FormInput
              type="number"
              name="quantity"
              placeholder={QUANTITY_PLACEHOLDER}
              value={formValues.quantity}
              onChange={handleChange}
            />
            <FormInput
              type="select"
              name="category_id"
              placeholder={CATEGORY_PLACEHOLDER}
              value={formValues.category_id}
              onChange={handleChange}
              options={categories.map((category) => ({ label: category.name, value: category.id }))}
            />
            <div className="product-manager-new-category">
              <input
                type="text"
                placeholder={NEW_CATEGORY_PLACEHOLDER}
                value={newCategoryName}
                onChange={(event) => setNewCategoryName(event.target.value)}
              />
              <button type="button" onClick={handleAddCategory}>{ADD_CATEGORY_BUTTON}</button>
            </div>
            <FormInput
              type="text"
              name="description"
              placeholder={DESCRIPTION_PLACEHOLDER}
              value={formValues.description}
              onChange={handleChange}
            />
            <label className="product-manager-image-label">
              {IMAGE_LABEL}
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </label>
            {imageDataUrl && <img className="product-manager-preview" src={imageDataUrl} alt="" />}

            <div className="product-manager-form-actions">
              <FormButton
                type="submit"
                disabled={saving}
                loading={saving}
                label={SAVE_BUTTON}
                loadingLabel={SAVING_BUTTON}
              />
              <button type="button" className="product-manager-cancel-btn" onClick={closeForm}>
                {CANCEL}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="product-manager-panel">
        {loading ? (
          <p>{LOADING}</p>
        ) : products.length === 0 ? (
          <p>{EMPTY_STATE}</p>
        ) : (
          <table className="product-manager-table">
            <thead>
              <tr>
                <th />
                <th>{TABLE.NAME}</th>
                <th>{TABLE.PRICE}</th>
                <th>{TABLE.STOCK}</th>
                <th>{TABLE.CATEGORY}</th>
                <th>{TABLE.ACTIONS}</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    {product.has_image && (
                      <img className="product-manager-thumb" src={getProductImageUrl(product.id)} alt="" />
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>${Number(product.price).toFixed(2)}</td>
                  <td>{product.quantity}</td>
                  <td>{categoryName(product.category_id)}</td>
                  <td className="product-manager-row-actions">
                    <button type="button" onClick={() => openEditForm(product)}>{EDIT_BUTTON}</button>
                    <button type="button" className="product-manager-delete-btn" onClick={() => handleDelete(product)}>
                      {DELETE}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default ProductManager;
