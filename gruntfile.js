
    module.exports = function(grunt) {
        grunt.initConfig({
          pkg: grunt.file.readJSON('package.json'),
      
          // Tasks
          sass: {
            // Begin Sass Plugin
                build: {
                    files:[{
                        src: 'assets/css/scss/styles.scss',
                        dest: 'assets/css/styles.css'
                    }]
                }
          },

          watch: {
            // Compile everything into one task with Watch Plugin
                css: {
                files: 'assets/css/scss/styles.scss',
                tasks: ['sass'],
                },
            },
        })
        // Load Grunt plugins
        grunt.loadNpmTasks('grunt-contrib-sass')
        grunt.loadNpmTasks('grunt-contrib-watch')
      
        // Register Grunt tasks
        grunt.registerTask('default', ['watch'])
      }