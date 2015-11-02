var nunjucks = require('nunjucks');
var consolidate = require('consolidate');
var app = require('assemble')();

modules.exports = function(isDev) {
  var src = ['./src/**/*.html'];
  var userName = process.cwd().split('/')[2];

  app.data({
    userName: userName
  });

  var njInstance = nunjucks.configure({
    watch: false,
    noCache: true
  });

  app.engine('.html', consolidate.nunjucks);

  app.option('renameKey', function(fp) {
    var dirname = path.dirname(fp).split('/').slice(-1)[0];
    var basename = path.basename(fp).split('.').slice(0)[0];
    return `${dirname}/${basename}`;
  });

  return function(cb) {
    app.task('build', function() {
      return app.src(src)
        .pipe(app.renderFile())
        .pipe(app.dest('./dist'))
        .on('error', function(err) {
          console.log('[assemble]: build');
        });
    });

    app.task('watch', ['build'], function() {
      app.watch('**/*.html', ['build']);
      cb();
    });

    app.build(isDev ? ['watch'] : ['build'], function(err) {
      if (err) {
        console.log('[assemble]: run');
      }
      cb();
    });
  };
}

