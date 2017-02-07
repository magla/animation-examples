/*
 * Project - Grunt file
 *
 * @author: Magdalena Maglicic
 */

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            options: {
                outputStyle: 'expanded',
                sourceMap: 'true'
            },
            dist: {
                files: {
                    'css/style.css': 'sass/slider.scss'
                }
            }
        },

        concat: {
            js: {
                src: [
                    'js/slider.js',
                    'js/main.js'
                ],
                dest: 'js/build/script.js'
            }
        },

        uglify: {
            jsbody: {
                src: 'js/build/script.js',
                dest: 'js/build/script.min.js'
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-sass');

    grunt.registerTask('default', ['sass:dist', 'concat', 'uglify']);

};
