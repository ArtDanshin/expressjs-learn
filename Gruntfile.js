module.exports = function(grunt) {

  ['grunt-cafe-mocha'].forEach(function(task){
    grunt.loadNpmTasks(task);
  })

  grunt.initConfig({
    cafemocha: {
      all: { src: 'qa/tests-unit.js', options: { ui: 'tdd' }}
    }
  })

  grunt.registerTask('default', ['cafemocha']);
}
