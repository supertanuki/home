let mix = require('laravel-mix');

mix
    .copy('node_modules/spectre.css/dist/spectre.min.css', 'assets/css')
    .copy('node_modules/spectre.css/dist/spectre-exp.min.css', 'assets/css')
    .copy('node_modules/spectre.css/dist/spectre-icons.min.css', 'assets/css')
;
