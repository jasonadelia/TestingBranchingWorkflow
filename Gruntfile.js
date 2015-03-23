module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    //TASK CONFIGURATIONS AND OPTIONS
    //For general documentation on task congigurations, see: http://gruntjs.com/configuring-tasks
    //For specific task requirements and options, see individual task pages (noted at the bottom where tasks are loaded).

    //LESS for css pre-processing (NOTE: multitasks like this less task require a target - I'm using default)
    less: {
      default: {
        options: {
          paths: ['source/_resources/less']
        },
        files: [
          // looking for all .less files directly under source/_resources/less, excpect common and shame
          {expand: true, cwd: 'source/_resources/less', src: ['*.less','!common.less','!shame.less'], dest: 'source/_resources/css', ext: '.css' }
        ]
      }
    },

    //BLESS to avoid the 4095 selector max issue in IE < 10
    bless: {
      css: {
        options: {
          imports: false
        },
        files: {
          'source/_resources/css/styles-blessed.css': 'source/_resources/css/styles.css'
        }
      }
    },

    //The Clean task will delete previous build dir
    clean: ["build/"],

    //PHP2HTML to produce static flat html from the raw php
    php2html: {
      default: {
        options: {
          // relative links should be renamed from .php to .html
          processLinks: true,
          // disabling htmlhint because we have a bunch of markup errors in our code but don't necessarily want those to fail a build.
          htmlhint: false
        },
        files: [
          // looking for all .php files under the source dir, excpect config.php and anything under the _includes directory
          {expand: true, cwd: 'source', src: ['**/*.php','!config.php','!_includes/**'], dest: 'build/', ext: '.html' }
        ]
      }
    },

    //Copy to copy the _resources dir (css, js, img...) over to build
    copy: {
      build: {
        files: [
          //copying all files from _resources except the less folder
          {expand: true, cwd: 'source/', src: ['_resources/**','!_resources/less/**'], dest: 'build/'}
        ]
      }
    },

    //Not sure we need to do this, but example of Uglify for minification work, including ex of a custom datestamp
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd hh:MM") %> */\n'
      },
      build: {
        src: 'build/_resources/js/common.js',
        dest: 'build/_resources/js/common.min.js'
      }
    },

    //WATCH to run some of the above automatically on file changes 
    watch: {
      less: {
        files: ['source/_resources/less/**'],
        tasks: ['less']
      }
    }

  });

  //LOAD REQUIRED TASKS
  grunt.loadNpmTasks('grunt-contrib-less');         // https://npmjs.org/package/grunt-contrib-less
  grunt.loadNpmTasks('grunt-bless');                // https://npmjs.org/package/grunt-bless
  grunt.loadNpmTasks('grunt-contrib-clean');        // https://npmjs.org/package/grunt-contrib-clean
  grunt.loadNpmTasks('grunt-php2html');             // https://npmjs.org/package/grunt-php2html
  grunt.loadNpmTasks('grunt-contrib-copy');         // https://npmjs.org/package/grunt-contrib-copy
  grunt.loadNpmTasks('grunt-contrib-uglify');       // https://npmjs.org/package/grunt-contrib-uglify
  grunt.loadNpmTasks('grunt-contrib-watch');        // https://npmjs.org/package/grunt-contrib-watch


  // Register Default task(s).
  //NOTE: when testing tasks, it's easiest to remove the watch task as the only way to stop the watch is to close the cmd window.
  grunt.registerTask('default', ['less']);
  //grunt.registerTask('build', ['less','bless', 'clean','copy:build','php2html','uglify']);
  //for now, just running what we need to produce the build.  We can add in bless, uglify and whatever else may turn out helpful later
  grunt.registerTask('build', ['less', 'clean', 'copy:build', 'php2html']);
  
};