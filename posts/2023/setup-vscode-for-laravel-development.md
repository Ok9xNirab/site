---
title: "Setup vsCode for Laravel Development"
path: "setup-vscode-for-laravel-development"
excerpt: "The extensions and keyboard shortcuts that turn Visual Studio Code into a proper Laravel editor."
date: 2023-09-22
draft: false
tags: ["Laravel"]
---

Visual Studio Code(vsCode)  is a highly customizable code editor. it can be taken next level if you configure it properly for specific use cases. In this post, we'll setup vsCode for Laravel development.

#### Extensions

[PHP Intelephense](https://marketplace.visualstudio.com/items?itemName=bmewburn.vscode-intelephense-client)

![PHP Intelephense](/images/2023/vscode-php-intelephense-plugin-page.png)

it's a very much required extension if you want to do PHP development in vscode. Gives you proper autocompletion, error hinting, goto type definition, provides autocompletion based on docs comments, etc. It's also provides you with **WordPress** code completion but by default not enabled.

[Laravel Extra Intellisense](https://marketplace.visualstudio.com/items?itemName=amiralizadeh9480.laravel-extra-intellisense)

![Laravel Extra Intellisense](/images/2023/vscode-laravel-extra-intellisense-plugin.png)

another required extension for good auto-completion. It will provide you with a better view, validation rules, ENV, configs, etc. auto-completion.

[PHPDoc Generator](https://marketplace.visualstudio.com/items?itemName=ronvanderheijden.phpdoc-generator)

![PHPDoc Generator](/images/2023/vscode-php-doc-generator-plugin.png)

I found it good to regularly write docs for classes and functions. To get the PHPDoc Generator to generate a PHPDoc block, place the cursor on a line with a class, method, or property and press `Control+Enter`.

[Laravel Blade formatted](https://marketplace.visualstudio.com/items?itemName=shufo.vscode-blade-formatter)

![Laravel Blade formatted](/images/2023/vscode-blade-formatter-plugin.png)

It'll auto-format blade files after saving.

[Laravel Blade Snippets](https://marketplace.visualstudio.com/items?itemName=onecentlin.laravel-blade)

![Laravel Blade Snippets](/images/2023/vscode-blade-snippets-plugin.png)

Some essential snippets for Laravel blade files. For example, **b:foreach** will set foreach loop block, **b:if**-else will set if-else condition block. For more snippets, you may read the extension's details.

[ENV](https://marketplace.visualstudio.com/items?itemName=IronGeek.vscode-env)

![ENV](/images/2023/vscode-env-plugin.png)

`.env` file's syntax highlighting.

[Better Pest](https://marketplace.visualstudio.com/items?itemName=m1guelpf.better-pest)

![Better Pest](/images/2023/vscode-better-pest-plugin.png)

The under-rated extension helps you to run pest tests from a file, under a test scope, and globally.

My personal keyboard shortcuts for these extensions

```json
  {
    "key": "alt+r",
    "command": "better-pest.run"
  },
  {
    "key": "cmd+k cmd+r",
    "command": "-better-pest.run"
  },
  {
    "key": "alt+f",
    "command": "better-pest.run-file"
  },
  {
    "key": "cmd+k cmd+f",
    "command": "-better-pest.run-file"
  }
```

[Pest Snippets](https://marketplace.visualstudio.com/items?itemName=dansysanalyst.pest-snippets)

![Pest Snippets](/images/2023/vscode-pest-snippets-plugin.png)

provides some snippets for quickly writing pest related common block of codes.

- `:pte` to access all `test()` snippets.
- `:pti` to access all `it()` snippets.
- `:pex` to access the available `expect()` methods.

**Thanks**.
