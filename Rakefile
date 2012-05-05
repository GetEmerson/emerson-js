require 'rubygems'

task :default => :spec

desc "run the spec suite"
task :spec => ['spec:server', 'spec:browser']

desc "run the 'server' spec suite"
task 'spec:server' do
  check 'jasmine-node', 'jasmine-node', 'https://github.com/mhevery/jasmine-node'
  system 'jasmine-node spec'
end

desc "run the 'browser' spec suite"
task 'spec:browser' => 'jasmine:server'

desc "build the docco documentation"
task :doc do
  # NOTE: we currently use a fork of docco, which supports cli flags and more.
  # sudo npm install -g https://github.com/justindujardin/docco/tarball/master
  # this is also specified as a dev dependency in package.json
  check 'docco',      'docco',    'https://github.com/jashkenas/docco'
  check 'pygmentize', 'pygments', 'http://pygments.org/'
  system 'docco -t ./spec/support/docco/template.jst ./lib/*.js'
end

# Check for the existence of an executable.
def check(exec, name, url)
  return unless `which #{exec}`.empty?
  puts "#{name} not found.\nInstall it from #{url}"
  exit
end

def hide(taskname)
  # sneaky
  task(taskname).instance_variable_set(:"@name", nil)
end

$LOAD_PATH.unshift File.join(File.dirname(__FILE__), 'spec/support')
require 'jasmine'
require 'jasmine/patches'

load 'jasmine/tasks/jasmine.rake'
hide('jasmine')
hide('jasmine:ci')
