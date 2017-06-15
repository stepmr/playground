module.exports = function(grunt) {
  require('time-grunt')(grunt);

  var srcImgPath = 'src_imgs/',
      destImgPath = 'dest_imgs/',
      changedCachePath = 'node_modules/grunt-changed/.cache';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    changed: {
      options: {
        cache: changedCachePath
      }
    },
    clean: {
      build: {
        src: [changedCachePath, destImgPath],
      }
    },
    copy: {
      build: {
        files: [
          {
            expand: true,
            cwd: srcImgPath,
            src: ['**'],
            dest: destImgPath
          },
        ]
      }
    },
    imagemin: {
      build: {
        options: {
          optimizationLevel: 3,
          progressive: true,
          interlaced: true
        },
        files: [{
          expand: true,
          cwd: destImgPath,
          src: ['**/*.{png,jpg,gif}'],
          dest: destImgPath
        }]
      },
    },
    responsive_images: {
      build: {
        options: {
          sizes: [{
            name: 'mobile',
            width: ‘50%’
          }, {
            name: 'tablet',
            width: ‘65%’
          }
          ],
          newFilesOnly: false
        },
        files: [{
          expand: true,
          cwd: srcImgPath,
          src: ['**/*.{gif,jpg,png}'],
          dest: destImgPath
        }]
      }
    },
  });

  grunt.loadNpmTasks('grunt-changed');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-responsive-images');
  
  grunt.registerTask('default', ['changed:copy', 'changed:responsive_images', 'changed:imagemin']);
  grunt.registerTask('force-process-images', ['clean', 'default']);
};
