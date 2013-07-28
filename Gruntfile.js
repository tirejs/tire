module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        banner: '/*!\n' +
        ' * tire.js\n' +
        ' * Copyright (c) 2012-<%= grunt.template.today("yyyy") %> Fredrik Forsmo\n' +
        ' * Version: <%= pkg.version %>\n' +
        ' * Released under the MIT License.\n' +
        ' *\n' +
        ' * Date: <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' */\n\n'
      },
      dist: {
        src: ['<banner>', 'src/header.js', 'src/core.js', 'src/fn/*.js', 'src/footer.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        banner: '// tire.js v<%= pkg.version %> | Copyright (c) 2012-<%= grunt.template.today("yyyy") %> Fredrik Forsmo | MIT License | <%= grunt.template.today("yyyy-mm-dd") %>\n',
        report: 'gzip',
        sourceMap: 'dist/<%= pkg.name %>.min.map'
      },
      build: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },

    eslint: {
      target: ['src/core.js', 'src/fn/*.js']
    },

    watch: {
      tasks: ['concat'],
      files: ['src/core.js', 'src/fn/*.js']
    },
    sizediff: {
      dist: {
        src: [
          'dist/<%= pkg.name %>.js',
          'dist/<%= pkg.name %>.min.js'
        ]
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Load the plugin that provides the "concat" task.
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Load the plugin that provides the "eslint" task.
  grunt.loadNpmTasks('grunt-eslint');

  // Load the plugin that provides the "watch" task
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  // Load the plugin that provides the "sizediff" task.
  grunt.loadNpmTasks('grunt-sizediff');

  // Our custom concat task.
  grunt.registerMultiTask('concat', 'Fix identation for files', function (config) {
    var src = ''
      , dest = this.data.dest
      , banner = this.options().banner
      , pkg = grunt.file.readJSON('package.json');

    src += banner;

    this.data.src.shift();

    grunt.file.expand(this.data.src).forEach(function (file) {
      if (file.indexOf('header') !== -1 || file.indexOf('footer') !== -1) {
        src += grunt.file.read(file) + '\n';
      } else {
        var lines = grunt.file.read(file).split('\n');
        lines.forEach(function (line) {
          src += '  ' + line + '\n';
        });
      }
      src = src.replace(/\{\{version\}\}/, pkg.version);
      grunt.file.write(dest, src);
    });

    grunt.log.writeln('File "' + dest + '" created.');
  });

  // Our custom after uglify task.
  grunt.registerTask('uglify:after', function () {
    var file = grunt.template.process('dist/<%= pkg.name %>.min.js')
      , src = grunt.file.read(file)
      , lines = src.split('\n')
      , map = arguments[0];

    for (var i = 0, l = lines.length; i < l; i++) {
      if (lines[i].indexOf('sourceMappingURL') !== -1) {
        lines[i] = lines[i].replace('//@', '//#');
        if (map) {
          lines[i] = lines[i].replace(/\=(.*)/, '=' + map);
        }
      }
    }

    grunt.file.write(file, lines.join('\n'));
  });

  // Our custom release task.
  grunt.registerTask('release', function () {
    var fs = require('fs')
      , filename = arguments[0] || grunt.template.process('<%= pkg.name %>-<%= pkg.version %>')
      , files = [
          grunt.template.process('dist/<%= pkg.name %>.js'),
          filename + '.js',
          grunt.template.process('dist/<%= pkg.name %>.min.js'),
          filename + '.min.js',
          grunt.template.process('dist/<%= pkg.name %>.min.map'),
          filename + '.min.map'
        ]
      , releaseDir = 'release'
      , tmp;

    grunt.task.run(['concat', 'uglify', 'uglify:after:' + files[5]]);

    // Replace paths in source map file.
    tmp = grunt.file.read(files[4]);
    tmp = tmp.replace(files[0], files[1]);
    tmp = tmp.replace(files[2], files[3]);
    grunt.file.write(files[4], tmp);

    if (!fs.existsSync(releaseDir)) fs.mkdirSync(releaseDir);

    // Copy files.
    for (var i = 0, l = files.length; i < l; i++) {
      fs.writeFileSync(releaseDir + '/' + files[i + 1], fs.readFileSync(files[i]));
      i += 1;
    }
  });

  // Default task(s).
  grunt.registerTask('default', ['concat', 'uglify', 'uglify:after']);

};
