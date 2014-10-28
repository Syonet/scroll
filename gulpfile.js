var gulp = require( "gulp" );
var less = require( "gulp-less" );
var plumber = require( "gulp-plumber" );
var traceur = require( "gulp-traceur" );

gulp.task( "less", function() {
    gulp.src( "src/styles/syoScroll.less" )
        .pipe( plumber() )
        .pipe( less() )
        .pipe( gulp.dest( "./dist/" ) );
});

gulp.task( "js", function() {
    gulp.src( "src/syoScroll.js" )
        .pipe( plumber() )
        .pipe( traceur() )
        .pipe( gulp.dest( "./dist/" ) );
});

gulp.task( "watch", function() {
    gulp.watch([ "src/styles/*.less" ], [ "less" ]);
    gulp.watch([ "src/*.js" ], [ "js" ]);
});

gulp.task( "package", [ "less", "js" ] )
gulp.task( "default", [ "package", "watch" ] );