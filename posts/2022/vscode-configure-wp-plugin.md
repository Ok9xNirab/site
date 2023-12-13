---
title: "vsCode Configuration for WordPress Plugin"
path: "vscode-configure-wp-plugin"
excerpt: "Configure vscode to experience better on develop WordPress Plugin."
date: 2022-12-17
tags: ["vsCode"]
image: "/images/wordpress.jpeg"
---

First of all you need to install **wpcs** dependencies on your plugin via **composer** :

```bash
composer require --dev wp-coding-standards/wpcs:dev-develop
```

After install this package, you'll get access these two types of commands :

```bash
# check php coding standard releted issues

./vendor/bin/phpcs
```

```bash
# fix coding standard automatically

./vendor/bin/phpcbf
```

I recommend to register these commands with **composer scripts**.

```json
"scripts": {
	"phpcs": "\"vendor/bin/phpcs\"",
	"phpcbf": "\"vendor/bin/phpcbf\"",
	"sniffs": "\"vendor/bin/phpcs\" -e",
}
```

then you can easily access phpcs commands via composer:

```bash
composer phpcs
composer phpcbf
composer sniffs
```

## Extensions

Some vsCode extensions, I always use :

![PHP-Intelephense](/images/2022/PHP-Intelephense.png)
I recommend [PHP Intelephense](https://marketplace.visualstudio.com/items?itemName=bmewburn.vscode-intelephense-client) for PHP built-in functions completion, code completion (IntelliSense), go to definition support and many more.

![Phpcs](/images/2022/phpcs-extension.png)

[phpcs](https://marketplace.visualstudio.com/items?itemName=ValeryanM.vscode-phpsab) extension allow us to display phpcs related issues without running phpcs commands every time & also fix coding styles after save file.

To enable WordPress coding standards:

```json
"phpsab.standard": "WordPress",
```

It's automatically configure setup from your root project **composer.json**.

But what happen if you want to develop something like **WooCommerce Extension** OR any other **plugin based plugin** !!

You need to open wordpress plugins directory instead of opening single plugin directory.
![vsCode explorer](/images/2022/vscode-explorer.png)

Then you can get better code completion (IntelliSense) support.

But the **phpcs** extension doesn't work, you need to configure locally in the **plugins** directory. So, create new folder called **.vscode** under the project root and create **settings.json** file here.

Inside **settings.json** :

```json
{
  "phpsab.executablePathCS": "./subscription-pro/vendor/bin/phpcs",
  "phpsab.executablePathCBF": "./subscription-pro/vendor/bin/phpcbf",
  "phpsab.standard": "WordPress",
  "[php]": {
    "editor.defaultFormatter": "valeryanm.vscode-phpsab"
  }
}
```

Now, you can see **phpcs** working fine.

![vscode phpcs](/images/2022/vscode-phpcs.png)

The last extension is [WordPress Hooks IntelliSense](https://marketplace.visualstudio.com/items?itemName=johnbillion.vscode-wordpress-hooks), which will provide better autocompletion for hooks.

![wordpress intellisense](/images/2022/wordpress-intellisense.png)

Thanks.
