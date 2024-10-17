const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const webpack = require("webpack-stream");
const clean = require("gulp-clean");
const plumber = require("gulp-plumber");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

gulp.task("styles", () => {
    return gulp
        .src("src/sass/style.scss")
        .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
        .pipe(autoprefixer({ overrideBrowserslist: ["last 2 version"] }))
        .pipe(browserSync.stream())
        .pipe(gulp.dest("src/css"));
});
gulp.task("html", () => {
    return gulp.src("./src/*.html").pipe(browserSync.stream());
});
gulp.task("build", () => {
    return gulp
        .src("./src/js/main.js")
        .pipe(plumber())
        .pipe(
            webpack({
                mode: "development",
                output: {
                    filename: "script.js",
                },
                watch: false,
                devtool: "source-map",
                module: {
                    rules: [
                        {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                                loader: "babel-loader",
                                options: {
                                    presets: [
                                        [
                                            "@babel/preset-env",
                                            {
                                                debug: true,
                                                corejs: 3,
                                                useBuiltIns: "usage",
                                            },
                                        ],
                                    ],
                                },
                            },
                        },
                    ],
                },
            })
        )
        .pipe(gulp.dest("src"))
        .on("end", browserSync.reload);
});

gulp.task("server", () => {
    browserSync.init({
        server: "./src/",
        port: 4000,
        notify: true,
    });
});
gulp.watch("./src/js/**/*.*", gulp.parallel("build"));
gulp.watch("./src/sass/**/*.scss", gulp.parallel("styles"));
gulp.watch("./src/*.html", gulp.parallel("html"));

gulp.task("default", gulp.parallel("server", "build", "styles", "html"));
//пушим в папку Dist
gulp.task("buildprodact", () => {
    return gulp
        .src("./src/js/main.js")
        .pipe(
            webpack({
                mode: "production",
                output: {
                    filename: "script.[contenthash].js",
                },
                watch: false,
                devtool: false,
                module: {
                    rules: [
                        {
                            test: /\.css$/i,
                            use: [MiniCssExtractPlugin.loader, "css-loader"],
                        },
                        {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                                loader: "babel-loader",
                                options: {
                                    presets: [
                                        [
                                            "@babel/preset-env",
                                            {
                                                debug: true,
                                                corejs: 3,
                                                useBuiltIns: "usage",
                                            },
                                        ],
                                    ],
                                },
                            },
                        },
                    ],
                },
                optimization: {
                    usedExports: true,
                    minimize: true,
                    minimizer: [new TerserPlugin()],
                    splitChunks: {
                        cacheGroups: {
                            default: false,
                            vendors: false,
                        },
                    },
                },
                plugins: [
                    new HtmlWebpackPlugin({
                        template: "src/index.html",
                        hash: true,
                        minify: false,
                        cache: false,
                        inject: "body",
                    }),
                    new MiniCssExtractPlugin({
                        filename: "[name].[contenthash].css",
                    }),
                ],
            })
        )
        .pipe(gulp.dest("dist"))
        .on("end", browserSync.reload);
});
gulp.task("hash", () => {
    return gulp.src("src/css");
});
gulp.task("file", () => {
    return gulp
        .src(
            ["src/fonts/**/*", "src/images/**/*", "src/icons/**/*", "src/favicon/**/*"],

            {
                base: "src",
                encoding: false,
            }
        )

        .pipe(gulp.dest("dist"));
});
gulp.task("clean", () => {
    return gulp.src("dist/*").pipe(clean());
});

gulp.task("test", gulp.series("clean", "file", "buildprodact"));
