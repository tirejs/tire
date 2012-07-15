/*global module:false*/
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*!\n' +
        '* <%= pkg.title %>\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
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
      files: ['grunt.js']
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
    }
  });

  grunt.registerTask('default', 'lint concat min');
};