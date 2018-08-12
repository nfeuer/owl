require 'test_helper'

class PrioritiesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get priorities_index_url
    assert_response :success
  end

end
