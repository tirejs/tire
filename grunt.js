/*global module:false*/
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*!\n' +
        '* tire.js\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> Fredrik Forsmo\n' +
        '* Version: <%= pkg.version %>\n' +
        '* Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n' +
        '*/'
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', 'src/header.js', 'src/core.js', 'src/footer.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    min: {
      "dist/tire.min.js": [ "<banner>", "dist/tire.js" ]
    },
    lint: {
//      files: ['dist/tire.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {},
    qunit: {
      all: ['test/index.html']
    },
    beautify: {
      files: 'dist/tire.js'
    }
  });

  grunt.registerMultiTask('beautify', 'Javascript beautifier', function () {
    var beautifier = require('node-beautify')
      , tmp = grunt.config(['beautifier', this.target, 'options'])
      , options = {
        indentSize: 2
      };
  
    // Beautify specified files.
    grunt.file.expandFiles(this.file.src).forEach(function (filepath) {
      var result = beautifier.beautifyJs(grunt.file.read(filepath), options);
      grunt.file.write(filepath, result);
    });
  
  });

  grunt.registerTask('default', 'concat beautify min');
};