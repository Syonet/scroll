var fs = require( "fs" );
var pkg = require( "./package.json" );

var gulp = require( "gulp" );
var header = require( "gulp-header" );
var less = require( "gulp-less" );
var plumber = require( "gulp-plumber" );
var babel = require( "gulp-babel" );

gulp.task( "less", function() {
    gulp.src( "src/styles/syoScroll.less" )
        .pipe( plumber() )
        .pipe( less() )
        .pipe( header( fs.readFileSync( "./build/banner.txt", "utf8" ), {
            pkg: pkg
        }))
        .pipe( gulp.dest( "./dist/" ) );
});

gulp.task( "js", function() {
    gulp.src( "src/syoScroll.js" )
        .pipe( plumber() )
        .pipe( babel() )
        .pipe( header( fs.readFileSync( "./build/banner.txt", "utf8" ), {
            pkg: pkg
        }))
        .pipe( gulp.dest( "./dist/" ) );
});

gulp.task( "watch", function() {
    gulp.watch([ "src/styles/*.less" ], [ "less" ]);
    gulp.watch([ "src/*.js" ], [ "js" ]);
});

gulp.task( "package", [ "less", "js" ] )
gulp.task( "default", [ "package", "watch" ] );
