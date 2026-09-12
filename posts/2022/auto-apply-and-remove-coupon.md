---
title: "WooCommerce auto apply & remove coupon"
path: "woocommerce-auto-apply-and-remove-coupon"
excerpt: "Apply coupon in cart based on certain conditions"
date: 2022-12-20
draft: false
tags: ["WooCommerce"]
image: "/images/woocommerce.jpeg"
---

It's very good idea to give your customer some discounts. You can increase your sales to give some discounts based on certain conditions.

These **certain conditions** can be something like :

- If anyone has equal OR greater than **X amount of items** in carts Then give **Y amount discount** in checkout as coupons.
- If anyone put **X quantity of items** in carts Then give **Y quantity discount** in checkout as coupons.
- Apply automatic coupon when anyone get into site via **specific custom url**.
- If **Subtotal** is greater than X then give Y discount.

and many more ...

You can do this in two ways.

1. Using third-party plugins
   > Checkout [Advance Coupons for Woocommerce](https://wordpress.org/plugins/advance-coupons-for-woocommerce/) plugin which can extends default WooCommerce coupon features.
2. Write own solution Programmatically

Lets take an example:

### If Subtotal is greater than X then give Y discount.

Here **Y discount** will be applied via **Y Coupon**. So the coupon must be created first in **Marketing > Coupons**. We only apply it from code, we don't create it from code.

```php
<?php

add_action('woocommerce_before_cart', 'auto_coupon');
add_action('woocommerce_before_checkout_form', 'auto_coupon');

function auto_coupon() {
   $coupon_code = 'over199'; // your existing coupon code
   $x_amount    = 199;

   $applied_coupons = WC()->cart->get_applied_coupons();
   $subtotal        = WC()->cart->get_subtotal();

   if (!in_array($coupon_code, $applied_coupons) && $subtotal > $x_amount) {
      WC()->cart->apply_coupon($coupon_code);
   }
}
```

`woocommerce_before_cart` covers the cart page and `woocommerce_before_checkout_form` covers the checkout page. Don't use `wp_head` or `init` here, cart is not ready that early.

### Now remove it

Apply is the easy half. The real problem starts when customer removes a product and subtotal goes down to 150, but the coupon is still sitting there. Customer gets the discount without the condition. So the same function have to remove it back :

```php
<?php

add_action('woocommerce_before_cart', 'auto_coupon');
add_action('woocommerce_before_checkout_form', 'auto_coupon');

function auto_coupon() {
   $coupon_code = 'over199';
   $x_amount    = 199;

   $applied_coupons = WC()->cart->get_applied_coupons();
   $subtotal        = WC()->cart->get_subtotal();
   $has_coupon      = in_array($coupon_code, $applied_coupons);

   if ($subtotal > $x_amount) {
      if (!$has_coupon) {
         WC()->cart->apply_coupon($coupon_code);
      }
   } else {
      if ($has_coupon) {
         WC()->cart->remove_coupon($coupon_code);
      }
   }
}
```

One thing to keep in mind, `remove_coupon()` only removes the code you pass. Manually entered coupons of the customer stays untouched, which is what we want.

### Same thing with quantity

If your condition is quantity instead of money, only the check part changes :

```php
<?php

$count = WC()->cart->get_cart_contents_count();

if ($count >= 3) {
   // apply
} else {
   // remove
}
```

### Some notes

> **Check the coupon really exists.**

If somebody deletes the coupon from admin, `apply_coupon()` will throw a notice on every page load. A small guard saves you :

```php
<?php

if (wc_get_coupon_id_by_code($coupon_code) == 0) return;
```

> **The notices.**

WooCommerce prints "Coupon code applied successfully." and "Coupon has been removed." every time. Customer didn't do anything, so it looks strange. You can clear them :

```php
<?php

WC()->cart->apply_coupon($coupon_code);
wc_clear_notices();
```

Better way is to clear only the coupon ones and show your own message, but for most shops `wc_clear_notices()` after the apply is enough.

> **Individual use only.**

If your auto coupon is marked as **Individual use only**, applying it will kick out the coupon customer typed by hand. Customer will not be happy. Keep the auto coupon normal unless you really need it.

> **Don't do it inside `woocommerce_before_calculate_totals`.**

Looks tempting because it runs everywhere, but `get_subtotal()` is not calculated yet at that point and applying a coupon there triggers the totals again. You get a loop. Stick with the cart & checkout hooks.

**Thanks.**
