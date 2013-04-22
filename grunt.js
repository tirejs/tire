/*global module:false*/
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*!\n' +
        ' * tire.js\n' +
        ' * Copyright (c) 2012-<%= grunt.template.today("yyyy") %> Fredrik Forsmo\n' +
        ' * Version: <%= pkg.version %>\n' +
        ' * Released under the MIT License.\n' +
        ' */'
    },
    concat: {
      dist: {
        src: ['<banner>', 'src/header.js', 'src/core.js', 'src/fn/*.js', 'src/footer.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    min: {
      'dist/tire.min.js': [ '<banner>', 'dist/tire.js' ]
    },
    lint: {
      files: ['src/core.js', 'src/fn/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint'
    },
    jshint: {
      options: {
        regexdash: true,
        laxcomma: true,
        expr: true,
        eqeqeq: true,
        noarg: true,
        sub: true,
        undef: true,
        eqnull: true,
        browser: true
      },
      globals: {
        tire: true,
        define: true,
        slice: true,
        document: true,
        ActiveXObject: true,
        noop: true
      }
    }
  });

  grunt.registerMultiTask('concat', 'Fix indent for files', function (config) {
    var src = ''
      , dest = this.file.dest
      , banner = grunt.task.directive(this.file.src[0], function() { return null; })
      , pkg = grunt.file.readJSON('package.json');

    src += banner;

    this.file.src.shift();

    grunt.file.expandFiles(this.file.src).forEach(function (file) {
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

  grunt.registerTask('default', 'concat min');
};