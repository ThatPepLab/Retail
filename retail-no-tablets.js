(() => {
  const isTabletProduct = (product) => Array.isArray(product?.items) && product.items.some((item) => String(item?.packageUnit || "").trim().toLowerCase() === "tablet");

  function removeTabletProducts() {
    if (typeof state === "undefined" || !Array.isArray(state.products)) return false;

    const before = state.products.length;
    state.products = state.products.filter((product) => !isTabletProduct(product));

    if (typeof categorySelect !== "undefined" && categorySelect) {
      [...categorySelect.options].forEach((option) => {
        if (String(option.value || option.textContent || "").trim().toLowerCase() === "tablets") option.remove();
      });
      if (String(categorySelect.value || "").trim().toLowerCase() === "tablets") categorySelect.value = "all";
    }

    if (typeof state.selectedProduct !== "undefined" && isTabletProduct(state.selectedProduct)) {
      state.selectedProduct = null;
      state.selectedStrength = "";
      if (typeof selection !== "undefined" && selection) selection.hidden = true;
      if (typeof search !== "undefined" && search) search.value = "";
    }

    if (state.products.length !== before) {
      if (typeof renderCatalog === "function") renderCatalog();
      if (typeof renderSuggestions === "function") renderSuggestions();
      if (typeof renderQuickList === "function") renderQuickList();
      return true;
    }
    return false;
  }

  let attempts = 0;
  const timer = setInterval(() => {
    attempts += 1;
    removeTabletProducts();
    if ((typeof state !== "undefined" && state.catalogLoaded) || attempts >= 40) clearInterval(timer);
  }, 250);

  document.addEventListener("DOMContentLoaded", removeTabletProducts, { once: true });
})();
