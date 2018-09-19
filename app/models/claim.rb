class Claim < ApplicationRecord
	mount_uploader :file, PhotoUploader
end
