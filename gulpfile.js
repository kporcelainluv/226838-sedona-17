"use strict";

const gulp = require("gulp");
const babel = require("gulp-babel");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const server = require("browser-sync").create();
const rename = require("gulp-rename");
const csso = require("gulp-csso");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const posthtml = require("gulp-posthtml");
const include = require("posthtml-include");
const del = require("del");
const htmlmin = require("gulp-htmlmin");
const checkCSS = require("gulp-check-unused-css");

gulp.task("css", function() {
  return gulp
    .src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"));
});

gulp.task("css1", function() {
  return gulp
    .src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(rename("style.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"));
});

gulp.task("server", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.scss", gulp.series("css"));
  gulp.watch("source/img/icon-*.svg", gulp.series("sprite", "html", "refresh"));
  gulp.watch("source/js/*.js", gulp.series("js", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
});

gulp.task("refresh", function(done) {
  server.reload();
  done();
});

gulp.task("images", () => {
  return gulp
    .src("source/img/**/*.{png,jpg,svg}")
    .pipe(
      imagemin([
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.svgo()
      ])
    )
    .pipe(gulp.dest("source/img"));
});

gulp.task("webp", () => {
  return gulp
    .src("source/img/**/*.{png,jpg}")
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("source/img/webp"));
});

gulp.task("sprite", function() {
  return gulp
    .src("source/img/icon-*.svg")
    .pipe(
      svgstore({
        inlineSvg: true
      })
    )
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("logo-sprite", function() {
  return gulp
    .src("source/img/logo-*.svg")
    .pipe(
      svgstore({
        inlineSvg: true
      })
    )
    .pipe(rename("logo-sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("html", function() {
  return gulp
    .src("source/*.html")
    .pipe(posthtml([include()]))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
});

gulp.task("js", function() {
  return gulp
    .src(["node_modules/babel-polyfill/dist/polyfill.js", "js/*.js"])
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(gulp.dest("compiled"));
});

gulp.task("copy", function() {
  return gulp
    .src(
      [
        "source/fonts/**/*.{woff,woff2}",
        "source/img/**",
        "source/js/**",
        "source/*.ico"
      ],
      {
        base: "source"
      }
    )
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
  return del("build");
});

gulp.task("check", function() {
  return gulp.src(["build/css/*.css", "build/*.html"]).pipe(checkCSS());
});

gulp.task(
  "build",
  gulp.series("clean", "copy", "css", "css1", "sprite", "logo-sprite", "html")
);

gulp.task("start", gulp.series("build", "server"));
