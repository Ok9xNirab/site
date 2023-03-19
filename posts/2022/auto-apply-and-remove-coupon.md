---
title: "WooCommerce auto apply & remove coupon"
path: "woocommerce-auto-apply-and-remove-coupon"
excerpt: "Apply coupon in cart based on certain conditions"
date: 2022-12-20
draft: true
tags: ["WooCommerce"]
image: "/images/woocommerce.jpeg"
---

It's very good idea to give your customer some discounts. You can increase your sells to give some discounts based on certain conditions.

These **certain conditions** can be something like :

- If anyone has equal OR greater than **X amount of items** in carts Then give **Y amount discount** in checkout as coupons.
- If anyone put **X quentity of items** in carts Then give **Y quentity discount** in checkout as coupons.
- Apply automatic coupon when anyone get into site via **specific custom url**.
- If **Subtotal** is greater than X then give Y discount.

and many more ...

You can do this in two ways.

1. Using third-party plugins
   > Checkout [Advance Coupons for Woocommerce](https://wordpress.org/plugins/advance-coupons-for-woocommerce/) plugin which can extends default WooCommerce coupon features.
2. Write own solution Programmatically

Lets take an example:

### If Subtotal is greater than X then give Y discount.

Here **Y discount** will be applied via **Y Coupon**.

```php
add_action('wp_head', 'apply_coupon_based_on_subtotal');

public function auto_coupon() {
   $counpon_id = 10; // provide coupon id
   $x_amount = 199;
   $applied_coupons  = WC()->cart->get_applied_coupons();
   $coupon_code = wc_get_coupon_code_by_id($coupon->ID);
   $subtotal = WC()->cart->get_subtotal();
   if (!in_array($coupon_code, $applied_coupons) && $subtotal > $x_amount) {
         WC()->cart->apply_coupon($coupon_code);
   }
}
```
