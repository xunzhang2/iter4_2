module.exports = function(grunt){
	grunt.initConfig({
      pkg:grunt.file.readJSON('package.json'),
      mochaTest:{
      	local:{
      		options:{
                 reporter:'spec',
                 quiet:false,
                 clearRequireCache:false,
                 ui:'tdd'
      		},
      		src:['test/**/*.js']
      	},
      	shippable:{
      		options:{
      			reporter:'mocha-junit-reporter',
      			reportOptions:{
      				mochaFile:'shippable/testresults/results.xml'
      			},
      			ui:'tdd'
      		},
      		src:['test/**/*.js']
      	}
      },
      mocha_istanbul:{
      	coverage:{
      		scr:'test',
      		options:{
      			mocha_Options:['--ui','tdd']
      		}
      	}
      }
	});
  
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-mocha-istanbul');

	grunt.registerTask('default', []);
  
	grunt.registerTask('test',['mochaTest:local']);

	grunt.registerTask('shippable',['mochaTest:shippable','mocha_istanbul']);

	grunt.registerTask('coverage',['mocha_istanbul']);

};