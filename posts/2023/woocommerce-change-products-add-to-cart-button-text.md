---
title: "WooCommerce : Change product's add-to-cart button text"
path: "woocommerce-change-products-add-to-cart-button-text"
excerpt: "Change the add-to-cart button text of WooCommerce products with plugins or with two filter hooks."
date: 2023-09-22
draft: false
tags: ["WooCommerce"]
---

#### No code solutions

You can easily do this with these Free Plugins

- [Custom Add To Cart Button for WooCommerce](https://wordpress.org/plugins/woo-custom-add-to-cart-button/)
- [Add to Cart Button Custom Text](https://wordpress.org/plugins/add-to-cart-button-custom-text/)

#### Coding Solutions

To change product text, You'll need to use two filter hooks

```
woocommerce_product_single_add_to_cart_text
```

This hook is defined in **woocommerce/includes/class-wc-product-external.php:171** and used to filter out add_to_cart button text value for single page only.

```php
	/**
	 * Get the add to cart button text for the single page.
	 *
	 * @access public
	 * @return string
	 */
	public function single_add_to_cart_text() {
		return apply_filters( 
		  'woocommerce_product_single_add_to_cart_text', 
		  $this->get_button_text() ? 
		      $this->get_button_text() :
		       _x( 'Buy product', 'placeholder', 'woocommerce' ), 
		  $this 
		);
	}
```

Have 2-parameters

1. Actual Add to Cart Button text
2. Product Object

To change add_to_cart across all type of products list, You'll need to use this hook :

```
woocommerce_product_add_to_cart_text
```

This hook is also defined in the same file as the previous hook.

```php
	/**
	 * Get the add to cart button text.
	 *
	 * @access public
	 * @return string
	 */
	public function add_to_cart_text() {
		return apply_filters( 
		  'woocommerce_product_add_to_cart_text', 
		  $this->get_button_text() ? 
		    $this->get_button_text() : 
		    _x( 'Buy product', 'placeholder', 'woocommerce' ), 
		  $this 
		);
	}
```

also contains 2 parameters like the last hook.

Let's see some examples.

#### All Products

```php
<?php

// Change add to cart text on single product page
add_filter( 
  'woocommerce_product_single_add_to_cart_text', 
  'change_button_text_single' 
); 
function change_button_text_single($text) {
    return __( 'Buy Now', 'text-domain' ); 
}

// Change add to cart text on product list page
add_filter( 
  'woocommerce_product_add_to_cart_text', 
  'change_button_text_lists' 
);  
function change_button_text_lists($text) {
    return __( 'Buy Now', 'text-dmain' );
}
```

#### Only Simple Products

```php
<?php

// Change add to cart text on single product page
add_filter( 
'woocommerce_product_single_add_to_cart_text', 
'change_button_text_single', 10, 2 ); 
function change_button_text_single($text, $product) {
    if ( "simple" === $product->get_type() ) {
      return __( 'Buy Now', 'text-domain' );
    } 
    
    return $text;
}

// Change add to cart text on product list page
add_filter( 
  'woocommerce_product_add_to_cart_text', 
  'change_button_text_lists', 10, 2 );  
function change_button_text_lists($text, $product) {
    if ( "simple" === $product->get_type() ) {
      return __( 'Buy Now', 'text-domain' );
    } 
    
    return $text;
}
```

#### Only Digital products

First, We need to check if the product is virtual. If the product is virtual then just return the Text else return the default text.

```php
// Change add to cart text on single product page
add_filter(
  'woocommerce_product_single_add_to_cart_text', 
  'change_button_text_single', 10, 2);
function change_button_text_single($text, $product)
{
    // check if product is virtual
    if (true === $product->get_meta('_virtual')) {
        return __('Get Now', 'text-domain');
    }

    return $text;
}

// Change add to cart text on product list page
add_filter(
  'woocommerce_product_add_to_cart_text', 
  'change_button_text_lists', 10, 2);
function change_button_text_lists($text, $product)
{
    // check if product is virtual
    if (true === $product->get_meta('_virtual')) {
        return __('Get Now', 'text-domain');
    }

    return $text;
}
```

Thanks.
