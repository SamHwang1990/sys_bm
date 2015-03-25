/**
 * Created by sam on 15-3-25.
 */

module.exports = function(grunt){
  grunt.initConfig({
    distDir: 'public/dist',
    srcDir: 'public/src',
    pkg: grunt.file.readJSON('package.json'),
    banner:
    '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
    '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
    ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
    ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
    src:{
      css: '<%= distDir %>/css',
      js: '<%= distDir %>/js',
      imgs: '<%= distDir %>/imgs',
      vendor: '%= distDir %>/vendor',
      jsWatch: '<%= srcDir %>/js/**.js',
      sass: '<%= srcDir %>/sass/sys_bm.sass',
      sassWatch: '<%= srcDir %>/sass/**/*.sass',
      npm: 'node_modules'
    },
    clean: ['<%= distDir %>'],
    copy:{
      assets:{
        files: [
          { dest: '<%= src.imgs %>', src : '**', expand: true, cwd: '<%= srcDir %>/imgs' },
          { dest: '<%= distDir %>', src: 'favicon.ico', expand: true, cwd: '<%= srcDir %>'}
        ]
      }
    },
    concat:{
      dist:{
        options: {
          banner: "<%= banner %>"
        },
        src:['<%= src.jsWatch %>/**/*.js'],
        dest:'<%= src.js %>/<%= pkg.name %>.js'
      }
    },
    compass: {
      dist: {
        options: {
          sassDir: '<%= srcDir/sass',
          cssDir: ['<%= src.css %>'],
          raw: 'preferred_syntax = :sass\n' // Use `raw` since it's not directly available
        }
      }
    },
    watch:{
      build: {
        files:[
          '<%= src.jsWatch %>',
          '<%= src.sassWatch %>',
          '<%= srcDir %>/imgs/**/*'
        ],
        tasks:['build','timestamp']
      }
    }
  });

  //grunt.loadNpmTasks('name')
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');

  // Print a timestamp (useful for when watching)
  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

  //grunt.registerTask('name', [dep])
  grunt.registerTask('default', ['build', 'watch']);
  grunt.registerTask('build', ['clean','concat','compass','copy:assets']);
};
