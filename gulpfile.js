var assembleTask = require('./assemble');
var isDev = process.argv.indexOf('watch') !== -1;

gulp.task('assemble', assembleTask(isDev));
gulp.task('build', ['assemble']);
gulp.task('watch', ['build']);
