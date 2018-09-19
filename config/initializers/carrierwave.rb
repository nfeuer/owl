CarrierWave.configure do |config|
  config.fog_credentials = {
    :provider               => 'AWS',                                         # required
    :aws_access_key_id      => 'AKIAJDZHC2JBZDBSX6HA',                        # required
    :aws_secret_access_key  => '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',    # required
  }
  config.fog_directory  = 'responsivetech'                          		 	  # required
end