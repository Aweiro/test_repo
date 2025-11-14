self.__BUILD_MANIFEST = {
  "/": [
    "static/chunks/pages/index.js"
  ],
  "/[...all]": [
    "static/chunks/pages/[...all].js"
  ],
  "/[category]": [
    "static/chunks/pages/[category].js"
  ],
  "/[category]/[productId]": [
    "static/chunks/pages/[category]/[productId].js"
  ],
  "/_error": [
    "static/chunks/pages/_error.js"
  ],
  "/cart": [
    "static/chunks/pages/cart.js"
  ],
  "/favorites": [
    "static/chunks/pages/favorites.js"
  ],
  "__rewrites": {
    "afterFiles": [],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/",
    "/_app",
    "/_error",
    "/cart",
    "/components/CategoriesBlock/CategoriesBlock",
    "/favorites",
    "/[category]",
    "/[category]/CatalogPage/CatalogPage",
    "/[category]/ProductDetailsPage",
    "/[category]/ProductDetailsPage/ProductDetailsPage",
    "/[category]/[productId]",
    "/[...all]"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()