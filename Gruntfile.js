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
        report: 'gzip'
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
      tasks: ['eslint'],
      files: ['src/core.js', 'src/fn/*.js']
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

  // Default task(s).
  grunt.registerTask('default', ['concat', 'uglify']);

};