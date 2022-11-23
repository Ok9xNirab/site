---
title: "Enqueue CSS and JS in WP"
path: "enqueue-css-js-wordpress"
excerpt: "Add your JavaScript & CSS assets on your wordpress site throught theme OR plugins"
date: 2022-04-10
tags: ["WordPress"]
image: "/images/wordpress.jpeg"
---

There are two steps taken when enqueueing a script or a style. First you register it – tell WordPress it’s there – and then you actually enqueue it, which eventually outputs it into the header or just before the closing body tag.

<br/>

### Register assets

- use [wp_register_style](https://developer.wordpress.org/reference/functions/wp_register_style/) function for register css files
- use [wp_register_script](https://developer.wordpress.org/reference/functions/wp_register_script/) function for register js files

```php
add_action( 'wp_enqueue_scripts', 'my_plugin_assets' );

function my_plugin_assets() {
    wp_register_style( 'custom-gallery', plugins_url( '/css/gallery.css' , __FILE__ ), array(), '1.0.0' );
    wp_register_script( 'custom-gallery', plugins_url( '/js/gallery.js' , __FILE__ ), array(), '1.0.0', true );
}

```

---

#### `wp_register_style` parameters :

```php
wp_register_style(
    string $handle,
    string|bool $src,
    string[] $deps = array(),
    string|bool|null $ver = false,
    string $media = 'all'
)
```

#### `wp_register_script` parameters :

```php
wp_register_script(
    string $handle,
    string|bool $src,
    string[] $deps = array(),
    string|bool|null $ver = false,
    bool $in_footer = false
)
```

---

### Enqueue assets

You can enqueue assets below the register function else anywhere.

```php
add_action( 'wp_enqueue_scripts', 'my_plugin_assets' );
function my_plugin_assets() {
    wp_register_style( 'custom-gallery', plugins_url( '/css/gallery.css' , __FILE__ ), array(), '1.0.0' );
    wp_register_script( 'custom-gallery', plugins_url( '/js/gallery.js' , __FILE__ ), array(), '1.0.0', true );

    wp_enqueue_style( 'custom-gallery' );
    wp_enqueue_script( 'custom-gallery' );
}
```

If you want to load your assets for WP-Admin, You need to use same proccedurs excerpt use [admin_enqueue_scripts](https://developer.wordpress.org/reference/hooks/admin_enqueue_scripts/) instead of [wp_enqueue_scripts](https://developer.wordpress.org/reference/hooks/wp_enqueue_scripts/).

```php
add_action( 'admin_enqueue_scripts', 'my_plugin_assets' );
function my_plugin_assets() {
    wp_register_style( 'custom-gallery', plugins_url( '/css/gallery.css' , __FILE__ ), array(), '1.0.0' );
    wp_register_script( 'custom-gallery', plugins_url( '/js/gallery.js' , __FILE__ ), array(), '1.0.0', true );

    wp_enqueue_style( 'custom-gallery' );
    wp_enqueue_script( 'custom-gallery' );
}
```

If you want to load your assets for specific page only, here is an example code for you :

```php
// Create an admin menu page & load assets only for this page.
add_action('admin_menu', 'create_admin_page');

function create_admin_page() {
   $hook = add_menu_page(__('Pathao', 'text_domain'), __('Pathao', 'text_domain'), 'manage_options', 'pathao-setup', 'page_content', 'dashicons-products', 50);

   	add_action('load-'.$hook, 'init_hooks');
}

function init_hooks() {
    add_action( 'admin_enqueue_scripts', 'page_assets' );
}

function page_assets() {
    wp_register_style( 'custom-gallery', plugins_url( '/css/gallery.css' , __FILE__ ), array(), '1.0.0' );
    wp_register_script( 'custom-gallery', plugins_url( '/js/gallery.js' , __FILE__ ), array(), '1.0.0', true );

    wp_enqueue_style( 'custom-gallery' );
    wp_enqueue_script( 'custom-gallery' );
}

function page_content() {
    ?>
    <div class='gallary-lists'>
    ...............
    </div>
    <?php
}
```

**Thanks**.
