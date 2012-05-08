module Jasmine
  class Config
    def simple_config_file
      File.join(project_root, 'spec/support/jasmine/config.yml')
    end

    def src_files
      base    = ENV['JS_BASELIB'] || 'jquery'
      exclude = js_baselibs.reject { |lib| lib == base }

      match_files(src_dir, simple_config['src_files']).reject do |file|
        exclude.any? { |x| file =~ /#{x}\.js$/ }
      end
    end

    def js_baselibs
      ['jquery', 'zepto', 'ender']
    end
  end
end
