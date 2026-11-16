import test from "node:test";
import assert from "node:assert/strict";
import { products, collections } from "../lib/mock-data/catalog";
import {
  totals,
  filterProducts,
  recommend,
  type ProductFilters,
} from "../lib/utils/commerce";
import { orderService, customerService, paymentService } from "../lib/services";
import { useShop } from "../stores/shop";
const defaults: ProductFilters = {
  search: "",
  fabric: "",
  color: "",
  occasion: "",
  availability: "",
  maxPrice: 35000,
  sort: "featured",
};
test("catalog has unique routes, resolvable collections and complete textile data", () => {
  assert.equal(products.length, 24);
  assert.equal(new Set(products.map((p) => p.slug)).size, 24);
  for (const p of products) {
    assert.ok(
      p.collections.every((s) => collections.some((c) => c.slug === s)),
    );
    assert.ok(p.images.length >= 3);
    assert.equal(p.macroImages.length, 6);
    assert.ok(p.price > 0);
    assert.ok(p.sample);
    assert.ok(p.composition && p.dimensions && p.blouse && p.care.length);
  }
  for (const c of collections)
    assert.ok(products.some((p) => p.collections.includes(c.slug)));
});
test("filters combine and sorting is numerical", () => {
  const result = filterProducts(products, {
    ...defaults,
    fabric: "Kanjivaram Silk",
    maxPrice: 22000,
    occasion: "Wedding",
    availability: "available",
    sort: "price-asc",
  });
  assert.ok(result.length > 0);
  assert.ok(
    result.every(
      (p) =>
        p.fabric === "Kanjivaram Silk" &&
        p.price <= 22000 &&
        p.occasions.includes("Wedding"),
    ),
  );
  const descending = filterProducts(products, {
    ...defaults,
    sort: "price-desc",
  });
  assert.ok(
    descending.every((p, i) => i === 0 || descending[i - 1].price >= p.price),
  );
  assert.equal(
    filterProducts(products, { ...defaults, search: "nothing-will-match" })
      .length,
    0,
  );
  assert.equal(
    filterProducts(products, { ...defaults, search: "neelambari" })[0].id,
    products[0].id,
  );
});
test("totals apply only the documented demo coupon", () => {
  const lines = [
    { productId: products[0].id, variantId: "original", quantity: 2 },
    { productId: products[1].id, variantId: "original", quantity: 1 },
  ];
  const subtotal = products[0].price * 2 + products[1].price;
  assert.deepEqual(totals(lines, products, " DRAPE10 "), {
    subtotal,
    discount: Math.round(subtotal * 0.1),
    total: subtotal - Math.round(subtotal * 0.1),
  });
  assert.equal(totals(lines, products, "INVALID").discount, 0);
  assert.equal(totals([], products).total, 0);
});
test("recommendations respect budget and availability, then rank preference fit", () => {
  const matches = recommend(products, {
    occasion: "Everyday",
    budget: 7000,
    fabric: "Cotton Classics",
    color: "Crimson",
    style: "Contemporary",
    drape: "Lightweight",
  });
  assert.ok(matches.length > 0);
  assert.ok(
    matches.every((p) => p.price <= 7000 && p.inventory === "available"),
  );
  assert.equal(matches[0].fabric, "Cotton Classics");
  assert.deepEqual(
    recommend(products, {
      occasion: "Wedding",
      budget: 1,
      fabric: "Organza",
      color: "Rose",
      style: "Traditional",
      drape: "Structured",
    }),
    [],
  );
});
test("bag merges variants, caps quantities, removes lines and toggles wishlist", () => {
  useShop.setState({ lines: [], wishlist: [] });
  const s = useShop.getState();
  const id = products[0].id;
  s.add(id, "original", 2);
  s.add(id, "original", 3);
  assert.equal(useShop.getState().lines[0].quantity, 5);
  s.add(id, "champagne", 2);
  assert.equal(useShop.getState().lines.length, 2);
  s.changeVariant(id, "champagne", "original");
  assert.equal(useShop.getState().lines.length, 1);
  assert.equal(useShop.getState().lines[0].quantity, 7);
  s.update(id, "original", 100);
  assert.equal(useShop.getState().lines[0].quantity, 10);
  s.add(products[23].id, "original");
  assert.equal(useShop.getState().lines.length, 1);
  s.toggleWish(id);
  assert.deepEqual(useShop.getState().wishlist, [id]);
  s.toggleWish(id);
  assert.deepEqual(useShop.getState().wishlist, []);
  s.update(id, "original", 0);
  assert.equal(useShop.getState().lines.length, 0);
});
test("orders reject invalid lines and remain explicit simulations", async () => {
  await assert.rejects(() => orderService.createDemo([]));
  await assert.rejects(() =>
    orderService.createDemo([
      { productId: products[23].id, variantId: "original", quantity: 1 },
    ]),
  );
  await assert.rejects(() =>
    orderService.createDemo([
      { productId: products[0].id, variantId: "original", quantity: 1.5 },
    ]),
  );
  const order = await orderService.createDemo(
    [{ productId: products[0].id, variantId: "original", quantity: 2 }],
    "DRAPE10",
  );
  assert.equal(order.status, "demo-confirmed");
  assert.ok(order.id.startsWith("DEMO-"));
  assert.equal(order.total, products[0].price * 1.8);
  assert.ok(!("address" in order));
  assert.equal(await customerService.current(), null);
  assert.equal((await paymentService.capabilities()).enabled, false);
});

test('guest bag and wishlist survive binding to the checkout customer',()=>{
  useShop.setState({customerId:null,lines:[],wishlist:[]});
  const state=useShop.getState();
  state.add(products[0].id,'original',2);
  state.toggleWish(products[0].id);
  state.bindCustomer('checkout-test-customer');
  assert.equal(useShop.getState().lines[0].quantity,2);
  assert.deepEqual(useShop.getState().wishlist,[products[0].id]);
  state.bindCustomer(null);
  assert.equal(useShop.getState().lines.length,0);
});
