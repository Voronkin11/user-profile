const { src, dest, watch, parallel, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const browsersync = require('browser-sync').create();
const imagemin = require("gulp-imagemin");
const del = require('del');


const path = {
    dest: {
        html: "./",
        css: "./css",
        js: "./js",
        img: "./img",
    },
    src: {
        html: "src/*.html",
        scss: "src/scss/style.scss",
        js: "src/js/script.js",
        img: "src/img/**/*",
    },
    watch: {
        html: "src/*.html",
        scss: "src/scss/**/*.scss",
        js: "src/js/**/*.js",
        img: "src/img/**/*",
    },
    clean: {
        css: "./css/**",
        js: "./js",
        img: "./img",
    }
}

function clean() {
    return del(path.clean.css, path.clean.js, path.clean.img);
}

function browserSync() {
    browsersync.init({
        server: {
            baseDir: path.dest.html,
        },
        port: 3000,
        notify: false,
    });
};

function html() {
    return src(path.src.html)
        .pipe(dest(path.dest.html))
        .pipe(browsersync.stream())
}

function scssMinify() {
    return src(path.src.scss)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 5 version'],
            cascade: true
        }))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write("../sourcemaps/"))
        .pipe(dest(path.dest.css))
        .pipe(browsersync.stream());
}

function jsMinify() {
    return src(path.src.js)
        .pipe(sourcemaps.init())
        .pipe(
            babel({
                presets: ["@babel/preset-env"],
            })
        )
        .pipe(uglify())
        .pipe(sourcemaps.write("../sourcemaps/"))
        .pipe(dest(path.dest.js))
        .pipe(browsersync.stream());
}

function imgMinify() {
    return src(path.src.img)
        .pipe(
            imagemin()
        )
        .pipe(dest(path.dest.img))
        .pipe(browsersync.stream())
}

function watchTasks() {
    watch([path.watch.html, path.watch.scss, path.watch.js, path.watch.img], parallel(html, scssMinify, jsMinify, imgMinify));
}

// exports.default = series(clean);
exports.default = series(clean, parallel(html, scssMinify, jsMinify, imgMinify), parallel(watchTasks, browserSync));