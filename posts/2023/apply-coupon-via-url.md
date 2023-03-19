---
title: "WooCommerce apply coupon via url"
path: "apply-coupon-via-url"
excerpt: "Apply woocommerce coupon via custom url"
date: 2023-03-19
draft: false
tags: ["WooCommerce"]
image: "/images/woocommerce.jpeg"
---

If you're unfamiliar with Programming then you may checkout

> [Advance Coupons for Woocommerce](https://wordpress.org/plugins/advance-coupons-for-woocommerce/) plugin which can extends default WooCommerce coupon features.

The example url must be look like:

```
https://springdevs.com/?coupon_code=DiscountCode
```

At first You need to check url & find coupon code. Then you need to set code into session because of You can't run
`WC()->cart->apply_coupon($coupon_code)` on `init` hook for some valid reasons.

```php
add_action('init', "set_coupon_url");

function set_coupon_url() {
   if (isset($_GET['coupon_code'])) {
      $coupon_code = esc_url($_GET['coupon_code']);
      WC()->session->set('coupon_code', $coupon_code);
   }
}
```

Now, Check coupon is valid or Already not inserted in cart and apply coupon.

```php
add_action("woocommerce_add_to_cart", "apply_coupon_via_url");
add_action("woocommerce_before_cart", "apply_coupon_via_url");

function apply_coupon_via_url() {
   $coupons = WC()->cart->get_applied_coupons();
   $code = WC()->session->get('coupon_code');
   $coupon_id = wc_get_coupon_id_by_code($code);

   // if coupon is invalid then return;
   if ($coupon_id == 0) return;

   if (in_array($code, $coupons)) {
         WC()->session->__unset('coupon_code');
   } else {
         WC()->cart->apply_coupon($code);
         WC()->session->__unset('coupon_code');
   }
}
```

**Thanks.**
