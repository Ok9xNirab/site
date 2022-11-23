---
title: "WooCommerce change price programmatically"
path: "woocommerce-change-price-programmatically"
excerpt: "Change WooCommerce product price ( simple & variable )"
date: 2022-09-25
tags: ["WooCommerce"]
---

To change existing product price on WooCommerce via programmatically , You need to use these filter Hooks :

```php
<?php

add_filter( 'woocommerce_product_get_regular_price', 'custom_dynamic_regular_price', 10, 2 );
add_filter( 'woocommerce_product_get_price', 'custom_dynamic_sale_price', 10, 2 );
add_filter( 'woocommerce_product_variation_get_price', 'custom_dynamic_sale_price', 10, 2 );
```

## Simple Product

If product type is **simple** or it’s based on **WC_Product_Simple** class , You might be use these simple product related filter hooks only :

```php
<?php

add_filter( 'woocommerce_product_get_regular_price', 'function_for_logic', 10, 2 );
add_filter( 'woocommerce_product_get_price', 'function_for_logic', 10, 2 );
```

EXAMPLE :

> update regular price

```php
<?php

add_filter('woocommerce_product_get_regular_price', 'update_regular_price', 10, 2);

function update_regular_price($regular_price, $product) {
   // some logic happen here

   return $regular_price;
}

```

> update sale price

```php
<?php

add_filter('woocommerce_product_get_price', 'update_sale_price', 10, 2);

function update_sale_price($price, $product) {
   // some logic happen here

   return $price;
}

```

## Variable Product

To update variation price you need to use these hooks :

```php
<?php

add_filter( 'woocommerce_product_variation_get_price', 'custom_dynamic_sale_price', 10, 2 );
add_filter( 'woocommerce_variation_prices_price', 'custom_dynamic_sale_price', 10, 2 );
add_filter( 'woocommerce_variation_prices_sale_price', 'custom_dynamic_sale_price', 10, 2 );
```

EXAMPLE :

> update variation price

```php
<?php

add_filter('woocommerce_product_variation_get_price', 'update_variation_price', 10, 2);

function update_variation_price($price, $variation) {
  // some logic happen here

  return $price;
}
```

Thanks.
