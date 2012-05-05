module Jasmine
  class Config
    def simple_config_file
      File.join(project_root, 'spec/support/jasmine/config.yml')
    end
  end
end
